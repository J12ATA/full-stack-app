const { CLUSTER, DATABASE, PASSWORD, SECRET, USER } = process.env;

module.exports = {
  mongoURI: `mongodb+srv://${USER}:${PASSWORD}@${CLUSTER}-8yvto.gcp.mongodb.net/${DATABASE}?retryWrites=true&w=majority`,
  secretOrKey: `${SECRET}`
};
