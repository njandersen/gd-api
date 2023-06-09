const prisma = require("../db/db");

const createPost = async (req, res) => {
  const { title, content, username, tagId } = req.body;

  try {
    // Check if user with given authorId exists
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      return res.status(404).json({ error: "Author not found" });
    }

    const tags = tagId.map((tagId) => ({ id: tagId }));
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: false,
        authorId: user.id,
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

const getAllPostsByUser = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const userPosts = await prisma.post.findMany({
      where: {
        authorId: Number(user.id),
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

    res.status(200).json(userPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user's posts" });
  }
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
  getAllPostsByUser,
  getPostById,
  updatePost,
  deletePost,
};
