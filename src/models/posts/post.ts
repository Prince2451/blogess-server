import { model, Schema, Types } from "mongoose";
import { posts } from "../../typings";
import slugify from "slugify";

const postSchema = new Schema<posts.Post>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: String,
        required: true,
      },
    ],
    slug: { type: String },
    tags: [
      {
        type: String,
        required: true,
      },
    ],
    user: {
      type: Types.ObjectId,
      required: true,
      select: false,
    },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  {
    timestamps: true,
  }
);

postSchema.pre("save", function (next) {
  this.slug = slugify(this.title);
  next();
});

const Post = model("Post", postSchema);

export default Post;
