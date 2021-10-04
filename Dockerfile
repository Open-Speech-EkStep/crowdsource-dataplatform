# Install dependencies only when needed
FROM node:14-alpine AS deps
ARG NODE_CONFIG_ENV=default
ENV NODE_CONFIG_ENV=${NODE_CONFIG_ENV}
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN mkdir fe
COPY crowdsource-fe/package*.json ./fe/
RUN mkdir ui
COPY crowdsource-ui/. ./ui/
RUN cd fe && npm install && cd ..
RUN cd ui && npm install && npm run gulp -- --env=${NODE_CONFIG_ENV}

# Rebuild the source code only when needed
FROM node:14-alpine AS builder
ARG NODE_CONFIG_ENV=default
ENV NODE_CONFIG_ENV=${NODE_CONFIG_ENV}
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
WORKDIR /app
COPY ./crowdsource-fe .
COPY --from=deps /app/fe/node_modules ./node_modules/
RUN mkdir target
COPY --from=deps /app/ui/target ./target/
RUN npm run build:docker

FROM ubuntu:latest as mover
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y curl
RUN apt-get install -y unzip
RUN apt-get install -y sudo
RUN apt-get install -y wget
# RUN apt install keyutils
# RUN apt-get install -y python3 python3-pip
ARG TENANT_ID=test
ARG APP_ID=test
ARG AZURE_URL=test
RUN wget -O azcopy_v10.tar.gz https://aka.ms/downloadazcopy-v10-linux
RUN tar -xf azcopy_v10.tar.gz --strip-components=1
RUN ./azcopy login --tenant-id ${TENANT_ID} --service-principal --application-id ${APP_ID}
COPY --from=builder /app/.next ./.next
RUN ./azcopy copy ".next/static/*" "${AZURE_URL}" --cache-control "max-age=1200" --recursive

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
COPY --from=builder /app/serverUtils.js ./
COPY --from=builder /app/server.docker.js ./
COPY --from=builder /app/config ./config
COPY --from=builder /app/target ./target
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start:docker"]
