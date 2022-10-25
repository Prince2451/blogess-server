import { ErrorRequestHandler } from "express";
import { HTTPError } from "../utils/helpers";

const errorMiddleware: ErrorRequestHandler = (error, _, res, next) => {
  if (error instanceof HTTPError) {
    return res.status(error.status).json({
      message: error.message,
      error: error.error,
    });
  }
  next(error);
};

export default errorMiddleware;
