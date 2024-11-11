const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const amqp = require("amqplib");

const PORT = process.env.PORT;

const Order = require("./order.js");

app.use(express.json());

let channel, connection;

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Order-Service is connected");
});

async function connect() {
  const amqpServer = process.env.RABBITMQ_URL;
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("ORDER");
}

async function createOrder(products, userEmail) {
  let total = 0;
  for (let i = 0; i < products.length; i++) {
    total += products[i].price;
  }
  const newOrder = new Order({
    products,
    user: userEmail,
    total_price: total,
  });
  newOrder.save();
  return newOrder;
}
connect().then(() => {
  channel.consume("ORDER", async (data) => {
    const { products, userEmail } = JSON.parse(data.content);
    const newOrder = await createOrder(products, userEmail);
    channel.ack(data);
    channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify({ newOrder })));
  });
});

app.listen(PORT, () => {
  console.log(`Order-Service is running on ${PORT}`);
});
