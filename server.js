const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
connectDB();

app.use("/api/users", userRoutes);

app.use("/api/books", bookRoutes);

app.use("/api/favorites", favoriteRoutes);

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
