import { curry } from "@fxts/core";

import { convertStringToDOM } from "@/utils";
import {
  replaceImageTags,
  uploadPendingMedia,
  getPendingMedia,
} from "@/utils/submit";
import { MediaFile, UploadedMedia } from "@/types";

export const resolveImages = curry(
  async (
    mediaFiles: Array<MediaFile>,
    contents: string,
  ) => {
    const referencedMediaFiles =
      getReferencedMediaFiles(mediaFiles, contents); // contents에서 사용되는 mediaFile만 필터링

    const { registered, pending } =
      await getPendingMedia(referencedMediaFiles);

    const uploaded = await uploadPendingMedia(pending);

    const uploadedFileMap = new Map<
      string,
      UploadedMedia
    >([...registered, ...uploaded]);

    return replaceImageTags(contents, uploadedFileMap);
  },
);

// referenced: 본문(contents)에 실제로 삽입되어 사용 중인 이미지
const getReferencedMediaFiles = (
  mediaFiles: Array<MediaFile>,
  contents: string,
) => {
  const referencedHashes =
    getReferencedPendingHashes(contents);

  return mediaFiles.filter((media) =>
    referencedHashes.has(media.hash),
  );
};

const getReferencedPendingHashes = (
  contents: string,
) => {
  const hashes = new Set<string>();

  const imageTags =
    contents.match(
      /<img\s+[^>]*src="([^"]+)"[^>]*>/g,
    ) ?? [];

  imageTags.forEach((imageTag) => {
    const dom = convertStringToDOM(imageTag);
    const src = dom?.getAttribute("src") ?? "";
    const hash = dom?.getAttribute("data-hash");

    if (src.startsWith("data:") && hash) {
      hashes.add(hash);
    }
  });

  return hashes;
};
