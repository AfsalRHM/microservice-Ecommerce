FROM node:18

WORKDIR /app/auth-service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6001

CMD ["node", "index.js"]