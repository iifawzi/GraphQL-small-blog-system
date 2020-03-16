const {validationResult} = require("express-validator/check");
const Post = require('../models/post');
const User = require('../models/user');
exports.getPosts = (req,res,next)=>{
    Post.find().then(posts=>{
   res.status(200).json({
       posts : posts,
   });
    }).catch(err=>{
        console.log(error);
    })

}
exports.createPost = (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validaiton Failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    let creator;
    const content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        imageUrl : "images/mama.png",
        creator: req.userId,
    });
    post.save().then(result=>{
           return  User.findById(req.userId)
    }).then(user=>{
        creator = user;
            user.posts.push(post);
            return user.save()
           
    }).then(result=>{
        res.status(201).json({
            message: "Post created Successfully!",
            post:result,
            creator: {_id: creator._id, name: creator.name}
        });
    }).catch(err=>{
       if (!err.statusCode){
        err.statusCode = 500;
       }
       next(err);
    })
 
}

exports.getPost = (req,res,next)=>{
    const postId = req.params.postId;
    Post.findById(postId).then(post=>{
        if (!post){
            const error = new Error('couldn\'t fine the post!');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            post: post,
        }) 
    }).catch(err=>{
        if (!err.statusCode){
            err.statusCode = 500;
           }
           next(err);
    })
}

exports.updatePost = (req,res,next)=>{
    const id = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    Post.findById(id).then(post=>{
        if (!post){
            const error = new Error('Coludn\'t find your post');
            error.statusCode = 404;
            throw error;
        }
        if (post.creator.toString() !== req.userId){
const error = new Error('Not authorized!');
error.statusCode = 403;
throw error
        }
        post.title = title;
        post.content = content;
        return post.save()
    }).then(result=>{
        res.status(200).json({
            message: "updated",
            post: result,
        });
    }).catch(err=>{
        console.log(err);
    }).catch(err=>{
        if (!err.statusCode){
            err.statusCode = 500;
           }
           next(err);
    })
}

exports.deletePost = (req,res,next)=>{
    const PostId = req.params.postId;
            if (post.creator.toString() !== req.userId){
const error = new Error('Not authorized!');
error.statusCode = 403;
throw error;
        }
    Post.findByIdAndRemove(PostId).then(post=>{
    return User.findById(req.userId);
    }).then(user=>{
        user.posts.pull(PostId);
      return  user.save()
    }).then(result=>{
        res.status(200).json({
            message: "Deleted Successfully",
            post: post,
        })
    }).catch(err=>{
        if (!err.statusCode){
            err.statusCode = 500;
           }
           next(err);
    })
}