const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  
    const username = req.body.username;
    const password = req.body.password;
    console.log(req.body.username);
    console.log(req.body.password);
    console.log(users.length);
    if(!username || !password){
        return res.status(404).send("Error logging in");
    }
    if(authenticatedUser(username,password)){
        let accessToken = jwt.sign({
            data:password
        }, 'access',{expiresIn:60*60}); // 1 hour

        req.session.authorization = {
            accessToken,username
        }

        return res.status(200).send("User successfully logged in");
    }
    else{
        return res.status(208).send("Invalid Login. Check username and password");
    }


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.query.review;
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const book = books[isbn];

    console.log(book.reviews[username]);
    if(books[isbn]){
        if(book.reviews[username]){
            book.reviews[username]=review;
            return res.send("review successfully updated!");
        }
        book.reviews[username]=review;
        return res.send("review sucessfully posted!");
    }
    return res.send("ERROR. Invalid ISBN");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    
    const book = books[isbn];

    if(book)
    {
        if(book.reviews[username]){
            delete book.reviews[username];
            return res.send("Review sucessfully deleted.");
        }
        return res.send("No Reviews Exist under your username.");   
    }

    return res.status(404).send("ERROR: Invalid ISBN");


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
