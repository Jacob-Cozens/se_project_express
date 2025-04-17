const jwt = require("jsonwebtoken");
const { BAD_REQUEST } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Information entered is incorrect" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(BAD_REQUEST).send({ message: err.message });
  }

  req.user = payload;

  return next();
};
