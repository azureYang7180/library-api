// controllers/favoriteController.js
const User = require("../models/userModel");
const Book = require("../models/bookModel");

// Add a book to the user's favorites
const addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Check if the book is already in the user's favorites
    if (!user.favorites.includes(req.params.bookId)) {
      user.favorites.push(req.params.bookId);
      await user.save();
      return res.json({ message: "Book added to favorites" });
    } else {
      return res.status(400).json({ message: "Book already in favorites" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding favorite", error: error.message });
  }
};

// Remove a book from the user's favorites
const removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Remove the book from favorites
    user.favorites = user.favorites.filter(
      (bookId) => bookId.toString() !== req.params.bookId
    );
    await user.save();

    return res.json({ message: "Book removed from favorites" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error removing favorite", error: error.message });
  }
};

// Get the user's favorite books
const getFavorites = async (req, res) => {
  try {
    // Populate favorite books information
    const user = await User.findById(req.user.id).populate("favorites");

    // Return the list of favorite books
    return res.json(user.favorites);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching favorites", error: error.message });
  }
};

module.exports = { addFavorite, removeFavorite, getFavorites };
