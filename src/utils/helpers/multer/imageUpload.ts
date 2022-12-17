import multer from "multer";
import path from "path";
import slugify from "slugify";
import { imageMimeTypes } from "../../mimeTypes";
import fileHandler from "./fileHandler";

const diskStorage = multer.diskStorage({
  destination: path.join(process.cwd(), "public", "assets", "images"),
  filename(_, file, callback) {
    const filePath = path.parse(file.originalname);
    const fileName = slugify(filePath.name);
    const uniqueSuffix = `${fileName}-${Date.now()}-${Math.round(
      Math.random() * 1e2
    )}${filePath.ext}`;
    callback(null, uniqueSuffix);
  },
});

const imageUpload = fileHandler(
  multer({
    storage: diskStorage,
    fileFilter(_, file, callback) {
      if (!imageMimeTypes.find((type) => type === file.mimetype)) {
        callback(new Error(`Only ${imageMimeTypes.join()} are accepted`));
      } else {
        callback(null, true);
      }
    },
  })
);

export { imageUpload };
