require("dotenv").config();

const { CLUSTER, DATABASE, PASSWORD, SECRET, USERNAME } = process.env;

module.exports = {
  mongoURI: `mongodb+srv://${USERNAME}:${PASSWORD}@${CLUSTER}-8yvto.gcp.mongodb.net/${DATABASE}?retryWrites=true&w=majority`,
  secretOrKey: `${SECRET}`
};
