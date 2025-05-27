const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingitems");
const auth = require("../middlewares/auth");

const { loginUser, createUser } = require("../controllers/users");
const {
  validateUserLogin,
  validateUserBody,
} = require("../middlewares/validation");
const { NotFoundError } = require("../utils/errors/NotFoundError");

router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

router.post("/signin", validateUserLogin, loginUser);
router.post("/signup", validateUserBody, createUser);

router.use("/users", auth, userRouter);
router.use("/items", clothingItemRouter);
router.use((req, res, next) => next(new NotFoundError("Route not found")));

module.exports = router;
