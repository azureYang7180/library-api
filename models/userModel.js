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
});

const User = mongoose.model("User", userSchema);

module.exports = User;
