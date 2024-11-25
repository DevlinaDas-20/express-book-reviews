const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const session = require("express-session");
const regd_users = express.Router();
const jwtSecret = '244d0b97c61cb978567e348a15fc8cd5c3c5791af982ccae88db48383bc3c273';


let users = [
  {
      "username": "test",
      "password": "123"
  }
];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  // console.log('post-login',req)
  const { username, password } = req.body;
  // console.log('post-login',req.body)
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
      // console.log('user',user,jwtSecret)
      const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: '1h' });
      // console.log('token',token)
      res.status(200).json({ message:'Login successful','token': token });
  } else {
      res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
// regd_users.post("/auth/review/:isbn", (req, res) => {
regd_users.put("/review/:isbn", (req, res) => {
  //Write your code here
    // console.log('req.params--',req.params)
    const isbn = req.params.isbn;
    // console.log('isbn--',isbn)
    const review = req.body.review;
    // console.log('review--',review)
    const token = req.headers.authorization.split(" ")[0];
    const decoded = jwt.verify(token, jwtSecret);
    console.log('decoded--',decoded)
    const username = decoded.username;
    if (books[isbn]) {
      if (!books[isbn].reviews) {
          books[isbn].reviews = {};
      }
      books[isbn].reviews[username] = review;
      res.status(200).json({ message: "Review added/updated successfully",books:books });
      console.log('books',books)
  } else {
      res.status(404).json({ message: "Book not found" });
  }
  // return res.status(300).json({ message: "Yet to be implemented" });
});


regd_users.delete("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const token = req.headers.authorization.split(" ")[0];
  const decoded = jwt.verify(token, jwtSecret);
  const username = decoded.username;

  if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      res.status(200).json({ message: "Review deleted successfully",books:books });
  } else {
      res.status(404).json({ message: "Review not found" });
  }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
