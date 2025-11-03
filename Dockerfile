# Stage 1: Build the Angular application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built application from build stage
COPY --from=build /app/dist/sa-demo /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create script to inject environment variables
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-inject-env.sh && \
    echo 'export APP_VERSION="${APP_VERSION:-1.0.0}"' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo 'echo "window.APP_VERSION = \"${APP_VERSION}\";" > /usr/share/nginx/html/env.js' >> /docker-entrypoint.d/40-inject-env.sh && \
    chmod +x /docker-entrypoint.d/40-inject-env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

