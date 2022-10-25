import { RequestHandler } from "express";
import { throwError } from "../../utils/helpers";

const login: RequestHandler = (req, res, next) => {
  console.log("hello");
  throwError(400, "world");
};

export { login };
