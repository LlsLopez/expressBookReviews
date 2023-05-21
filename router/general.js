const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const userExists = (username) => {
    let usersWithName = users.filter((user)=>{
        return user.username === username;
    });

    if(usersWithName.length > 0){
        return true;
    }
    else{
        return false;
    }

}


public_users.post("/register", (req,res) => {
  
    const username = req.body.username;
    const password = req.body.password;

    if(username && password){ // if filled
        if(!userExists(username)){
            users.push({"username":username,"password":password});
            res.status(200).send("User has been created. You may now login to your account.");
        }
        else{
            res.status(404).send("Username is already taken!");
        }
    }
    else{
        console.log(req.body + "tes2t");
        res.status(404).send("Unable to Register user.");
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  res.send(books[req.params.isbn]);

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    let author = req.params.author;
    let booksWithAuthor = Object.values(books).filter((book)=>{
        return book.author === author;
    })

    res.send(booksWithAuthor);


});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let booksWithTitle = Object.values(books).filter((book)=>{
        return book.title === title;
    })

    res.send(booksWithTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
    isbn = req.params.isbn;
    let reviews = books[isbn].reviews;

    res.send(reviews);

});

module.exports.general = public_users;
