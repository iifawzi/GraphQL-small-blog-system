const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
module.exports = {
    createUser: async function({userInput},req){
        const email = userInput.email;
        const password = userInput.password;
        const name = userInput.name;
        const errors = [];
        if (!validator.isEmail(email)){
        errors.push({message: "Email is invalid."});
        }
        if (validator.isEmpty(password) || !validator.isLength(password, {min: 5})){
            errors.push({message: "Password can't be null or less than 5 digits"});
        }
        if (errors.length > 0 ){
            const error = new Error('invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const existingUser = await User.findOne({email: email});
        if (existingUser){
            const error = new Error('User exists already');
        }
        const hashedPw =  await bcrypt.hash(password,12);
        const user = new User({
            email,
            password: hashedPw,
            name,
        });
        const createdUser = await user.save();
        return { 
            ...createdUser._doc,
             _id: createdUser._id.toString(),
        }
    },

    login: async function({loginInput},req){
        const email = loginInput.email;
        const password = loginInput.password;
        const user = await User.findOne({email});
        if (!user){
            const error = new Error('User not found');
            error.code = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password,user.password);
        if (!isEqual){
            const error = new Error('password is not correct');
            error.code = 401;
            throw error;
        }
        const token = jwt.sign({
            userId: user._id.toString(),
            email: user.email,
        },'supersecretsecretsecret',{expiresIn:  '1h'});
return {
    ...user._doc
}
    },

    createPost: async function({postInput},req){
        if(!req.isAuth){
            const error = new Error("Not authnticated");
            error.code = 401;
            throw error;
        }
        const title = postInput.title;
        const content = postInput.content;
        const imageUrl = postInput.imageUrl;
        if (validator.isEmpty(title)) {
            const error = new Error('Title can\'t be null');
            error.code = 422;
            throw error
        };
        if (validator.isEmpty(content)) {
            const error = new Error('content can\'t be null');
            error.code = 422;
            throw error
        }
        if (validator.isEmpty(imageUrl)) {
            const error = new Error('image url can\'t be null');
            error.code = 422;
            throw error
        }
        const user = await User.findOne({email: "iifawzie@gmail.com"});
        if (!user){
            const error = new Error('invalid user');
            error.code = 422;
            throw error
        }
        const post = new Post({
            title,
            content,
            imageUrl,
            creator: user,
        });
        const createdPost = await post.save();
        user.posts.push(createdPost);
        await user.save()
        return {
...createdPost._doc
        }   
    },
    getPosts : async function(){
      const posts =  await Post.find()
      return (
        posts.map(p=>{
             return {...p._doc}
         })
      )
    }
}