import { auth, PublicRequestHandler, Validator } from "../../typings";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { RefreshToken, User } from "../../models/auth";
import { throwError } from "../../utils/helpers";
import { Types } from "mongoose";

const validators: Record<"login" | "register" | "token", Validator> = {
  login: () => [
    body("email", "Valid email address is required").isEmail(),
    body("password", "Password is required").notEmpty().isString(),
  ],
  register: () => [
    body("email", "Valid email address is required").isEmail(),
    body("firstName", "valid first name is required")
      .isString()
      .trim()
      .notEmpty(),
    body("lastName", "Valid last name is required").optional().isString(),
    body(
      "password",
      "Password must contain atleast 1 lowercase, 1 uppercase, 1 special character and of minimun 6 characters long"
    ).isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    }),
  ],
  token: () => [
    body("refreshToken", "Valid refreshToken is required").exists().isString(),
  ],
};

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
  phoneNumber: string;
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
    throwError(StatusCodes.BAD_REQUEST, "Invalid Token");
  }
  const user = await User.findById(refreshToken.user);
  if (!user) throwError(StatusCodes.BAD_REQUEST, "User not available");
  const token = await User.createAccessToken(user._id, user.email);

  return res.status(StatusCodes.OK).json({ token });
};

export { login, register, token, validators };
