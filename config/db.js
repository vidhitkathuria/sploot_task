const mongoose = require("mongoose");

module.exports.mongoConnection = mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
