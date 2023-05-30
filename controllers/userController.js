const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "10d",
  });
};

const registerUser = async (req, res, next) => {
  const { email, name, password, age } = req.body;

  try {
    //check if user has entered all details
    if (!email || !name || !password || !age) {
      return res.status(400).json({
        stausCode: 400,
        data: null,
        error: true,
        message: "Please enter all details",
      });
    }

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
    //check if email is valid
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        stausCode: 400,
        data: null,
        error: true,
        message: "Not a valid email",
      });
    }

    //check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(401).json({
        stausCode: 401,
        data: null,
        error: true,
        message: "User already exists",
      });
    }

    //hash password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        //store hash in DB
        const user = await User.create({
          name,
          email,
          age,
          password: hash,
        });

        //check if user is created
        if (user) {
          return res.status(201).json({
            stausCode: 201,
            data: { user, token: generateToken(user._id) },
            error: false,
            message: "User created succesfully",
          });
        } else {
          return res.status(401).json({
            statusCode: 401,
            data: null,
            error: true,
            message: "Invalid User data",
          });
        }
      });
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      data: null,
      error: true,
      message: error || "Failed to register",
    });
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //check if email exists
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        stausCode: 200,
        data: { user, token: generateToken(user._id) },
        error: false,
        message: "User logged in succesfully",
      });
    } else {
      return res.status(401).json({
        statusCode: 401,
        data: null,
        error: true,
        message: "Invalid user credentials",
      });
    }
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      data: null,
      error: true,
      message: error || "Failed to login",
    });
  }
};

const updateUserDetails = async (req, res, next) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).json({
      statusCode: 400,
      data: null,
      error: true,
      message: "Please fill all fields",
    });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          age,
        },
      },
      { new: true }
    );

    res.status(200).json({
      statusCode: 200,
      data: { user },
      error: false,
      message: "Details Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      data: null,
      error: true,
      message: error || "Failed to update user",
    });
  }
};

module.exports = { registerUser, loginUser, updateUserDetails };
