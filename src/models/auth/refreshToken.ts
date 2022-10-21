import { Model, model, Schema } from "mongoose";
import { auth } from "../../typings";
import { REFRESH_TOKEN_EXPIRY_TIME } from "../../utils/constants";

interface RefreshTokenStatics {
  verifyToken: (token: string) => boolean;
}

const refreshTokenSchema = new Schema<
  auth.RefreshToken,
  Model<auth.RefreshToken>,
  {},
  {},
  {},
  RefreshTokenStatics
>({
  expiresAt: {
    type: Date,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

refreshTokenSchema.pre("save", function (next) {
  this.expiresAt = new Date(
    this.createdOn.valueOf() + REFRESH_TOKEN_EXPIRY_TIME
  );
  next();
});

refreshTokenSchema.statics.verifyToken = () => false;

const RefreshToken = model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
