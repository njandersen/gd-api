const prisma = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid Email or Password" });
  }
  try {
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error("Error comparing password hash:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const generateToken = (user) => {
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  return token;
};

module.exports = { login };
