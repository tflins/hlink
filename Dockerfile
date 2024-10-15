FROM node:lts-alpine AS base
RUN npm install pnpm@9.11.0 --location=global

FROM base AS build
COPY . ./usr/src/app
WORKDIR /usr/src/app
RUN npm config set registry https://registry.npmmirror.com
RUN pnpm install --frozen-lockfile
RUN pnpm run build:core && pnpm run build:app
RUN pnpm deploy --filter @hlink/app --prod /app/hlink-app && pnpm deploy --filter @hlink/core --prod /app/hlink-core

FROM base AS server
EXPOSE 9090
COPY --from=build /app/hlink-app /app
COPY --from=build /app/hlink-core /app/hlink-core
WORKDIR /app
CMD ["npm", "run", "start"]
