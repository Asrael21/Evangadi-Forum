# ── Stage 1: Build Frontend ──
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Force development mode during build stage so devDependencies (like vite) are never omitted
ENV NODE_ENV=development

COPY frontend/package*.json ./
RUN npm install --include=dev

COPY frontend/ ./
RUN npm run build

# ── Stage 2: Production Server ──
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3777

# Copy backend dependencies and install production modules
COPY backend/package*.json ./backend/
RUN npm --prefix backend install --omit=dev

# Copy backend source code
COPY backend/ ./backend/

# Copy compiled frontend assets from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose backend port
EXPOSE 3777

# Start the full-stack server
CMD ["node", "backend/index.js"]
