// controllers/favoriteController.js
const User = require("../models/userModel");
const Book = require("../models/bookModel");

// Add a book to the user's favorites
const addFavorite = async (req, res) => {
  const user = await User.findById(req.user.id);
  const book = await Book.findById(req.params.bookId);

  if (!user.favorites.includes(book._id)) {
    user.favorites.push(book._id);

    if (book.copiesAvailable === 0) {
      user.watchedBooks.push({
        bookId: book._id,
        hasReturned: false,
      });
    }

    await user.save();
    res.json({ message: "Book added to favorites" });
  } else {
    res.status(400).json({ message: "Book already in favorites" });
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
    // Populate favorite books and borrow history information
    const user = await User.findById(req.user.id)
      .populate("favorites")
      .populate("borrowHistory.bookId");

    // Map through user's favorites to check if the book is borrowed
    const favoritesWithBorrowStatus = user.favorites.map((book) => {
      const borrowedBook = user.borrowHistory.find(
        (history) =>
          history.bookId._id.toString() === book._id.toString() &&
          history.status === "borrowed"
      );

      return {
        ...book._doc,
        isBorrowed: !!borrowedBook, // If borrowedBook exists, set isBorrowed to true
      };
    });

    // Return the list of favorite books with borrow status
    return res.json(favoritesWithBorrowStatus);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching favorites", error: error.message });
  }
};

module.exports = { addFavorite, removeFavorite, getFavorites };
