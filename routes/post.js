const router = require("express").Router();
const Post = require("../models/Post")


// get all posts
router.get("/", async (req,res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json(error)
    }
})

// get a post
router.get("/:id", async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
})

// create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);

    try {
        const savePost = await newPost.save();
        res.status(200).json(savePost);
    } catch (error) {
        res.status(500).json(error)
    }
    
})

// update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.updateOne({$set: req.body});
            res.status(403).json("The post has been updated");
        } else {
            res.status(403).json("You can only update your post")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

// delete a post

router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("The post has been deleted");
        } else {
            res.status(403).json("You can only delete your post")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;

