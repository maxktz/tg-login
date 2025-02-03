FROM oven/bun:1.2

WORKDIR /app

COPY package.json bun.lock* ./

RUN bun install

COPY . .