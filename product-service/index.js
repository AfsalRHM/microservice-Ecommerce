const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const amqp = require("amqplib");

const PORT = process.env.PORT_AUTH;

const Product = require("./product.js");

const isAuthenticated = require("./middlewares/isAuth.js");

app.use(express.json());

let channel, connection, order;

const mongoose = require("mongoose");
mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(() => {
    console.log("Product-Service is connected");
  });

async function connect() {
  const amqpServer = process.env.RABBITMQ_URL;
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("PRODUCT");
}
connect();

function consumeOrderResponse() {
  return new Promise((resolve) => {
    channel.consume(
      "PRODUCT",
      (data) => {
        const order = JSON.parse(data.content);
        channel.ack(data);
        resolve(order);
      },
      { noAck: false }
    );
  });
}

app.get("/", async (req, res) => {
  const products = await Product.find();
  return res.json(products);
});

app.post("/create", isAuthenticated, async (req, res) => {
  const { name, description, price } = req.body;
  const newProduct = new Product({
    name,
    description,
    price,
  });
  await newProduct.save();
  return res.json(newProduct);
});

app.post("/buy", isAuthenticated, async (req, res) => {
  const { ids } = req.body;
  if (!ids) {
    return res.json({ message: "Please select some products" });
  }
  const products = await Product.find({ _id: { $in: ids } });

  channel.sendToQueue(
    "ORDER",
    Buffer.from(
      JSON.stringify({
        products,
        userEmail: req.user.email,
      })
    )
  );
  const order = await consumeOrderResponse();
  return res.json({ order });
});

app.listen(PORT, () => {
  console.log(`Product-Service is running on ${PORT}`);
});
