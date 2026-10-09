# The official Playwright image already ships the matching browsers and all
# system libraries, so the container needs no extra browser download.
FROM mcr.microsoft.com/playwright:v1.64.0-noble

WORKDIR /app

# Install dependencies first so that code changes do not invalidate this layer.
COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json playwright.config.ts ./
COPY src ./src
COPY tests ./tests

# Credentials are never baked into the image: they are mounted or passed in at
# run time (see docker-compose.yml and README.md).
CMD ["npx", "playwright", "test"]
