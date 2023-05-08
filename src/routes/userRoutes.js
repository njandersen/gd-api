const express = require("express");
const router = express.Router();

const userController = require("../controllers/Users");

router.get("/users", userController.getUsers);
// router.get("/users/:id", userController.getUserById);
router.get("/users/:username", userController.getUserByUsername);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
