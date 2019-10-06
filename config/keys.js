require('dotenv').config();

const {MONGO_URI, SECRET} = process.env;

module.exports = {
  mongoURI: MONGO_URI,
  secretOrKey: SECRET,
};
