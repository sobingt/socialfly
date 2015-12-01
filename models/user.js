var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
  email: String,
  password: String,
  fullName: String,
  username: String,
  name: String,
  phone:[String],
  gender:{type: String, enum:["Male","Female","Third"]},
  facebook: String, //facebook ID
  google: String,
  token : Array,
  requests: Array,
  friends: Array
});


userSchema.pre('save', function(next){
  var user = this;
  if(!user.isModified('password'))
  {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt){
    if(err)
      return next(err);
    bcrypt.hash(user.password,salt,null,function(err, hash){
      if(err)
        return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, callback){
  var user = this;
  bcrypt.compare(password, user.password, function(err, isMatch){
    if(err)
      return callback(err);
    callback(null,isMatch);
  });
}

module.exports =mongoose.model('User',userSchema);