import { curry } from "@fxts/core";

import {
  filterUnregisteredMedia,
  replaceImageTags,
  uploadPendingMedia,
} from "@/utils/submit";
import { MediaFile, UploadedMedia } from "@/types";

export const resolveImages = curry(
  async (
    mediaFiles: Array<MediaFile>,
    contents: string,
  ) => {
    const { registered, pending } =
      await filterUnregisteredMedia(mediaFiles);

    const uploaded = await uploadPendingMedia(pending);

    const uploadedByHash = new Map<
      string,
      UploadedMedia
    >([...registered, ...uploaded]);

    return replaceImageTags(contents, uploadedByHash);
  },
);
