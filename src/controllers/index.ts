import authValidators from "./auth/validators";
import postsValidators from "./posts/validators";
export * as auth from "./auth";
export * as posts from "./posts";

const validators = { auth: authValidators, posts: postsValidators };

export { validators };
