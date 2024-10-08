const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Account & User Profile & Address
app.use("/api/account", require("./routes/account.route"));

// Product & Cart
app.use("/api/product", require("./routes/product.route"));
app.use("/api/cart", require("./routes/cart.route"));

// My Purchases & My Sales
// app.use("/api/mypurchases", require("./routes/mypurchases.route"));
// app.use("/api/mysales", require("./routes/mysales.route"));

// Payment (Stripe)
app.use("/api/payments", require("./routes/payment.route"));

// Webhook route for Stripe (important: use express.raw)
app.post('/webhook', express.raw({ type: 'application/json' }), require('./controllers/payment.controller').webhook);

// Blogs
// app.use("/api/blog", require('./routes/blog.route'));

// Search
app.use("/api/search", require("./routes/search.route"));

app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
