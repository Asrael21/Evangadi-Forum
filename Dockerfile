# ── Stage 1: Build Frontend ──
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ── Stage 2: Production Server ──
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3777

# Copy backend dependencies and install
COPY backend/package*.json ./backend/
RUN npm --prefix backend install --omit=dev

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend static files from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose application port for DockHosting
EXPOSE 3777

# Start the full-stack app
CMD ["node", "backend/index.js"]
