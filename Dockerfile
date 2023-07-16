FROM node:18-alpine
RUN npm install pnpm
COPY package.json package.json
RUN pnpm install
COPY . .
CMD ["pnpm", "start"]
