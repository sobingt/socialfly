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
  })(req, res, next);
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
    var user = new User({
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
            res.redirect('/');

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

exports.getProfile = function(req, res){
  User.findOne({username: req.params.username}, function(err, user){
    if(err)
      return next(err);
    var requestee = false;
    if(req.user._id.toString()==user._id.toString())
      requestee = true;
    res.render('profile',{
      user: user,
      requestee : requestee
    });
  });
};

exports.isLogin = function(req, res, next){
  if(req.user)
    next();
  else
    res.redirect('/login');
};

exports.getSendFriendsRequest = function(req, res, next){
  User.findById(req.params.userId, function(err, user){
    if(err)
      return next(err);
    var found = false;
    for(var i; i< user.requests.length; i++){
      if(user.requests[i]==req.user._id)
        found = true;
    }
    if(!found)
      user.requests.push(req.params.userId);
    user.save();
    res.redirect('/profile/abc');  
  });
}

exports.getAcceptFriendsRequest = function(req, res, next){
  User.findById(req.params.userId, function(err, user){
    if(err)
      return next(err);
    for(var i; i<  req.user.requests.length; i++){
      if( req.user.requests[i]==req.params.userId)
      {
        user.friends.push(req.user._id);
        user.requests.splice(i,1);
         req.user.friends.push(req.params.userId);
        req.user.save();
      }
      
    }
      user.save();
    res.redirect('/');
  });
};

exports.getRejectFriendsRequest = function(req, res, next){
  User.findById(req.user._id, function(err, user){
    if(err)
      return next(err);
    for(var i; i< user.requests.length; i++){
      if(user.requests[i]==req.params.userId)
        user.requests.splice(i,1);
    }
      user.save();
    res.redirect('/');
  });
};

function getUsernameById(id){
  User.findById(id,function(err, user){
    if(err)
      return next(err);
    if(!user)
      return 0;
    return user.username;
  });
};

function getIdByUsername(username){
  User.findOne({username: username},function(err, user){
    if(err)
      return next(err);
    if(!user)
      return 0;
    return user._id;
  });
};












