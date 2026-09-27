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
RUN cp -r src/generated dist/generated

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder --chown=node:node /app/dist ./dist

ARG UPLOAD_DIR=/app/uploads
RUN mkdir -p /app/uploads && chown node:node /app/uploads

USER node
EXPOSE 3001

CMD ["node", "dist/main"]