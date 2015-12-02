var User = require('../models/User');

exports.getHome = function(req,res){
  User.find({}, function(err, users){
    if(err)
      return next(err);
    res.render('home',{users: users});
  });
    
};
