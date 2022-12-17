/// <reference path="multer/index.d.ts" />

namespace Express {
  namespace Multer {
    export interface File {
      /** URL by which file can be accessed */
      url?: string;
    }
  }
}
