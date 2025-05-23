const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { BAD_REQUEST } = require("../utils/errors");
const { DuplicateError } = require("../utils/errors/DuplicateError");
const { BadRequestError } = require("../utils/errors/BadRequestError");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { UnauthorizedError } = require("../utils/errors/UnauthorizedError");
const { JWT_SECRET } = require("../utils/config");
const { ConflictError } = require("../utils/errors/ConflictError");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new DuplicateError("Email is already in use");
      }

      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }));
    })
    .then((user) => {
      if (user) {
        return res.status(201).send({
          name: user.name,
          avatar: user.avatar,
          email: user.email,
        });
      }
      return res.status(BAD_REQUEST).send({ message: "User creation failed" });
    })
    .catch((err) => {
      console.error(err);
      if (err instanceof DuplicateError) {
        next(new ConflictError("Email is already in use"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid information entered"))();
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password required" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (
        err.name === "AuthenticationError" ||
        err.message === "Incorrect email or password"
      ) {
        next(new UnauthorizedError(err.message))();
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid email or password"))();
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
      console.log(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid information entered"))();
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"))();
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )

    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Incorrect email or password"))();
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid information entered"))();
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"))();
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  loginUser,
  updateUser,
};
