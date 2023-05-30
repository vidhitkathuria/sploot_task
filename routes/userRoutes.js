const express = require("express");
const {
  registerUser,
  loginUser,
  updateUserDetails,
} = require("../controllers/userController");

const {
  createArticle,
  getArticles,
} = require("../controllers/articleController");
const router = express.Router();
const auth = require("../auth/auth");

router.post("/signup", registerUser);
router.post("/login", loginUser);

router.post("/users/:user_id/articles", auth.auth, createArticle);
router.get("/articles", auth.auth, getArticles);
router.put("/users/:id", auth.auth, updateUserDetails);
module.exports = router;
