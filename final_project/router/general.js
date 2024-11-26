const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];

  if(book){
    return res.json(book);
  }

  return res.json({ message: `Not found book with isbn ${isbn}` });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  const { author } = req.params;
  const booksByAuthor = Object.values(books).filter(book => book.author.toUpperCase() === author.toUpperCase());

  if(booksByAuthor.length > 0){
    return res.json(booksByAuthor);
  }

  return res.json({ message: `No books found for author ${author}` });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params;

  const booksByTitle = Object.values(books).filter(book => book.title.toUpperCase() === title.toUpperCase());

  if (booksByTitle.length > 0) {
    return res.json(booksByTitle);
  }

  return res.json({ message: `No books found for title ${title}` });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];

  if(!book){
    return res.json({ message: `Not found book with isbn ${isbn}` });
  }

  const { reviews, title } = book;

  if (Object.keys(reviews).length === 0) {
    return res.json({ message: `No review for book ${title}` });
  }

  return res.json(reviews);
});

module.exports.general = public_users;
