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
FROM node:14-alpine AS runner
ARG NODE_CONFIG_ENV=default
ENV NODE_CONFIG_ENV=${NODE_CONFIG_ENV}
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
WORKDIR /app
COPY ./crowdsource-fe .
COPY --from=deps /app/fe/node_modules ./node_modules/
# RUN mkdir target
COPY --from=deps /app/ui/target ./target/
RUN npm run build:docker

# Production image, copy all the files and run next

# You only need to copy next.config.js if you are NOT using the default configuration

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start:docker"]
