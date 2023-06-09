const Comment = require('../models/comment');
const Post = require('../models/post');
const queue = require('../config/kue');
const commentEmailWorker =  require('../workers/comments_email_worker');
const commentsMailer = require('../mailers/comment_mailer');
const Like = require('../models/like');
// module.exports.create = function(req,res){
//     Post.findById(req.body.post,function(err,post){
//         if(post){
//             Comment.create({
//                 content:req.body.content,
//                 post:req.body.post,
//                 user: req.user._id
//             },function(err,comment){
//                 //handle error

//                 post.comments.push(comment);
//                 post.save();

//                 res.redirect('/');
//             });
//         }
//     });
// }

//using async awit
module.exports.create = async function(req,res){

    try{
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content:req.body.content,
                post:req.body.post,
                user: req.user._id
            });
            post.comments.push(comment);
                post.save();

                comment = await comment.populate({
                    path:'user',
                    select: 'name email'
                });
                //commentsMailer.newComment(comment);
                let job = queue.create('email',comment).save(function(err){
                    if(err){
                        console.log('error in creating a queue',err);
                    }

                    console.log('job enqueue',job.id);
                })
                if(req.xhr){
                    // Similar for comments to fetch the user's id!
                    
                    return res.status(200).json({
                        data:{
                            comment: comment
                        },
                        message: "Comment created!"
                    });
                }

                req.flash('success','Comment created successfully');
                return res.redirect('back');
        }
    }catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }

    
   
}

// module.exports.destroy = function(req,res){
//     Comment.findById(req.params.id,function(err,comment){
//         if(comment.user == req.user.id){
//            let postId = comment.post;
           
//            comment.remove();

//            Post.findByIdAndUpdate(postId,{$pull: {comments: req.params.id}},function(err,post){
//             return res.redirect('back');
//            })
//         }else{
//             return res.redirect('back');
//         }
//     });
// }

module.exports.destroy = async function(req,res){

    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
           let postId = comment.post;
           
           comment.remove();

           let post = Post.findByIdAndUpdate(postId,{$pull: {comments: req.params.id}});

           await Like.deleteMany({likeable: comment._id, OnModel: 'Comment'});

           if(req.xhr){
            return res.status(200).json({
                data:{
                    comment_id: req.params.id
                },
                message: "Post deleted!"
            });
           }
           
           req.flash('success','Comment deleted!');
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error',err);
        return;
    }

   
    
}