var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

    fullName: String,
    username: String,
    email: { type: String, unique: true},
    phone: String,
    password: String
});

module.exports=mongoose.model('User',userSchema);