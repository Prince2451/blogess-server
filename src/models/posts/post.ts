import { model, Schema, Types } from "mongoose";
import { posts } from "../../typings";

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
    tags: [
      {
        type: String,
        required: true,
      },
    ],
    user: {
      type: Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

export default Post;
