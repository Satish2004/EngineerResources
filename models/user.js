const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

// Use the schema to apply the plugin
userSchema.plugin(passportLocalMongoose); // adds username, hash, and salt fields

// Export the model
module.exports = mongoose.model("User", userSchema);
