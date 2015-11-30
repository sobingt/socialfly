var mongoose = require('mongoose');

var userSchema;

userSchema = new mongoose.Schema({

    name: String,
    email: { type: String, unique: true},
    phone: String,
    password: String
});

module.exports=mongoose.model('User',userSchema);