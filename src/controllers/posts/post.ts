import { StatusCodes } from "http-status-codes";
import { Post } from "../../models/posts";
import { posts, PaginatedResponse, PrivateRequestHandler } from "../../typings";

interface GetPostReqQuery {
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
  const query = Post.find({
    user: res.locals.user,
  })
    .sort({ updatedAt: 1 })
    .skip(req.query.size * (req.query.page - 1))
    .limit(req.query.size);

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
