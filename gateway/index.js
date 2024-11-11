const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const dotenv = require('dotenv');

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());  

app.use('/user', proxy(`http://order-service:${process.env.ORDER_PORT}`));
app.use('/auth', proxy(`http://auth-service:${process.env.AUTH_PORT}`));
app.use('/', proxy(`http://product-service:${process.env.PRODUCT_PORT}`)); // Products

app.listen(process.env.MAIN_PORT, () => {
    console.log(`Gateway is Listening in the Port : http://localhost:${process.env.MAIN_PORT}`)
});