var express = require("express");
var router = express.Router();
var middleware = require("../middleware/authorization");
var passport = require("passport");
var Recipe = require("../models/recipe");
var User = require("../models/user");

router.get("/", function(req, res) {
    res.redirect("/recipe");
  });
  
  router.get("/recipe", function(req, res) {
    Recipe.find({}, function(err, recipe) {
      if (err) {
        console.log(err);
        return res.render("pages/home");
      } else {
        console.log(recipe);
        res.render("pages/home", { recipes: recipe });
      }
    });
  });
  
  router.get("/recipe/new", middleware.isLoggedIn, function(req, res) {
    res.render("pages/new");
  });
  
  router.get("/recipe/:id", function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
      if (err) {
        console.log(err);
        return res.render("pages/");
      } else {
        res.render("pages/recipeView", { recipe, recipe });
      }
    });
  });
  
  router.get("/recipe/:id/edit", middleware.checkRecipeOwnership, function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
      if (err) {
        res.render("pages/home");
      } else {
        res.render("pages/edit", { recipe: recipe });
      }
    });
  });
  
  router.get("/register", function(req, res) {
    res.render("pages/register");
  });
  
  router.get("/login", function(req, res) {
    res.render("pages/login");
  });
  
  router.get("/logout", function(req, res) {
    req.logOut();
    res.redirect("/recipe");
  });
  
  router.post("/recipe", middleware.isLoggedIn, function(req, res) {
    var recip = req.body.recipe;
    console.log(recip);
    recip.author = {
      id: req.user._id,
      username: req.user.username
    };
    Recipe.create(recip,
      function(err, newRecipe) {
        if (err) {
          console.log(err);
        } else {
          console.log(newRecipe);
        }
    res.redirect("/recipe");
  })
  });
  
  router.post("/register", function(req, res) {
    User.register(
      { username: req.body.username, active: false },
      req.body.password,
      function(err, user) {
        if (err) {
          console.log(err);
        }
        passport.authenticate("local")(req,res, function (){
          res.redirect('/recipe')
        })
        })
      }
    );
  
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/recipe",
      failureRedirect: "/login"
    })
  );
  
  router.put("/recipe/:id", middleware.checkRecipeOwnership, function(req, res) {
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(
      err,
      recipe
    ) {
      if (err) {
        res.redirect("/recipe");
      } else {
        console.log(recipe);
        res.redirect("/recipe/" + req.params.id);
      }
    });
  });
  
  router.delete("/recipe/:id", middleware.checkRecipeOwnership, function(req, res) {
    Recipe.findByIdAndDelete(req.params.id, function(err, deleteSuccess) {
      if (err) {
        res.redirect("/recipe/");
      } else {
        console.log(deleteSuccess);
        res.redirect("/recipe/");
      }
    });
  });

  module.exports = router;