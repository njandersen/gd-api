const express = require("express");
const router = express.Router();
const postsController = require("../controllers/Posts");
const {
  createPostValidators,
  updatePostValidators,
} = require("../util/validators/post-validator");

router.get("/posts", postsController.getAllPosts);
router.get("/posts/:id", postsController.getPostById);
router.get("/users/:userId/posts", postsController.getAllPostsByUser);
router.post("/posts", createPostValidators, postsController.createPost);
router.put("/posts/:id", updatePostValidators, postsController.updatePost);
router.delete("/posts/:id", postsController.deletePost);

module.exports = router;
