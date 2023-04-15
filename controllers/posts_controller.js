const Post  = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

// module.exports.create = function(req,res){
//     Post.create({
//         content: req.body.content,
//         user: req.user._id
//     },function(err,post){
//         if(err){
//             console.log('error in creating a post');
//             return;
//         }

//         res.redirect('back');
//     });
// }

//using async await
module.exports.create = async function(req,res){

    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        post.user = req.user;
        if(req.xhr){
            //post = await post.populate('user', 'name').execPopulate();
            return res.status(200).json({
                data:{
                    post: post,
                    user: req.user
                },
                message: "Post created!"
            })
        }

        req.flash('success','Post created successfully');
        return res.redirect('back');
    }catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
    
}

// module.exports.destroy = function(req, res){
//     Post.findById(req.params.id,function(err,post){
//         //.id means converting the object id into string
//         if(post.user == req.user.id){
//             post.remove();

//             Comment.deleteMany({post: req.params.id},function(err){
//                 return res.redirect('back');
//             });
//         }else{
//             return res.redirect('back');
//         }
//     })
// }

//using async await
module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);
        //.id means converting the object id into string
        if(post.user == req.user.id){

            await Like.deleteMany({likeable: post,onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});

            post.remove();

            await Comment.deleteMany({post: req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id: req.params.id,
                    },
                    message: "Post delete successfully!"
                })
            }

            req.flash('success','Post and associated commented deleted!');
            return res.redirect('back');
            
        }else{
            req.flash('error','You cannot delete this post');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error',err);
        return;
    }

}