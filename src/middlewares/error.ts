import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import { HTTPError } from "../utils/helpers/request";

const errorMiddleware: ErrorRequestHandler = (error, _, res, next) => {
  if (error instanceof HTTPError) {
    return res.status(error.status).json({
      message: error.message,
      error: error.error,
    });
  } else if (error instanceof multer.MulterError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
      param: error.field,
    });
  }
  next(error);
};

export default errorMiddleware;
