FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/src/data/products.json ./src/data/products.json
COPY --from=build /app/src/lib/pricing.ts ./src/lib/pricing.ts
COPY --from=build /app/src/lib/seo.ts ./src/lib/seo.ts
COPY package.json ./
USER node
EXPOSE 8080
CMD ["node", "server/index.mjs"]
