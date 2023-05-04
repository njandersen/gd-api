const { body, param } = require("express-validator");

// Validator for createPost route
const createPostValidators = [
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
  body("authorId").notEmpty().withMessage("Author ID is required"),
  body("tagId").isArray().withMessage("Tags must be an array"),
];

// Validator for updatePost route
const updatePostValidators = [
  param("id").isInt().withMessage("Invalid post ID"),
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
  body("published").isBoolean().withMessage("Published must be a boolean"),
  body("authorId").notEmpty().withMessage("Author ID is required"),
  body("tags").isArray().withMessage("Tags must be an array"),
];

module.exports = {
  createPostValidators,
  updatePostValidators,
};
