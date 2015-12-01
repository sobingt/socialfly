var passport = require('passport');
var LocalStrategies = require('passport-local');
var FacebookStrategies =require('passport-facebook');

var User = require('../models/User');

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/*** Local email and Pawoord ***/
passport.use(new LocalStrategies({usernameField: 'email'},function(email, password, done){
  User.findOne({email: email}, function(err, user){
    if(err)
      return err;
    user.comparePassword(password, function(err, isMatch){
      if(isMatch)
        return done(null,user);
      else
        return done(null,false,{message: "Invalid password and email"});
    });
      
  });
}))

/*** Facebook Login **/
passport.use(new FacebookStrategies({
    clientID: '857572574355785', 
    clientSecret:'6d1fb52f15051e0099b08786c15d96a7',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },function(req, accessToken, refreshToken, profile, done){
    console.log(profile);
    if(req.user)
    {
      User.findOne({facebook: profile.id}, function(err,user){
        if(user)
        {
          console.log("You have already synced your facebook account with an existing account");
        }
        else
        {
          User.findById(req.user.id,function(err, user){
            user.facebook = profile.id;
            user.token.push({type:'facebook', accessToken: accessToken});
            user.name = user.name || profile.displayName;
            user.save(function(err){
              console.log("Facebook account synced");
              done(err,user)
            });
            
          });
        }
      });
    }
    else{
      User.findOne({facebook: profile.id}, function(err, user){
         if(user)
         {
           console.log("Existing facebook Account");
           return done(null,user);
         }
        else
        {
          User.findOne({email: profile._json.email}, function(err, user)           {
            if(user)
            {
              console.log("Your facebook email is associated to an in this system. Try login in with that email id or send a forget password request. ");
              done(err);
            }
            else
            {
              var user = new User();
              user.email = profile._json.email;
              user.facebook = profile.id;
              user.token.push({type:'facebook', accessToken: accessToken});
              user.name = profile.displayName;
              user.save(function(err){
                done(err, user);
              })
            }
          });
        }
      });
    }
}));








