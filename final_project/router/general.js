const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");
const path = require("path");

const filePath = path.resolve(__dirname, "./booksdb.js");
console.log("filePath", filePath);

public_users.post("/register", (req, res) => {
  //Write your code here
  console.log("req", req.body);
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Username and password are required" });
  }
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).send({ message: "Username already exists" });
  }
  users.push({ username, password });
  res.status(200).send({ message: "User registered successfully" });
});

public_users.get("/", async function (req, res) {
  console.log("books---", books);
  let meth = req.body.method;
  if (meth === "no-axios") {
    if (books) {
      return res.status(200).json({ listOfBooks: books });
    } else {
      return res.status(300).json({ message: "Error fetching books" });
    }
  } else {
    //axios
    try {
      const response = await axios.get(filePath);
      console.log(response);
      const books = response.data;
      return res.status(200).json(books);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching books", error: error.message });
    }
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  let isbn = req.body.isbn;
  console.log("isbn", isbn);
  let meth = req.body && req.body.method ? req.body.method : "";
  if (meth === "no-axios") {
    for (let key in books) {
      console.log(books[key]["reviews"]);
      if (books[key]["reviews"].hasOwnProperty(isbn)) {
        console.log(books[key]["reviews"]);
        return res.status(200).json({ review: books[key]["reviews"] });
      } else {
        return res.status(300).json({ review: "No Reviews found" });
      }
    }
  } else {
    try {
      const response = await axios.get(`URL_TO_GET_BOOK_BY_ISBN/${isbn}`); // Replace with the actual URL or API endpoint
      const book = response.data;
      res.status(200).json(book);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching book details", error: error.message });
    }
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  let author = req.body.author;
  let resp = "";
  console.log("isbn", isbn);
  let meth = req.body && req.body.method ? req.body.method : "";
  if(meth === "no-axios") {
    for (let key in books) {
      console.log(books[key]);
      if (
        books[key].hasOwnProperty("author") &&
        books[key]["author"] === author
      ) {
        console.log("check", books[key]["author"]);
        resp = books[key];
        console.log("resp-", resp);
      }
    }
    return res.status(200).json({ review: resp });
  }else{
    try {
      const response = await axios.get(`URL_TO_GET_BOOKS_BY_AUTHOR/${author}`);
      const booksByAuthor = response.data;
      res.status(200).json(booksByAuthor);
  } catch (error) {
      res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
  }

});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  let title = req.body.title;
  let resp = "";
  let meth = req.body && req.body.method ? req.body.method : "";
  if(meth === "no-axios") {
    for (let key in books) {
      console.log(books[key]);
      if (books[key].hasOwnProperty("title") && books[key]["title"] === title) {
        console.log("check", books[key]["title"]);
        resp = books[key];
        console.log("resp-", resp);
      }
    }
    return res.status(200).json({ review: resp });
  }else{
    try {
      const response = await axios.get(`URL_TO_GET_BOOKS_BY_TITLE/${title}`);
      const booksByTitle = response.data;
      res.status(200).json(booksByTitle);
  } catch (error) {
      res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
  }

});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.body.isbn;
  console.log("isbn", isbn);
  for (let key in books) {
    console.log(books[key]["reviews"]);
    if (books[key]["reviews"].hasOwnProperty(isbn)) {
      console.log(books[key]["reviews"]);
      return res.status(200).json({ review: books[key] });
    } else {
      return res.status(300).json({ review: "No Reviews found" });
    }
  }
});

module.exports.general = public_users;
