var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var Recipe = require("./models/recipe");
var User = require("./models/user");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var passportLocalMongoose = require("passport-local-mongoose");
var router = require('./routes/routes');

var url = process.env.DATABASEURL || "mongodb://localhost/recipe_app"
mongoose.connect(url, {useNewUrlParser: true});


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use(
  require("express-session")({
    secret: "I love cooking",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', router);

app.listen(process.env.PORT || 5000);
