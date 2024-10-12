const express = require("express");
const {
  addBook,
  getBooks,
  updateBook,
  deleteBook,
  borrowBook,
} = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", addBook);

router.get("/", getBooks);

router.put("/:id", updateBook);

router.delete("/:id", deleteBook);

router.post("/borrow/:bookId", authMiddleware, borrowBook);

module.exports = router;
