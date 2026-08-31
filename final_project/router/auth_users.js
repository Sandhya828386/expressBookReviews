const express = require('express');
const jwt = require('jsonwebtoken');

let books = require('./booksdb.js');

const regd_users = express.Router();

let users = [];


// Check if username already exists
const isValid = (username) => {
  return users.some((user) => user.username === username);
};


// Check if username and password match
const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};


// Only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      message: 'Invalid username or password'
    });
  }

  const token = jwt.sign(
    { username: username },
    'fingerprint_customer',
    { expiresIn: '1h' }
  );

  return res.status(200).json({
    message: 'Login successful',
    token: token
  });
});


// Add or modify a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;

  if (!books[isbn]) {
    return res.status(404).json({
      message: 'Book not found'
    });
  }

  if (!review) {
    return res.status(400).json({
      message: 'Review is required'
    });
  }

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: 'Authorization token required'
    });
  }

  try {
    const decoded = jwt.verify(
      token.replace('Bearer ', ''),
      'fingerprint_customer'
    );

    books[isbn].reviews[decoded.username] = review;

    return res.status(200).json({
      message: 'Review added successfully',
      reviews: books[isbn].reviews
    });
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
});


// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({
      message: 'Book not found'
    });
  }

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: 'Authorization token required'
    });
  }

  try {
    const decoded = jwt.verify(
      token.replace('Bearer ', ''),
      'fingerprint_customer'
    );

    const username = decoded.username;

    if (!books[isbn].reviews[username]) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({
      message: 'Review deleted successfully',
      reviews: books[isbn].reviews
    });
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;