const express = require('express');
const axios = require('axios');

let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;

const public_users = express.Router();


// Register a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  if (isValid(username)) {
    return res.status(400).json({
      message: 'User already exists'
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(201).json({
    message: 'User registered successfully'
  });
});


// Get all books using Axios and async/await
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving books'
    });
  }
});


// Internal endpoint used by Axios to retrieve the books
public_users.get('/books', function (req, res) {
  res.json(books);
});


// Get book details based on ISBN using Axios Promise
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  axios
    .get('http://localhost:5000/books')
    .then((response) => {
      const book = response.data[isbn];

      if (book) {
        res.json(book);
      } else {
        res.status(404).json({
          message: 'Book not found'
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Error retrieving book'
      });
    });
});


// Get books based on author using Axios Promise
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  axios
    .get('http://localhost:5000/books')
    .then((response) => {
      const result = Object.values(response.data).filter(
        (book) => book.author.toLowerCase() === author.toLowerCase()
      );

      if (result.length > 0) {
        res.json(result);
      } else {
        res.status(404).json({
          message: 'No books found for this author'
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Error retrieving books'
      });
    });
});


// Get books based on title using Axios Promise
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  axios
    .get('http://localhost:5000/books')
    .then((response) => {
      const result = Object.values(response.data).filter(
        (book) => book.title.toLowerCase() === title.toLowerCase()
      );

      if (result.length > 0) {
        res.json(result);
      } else {
        res.status(404).json({
          message: 'No books found for this title'
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Error retrieving books'
      });
    });
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: 'Book not found'
  });
});


module.exports.general = public_users;