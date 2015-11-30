
var User = require('../models/user.js');

/*
 /login                  = userController.getLogin -- Surya
/signup                 = userController.postSignup  ---> home or signup -- Surya

*/

exports.getLogin=function(req,res){

    res.render('login');

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