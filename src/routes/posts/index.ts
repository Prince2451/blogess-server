import { Router } from "express";
import { posts, validators } from "../../controllers";
import { createRequestHandler } from "../../utils/helpers";

const privateRoutes = Router();

privateRoutes.get(
  "/",
  validators.posts.getPost(),
  createRequestHandler(posts.getPost)
);
privateRoutes.post(
  "/",
  validators.posts.createPost(),
  createRequestHandler(posts.createPost)
);

export { privateRoutes };
