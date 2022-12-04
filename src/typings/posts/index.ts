import { DocRef, MongooseTimestamp, SoftDeletableDoc } from "../utils";

export interface Post extends MongooseTimestamp, SoftDeletableDoc {
  title: string;
  description: string;
  content: string;
  categories: [string];
  tags: string[];
  coverImage: {
    url: string;
    base64url: string;
  };
  slug: string;
  user: DocRef<Post>;
}
