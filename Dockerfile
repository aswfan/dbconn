FROM node:alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 8080
ENTRYPOINT [ "node", "index.js" ]