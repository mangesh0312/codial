const Post = require('../models/post');
const User = require('../models/user');

// module.exports.home = function(req,res){
//     //return res.end('<h1>Express is up and running</h1>');

//     // console.log(req.cookies);
//     // res.cookie('user_id',25);
//     // Post.find({},function(err,posts){
//     //     return res.render('home.ejs',{
//     //         title:"Codeial | Home",
//     //         posts: posts
//     //     });
//     // });
    
//     //populate the user of each post
//     Post.find({})
//     .populate('user')
//     .populate({
//         path: 'comments',
//         populate:{
//             path: 'user'
//         }
        
//     })
//     .exec(function(err,posts){

//         User.find({},function(err,user){
//             return res.render('home.ejs',{
//                 title:"Codeial | Home",
//                 posts: posts,
//                 all_users: user
//             });
//         })

       
//     })
    
// }

//Using Async Await
module.exports.home = async function(req,res){
    //populate the user of each post

    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
        path: 'comments',
        populate:{
            path: 'user likes'
        },
    }).populate('likes');
    

       let user = await User.find({});
            return res.render('home',{
                title:"Codeial | Home",
                posts: posts,
                all_users: user
            });
    }catch(err){
        console.log('Error',err);
        return;
    }

    
        
}