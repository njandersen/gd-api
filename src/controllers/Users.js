const prisma = require("../db/db");
const bcrypt = require("bcrypt");
const { createUserValidators } = require("../util/validators/user-validator");

// GET /users
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// GET /users/:id
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// POST /users
const createUser = async (req, res) => {
  const { name, email, password, username } = req.body;

  //Validate user input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  try {
    const user = await prisma.user.create({
      data: { name, email, password: passwordHash, username },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// PUT /users/:id
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, username } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, password, username },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// DELETE /users/:id
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
