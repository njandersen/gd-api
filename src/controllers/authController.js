const prisma = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const authController = {
  login: async (req, res) => {
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
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid Email or Password" });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: refreshToken },
      });
      res.json({ accessToken, refreshToken, username: user.username });
    } catch (err) {
      console.error("Error comparing password hash:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  logout: async (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token is missing" });
    }

    try {
      const deletedToken = await prisma.user.update({
        where: { refreshToken: refreshToken },
        data: { refreshToken: null },
      });

      if (!deletedToken) {
        return res.status(401).json({ error: "Invalid refresh token" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting refresh token:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  refresh: async (req, res) => {
    const refreshToken = req.body.refreshToken;

    let newAccessToken, newRefreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token is missing" });
    }

    const user = await prisma.user.findUnique({
      where: {
        refreshToken: refreshToken,
      },
    });

    if (!user) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
      if (err) {
        console.log(err);
      }

      newAccessToken = generateAccessToken(user);
      newRefreshToken = generateRefreshToken(user);
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  },

  verify: async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Forbidden" });
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json({ error: "Access token is missing" });
    }
  },
};

const generateAccessToken = (user) => {
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  return accessToken;
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_SECRET
  );
  return refreshToken;
};

module.exports = authController;
