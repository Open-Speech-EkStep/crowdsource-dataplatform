# Install dependencies only when needed
FROM node:14-alpine AS deps
ARG NODE_CONFIG_ENV=default
ENV NODE_CONFIG_ENV=${NODE_CONFIG_ENV}
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY ./package*.json ./fe/
# COPY crowdsource-ui/. ./ui/
RUN cd fe && npm install && cd ..
# RUN cd ui && npm install && npm run gulp -- --env=${NODE_CONFIG_ENV}

# Rebuild the source code only when needed
FROM node:14-alpine AS builder
ARG NODE_CONFIG_ENV=default
ENV NODE_CONFIG_ENV=${NODE_CONFIG_ENV}
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
WORKDIR /app
COPY ./ .
COPY --from=deps /app/fe/node_modules ./node_modules/
# COPY --from=deps /app/ui/target ./target/
RUN npm run build:docker

# Production image, copy all the files and run next
FROM node:14-alpine AS runner
ARG NODE_CONFIG_ENV=default
ENV NODE_CONFIG_ENV=${NODE_CONFIG_ENV}
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/next-i18next.config.js ./
COPY --from=builder /app/server.docker.js ./
COPY --from=builder /app/config ./config
# COPY --from=builder /app/target ./target
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start:docker"]
