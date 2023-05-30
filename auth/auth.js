const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token)
      return res.status(400).json({
        stausCode: 400,
        data: null,
        error: true,
        message: "Access Denied / Unauthorized request",
      });

    token = token.split(" ")[1];
    if (token === null || !token)
      return res.status(401).json({
        stausCode: 401,
        data: null,
        error: true,
        message: "Access Denied / Unauthorized request",
      });

    let verifiedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!verifiedUser) {
      return res.status(401).json({
        stausCode: 401,
        data: null,
        error: true,
        message: "Access Denied / Unauthorized request",
      });
    } else {
      next();
    }
  } catch (err) {
    return res.status(403).json({
      stausCode: 403,
      data: null,
      error: true,
      message: err.message,
    });
  }
};

module.exports = {
  auth,
};
