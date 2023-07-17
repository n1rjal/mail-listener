FROM node:18-alpine
WORKDIR /app
RUN apk update && apk add bind-tools
RUN npm install -g pnpm
COPY package.json package.json
RUN pnpm install
COPY . .
CMD ["pnpm", "start"]
