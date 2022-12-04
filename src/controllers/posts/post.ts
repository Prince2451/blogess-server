import { StatusCodes } from "http-status-codes";
import { Post } from "../../models/posts";
import {
  posts,
  PaginatedResponse,
  PrivateRequestHandler,
  QueryParameters,
  WithDocId,
  PublicRequestHandler,
} from "../../typings";
import { throwError } from "../../utils/helpers/request";

interface GetPostReqQuery extends QueryParameters {
  page: number;
  size: number;
}
type GetPostResBody = PaginatedResponse<
  WithDocId<Omit<posts.Post, "user" | "isDeleted" | "_id">>
>;

const getPost: PrivateRequestHandler<
  {},
  GetPostResBody,
  undefined,
  GetPostReqQuery
> = async (req, res) => {
  req.query.page = req.query.page ?? 1;
  req.query.size = req.query.size ?? 10;
  const query = Post.find({ user: res.locals.user.id, isDeleted: false })
    .sort({ updatedAt: -1 })
    .skip(req.query.size * (req.query.page - 1))
    .limit(req.query.size);

  const data = await query.clone().exec();
  const count = await query.count();

  res.status(StatusCodes.OK).json({
    currentLength: Math.min(req.query.size, data.length),
    currentPage: req.query.page,
    data: data.map((post) => {
      const { _id, ...sendData } = post.toObject({ versionKey: false });
      return { id: _id, ...sendData, categories: post.categories };
    }),
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
interface UpdatePostReqParams extends Record<string, string> {
  id: string;
}

const updatePost: PrivateRequestHandler<
  UpdatePostReqParams,
  UpdatePostResBody,
  UpdatePostReqBody
> = async (req, res) => {
  // setting up type for 'id' existense
  // but it will always exists as it is validated in validator
  if (!req.params.id)
    throwError(StatusCodes.NOT_FOUND, "Post with this id does not exists");
  if (req.body.title) {
    const existingPost = await Post.exists({
      title: req.body.title,
      _id: { $ne: req.params.id },
    });
    if (existingPost)
      throwError(StatusCodes.CONFLICT, "Post with same title already exists");
  }
  const post = await Post.findOneAndUpdate(
    {
      _id: req.params.id,
      user: res.locals.user.id,
    },
    { ...req.body },
    { new: true }
  );
  if (!post)
    throwError(StatusCodes.NOT_FOUND, "Post with this id does not exists");
  const { _id, user, ...sendData } = post.toObject({ versionKey: false });
  res.status(StatusCodes.OK).json({
    id: _id,
    ...sendData,
    categories: post.categories,
  });
};

interface DeletePostReqParams extends Record<string, string> {
  id: string;
}

const deletePost: PrivateRequestHandler<DeletePostReqParams> = async (
  req,
  res
) => {
  const post = await Post.findOneAndUpdate(
    { user: res.locals.user.id, _id: req.params.id, isDeleted: false },
    { isDeleted: true }
  );
  if (!post)
    throwError(StatusCodes.NOT_FOUND, "Post with this id does not exists");

  res.status(StatusCodes.NO_CONTENT).json({
    message: "Post deleted successfully",
  });
};

type GetPostDetailsResBody = WithDocId<
  Omit<posts.Post, "user" | "isDeleted" | "_id">
>;
interface GetPostDetailsReqParams extends Record<string, string> {
  id: string;
}

const getPostDetails: PrivateRequestHandler<
  GetPostDetailsReqParams,
  GetPostDetailsResBody
> = async (req, res) => {
  const post = await Post.findOne({
    _id: req.params.id,
    user: res.locals.user.id,
    isDeleted: false,
  });
  if (!post)
    throwError(StatusCodes.NOT_FOUND, "Post with this id does not exists");

  const { _id, user, ...sendData } = post.toObject({ versionKey: false });
  res.status(StatusCodes.OK).json({
    id: _id,
    ...sendData,
    categories: post.categories,
  });
};

interface GetPublicReqParams extends Record<string, string> {
  slug: string;
}
type GetPublicReqResBody = WithDocId<
  Omit<posts.Post, "user" | "isDeleted" | "_id">
>;

const getPublicPost: PublicRequestHandler<
  GetPublicReqParams,
  GetPublicReqResBody
> = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug, isDeleted: false });
  if (!post) throwError(StatusCodes.NOT_FOUND, "Post doesn't exists");
  const { _id, user, categories, ...sendData } = post.toObject({
    versionKey: false,
  });
  res
    .status(StatusCodes.OK)
    .json({ id: _id, ...sendData, categories: post.categories });
};

export {
  getPost,
  createPost,
  updatePost,
  deletePost,
  getPostDetails,
  getPublicPost,
};
