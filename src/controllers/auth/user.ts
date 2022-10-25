import { PublicRequestHandler } from "../../typings";

interface LoginReqBody {
  email: string;
  password: string;
}
interface LoginResBody {
  refreshToken: string;
  token: string;
}

const login: PublicRequestHandler<{}, LoginResBody, LoginReqBody> = (
  req,
  res,
  next
) => {};

export { login };
