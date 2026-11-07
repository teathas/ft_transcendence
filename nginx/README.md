How Shared Room is containerised, wired together, exposed and health-checked: Docker Compose, the two application images,
the nginx reverse proxy with TLS, the private network and the healthchecks.

![](../assets/devops-architecture.svg)

*Containers are labelled with the name and port the configuration uses. Docker assigns the IP addresses itself and they can change
after `make re`; nothing depends on them.*

## Quick start

Requirements: Docker Engine with the Compose v2 plugin (`docker compose`) and `make`.

```bash
cp .env.example .env    # then set JWT_SECRET and a real Postgres password (keep DATABASE_URL in sync)
make                    # build the images and start the stack
```

Generate a JWT secret with `openssl rand -hex 32`.

Open **https://localhost**. The certificate is self-signed, so the browser shows a warning the first time; accept it to continue.

Check that everything is up:

```bash
make ps                                  # 4 services "(healthy)", certs and migrate "Exited (0)"
curl -sk https://localhost/api/health    # {"status":"ok","database":"up"}
```

## Make targets

| Target | Runs | Effect |
|---|---|---|
| `make`, `make build` | `docker compose up -d --build` | rebuild images whose inputs changed, recreate changed containers |
| `make up` | `docker compose up -d` | start without rebuilding |
| `make stop` / `make start` | `docker compose stop` / `start` | stop or resume the containers, keeping them |
| `make down` | `docker compose down` | remove containers and network; **data is kept** |
| `make clean` | `docker compose down --remove-orphans` | same, plus containers of services no longer in the file |
| `make fclean` | `docker compose down --rmi all --volumes --remove-orphans` | also delete the images and **all data** (database, uploads, certificate) |
| `make re` | `fclean` then `all` | rebuild everything from zero |
| `make logs` | `docker compose logs -f` | follow the logs of every service |
| `make ps` | `docker compose ps -a` | list containers, including the finished one-shot jobs |

`make`, `make up` and `make build` refuse to run when `.env` is missing.

## Services

| Service | Image | Role | Port | Published | Healthcheck |
|---|---|---|---|---|---|
| `nginx` | `nginx:1.27-alpine` | reverse proxy, TLS, security headers | 80, 443 | **80, 443** | `GET 127.0.0.1:8080/health` |
| `frontend` | built from `./frontend` | Next.js (standalone): pages and server-side rendering | 3000 | no | `GET /` |
| `backend` | built from `./backend` | NestJS + Prisma: REST API, Socket.IO, whiteboard sync, uploads | 3001 | no | `GET /health` (runs `SELECT 1`) |
| `pgdb` | `postgres:17-alpine` | database | 5432 | no | `pg_isready` |
| `migrate` | `./backend`, stage `builder` | one-shot: `prisma migrate deploy` | – | no | must exit 0 |
| `certs` | `alpine/openssl` | one-shot: creates the TLS certificate if missing | – | no | must exit 0 |

nginx is the only entry point. Pages and API share one origin (`https://localhost`), so no CORS is needed.

## Startup order

```text
pgdb ─(healthy)─▶ migrate ─(exit 0)─▶ backend ─(healthy)─▶ frontend ─(healthy)─▶ nginx
                                                              ▲                    ▲
certs ─────────────────────────(exit 0)───────────────────────┴────────────────────┘
```

Each arrow is a `depends_on` condition. A service isn't created until its dependency is healthy (`service_healthy`) or has exited
with code 0 (`service_completed_successfully`). So the backend never runs against an unmigrated database, and nginx never starts
without a certificate or before the apps can answer. The frontend also waits for `certs`: Node loads the certificate it trusts
for its HTTPS calls to nginx (`NODE_EXTRA_CA_CERTS`) only once, when it starts. If a condition is never met, `docker compose up`
fails and names the dependency. These conditions only apply at startup.

On `make down`, containers stop in reverse order. Both Node images use an exec-form `CMD`, so Node runs as PID 1 and receives
`SIGTERM` directly, which lets the backend shut down cleanly.

## Network

- **One bridge network**, `ft_transcendence_default`, created by Compose; every service joins it.
- **Name resolution.** Docker's embedded DNS (`127.0.0.11` inside each container) resolves service names to their current IP
  addresses, so the configuration only ever uses names: `frontend:3000`, `backend:3001`, `pgdb:5432`.
- **Only nginx is published.** The frontend, the backend and Postgres can't be reached from the host. To open a database shell:

  ```bash
  docker compose exec pgdb sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
  ```

- **Every call to the backend goes through nginx over HTTPS:**

  | Caller | URL | Path |
  |---|---|---|
  | browser | `https://localhost/api/…` | host :443 → nginx → `backend:3001` |
  | Next.js server, while rendering | `https://nginx/api/…` | private network → nginx :443 → `backend:3001` |

  The Next.js server trusts the self-signed certificate through `NODE_EXTRA_CA_CERTS=/certs/cert.pem`. It reads the
  file from the `certs` volume, mounted read-only.

Useful checks:

```bash
docker compose exec backend cat /etc/resolv.conf     # nameserver 127.0.0.11
docker compose exec backend getent hosts pgdb        # <ip>  pgdb
```

## nginx

Configuration lives in `nginx/conf.d/` and is mounted read-only into the container:

- `default.conf`: the public HTTP and HTTPS servers. It is mounted as a template: at startup the nginx image
  replaces `${HTTP_PORT}` and `${HTTPS_PORT}` with the values from `.env`
- `health.conf`: a private server used only by the healthcheck

### TLS

- Port 80 answers every request with `301` to the same URL over HTTPS.
- Port 443 accepts **TLS 1.2 and 1.3 only**.
- The certificate is self-signed: subject alternative names `DNS:localhost` (the browser), `DNS:nginx` (the Next.js server)
  and `IP:127.0.0.1`, RSA 2048, valid for 365 days. The `certs` service runs `nginx/cert/gen-cert.sh` at every start. It writes
  the certificate into the `certs` volume if it's missing or lacks `DNS:nginx`, and skips otherwise, so the certificate stays
  the same across restarts.
- When `certs` writes a new certificate while nginx is already running, run `docker compose restart nginx` so nginx serves it.
- To issue a new certificate: `make down`, `docker volume rm ft_transcendence_certs`, `make up`.

### Routing

nginx picks the **longest matching prefix**.

| Location | Upstream | Path sent upstream | Serves |
|---|---|---|---|
| `/` | `frontend:3000` | unchanged | pages |
| `/api/` | `backend:3001` | `/api` removed: `/api/auth/login` → `/auth/login` | application API, avatars |
| `/api/v1/` | `backend:3001` | unchanged | public API |
| `/api/docs` | `backend:3001` | unchanged | Swagger UI and `/api/docs-json` |
| `/api/sync/` | `backend:3001` | `/api/sync/` → `/sync/` | whiteboard sync (WebSocket) |
| `/socket.io/` | `backend:3001` | unchanged | Socket.IO (WebSocket) |

- Every location forwards `Host`, `X-Real-IP`, `X-Forwarded-For` and `X-Forwarded-Proto`.
- The two WebSocket locations also use HTTP/1.1, pass the `Upgrade` and `Connection` headers, and allow connections to stay idle
  for up to one hour (`proxy_read_timeout` and `proxy_send_timeout` 3600 s).

### Hardening

| Setting | Effect |
|---|---|
| `server_tokens off` | no nginx version in the `Server` header or on error pages |
| `client_max_body_size 10m` | request bodies up to 10 MB; larger ones get `413` |
| `X-Content-Type-Options: nosniff` | the browser trusts the declared content type and doesn't guess |
| `X-Frame-Options: SAMEORIGIN` | other sites can't frame the app (clickjacking) |
| `Referrer-Policy: strict-origin-when-cross-origin` | other sites only see the origin, never paths or invite codes |
| `Permissions-Policy: camera=(), microphone=(), geolocation=()` | APIs the app doesn't use are disabled |
| `Strict-Transport-Security: max-age=300` | HTTPS only; kept short on purpose for a self-signed `localhost` certificate |

The headers use `always`, so error responses carry them too.

## Healthchecks

| Service | Test | Healthy means | Interval / timeout / retries / start period |
|---|---|---|---|
| `pgdb` | `pg_isready -U $POSTGRES_USER -d $POSTGRES_DB` | Postgres accepts connections | 5 s / 5 s / 10 / – |
| `backend` | `wget -qO- http://127.0.0.1:$PORT/health` | Nest is up **and** the database answers `SELECT 1` | 10 s / 5 s / 5 / 10 s |
| `frontend` | `wget -qO- http://127.0.0.1:$PORT/` | Next.js renders the landing page | 10 s / 5 s / 5 / 10 s |
| `nginx` | `wget -qO- http://127.0.0.1:8080/health` | nginx runs with a valid configuration | 10 s / 5 s / 5 / – |

- **Each container checks only itself**, so a failing status points at the broken layer.
- **Escaped variables.** In `docker-compose.yml` the variables are written `$${VAR}`, so the container's own shell expands
  them when the check runs.
- **nginx's endpoint is private.** It listens on `127.0.0.1:8080` inside the nginx container only. It isn't published, other
  containers can't reach it, and it has no access log.
- **End-to-end status.** `https://localhost/api/health` goes through nginx, the backend and Postgres. It returns
  `{"status":"ok","database":"up"}`, or `503` with `{"status":"error","database":"down"}` when the database is unreachable.
- **Reading the status:** `make ps`, or
  `docker inspect --format '{{json .State.Health}}' ft_transcendence-backend-1`.

Compose uses health only to order startup. A container that turns unhealthy later is reported as `(unhealthy)` but isn't
restarted: `restart: always` reacts to a process exiting, not to its health.

## Data and volumes

| Volume | Mounted in | Contains |
|---|---|---|
| `pgdata` | `pgdb:/var/lib/postgresql/data` | the database |
| `uploads` | `backend:/app/uploads` (`UPLOAD_DIR`) | avatars and room files |
| `certs` | `certs:/certs`, `nginx:/etc/nginx/certs` (read-only), `frontend:/certs` (read-only) | `cert.pem`, `key.pem` (mode `0600`, root only, so the frontend's `nextjs` user can't read it) |

The volumes survive `make down` and `make clean`. `make fclean` and `make re` delete them.

The schema is managed with Prisma migrations: the `migrate` service applies any pending ones before the backend starts.

## Configuration

Copy `.env.example` to `.env`. `.env` is git-ignored.

| Variable | Read by | When | Notes |
|---|---|---|---|
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Postgres image | first boot only | ignored once the `pgdata` volume holds data |
| `DATABASE_URL` | backend, migrate | start | host `pgdb`, port 5432; must match the three values above |
| `BACKEND_PORT`, `FRONTEND_PORT` | backend, frontend | start | nginx expects 3001 and 3000 |
| `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL` | frontend | **build** | URLs the browser uses (`https://localhost/api`, `wss://localhost`); run `make build` after changing them |
| `TLDRAW_API_KEY` | frontend | **build** | optional; empty keeps the tldraw watermark |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | backend | start | access tokens, 900 s by default |
| `REFRESH_TOKEN_EXPIRES_IN`, `REFRESH_COOKIE_PATH` | backend | start | the cookie path is the browser-side path (`/api/auth`) |
| `UPLOAD_DIR` | backend | build and start | also the mount point of the `uploads` volume |
| `NODE_ENV` | backend | start | defaults to `production` (secure cookies) |

`INTERNAL_API_URL` in `.env.example` documents the server-side URL. Compose sets it for the frontend to `https://nginx/api`,
together with `NODE_EXTRA_CA_CERTS`.

## Images

The frontend and the backend each have their own `Dockerfile`, built in three stages. Every stage starts from a
fresh `node:22-alpine`, and only what is explicitly copied passes to the next one, so build tools never reach the
final image.

| Stage | What it does | In the final image? |
|---|---|---|
| `deps` | installs every dependency with `npm ci` (exact versions from the lockfile) | no |
| `builder` | copies the source and compiles it (`nest build` / `next build`) | no |
| `runner` | starts clean and copies in only what is needed to run | **yes** |

| | Backend | Frontend |
|---|---|---|
| Final image contains | compiled `dist/` + production dependencies | Next.js standalone server (`server.js` + the dependencies it uses) + static assets |
| Runs as | `node`, UID 1000 (comes with the base image) | `nextjs`, UID 1001 (created in the Dockerfile) |
| Start command | `node dist/main` | `node server.js` |
| Build arguments | `UPLOAD_DIR`: creates the upload folder | `NEXT_PUBLIC_*`: baked into the browser JavaScript |
| Size | ~1.1 GB | ~320 MB |

Why it is built this way:

- **Fast rebuilds:** `package.json` and the lockfile are copied before the source, so the slow install step is
  reused from cache when only code changes.
- **Less to attack:** no compiler, dev dependencies or source code in the running container, and the process is not root.
- **Clean shutdown:** the start command uses the exec form (`CMD ["node", …]`), so Node receives Docker's stop signal directly.
- **Clean build input:** `.dockerignore` keeps the host's `node_modules`, old build output and `.git` out of the build;
  the frontend's also keeps local `.env*` files out.

The `migrate` service builds the backend `Dockerfile` only up to `builder` (`target: builder`), because that stage
still contains the Prisma CLI and the migration files.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `make` says `.env` is missing | `cp .env.example .env` and fill it in |
| certificate warning in the browser | expected with a self-signed certificate; accept it once |
| ports 80 or 443 already in use | stop the other web server on the host |
| `502` after rebuilding a single service | nginx resolved the old container address at startup: `docker compose restart nginx` |
| a new `NEXT_PUBLIC_*` value has no effect | it's baked in at build time: `make build` |
| public profile pages fail with a certificate error (`ERR_TLS_CERT_ALTNAME_INVALID`, `DEPTH_ZERO_SELF_SIGNED_CERT`) in `docker compose logs frontend` | nginx still serves an old certificate: `docker compose restart nginx` |
| backend can't log in to Postgres after changing the password | the existing volume keeps the old password: `ALTER USER` in `psql`, or `make fclean` (deletes data) |
| `dependency failed to start` | `docker compose logs <service>` and `docker inspect --format '{{json .State.Health}}' <container>` |

## Files

| Path | Purpose |
|---|---|
| `docker-compose.yml` | services, volumes, startup order, healthchecks |
| `Makefile` | commands |
| `.env.example` | configuration template |
| `backend/Dockerfile`, `backend/.dockerignore` | API image, also used by `migrate` |
| `frontend/Dockerfile`, `frontend/.dockerignore` | web image |
| `nginx/conf.d/default.conf` | public servers: redirect, TLS, routing, headers (ports from `.env`) |
| `nginx/conf.d/health.conf` | private healthcheck server |
| `nginx/cert/gen-cert.sh` | self-signed certificate |

## Limitations

- **Self-signed certificate.** A real deployment would use a certificate from a trusted authority and a long HSTS `max-age`.
- **No automatic recovery.** Plain Compose doesn't replace unhealthy containers; an orchestrator would.
- **No rate limiting yet.** nginx doesn't throttle requests.
