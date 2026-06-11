# ------------------------------ Frontend Builder --------------------------- #
FROM node:22-bookworm-slim AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# ------------------------------ TypeScript Server Builder ------------------ #
FROM node:22-bookworm-slim AS server-builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src/ ./src/
RUN npm run build

# ------------------------------ Production --------------------------------- #
FROM node:22-bookworm-slim AS production
ENV NODE_ENV=production
ENV TZ=Asia/Kolkata
RUN apt-get update && apt-get install -y --no-install-recommends tzdata curl && \
    ln -fs /usr/share/zoneinfo/Asia/Kolkata /etc/localtime && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
RUN groupadd --gid 1000 appuser && useradd --create-home --uid 1000 --gid 1000 appuser
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=server-builder --chown=appuser:appuser /app/dist ./dist
COPY --from=frontend-builder --chown=appuser:appuser /app/frontend/dist ./frontend/dist
COPY --chown=appuser:appuser .sample.env ./.sample.env
RUN mkdir -p db log && chown -R appuser:appuser db log
USER appuser
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:5000/health/status || exit 1
CMD ["node", "dist/server/start.js"]
