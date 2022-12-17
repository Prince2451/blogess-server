import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import { URL } from "url";
import { promisify } from "util";
import { STATIC_FILES_BASE_PATH, STATIC_FILES_ROUTE } from "../../constants";

function fileHandler(multer: multer.Multer): {
  any: () => RequestHandler;
  single: (fieldName: string) => RequestHandler;
  fields: (fields: readonly multer.Field[]) => RequestHandler;
  array: (fieldName: string, maxCount?: number | undefined) => RequestHandler;
} {
  function withFileHandler<T extends (...args: any[]) => RequestHandler>(
    fn: T
  ): (...args: Parameters<T>) => RequestHandler {
    return function (...args) {
      return async function (req, res, next) {
        try {
          await promisify(fn.call(multer, ...args))(req, res);
          const fieldName =
            args.length && typeof args[0] === "string" ? args[0] : null;
          if (req.file && fieldName) {
            const url = new URL(
              path.join(
                STATIC_FILES_ROUTE,
                path.relative(path.join(STATIC_FILES_BASE_PATH), req.file.path)
              ),
              process.env.SERVER_NAME
            );
            req.file.url = url.toString();
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
    any: withFileHandler(multer.any),
    single: withFileHandler(multer.single),
    fields: withFileHandler(multer.fields),
    array: withFileHandler(multer.array),
  };
}

export default fileHandler;
