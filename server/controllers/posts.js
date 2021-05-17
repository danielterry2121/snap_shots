import PostMessage from '../models/postMessage.js'
import mongoose from 'mongoose';
//Step2

//all of the backend actions for post are written out here 

//Fetching Data
export const getPosts = async (req,res) => {
    //writing try/catch to pull all of the post currently in the database
    try{
        const postMessages = await PostMessage.find();

        res.status(200).json(postMessages);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//Create
export const createPost = async (req,res) => {
    const post = req.body;
    //restructure the post and set the creator of that post equal to the user ID and add a created at function
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()});

    try {
        await newPost.save();

        res.status(201).json(newPost);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}

//Update
export const updatePost = async (req,res) => {
    //extract id from the params to target what to update - restructuring it with _id
    const { id: _id } = req.params;
    const post = req.body;
    //check if the id is a mongoose type id
    // also re-iterate the data now that we have an id const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new: true}); - const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, {new: true});
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');
    //asynchronoous action
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, {new: true});

    res.json(updatedPost);
}
//Delete

export const deletePost = async (req,res) => {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: 'Post deleted successfully' });
}

//likePost functionality

export const likePost = async (req,res) => {
    const { id } = req.params;

    if(!req.userId) return res.json({ message: 'Unauthenticated'});

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    const post = await PostMessage.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId));

    if(index === -1) {
        //like the post if they haven't
        post.likes.push(req.userId)
    } else {
        //dislike a post
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true });

    res.status(200).json(updatedPost);
}