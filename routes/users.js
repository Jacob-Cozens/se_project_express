const router = require("express").Router();

router.get("/", () => console.log("Hi!"));
router.get("/:userId", () => console.log("ID Hi!"));
router.get("/", () => console.log("POST Hi!"));

module.exports = router;
