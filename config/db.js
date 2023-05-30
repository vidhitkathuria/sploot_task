const mongoose = require("mongoose");

module.exports.mongoConnection = mongoose.connect(
  process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (!err) {
      console.log("Database Connected Successfully");
    } else {
      console.log("Error in Connecting Mongodb", err);
    }
  }
);
