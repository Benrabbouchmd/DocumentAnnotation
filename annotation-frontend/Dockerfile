# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build --prod

# Stage 2: Create a lightweight web server to serve the built app
FROM nginx:alpine
COPY --from=builder /app/dist/* /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
