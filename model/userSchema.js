const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    first_name: String,
    email: String,
    pin: String,
    mobileNumber: String,
    category:String,
    is_verified:Boolean
})

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;