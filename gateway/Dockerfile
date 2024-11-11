FROM node:18

WORKDIR /app/gateway

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6000

CMD ["node", "index.js"]