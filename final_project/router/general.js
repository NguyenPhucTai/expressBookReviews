const express = require('express');
let axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const newUser = { username, password };
  users.push(newUser);

  return res.status(201).json({ message: 'User registered successfully' });
});


// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const getBooks = () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(books), 2000); 
      });
    };

    const bookList = await getBooks();
    res.json(bookList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book list', error: error.message });
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  try{
    const getBookByIsbn = (isbn) =>{
      return new Promise((resolve , reject) => {
        setTimeout(() => {
          const book = books[isbn];
          if (book) {
            resolve(book);
          } else {
            reject(new Error(`Not found book with isbn ${isbn}`));
          }
        }, 2000);
      });
    };

    const { isbn } = req.params;
    const bookDetails = await getBookByIsbn(isbn);
    res.json(bookDetails);
  }catch (error){
    res.status(500).json({ message: error.message });
  }
});


  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const getBooksByAuthor = (author) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const booksByAuthor = Object.values(books).filter(
            (book) => book.author.toUpperCase() === author.toUpperCase()
          );
          resolve(booksByAuthor);
        }, 2000); // Simulating a delay
      });
    };

    const { author } = req.params;
    const booksByAuthor = await getBooksByAuthor(author);

    if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
    } else {
      res.json({ message: `No books found for author ${author}` });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books by author', error: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const getBooksByTitle = (title) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const booksByTitle = Object.values(books).filter(
            (book) => book.title.toUpperCase() === title.toUpperCase()
          );
          resolve(booksByTitle);
        }, 2000); // Simulating a delay
      });
    };

    const { title } = req.params;
    const booksByTitle = await getBooksByTitle(title);

    if (booksByTitle.length > 0) {
      res.json(booksByTitle);
    } else {
      res.json({ message: `No books found for title ${title}` });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books by title', error: error.message });
  }
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
