FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder --chown=node:node /app/dist ./dist

ARG UPLOAD_DIR=/app/uploads
ENV UPLOAD_DIR=${UPLOAD_DIR}
RUN mkdir -p "${UPLOAD_DIR}" && chown node:node "${UPLOAD_DIR}"

USER node
EXPOSE 3001

CMD ["node", "dist/main"]