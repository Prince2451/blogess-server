import { RequestHandler } from "express";
import multer from "multer";
import { promisify } from "util";

function errorHandler(multer: multer.Multer): {
  any: () => RequestHandler;
  single: (fieldName: string) => RequestHandler;
  fields: (fields: readonly multer.Field[]) => RequestHandler;
  array: (fieldName: string, maxCount?: number | undefined) => RequestHandler;
} {
  function withErrorHandling<T extends (...args: any[]) => RequestHandler>(
    fn: T
  ): (...args: Parameters<T>) => RequestHandler {
    return function (...args) {
      return async function (req, res, next) {
        try {
          await promisify(fn.call(multer, ...args))(req, res);
          const fieldName =
            args.length && typeof args[0] === "string" ? args[0] : null;
          if (req.file && fieldName) {
            // populated by single()
            req.body[fieldName] = req.file;
          } else if (req.files && Array.isArray(req.files) && fieldName) {
            // populated by array()
            req.body[fieldName] = req.files;
          }
          next();
        } catch (err) {
          next();
        }
      };
    };
  }
  return {
    any: withErrorHandling(multer.any),
    single: withErrorHandling(multer.single),
    fields: withErrorHandling(multer.fields),
    array: withErrorHandling(multer.array),
  };
}

export default errorHandler;
