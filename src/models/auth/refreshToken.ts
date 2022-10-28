import { randomUUID } from "crypto";
import { Model, model, Schema } from "mongoose";
import { auth } from "../../typings";
import { REFRESH_TOKEN_EXPIRY_TIME } from "../../utils/constants";

interface RefreshTokenStatics {
  verifyToken: (token: auth.RefreshToken) => boolean;
  createToken: () => string;
}

const refreshTokenSchema = new Schema<
  auth.RefreshToken,
  Model<auth.RefreshToken>,
  {},
  {},
  {},
  RefreshTokenStatics
>(
  {
    expiresAt: {
      type: Date,
    },
    token: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

refreshTokenSchema.pre("save", function (next) {
  this.expiresAt = new Date(
    this.createdAt.valueOf() + REFRESH_TOKEN_EXPIRY_TIME
  );
  next();
});

refreshTokenSchema.statics.verifyToken = function (token) {
  return Date.now() < token.expiresAt.valueOf();
};

refreshTokenSchema.statics.createToken = function () {
  return randomUUID();
};

const RefreshToken = model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
