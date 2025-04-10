const ClothingItem = require("../models/clothingitem");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      return item.deleteOne();
    })
    .then(() => res.status(200).send({ message: "Item deleted succesfully" }))
    .catch((err) => {
      console.error(err);
      if ((err.name = "DocumentNotFoundError")) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { createItem, getItems, deleteItem };
