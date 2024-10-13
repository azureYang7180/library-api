const Book = require("../models/bookModel");
const User = require("../models/userModel");

const addBook = async (req, res) => {
  const { title, author, isbn, description, copiesAvailable, category } =
    req.body;
  try {
    const book = new Book({
      title,
      author,
      isbn,
      description,
      copiesAvailable,
      category,
    });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const borrowBook = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user.id; // 从认证中获取用户ID

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // 检查书籍是否已经被用户借阅且尚未归还
    const user = await User.findById(userId);
    const alreadyBorrowed = user.borrowHistory.some(
      (borrow) => borrow.bookId.equals(bookId) && borrow.status === "borrowed"
    );

    if (alreadyBorrowed) {
      return res
        .status(400)
        .json({ message: "You have already borrowed this book" });
    }

    // 检查剩余书籍数量
    if (book.copiesAvailable <= 0) {
      return res.status(400).json({ message: "No copies available" });
    }

    // 更新书籍数量
    book.copiesAvailable -= 1;
    await book.save();

    // 更新用户的借书历史
    user.borrowHistory.push({
      bookId: book._id,
      borrowDate: new Date(),
      status: "borrowed",
    });
    await user.save();

    res.json({
      message: "Book borrowed successfully",
      copiesAvailable: book.copiesAvailable,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const book = await Book.findById(req.params.id);

    // 更新用户的借阅历史
    const borrowEntry = user.borrowHistory.find(
      (entry) =>
        entry.bookId.toString() === book._id.toString() &&
        entry.status === "borrowed"
    );
    if (!borrowEntry) {
      return res
        .status(400)
        .json({ message: "Book not found in borrow history" });
    }

    borrowEntry.status = "returned";
    await user.save();

    // 增加书籍剩余数量
    book.copiesAvailable += 1;
    await book.save();

    // 查找收藏了此书并且库存为0时收藏的用户，并更新他们的通知数字
    if (book.copiesAvailable > 0) {
      const usersWhoFavorited = await User.find({
        favorites: book._id,
      });

      usersWhoFavorited.forEach(async (favoritingUser) => {
        if (favoritingUser._id.toString() !== user._id.toString()) {
          favoritingUser.notifications += 1;
          await favoritingUser.save();
        }
      });
    }

    res.json({ message: "Book returned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to return the book" });
  }
};

module.exports = {
  addBook,
  getBooks,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
};
