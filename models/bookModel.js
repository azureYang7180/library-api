const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
  },
  copiesAvailable: {
    type: Number,
    default: 1,
  },
  category: {
    type: String,
  },
  status: {
    type: String,
    enum: ["available", "unavailable"],
    default: "available",
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
