const mimeTypes = {
  png: "image/png",
  gif: "image/gif",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  webp: "image/webp",
  mp4: "video/mp4",
  zip: "application/zip",
  csv: "text/csv",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  exe: "application/vnd.microsoft.portable-executable",
} as const;

const imageMimeTypes = [
  mimeTypes.png,
  mimeTypes.gif,
  mimeTypes.jpeg,
  mimeTypes.svg,
  mimeTypes.webp,
] as const;

const pdfMimeType = [mimeTypes.pdf] as const;
const msWordMimeType = [mimeTypes.doc, mimeTypes.docx] as const;
const msExcelMimeType = [mimeTypes.xls, mimeTypes.xlsx] as const;
const msPowerpointMimeType = [mimeTypes.ppt, mimeTypes.pptx] as const;
const exeMimeType = [mimeTypes.exe] as const;

export {
  exeMimeType,
  imageMimeTypes,
  mimeTypes,
  msExcelMimeType,
  msPowerpointMimeType,
  msWordMimeType,
  pdfMimeType,
};
