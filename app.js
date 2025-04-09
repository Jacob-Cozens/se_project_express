const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");

const app = express();

const { PORT = 3001 } = process.env;

app.use("/", userRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);
