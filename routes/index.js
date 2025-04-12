const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingitems");
const { NOT_FOUND } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use((req, res) => {
  return res.status(NOT_FOUND).send({ message: "Route not found." });
});

module.exports = router;
