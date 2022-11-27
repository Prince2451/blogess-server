import { StatusCodes } from "http-status-codes";
import { Post } from "../../models/posts";
import {
  posts,
  PaginatedResponse,
  PrivateRequestHandler,
  QueryParameters,
  WithDocId,
} from "../../typings";
import { throwError } from "../../utils/helpers";

interface GetPostReqQuery extends QueryParameters {
  page: number;
  size: number;
}
type GetPostResBody = PaginatedResponse<posts.Post>;

const getPost: PrivateRequestHandler<
  {},
  GetPostResBody,
  undefined,
  GetPostReqQuery
> = async (req, res) => {
  req.query.page = req.query.page ?? 1;
  req.query.size = req.query.size ?? 10;
  const query = Post.find({
    user: res.locals.user.id,
  })
    .sort({ updatedAt: 1 })
    .skip(req.query.size * (req.query.page - 1))
    .limit(req.query.page);

  const data = await query.clone().exec();
  const count = await query.count();

  res.status(StatusCodes.OK).json({
    currentLength: Math.min(req.query.size, data.length),
    currentPage: req.query.page,
    data,
    totalLength: count,
    totalPage: Math.ceil(count / req.query.size),
  });
};

type CreatePostReqBody = Omit<posts.Post, "user" | "slug">;
type CreatePostResBody = WithDocId<Omit<posts.Post, "user">>;

const createPost: PrivateRequestHandler<
  {},
  CreatePostResBody,
  CreatePostReqBody
> = async (req, res) => {
  const doesTitleExists = Boolean(await Post.exists({ title: req.body.title }));
  if (doesTitleExists)
    throwError(StatusCodes.CONFLICT, "Post with same title already exists");
  const newPost = await Post.create({
    ...req.body,
    user: res.locals.user.id,
  });
  const { _id, user, ...sendData } = newPost.toObject({ versionKey: false });

  res.status(StatusCodes.CREATED).json({
    id: _id,
    ...sendData,
    categories: newPost.categories,
  });
};

type UpdatePostReqBody = Partial<Omit<posts.Post, "user" | "slug">>;
type UpdatePostResBody = WithDocId<Omit<posts.Post, "user">>;
interface UpdatePostParams extends Record<string, string> {
  id: string;
}

const updatePost: PrivateRequestHandler<
  UpdatePostParams,
  UpdatePostResBody,
  UpdatePostReqBody
> = async (req, res) => {
  // setting up type for 'id' existense
  // but it will always exists as it is validated in validator
  if (!req.params.id)
    throwError(StatusCodes.NOT_FOUND, "Post with this id does not exists");
  const post = await Post.findOne({
    _id: req.params.id,
    user: res.locals.user.id,
  });
  if (!post)
    throwError(StatusCodes.NOT_FOUND, "Post with this id does not exists");
  if (req.body.title) {
    const existingPost = await Post.exists({
      title: req.body.title,
      _id: { $ne: req.params.id },
    });
    if (existingPost)
      throwError(StatusCodes.CONFLICT, "Post with same title already exists");
    post.title = req.body.title;
  }
  if (req.body.description) post.description = req.body.description;
  if (req.body.content) post.content = req.body.content;
  if (req.body.categories) post.categories = req.body.categories;
  if (req.body.tags) post.tags = req.body.tags;
  if (req.body.coverImage) post.coverImage = req.body.coverImage;
  await post.save();
  const { _id, user, ...sendData } = post.toObject({ versionKey: false });
  res.status(StatusCodes.OK).json({
    id: _id,
    ...sendData,
    categories: post.categories,
  });
};

export { getPost, createPost, updatePost };
