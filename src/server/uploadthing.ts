import { UTApi } from "uploadthing/server";

export const utapi = new UTApi({
  fetch: globalThis.fetch, // subset of standard fetch required for uploadthing
  apiKey: process.env.UPLOADTHING_SECRET,
});