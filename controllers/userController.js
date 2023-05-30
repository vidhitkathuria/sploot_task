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
  console.log(req.body);
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
        console.log(user);
        //check if user is created
        if (user) {
          return res.status(201).json({
            stausCode: 201,
            data: user,
            error: false,
            token: generateToken(user._id),
            message: "User created succesfully",
          });
        } else {
          return res.status(401).json({
            stausCode: 401,
            data: null,
            error: true,
            message: "Inavalid User data",
          });
        }
      });
    });
  } catch (error) {
    next(error.message);
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
        data: user,
        error: false,
        token: generateToken(user._id),
        message: "User logged in succesfully",
      });
    } else {
      return res.status(401).json({
        stausCode: 401,
        data: null,
        error: true,
        message: "Invalid user credentials",
      });
    }
  } catch (error) {
    next(error.message);
  }
};

const updateUserDetails = async (req, res, next) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).json({
      stausCode: 400,
      data: null,
      eroor: true,
      message: "Please fill all fields",
    });
  }
  try {
    const response = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          age,
        },
      },
      { new: true }
    );
    console.log(response);
    res.status(200).json({
      stausCode: 200,
      data: response,
      error: false,
      message: "Details Updated Successfully",
    });
  } catch (error) {
    next(error.message);
  }
};

module.exports = { registerUser, loginUser, updateUserDetails };
