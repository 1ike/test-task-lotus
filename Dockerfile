### STAGE 1: Build ###
FROM node:16-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx nx run-many --target=build


### STAGE 2: Production Environment ###
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist

COPY package*.json ./

RUN npm ci --omit=dev


EXPOSE 3333

CMD [ "node", "dist/packages/nest/main.js"]
