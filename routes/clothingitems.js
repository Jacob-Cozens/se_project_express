const router = require("express").Router();
const { createItem, getItems, deleteItem, likeItem, dislikeItem } = require("../controllers/clothingitems");

router.get("/", getItems)
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId", likeItem);
router.delete("/:itemId", dislikeItem);

module.exports = router;
