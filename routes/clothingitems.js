const router = require("express").Router();
const { createItem } = require("../controllers/clothingitems");

router.post("/", createItem);

module.exports = router;
