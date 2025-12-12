###############################################
# 1. Build frontend (React + Vite)
###############################################
FROM node:20 AS frontend-builder
WORKDIR /app/frontend

# 1️⃣ Copy dependency files first (cache)
COPY TaskManagerFrontend/package*.json ./

# 2️⃣ Faster, cached install
RUN npm ci --prefer-offline --no-audit --no-fund

# 3️⃣ Copy rest of frontend
COPY TaskManagerFrontend .

# 4️⃣ Fix vite permission issue
RUN chmod +x node_modules/.bin/vite

# 5️⃣ Prevent slow builds / OOM
ENV NODE_OPTIONS=--max_old_space_size=4096

# 6️⃣ Build
RUN npm run build



###############################################
# 2. Build backend (Spring Boot + Gradle)
###############################################
FROM gradle:8.5-jdk21 AS backend-builder
WORKDIR /app

# Copy backend root project
COPY . .

# Copy frontend build into Spring Boot static folder
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static/

RUN gradle clean bootJar --no-daemon


###############################################
# 3. Runtime stage
###############################################
FROM eclipse-temurin:21-jre
WORKDIR /app

EXPOSE 8080

COPY --from=backend-builder /app/build/libs/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
