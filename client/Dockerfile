# === Build stage ===
FROM node:14-slim AS build

LABEL author="Paul Muchiri"

ARG buildversion
ARG VITE_API_URL  

# Environment variables
ENV PORT=80
ENV BUILD=$buildversion
ENV NODE_ENV=production
ENV VITE_API_URL=$VITE_API_URL  

WORKDIR /usr/src/app

COPY package*.json ./

# ✅ Install ALL dependencies (react-scripts included)
RUN npm install

# Copy the rest of the app
COPY . .

# Build app
RUN npm run build

# === Runtime stage ===
FROM nginx:alpine

# Clean up default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from build stage
WORKDIR /usr/src/app

# reduce image size by copying only necessary files
# COPY --from=build /usr/src/app/package*.json ./
# COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE $port

RUN echo "Build version: $BUILD"

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
