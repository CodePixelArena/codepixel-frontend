FROM node:22-alpine AS build
# uses lightweight Node to install deps and build React
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
# npm ci = clean install, faster and stricter than npm install
COPY . .
RUN npm run build
# builds your React/Vite app into static files → /app/dist

FROM nginx:1.27-alpine AS runtime
# second stage — throws away Node entirely, only keeps the built files
COPY --from=build /app/dist /usr/share/nginx/html
# copies built static files into nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# serves your frontend