ARG NODE=node:22-alpine

# Stage 1: Install dependencies
FROM ${NODE} AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Stage 2: Build stage
FROM ${NODE} AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build if needed (uncomment if you have a build step)
# RUN npm run build

# Stage 3: Production runtime
FROM ${NODE} AS runner
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Set production environment
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeapp

# Copy built files and dependencies
COPY --from=builder --chown=nodeapp:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodeapp:nodejs /app/src ./src
COPY --from=builder --chown=nodeapp:nodejs /app/package.json ./

# Switch to non-root user
USER nodeapp

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "src/server.js"]