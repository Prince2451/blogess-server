import { pbkdf2, randomBytes } from "crypto";
import { Model, model, Schema } from "mongoose";
import { auth } from "../../typings";

interface UserStatics {
  hashPassword: (password: string) => Promise<string>;
  verifyPassword: (password: string, hasedPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<
  auth.User,
  Model<auth.User>,
  {},
  {},
  {},
  UserStatics
>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin"],
    required: true,
  },
});

userSchema.statics.hashPassword = async function (password) {
  const salt = randomBytes(16).toString("hex");
  return await new Promise((resolve, reject) => {
    pbkdf2(password, salt, 1000, 64, "sha512", (err, hash) => {
      if (err) reject(err);
      else {
        resolve(hash.toString("hex") + "." + salt);
      }
    });
  });
};

userSchema.statics.verifyPassword = async function (password, hasedPassword) {
  const [storedHash, salt] = hasedPassword.split(".");
  return await new Promise((resolve, reject) => {
    pbkdf2(password, salt, 1000, 64, "sha512", (err, hash) => {
      if (err) reject(err);
      else {
        resolve(storedHash === hash.toString("hex"));
      }
    });
  });
};

const User = model("User", userSchema);

export default User;
