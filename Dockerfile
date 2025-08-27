FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm i --only=prod
COPY src ./src
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/server.js"]
