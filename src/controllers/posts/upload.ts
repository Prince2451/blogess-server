import { PrivateRequestHandler } from "../../typings";
import sharp from "sharp";
import { StatusCodes } from "http-status-codes";
import { throwError } from "../../utils/helpers/request";

interface UploadCoverImageReqBody {
  image: string;
}
interface UploadCoverImageResBody {
  url: string;
  base64Url: string;
}

const uploadCoverImage: PrivateRequestHandler<
  {},
  UploadCoverImageResBody,
  UploadCoverImageReqBody
> = async (req, res) => {
  if (!req.file) throwError(StatusCodes.BAD_REQUEST, "'image' is not a file");
  if (!req.file.url)
    throwError(StatusCodes.INTERNAL_SERVER_ERROR, "Cannot create file URL");
  const imageBuffer = await sharp(req.file.path).resize(16).blur(1).toBuffer();
  const base64Url = `data:${req.file.mimetype};base64,${String(
    imageBuffer.toString("base64")
  )}`;
  res.status(StatusCodes.CREATED).json({
    url: req.file.url,
    base64Url,
  });
};

export { uploadCoverImage };
