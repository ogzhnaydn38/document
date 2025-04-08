
  FROM node:20.5 AS builder
  
  WORKDIR /app
  
  COPY ./package.json ./
  RUN npm cache clean –force
  RUN npm install 
  
  COPY . .
  
  RUN npm run  build
  
  FROM nginx:alpine-slim
  COPY --from=builder /app/build /usr/share/nginx/html
  COPY nginx.conf /etc/nginx/conf.d/default.conf
    