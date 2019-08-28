var mongoose = require("mongoose");

var recipeSchema = new mongoose.Schema({
  title: String,
  image: String,
  ingredients: String,
  instructions: String,
  cookingTime: Number,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

module.exports = mongoose.model("Recipe", recipeSchema);
