# Stage 1: Build Angular SSR app
FROM node:22 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run SSR server
FROM node:22
WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY package*.json ./
RUN npm install --omit=dev

EXPOSE 4000

CMD ["node", "dist/users-service-angular-app/server/main.js"]