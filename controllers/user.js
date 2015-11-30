var passport = require('passport');
var User = require('../models/User');

//login
exports.getLogin=function(req,res){

    res.render('login');

};
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
//signup
exports.getSignup = function(req, res, next){
  res.render('register');
};

exports.postSignUp = function(req,res){
    var user = new User
    ({
        name: req.body.name,
        email:req.body.email,
        password:req.body.password
    });
    user.save(function(err)
    {
        var error;
        if (!err)
        {
            res.redirect('/home');

        }
        else if( err.code === 11000)
        {
            error = "Provided email already exists..! try another.";
        }
        else {
            error = "Unable to save register.. Try again";
        }
        res.render('signup', {error: error});
    });

};
