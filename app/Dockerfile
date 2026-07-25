FROM node:24 AS build

WORKDIR /app

COPY app/package*.json ./
RUN npm install --include=dev

COPY app/ ./
RUN npm run typecheck && npm run build
RUN npm prune --omit=dev

FROM node:24-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/app ./app
COPY scripts/start.sh /usr/local/bin/niteowl-start

RUN chmod +x /usr/local/bin/niteowl-start

EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/niteowl-start"]
