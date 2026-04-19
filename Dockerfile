# Build stage
FROM node:22 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist/users-service-angular-app/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]