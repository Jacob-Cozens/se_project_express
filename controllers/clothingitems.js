const ClothingItem = require("../models/clothingitem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  FORBIDDEN,
} = require("../utils/errors");
const { ForbiddenError } = require("../utils/specialerrors/ForbiddenError");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server." });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        throw new ForbiddenError("You don't have permission to delete this");
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.status(200).send({ message: "Item deleted succesfully" })
      );
    })
    .catch((err) => {
      console.error(err);
      if (err instanceof ForbiddenError) {
        return res.status(FORBIDDEN).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server." });
    });
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server." });
    });

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server." });
    });

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
