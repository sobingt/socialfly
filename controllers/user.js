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
      res.redirect('/login', {
                    message: info.message
      });
    }
    req.logIn(user, function(err){
      if(err)
        return next(err);
      res.redirect('/');
    });
  });
};

//Facebook login
exports.getFacebookLogin = function(req, res, next){
  passport.authenticate('facebook',{scope:['email','user_location']});
};

//Facebook Login Callback
exports.getFacebookLoginCallback = function(req, res, next){
  passport.authenticate('local',{ failureRedirect: '/login'});
  next();
};

//Logout
exports.getLogout = function(req, res){
  req.logout();
  res.redirect('/');
};

//signup
exports.getSignUp = function(req, res, next){
  res.render('signup');
};

exports.postSignUp = function(req,res){
    var user = new User
    ({
        fullName: req.body.name,
        username: req.body.username,
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
        else if(err.code === 11000)
        {
            error = "Provided email already exists..! try another.";
        }
        else {
            error = "Unable to save register.. Try again";
        }
        res.render('signup', {error: error});
    });

};
