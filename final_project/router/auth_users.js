const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  return user && user.password === password;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!isValid(username)) {
    return res.status(400).json({ message: "Username does not exist." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(400).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign({username : username}, 'tai_phuc_key', { expiresIn: '1h' });

  req.session.username = username;

  return res.status(200).json({
    message: "Login successful",
    token: token,
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const username = req.session.username;

  if(!username){
    return res.status(401).json({ message: "You must be logged in to add or modify a review." });
  }

  if (!review || review.trim() === "") {
    return res.status(400).json({ message: "Review cannot be empty." });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }

  book.reviews = book.reviews || {};
  book.reviews[username] = review;
  res.status(200).json({ message: "Review added/updated successfully." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.username;

  if(!username){
    return res.status(401).json({ message: "You must be logged in to add or modify a review." });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }

  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: `Review not found for book ${isbn} by user ${username}.` });
  }

  delete book.reviews[username]
  return res.status(200).json({ message: `Review of user ${username} for book ${book.title} deleted successfully.` });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
