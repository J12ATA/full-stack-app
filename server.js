require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/review");
const cors = require("cors");
const port = process.env.PORT || 8080;
const app = express();
const path = require("path");

mongoose.set("useFindAndModify", false);

app.use(express.static(path.join(__dirname, "client", "build")));

app.use(cors());
app.options("*", cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    if (mongoose.connection.readyState !== 1)
      console.log("MongoDB disconnected");
  })
  .catch(err => console.log(err));

app.use(passport.initialize());

require("./config/passport")(passport);

app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);

app.use((err, req, res, next) => {
  const { errors, status } = err;
  res.status(status || 500).send(errors || "Internal Server Error");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

if (!module.parent)
  app.listen(port, () => console.log(`Server up and running on port ${port}!`));

module.exports = app;
