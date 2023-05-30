const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please enter title"],
    },
    description: {
      type: String,
      required: [true, "please enter description"],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "please enter user_id"]
    },
  },
  {
    timestamps: true,
  }
);

const Article = new mongoose.model("Article", articleSchema);

module.exports = { Article };
