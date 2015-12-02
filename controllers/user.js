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
/*
  
  User.findOne({username: req.params.username}, function(err, user){

*/ 
    //call the callback function using exeec
  User.findOne({username: req.params.username})
  .populate('requests')
  .populate('friends')
  .exec(function(err, user){
    if(err)
      return next(err);
    if(!user)
      res.redirect('/');
    var loggedUser = false;
    var requestee = false;
    if(req.user)
    {
      if(req.user._id.toString()==user._id.toString())
        loggedUser = true;
      for(var i=0; i<user.requests.length; i++)
      {
        if(req.user._id.toString()==user.requests[i]._id.toString())
         requestee = true;
      }
    }
    res.render('profile',{
      user: user,
      loggedUser : loggedUser,
      requestee: requestee
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
  User.findOne({username: req.params.username}, function(err, user){
    if(err)
      return next(err);
    var found = false;
    for(var i; i< user.requests.length; i++){
      if(user.requests[i]==req.user._id)
        found = true;
    }
    if(!found)
      user.requests.push(req.user._id);
    user.save();
    res.redirect('/profile/'+user.username);  
  });
}

exports.getAcceptFriendsRequest = function(req, res, next){
  User.findOne({username: req.params.username})
    .exec(function(err, user){
    if(err)
      return next(err);
    var found = false;
    for(var i; i< user.friends.length; i++){
      if(user.friends[i]==req.user._id)
        found = true;
    }

    for(var i=0; i<req.user.requests.length; i++)
    {
      if(req.user.requests[i].toString()==user._id)
        req.user.requests.splice(i,1);
    }
    if(!found)
    {
      user.requests.push(req.user._id);
      user.save();
      req.user.friends.push(user._id);
      req.user.save();
    }
    res.redirect("/profile/"+req.user.username);
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
    return user.username;
  });
};












