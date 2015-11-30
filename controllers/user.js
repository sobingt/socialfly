var passport = require('passport');
var User = require('../models/User');

exports.postLogin = function(req, res, next){
  passport.authenticate('local', function(err, user, info){
    if(err)
      return next(err);
    console.log(user);
    if(!user){
      res.redirect('/login', {message});
    }
    req.logIn(user, function(err){
      if(err)
        return next(err);
      res.redirect('/');
    });
  });
};
//signup get
exports.getSignup = function(req, res, next){
  res.render('register');
};
