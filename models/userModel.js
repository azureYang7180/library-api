const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  borrowHistory: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
      borrowDate: {
        type: Date,
      },
      returnDate: {
        type: Date,
      },
      status: {
        type: String,
        enum: ["borrowed", "returned"],
        default: "borrowed",
      },
    },
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  watchedBooks: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      hasReturned: { type: Boolean, default: false },
    },
  ],
  notifications: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
