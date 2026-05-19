# Stage 1: Build React Application
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./

RUN npm install

# Copy application source
COPY . .

# Build React app
RUN npm run build

# Stage 2: Nginx Production Server
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Fix OpenShift permissions
RUN mkdir -p /var/cache/nginx \
    /var/run \
    /var/log/nginx && \
    chmod -R 777 /var/cache/nginx \
    /var/run \
    /var/log/nginx \
    /usr/share/nginx/html

# Use non-root compatible port
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]