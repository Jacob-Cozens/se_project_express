const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingitems");
const auth = require("../middlewares/auth");
const { NOT_FOUND } = require("../utils/errors");
const { loginUser, createUser } = require("../controllers/users");

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

router.post("/signin", loginUser);
router.post("/signup", createUser);

router.use("/users", auth, userRouter);
router.use("/items", clothingItemRouter);
router.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "Route not found." })
);

module.exports = router;
