import { ErrorRequestHandler } from "express";

const errorMiddleware: ErrorRequestHandler = (error, _, res, __) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  res.status(status).json({
    status,
    message,
  });
};

export default errorMiddleware;
