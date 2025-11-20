const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect("mongodb+srv://blackvisage44_db_user:4u9qhmgMsN1znGG0@cluster0.axvign9.mongodb.net/")
  .then(() => {
    console.log("MD connected");
  })
  .catch((err) => {
    console.log("Connection error:", err);
  });

app.listen(3000, () => {
  console.log("server at 3000");
});
