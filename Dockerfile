### STAGE 1: Build ###
FROM node:16-alpine AS builder

ARG URL
ARG PORT

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN NX_SERVER_URL=$URL \
  NX_SERVER_PORT=$PORT \
  npx nx run-many --target=build


### STAGE 2: Production Environment ###
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist

COPY package*.json ./

RUN npm ci --omit=dev

CMD ["node", "dist/packages/nest/main.js"]
