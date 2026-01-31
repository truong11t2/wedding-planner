ARG NODE=node:22-alpine

# Stage 1: Install dependencies
FROM ${NODE} AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Stage 2: Build the application
FROM ${NODE} AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY ./api ./api
COPY ./app ./app
COPY ./components ./components
COPY ./content ./content
COPY ./context ./context
COPY ./data ./data
COPY ./lib ./lib
COPY ./public ./public
COPY ./styles ./styles
COPY ./types ./types
COPY ./*config* ./
COPY ./next-env.d.ts ./next-env.d.ts
COPY ./package* ./
COPY ./.env.production ./

# Build the application with standalone output
RUN npm run build

# Stage 3: Production runtime
FROM ${NODE} AS runner
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Set production environment
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PRIVATE_STANDALONE true

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built files from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

# Set host binding
ENV PORT 3001

# Start the server
CMD ["node", "server.js"]