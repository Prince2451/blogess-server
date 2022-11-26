import {
  auth,
  PrivateRequestHandler,
  PublicRequestHandler,
} from "../../typings";
import { StatusCodes } from "http-status-codes";
import { RefreshToken, User } from "../../models/auth";
import { throwError } from "../../utils/helpers";
import { Types } from "mongoose";

interface LoginReqBody {
  email: string;
  password: string;
}
interface LoginResBody {
  refreshToken: string;
  token: string;
}
const login: PublicRequestHandler<{}, LoginResBody, LoginReqBody> = async (
  req,
  res
) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    throwError(StatusCodes.NOT_FOUND, "User with email does not exists");
  const isPassCorrect = await User.verifyPassword(
    req.body.password,
    user.password
  );
  if (!isPassCorrect)
    throwError(StatusCodes.UNAUTHORIZED, "Password does not match");
  const refreshToken = new RefreshToken({
    token: RefreshToken.createToken(),
    user,
  });
  const token = await User.createAccessToken(user._id, user.email);
  await refreshToken.save();

  res.status(StatusCodes.OK).json({
    refreshToken: refreshToken.token,
    token,
  });
};

interface RegisterReqBody {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}
interface RegisterResBody
  extends Omit<auth.User, "password" | "_id" | "createdAt" | "updatedAt"> {
  id: Types.ObjectId;
}
const register: PublicRequestHandler<
  {},
  RegisterResBody,
  RegisterReqBody
> = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) throwError(StatusCodes.CONFLICT, "User already exists");
  const hasedPassword = await User.hashPassword(req.body.password);
  const user = await User.create({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hasedPassword,
    role: "admin",
  });

  return res.status(StatusCodes.CREATED).json({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    id: user._id,
    role: user.role,
  });
};

interface TokenReqBody {
  refreshToken: string;
}
interface TokenResBody {
  token: string;
}

const token: PublicRequestHandler<{}, TokenResBody, TokenReqBody> = async (
  req,
  res
) => {
  const refreshToken = await RefreshToken.findOne({
    token: req.body.refreshToken,
  });
  const isTokenValid = refreshToken && RefreshToken.verifyToken(refreshToken);
  if (!isTokenValid) {
    if (refreshToken) {
      // refresh token exists but is expired
      // removing extra token
      await refreshToken.remove();
    }
    throwError(StatusCodes.UNAUTHORIZED, "Invalid Token");
  }
  const user = await User.findById(refreshToken.user);
  if (!user) throwError(StatusCodes.BAD_REQUEST, "User not available");
  const token = await User.createAccessToken(user._id, user.email);

  return res.status(StatusCodes.OK).json({ token });
};

interface GetUserResBody extends Omit<auth.User, "password"> {
  id: Types.ObjectId;
}
const getUser: PrivateRequestHandler<{}, GetUserResBody> = async (req, res) => {
  const user = await User.findById(res.locals.user.id);
  if (!user) throwError(StatusCodes.BAD_REQUEST, "User Doesn't exists");
  const { _id, password, ...sendData } = user.toObject({ versionKey: false });

  res.status(StatusCodes.OK).json({
    id: user._id,
    ...sendData,
  });
};

export { login, register, token, getUser };
