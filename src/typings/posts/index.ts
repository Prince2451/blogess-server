import { DocRef, MongooseTimestamp } from "../utils";

export interface Post extends MongooseTimestamp {
  title: string;
  description: string;
  content: string;
  categories: [string];
  tags: string[];
  coverImage: string;
  user: DocRef<Post>;
}
