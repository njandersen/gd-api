const express = require("express");
const app = express();
const port = 3000;

const postsRouter = require("./src/routes/postRoutes");
const usersRouter = require("./src/routes/userRoutes");
const commentsRouter = require("./src/routes/commentRoutes");
const tagRouter = require("./src/routes/tagRoutes");

// add middleware to parse JSON request bodies
app.use(express.json());

// define routes
app.use("/guardian-dispatch", postsRouter);
app.use("/guardian-dispatch", usersRouter);
app.use("/guardian-dispatch", commentsRouter);
app.use("/guardian-dispatch", tagRouter);

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
