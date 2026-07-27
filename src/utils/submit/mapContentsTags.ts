import { pipe } from "@rebel9/memex-fetcher";

import { mapImageTags } from "@/utils/submit/mapImageTags";
import { MediaFile } from "@/types";

export const mapContentsTags = (
  contents: string,
  mediaFiles: Array<MediaFile>,
) => {
  return pipe(contents, mapImageTags(mediaFiles));
};
