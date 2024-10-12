const express = require("express");
const {
  addFavorite,
  removeFavorite,
  getFavorites,
} = require("../controllers/favoriteController");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

// Route to add a book to the user's favorites
router.post("/:bookId", authMiddleware, addFavorite);

// Route to remove a book from the user's favorites
router.delete("/:bookId", authMiddleware, removeFavorite);

// Route to get all favorite books for the user
router.get("/", authMiddleware, getFavorites);

module.exports = router;
