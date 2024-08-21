const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();


app.use(bodyParser.json());
app.use(express.json())
app.use(cors({ credentials: true, origin: true }));

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Account & User Profile & Address
app.use("/api/account", require("./routes/account.route"))
// app.use("/api/user-profile", require("./routes/userProfile.route"))
// app.use("/api/address", require("./routes/address.route"))

// Product & Wishlist & Cart
app.use("/api/product", require("./routes/product.route"))
// app.use("/api/wishlist", require("./routes/wishlist.route"))
// app.use("/api/cart", require("./routes/cart.route"))

// My Purchases & My Sales
// app.use("/api/mypurchases", require("./routes/mypurchases.route"))
// app.use("/api/mysales", require("./routes/mysales.route"))

// Blogs
// app.use("/api/blog", require('./routes/blog.route'))

app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
})