const express = require('express');

let books = require('./booksdb.js');

let isValid = require('./auth_users.js').isValid;

let users = require('./auth_users.js').users;

const public_users = express.Router();


// Register a new user
public_users.post('/register', (req, res) => {
  return res.status(300).json({ message: 'Yet to be implemented' });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.json(books);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.json(books[isbn]);
  }

  return res.status(404).json({ message: 'Book not found' });
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const result = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  );

  if (result.length > 0) {
    return res.json(result);
  }

  return res.status(404).json({
    message: 'No books found for this author'
  });
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const result = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title.toLowerCase()
  );

  if (result.length > 0) {
    return res.json(result);
  }

  return res.status(404).json({
    message: 'No books found for this title'
  });
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.json(books[isbn].reviews);
  }

  return res.status(404).json({ message: 'Book not found' });
});


module.exports.general = public_users;