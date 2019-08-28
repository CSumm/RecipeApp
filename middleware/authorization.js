var middleware = {};

middleware.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }
  
  middleware.checkRecipeOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
      Recipe.findById(req.params.id, function(err, recipe){
        if(err){
          res.redirect('/recipe')
        }
        else {
          if(recipe.author.id.equals(req.user._id)){
            next();
          } else {
            res.redirect("back");
          }
        }
      })
    }
    else {
      res.redirect("back");
    }
  }

  module.exports = middleware;

  