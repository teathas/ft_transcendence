COMPOSE := docker compose
ENV_FILE := .env

.DEFAULT_GOAL := help

help:
	@echo "  up              Build if needed and start the whole stack"
	@echo "  down            Stop the stack, keep the data"
	@echo "  restart         Stop then start again"
	@echo "  build           Build the images without starting anything"
	@echo "  rebuild         Rebuild from scratch, ignoring the layer cache"
	@echo "  migrate         Apply pending Prisma migrations"
	@echo "  seed            Fill the database with development users and rooms"
	@echo "  psql            Open a psql shell on the database"
	@echo "  ps              Show what is running"
	@echo "  logs            Follow every service"
	@echo "  logs-backend    Follow the API only"
	@echo "  logs-frontend   Follow the web app only"
	@echo "  logs-proxy      Follow nginx only"
	@echo "  shell-backend   Open a shell inside the API container"
	@echo "  check           Typecheck, lint and format-check the frontend"
	@echo "  clean           Stop the stack and drop the volumes"
	@echo "  fclean          clean, plus remove the images this project built"
	@echo "  re              Full reset, then start again"

all: up

up: $(ENV_FILE)
	$(COMPOSE) up -d --build
	@echo ""
	@echo "  app   http://localhost:$$(grep -E '^PROXY_PORT=' $(ENV_FILE) | cut -d= -f2)"
	@echo "  api   same origin, under /api"
	@echo ""

down:
	$(COMPOSE) down

restart: down up

build: $(ENV_FILE)
	$(COMPOSE) build

rebuild: $(ENV_FILE)
	$(COMPOSE) build --no-cache

migrate:
	$(COMPOSE) run --rm migrate

seed:
	$(COMPOSE) run --rm migrate npx prisma db seed --config prisma7.config.ts

psql:
	$(COMPOSE) exec pgdb sh -c 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f --tail=100

logs-backend:
	$(COMPOSE) logs -f --tail=100 backend

logs-frontend:
	$(COMPOSE) logs -f --tail=100 frontend

logs-proxy:
	$(COMPOSE) logs -f --tail=100 proxy

shell-backend:
	$(COMPOSE) exec backend sh

check:
	cd frontend && npm run check

clean:
	$(COMPOSE) down --volumes

fclean:
	$(COMPOSE) down --volumes --rmi local --remove-orphans

re: fclean up

$(ENV_FILE):
	@cp .env.example $(ENV_FILE)
	@echo "Created $(ENV_FILE) from .env.example - set JWT_SECRET before going further."

.PHONY: help all up down restart build rebuild migrate seed psql ps logs logs-backend logs-frontend logs-proxy shell-backend check clean fclean re
