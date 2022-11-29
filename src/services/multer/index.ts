import multer from "multer";
import path from "path";
import slugify from "slugify";

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

const upload = multer({
  storage: diskStorage,
});

export { upload };
