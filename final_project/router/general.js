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
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
    return res.json(book);
  }
  return res.json({ message: `Not found book with isbn ${isbn}` });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];

  for(let key in books){
    if(books[key].author.toUpperCase() === author.toUpperCase()){
      booksByAuthor.push(books[key]);
    }
  }

  if(booksByAuthor.length > 0){
    return res.json(booksByAuthor);
  } else{
    return res.json({ message: `No books found for author ${author}` });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];

  for(let key in books){
    if(books[key].title.toUpperCase() === title.toUpperCase()){
      booksByTitle.push(books[key]);
    }
  }

  if(booksByTitle.length > 0){
    return res.json(booksByTitle);
  } else{
    return res.json({ message: `No books found for title ${title}` });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
