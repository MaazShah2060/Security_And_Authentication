//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const app = express();
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require("express-session");
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const User = mongoose.model("User", userSchema);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: 'mnmforce',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(passportLocalMongoose);
app.get('/', function(req, res) {
    res.render('home');
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/register', function(req, res) {
    res.render('register');
});

app.post('/login', function(req, res) {
    const Username = req.body.username;
    const Password = req.body.password;

    User.findOne({ email: Username }, function(err, found) {
        if (err) {
            console.log(err);
        } else {
            if (!found) {
                res.send('Invalid username!!!');
            } else {

                bcrypt.compare(Password, found.password, function(err, result) {
                    if (result == true) {
                        res.render('secrets');
                    } else {
                        res.send("INVALID PASSWORD!!!")
                    }
                });
            }
        }
    });
});

app.post('/register', function(req, res) {
    const Username = req.body.username;
    const Password = req.body.password;
    bcrypt.hash(Password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: Username,
            password: hash
        });
        newUser.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                res.render('secrets');
            }
        });
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});