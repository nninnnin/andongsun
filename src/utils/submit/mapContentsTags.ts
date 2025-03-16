import { pipe } from "@rebel9/memex-fetcher";

import { mapImageTags } from "@/utils/submit/mapImageTags";

export const mapContentsTags = (
  contents: string,
  mediaFiles: {
    name: string;
    file: File;
  }[]
) => {
  return pipe(contents, mapImageTags(mediaFiles));
};
