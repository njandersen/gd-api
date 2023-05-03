const express = require("express");
const router = express.Router();
const postsController = require("../controllers/Posts");

router.get("/posts", postsController.getAllPosts);
router.get("/posts/:id", postsController.getPostById);
router.get("/users/:userId/posts", postsController.getAllPostsByUser);
router.post("/posts", postsController.createPost);
router.put("/posts/:id", postsController.updatePost);
router.delete("/posts/:id", postsController.deletePost);

module.exports = router;
