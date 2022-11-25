import { StatusCodes } from "http-status-codes";
import { Post } from "../../models/posts";
import {
  posts,
  PaginatedResponse,
  PrivateRequestHandler,
  QueryParameters,
} from "../../typings";

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
    user: res.locals.user,
  })
    .sort({ updatedAt: 1 })
    .skip(req.query.size * (req.query.page - 1))
    .limit(req.query.page);

  const data = await query.exec();
  const count = await query.count();

  res.status(StatusCodes.OK).json({
    currentLength: req.query.size,
    currentPage: req.query.page,
    data,
    totalLength: count,
    totalPage: Math.ceil(count / req.query.size),
  });
};

export { getPost };
