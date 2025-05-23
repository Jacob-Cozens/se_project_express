const ClothingItem = require("../models/clothingitem");

const { ForbiddenError } = require("../utils/errors/ForbiddenError");
const { BadRequestError } = require("../utils/errors/BadRequestError");
const { NotFoundError } = require("../utils/errors/NotFoundError");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("The information you entered is invalid"));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
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
        next(new ForbiddenError("You are not authorized to delete this item"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("The item you've requested cannot be found"));
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res, next) =>
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
        next(new BadRequestError("You cannot like this item"))();
      }
      if (err.name === "DocumentNotFoundError") {
        next(
          new NotFoundError("The item you attempted to like cannot be found")
        )();
      } else {
        next(err);
      }
    });

const dislikeItem = (req, res, next) =>
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
        next(new BadRequestError("You cannot like this item"))();
      }
      if (err.name === "DocumentNotFoundError") {
        next(
          new NotFoundError("The item you attempted to dislike cannot be found")
        )();
      } else {
        next(err);
      }
    });

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
