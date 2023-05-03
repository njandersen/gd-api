const prisma = require("../db/db");

const createPost = async (req, res) => {
  const { title, content, authorId, tagId } = req.body;

  try {
    const tags = tagId.map((tagId) => ({ id: tagId }));
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: false,
        authorId,
        tags: { connect: tags },
      },
      include: {
        tags: true,
      },
    });

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating post" });
  }
};

const getAllPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      tags: true,
      comments: {
        include: {
          author: true,
        },
      },
    },
  });

  res.json(posts);
};

const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        author: true,
        tags: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving post" });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, published, authorId, tags } = req.body;

  try {
    const post = await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        content,
        published,
        authorId,
        tags: {
          set: tags,
        },
      },
      include: {
        tags: true,
      },
    });

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating post" });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting post" });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
