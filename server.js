const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 2001;

const userRoutes = require("./routes/userRoutes");

require("./config/db");
app.use(cors());

app.use(express.json());

app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Running Succesfully" });
});
app
  .listen(port, () => {
    console.log(`App is running on port ${port}`);
  })
  .on("error", function (err) {
    console.log("Sowething Went Worng", err);
  });
