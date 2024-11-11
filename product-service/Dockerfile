FROM node:18

WORKDIR /app/product-service

COPY package*.json ./

COPY wait-for-it.sh ./ 

RUN chmod +x wait-for-it.sh

RUN npm install

COPY . .

EXPOSE 6002

CMD ["node", "index.js"]