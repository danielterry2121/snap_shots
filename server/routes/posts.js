import express from 'express';
//Step one 
import { getPosts,createPost,updatePost, deletePost, likePost } from '../controllers/posts.js';

import auth from '../middleware/auth.js';
const router = express.Router();
//keeping all of the functionality of our post clean and importing the functionality from controllers

//Fetching data
router.get('/', getPosts );
//Create
router.post('/', auth, createPost );
//Update
router.patch('/:id', auth, updatePost);
//Delete
router.delete('/:id', auth, deletePost);
//like functionality
router.patch('/:id/likePost', auth, likePost);
export default router;