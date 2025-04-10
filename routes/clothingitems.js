const router = require("express").Router();
const { createItem, getItems, deleteItem } = require("../controllers/clothingitems");

router.get("/", getItems)
router.post("/", createItem);
router.delete("/", deleteItem);

module.exports = router;
