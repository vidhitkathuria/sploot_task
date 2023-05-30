const { Article } = require("../models/article");
const { User } = require("../models/user");

const createArticle = async (req, res, next) => {
  const { title, description } = req.body;
  const { user_id } = req.params;

  try {
    //check if all details are entered
    if (!title || !description || !user_id) {
      return res.status(400).json({
        statusCode: 400,
        data: null,
        error: true,
        message: "Enter all details",
      });
    }

    const article = new Article({
      title,
      description,
      user_id,
    });

    // Save the article to the database
    const savedArticle = await article.save();
    return res.status(201).json({
      statusCode: 201,
      data: savedArticle,
      error: false,
      message: "article added succesfully",
    });
  } catch (error) {
    next(error.message);
  }
};

const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find().populate("user_id", "name");
    return res.status(200).json({
      statusCode: 200,
      data: articles,
      error: false,
    });
  } catch (error) {
    next(error.message);
  }
};

module.exports = { createArticle, getArticles };
