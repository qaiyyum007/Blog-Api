import express from 'express'
import { validationResult } from 'express-validator'
import { isAuth } from '../middleware/auth.js'
import {searchForPostValidator } from '../middleware/validation.js'
import Post from '../Model/PostModel.js'
import User from '../Model/UserModel.js'
const expressRouter=express.Router()
class PostRouter{
    postRouter
    constructor(){
     this.postRouter=expressRouter
     this.postRouter.post('/create_post' ,isAuth ,async(req,res)=>{

        try {
            let { textOfThePost } = req.body;

            let user = await User.findById(req.user._id).select("-password");
            if (!user) return res.status(404).json("User not found");

             let newPost = new Post({
                textOfThePost,
                name: user.name,
                avatar: user.avatar,
                user: req.user._id,
              });

              const post= await newPost.save()

             return res.status(200).send(post)


        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })







     this.postRouter.delete('/delete/:id' ,async(req,res)=>{

        try {
            const post = await Post.findByIdAndDelete(req.params.id);
         
            return res.send({post})

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })



     this.postRouter.get('single_post/:post_id' ,async(req,res)=>{

        try {
            const post = await Post.findById(req.params.post_id);
         
            return res.send({post})

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })



     this.postRouter.get('/user_posts',isAuth ,async(req,res)=>{

        try {
            let posts = await Post.find();
    let userPosts = posts.filter(
      (post) => post.user.toString() === req.user.id.toString()
    );
         
            return res.send({userPosts})

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })





     this.postRouter.get('/all_Post' ,async(req,res)=>{

        try {
            const post = await Post.find();
         
            return res.send({post})

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })



     this.postRouter.put('/search_for_post', searchForPostValidator, async(req,res)=>{

        try {
            const { searchInput } = req.body;
            const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(400).json({ errors: errors.array() });
            let posts = await Post.find();
            if (searchInput === "" || searchInput === null) {
                res.status(401).json(posts);
              } else {
                const findPostBySearchInput = posts.find(
                  (post) =>
                    post.textOfThePost.toString().toLowerCase().split(" ").join("") ===
                    searchInput.toString().toLowerCase().split(" ").join("")
                );
                res.status(200).send(findPostBySearchInput);
              }
         
            

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })






     this.postRouter.get('/most_liked' ,async(req,res)=>{

        try {
             //We order from the most to the least liked, as default sort is assigned as 1, when you use -1 you basically reverse the order of array
           let posts = await Post.find().sort({ likes: -1 });
          res.status(200).send(posts);

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })


     this.postRouter.get('/the_most_commented' ,async(req,res)=>{

        try {
             //We order from the most to the least liked, as default sort is assigned as 1, when you use -1 you basically reverse the order of array
           let posts = await Post.find().sort({ commnets: -1 });
          res.status(200).send(posts);

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })



     this.postRouter.put('/likes/:post_id' ,isAuth,async(req,res)=>{

        try {
            let post = await Post.findById(req.params.post_id);

            if (!post) return res.status(404).json("Post not found");
        
            if ( post.likes.filter((like) => like.user === req.user._id))
            return res.status(401).json("Post is already liked by you!");

        
            let newLike = {
              user: req.user._id,
            };
        
            post.likes.unshift(newLike);
        
          const posts=   await post.save();
          res.status(200).send(posts);

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })




     this.postRouter.put('/add_comment/:post_id' ,isAuth,async(req,res)=>{

        try {
            let post = await Post.findById(req.params.post_id);
            let user = await User.findById(req.user._id).select("-password");
            if (!user) return res.status(404).json("User not found");
            if (!post) return res.status(404).json("Post not found");

        
            const { textOfTheComment } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty())
              return res.status(400).json({ errors: errors.array() });
        
        
        
            let newComment = {
              textOfTheComment,
              name: user.name,
              avatar: user.avatar,
            };
            post.comments.unshift(newComment);
        
          const comments=  await post.save();
        
            res.send({comments});
        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })




     this.postRouter.delete('/delete_post/:post_id' ,isAuth,async(req,res)=>{

        try {
            let post = await Post.findById(req.params.post_id);

    if (!post) return res.status(404).json("Post not found");

    if (post.user.toString()!== req.user._id.toString())
      return res.status(401).json("You are not allowed to do that!");

          const deletePost= await post.remove()  ;
        
            res.send(deletePost);
        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })





     this.postRouter.delete('/delete_post/:post_id' ,isAuth,async(req,res)=>{

        try {
            let post = await Post.findById(req.params.post_id);

    if (!post) return res.status(404).json("Post not found");

    if (post.user.toString()!== req.user._id.toString())
      return res.status(401).json("You are not allowed to do that!");

          const deletePost= await post.remove()  ;
        
            res.send(deletePost);
        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })





     this.postRouter.delete('/remove_like_from_post/:post_id/:like_id' ,isAuth,async(req,res)=>{

        try {
            let post = await Post.findById(req.params.post_id);

            if (!post) return res.status(404).json("Post not found");
        // filter create a new Array so it does not parmas.like_id  match meaans no like if exit then it wil delete
            const removeLikeFromPost = post.likes.filter(
              (like) => like.id.toString() !== req.params.like_id.toString()
            );
        
            post.likes = removeLikeFromPost;
        
            await post.save();
        
            res.json(post);
        
        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })




     this.postRouter.delete('/remove_like_from_comment/:post_id/:comment_id/:like_id' ,isAuth,async(req,res)=>{

        try {
            let post = await Post.findById(req.params.post_id);

            if (!post) return res.status(404).json("Post not found");
        
            const removeCommentFromComments = post.comments.filter(
              (comment) => comment._id.toString() !== req.params.comment_id
            );
        
            post.comments = removeCommentFromComments;
        
            await post.save();
        
            res.json(post);
        
        
        
        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })




     this.postRouter.get('/the_most_recent' ,isAuth,async(req,res)=>{

        try {
            let posts = await Post.find().sort({ date: -1 });
            return res.send(posts);        
        
        
        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })



     this.postRouter.get('/the_most_commented' ,isAuth,async(req,res)=>{

        try {
            let posts = await Post.find().sort({ comments: -1 });
             return res.send(posts);      
        
        
        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })


     this.postRouter.get('/the_most_likes' ,async(req,res)=>{

        try {
            let posts = await Post.find().sort({ likes: -1 });
            res.json(posts);  
        
        
        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })





    }
}

export default PostRouter