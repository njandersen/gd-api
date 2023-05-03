const prisma = require("../db/db");

const commentsController = {
  getAllComments: async (req, res) => {
    try {
      const comments = await prisma.comment.findMany();
      res.json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getCommentById: async (req, res) => {
    const { id } = req.params;
    try {
      const comment = await prisma.comment.findUnique({
        where: { id: Number(id) },
      });
      if (!comment)
        return res.status(404).json({ message: "Comment not found" });
      res.json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  createComment: async (req, res) => {
    const { content, postId, authorId } = req.body;
    try {
      const comment = await prisma.comment.create({
        data: { content, postId, authorId },
      });
      res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateComment: async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
      let comment = await prisma.comment.findUnique({
        where: { id: Number(id) },
      });
      if (!comment)
        return res.status(404).json({ message: "Comment not found" });
      comment = await prisma.comment.update({
        where: { id: Number(id) },
        data: { content },
      });
      res.json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteComment: async (req, res) => {
    const { id } = req.params;
    try {
      const comment = await prisma.comment.findUnique({
        where: { id: Number(id) },
      });
      if (!comment)
        return res.status(404).json({ message: "Comment not found" });
      await prisma.comment.delete({ where: { id: Number(id) } });
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = commentsController;
