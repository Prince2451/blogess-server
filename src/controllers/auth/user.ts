import { RequestHandler } from "express";

const login: RequestHandler = (req, res, next) => {
  console.log("hello");
  throw new Error("world");
};

export { login };
