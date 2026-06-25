FROM node:22-alpine AS base

FROM base AS development
WORKDIR /app
EXPOSE 3000
CMD ["sh", "-c", "npm install && npm run dev"]
