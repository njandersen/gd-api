const { body } = require("express-validator");

// Validation chain for creating a user
const createUserValidators = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("username").notEmpty().withMessage("Username is required"),
];

module.exports = {
  createUserValidators,
};
