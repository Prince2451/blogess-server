import { Router } from "express";
import { posts, validators } from "../../controllers";
import helpers from "../../utils/helpers";

const privateRoutes = Router();

privateRoutes.get(
  "/",
  validators.posts.getPost(),
  helpers.request.createRequestHandler(posts.getPost)
);
privateRoutes.post(
  "/",
  validators.posts.createPost(),
  helpers.request.createRequestHandler(posts.createPost)
);
privateRoutes.get(
  "/:id",
  validators.posts.getPostDetails(),
  helpers.request.createRequestHandler(posts.getPostDetails)
);
privateRoutes.put(
  "/:id",
  validators.posts.updatePost(),
  helpers.request.createRequestHandler(posts.updatePost)
);
privateRoutes.delete(
  "/:id",
  validators.posts.deletePost(),
  helpers.request.createRequestHandler(posts.deletePost)
);
privateRoutes.post(
  "/cover-image",
  helpers.multer.imageUpload.single("image"),
  validators.posts.uploadCoverImage(),
  helpers.request.createRequestHandler(posts.uploadCoverImage)
);

export { privateRoutes };
