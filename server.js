const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/review");
const port = process.env.PORT || 5000;
const app = express();

// use the MongoDB drivers
mongoose.set("useFindAndModify", false);

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true }).then(() => {
  if (mongoose.connection.readyState !== 1) console.log("MongoDB disconnected")
}).catch(err => next(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);

// Error Handling middleware
app.use((err, req, res, next) => {
  const { status, message } = err;
  res.status(status || 500).type("txt").send(message || "Internal Server Error");
});

if (!module.parent) app.listen(port, () => 
  console.log(`Server up and running on port ${port}!`)
);

module.exports = app;
