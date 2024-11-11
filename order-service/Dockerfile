    FROM node:18

    WORKDIR /app/order-service

    COPY package*.json ./

    COPY wait-for-it.sh ./ 

    RUN chmod +x wait-for-it.sh

    RUN npm install

    COPY . .

    EXPOSE 6003

    CMD ["node", "index.js"]