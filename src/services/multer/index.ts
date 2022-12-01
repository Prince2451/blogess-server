import multer from "multer";
import path from "path";
import slugify from "slugify";
import { imageMimeTypes } from "../../utils/mimeTypes";

const diskStorage = multer.diskStorage({
  destination: path.join(__dirname, "assets", "images"),
  filename(_, file, callback) {
    const fieldName = slugify(file.fieldname);
    const uniqueSuffix = `${fieldName}-${Date.now()}-${Math.round(
      Math.random() * 1e2
    )}`;
    callback(null, uniqueSuffix);
  },
});

const imageUpload = multer({
  storage: diskStorage,
  fileFilter(_, file, callback) {
    if (!imageMimeTypes.find((type) => type === file.mimetype)) {
      callback(new Error(`Only ${imageMimeTypes.join()} are accepted`));
    } else {
      callback(null, true);
    }
  },
});

export { imageUpload };
