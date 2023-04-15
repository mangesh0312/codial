const User = require('../models/user');
const fs = require('fs');
const path = require('path');
module.exports.profile = function(req,res){
    // res.end('<h1>User Profile</h1>');

    // if(req.cookies.user_id){
    //     User.findById(req.cookies.user_id,function(err,user){
    //         if(user){
    //             return res.render('userprofile.ejs',{
    //                     title:"UserProfile",
    //                     user: user
    //                 })
    //         }
    //     })
    // }else{
    //     res.redirect('/users/sign-in');
    // }
    User.findById(req.params.id,function(err, user){
        return res.render('userprofile',{
            title:'UserProfile',
            profile_user: user
        });
    })
    

    //return res.redirect('/users/profile');
}

module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id,req.body,function(err, user){
    //            req.flash('success','Updated');
    //         return res.redirect('back');
    //     });
    // }else{
    //    req.flash('error','UnAuthorised');
    //     return res.status(401).send('UnAuthorised');
    // }

    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('******Multer Error: ',err);
                }

                //console.log(req.file);

                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){

                    if(user.avatar && fs.existsSync('../uploads/user/avatars')){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                    //this is saving the path of the uploaded file into the avatar filed in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename; 
                }

                user.save();
                return res.redirect('back');
            });
        }catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    }else{
        req.flash('error','UnAuthorised');
        return res.status(401).send('UnAuthorised');
    }
}

//render the sign up page
module.exports.signUp = function(req,res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    })
}

//render the sign in page
module.exports.signIn = function(req,res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title:"Codeial | Sign In"
    })
}

//get the sign-up data
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if(!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating the user while signing up'); return}

                return res.redirect('/users/sign-in')
            })
        }else{
            return res.redirect('back')
        }
    })

}

//sign in and create session of the user
// module.exports.createSession = function(req,res){   

//     //steps to authenticate user
//     //find the user
//     User.findOne({email: req.body.email},function(err,user){
//         if(err){
//             console.log('error in finding user');
//             return
//         }
//          //handle user found

//         if(user){
//         //handle password which don't match
//             if(user.password != req.body.password){
//                 return res.redirect('back');
//             }

//             res.cookie('user_id',user.id);
//             return res.redirect('/users/profile');
//         }else{
//             //handle user not found
//             return res.redirect('back');
//         }
//     })
   
// }

//create session using passport

module.exports.createSession = function(req,res){
    req.flash('success','Logged in Successfully!!!')
    return res.redirect('/');
}

module.exports.deleteSession = function(req,res,next){

    // res.clearCookie("user_id",'req.body.email');
    // return res.redirect('/users/sign-in');
    // res.end();

    // req.logout(function(err){
    //     if(err){
    //         console.log(err);
    //         return
    //     }
    // });

    // req.flash('success','You are logged out!')
    // res.redirect('/');

    req.logout(function (err) {
        if (err) {
          return next(err);
        }
      });
      req.flash('success', 'You have logged out!');
    
      return res.redirect('/');
}