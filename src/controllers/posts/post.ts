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

type CreatePostReqBody = Omit<posts.Post, "user">;
type CreatePostResBody = WithDocId<Omit<posts.Post, "user">>;

const createPost: PrivateRequestHandler<
  {},
  CreatePostResBody,
  CreatePostReqBody
> = async (req, res) => {
  const doesTitleExists = Boolean(
    await Post.findOne({ title: req.body.title }).count()
  );
  if (doesTitleExists)
    throwError(StatusCodes.CONFLICT, "Post with same title already exists");
  const newPost = await Post.create({
    ...req.body,
    user: res.locals.user,
  });
  const { _id, user, ...sendData } = newPost.toObject();
  res.status(StatusCodes.CREATED).json({
    ...sendData,
    id: _id,
    categories: newPost.categories,
  });
};

export { getPost, createPost };
