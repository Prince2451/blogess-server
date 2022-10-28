import { auth, PublicRequestHandler, Validator } from "../../typings";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { RefreshToken, User } from "../../models/auth";
import { throwError } from "../../utils/helpers";
import { Secret, sign, SignOptions } from "jsonwebtoken";
import { JWT_EXPIRY } from "../../utils/constants";
import { promisify } from "util";
import { Types } from "mongoose";

const validators: Record<"login" | "register", Validator> = {
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
  const token = await promisify<object, Secret, SignOptions, string>(sign)(
    {
      email: user.email,
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY,
    }
  );
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

export { login, register, validators };
