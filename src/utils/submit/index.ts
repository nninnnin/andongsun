import { curry } from "@fxts/core";
import sanitize from "sanitize-filename";

import {
  convertDOMToString,
  convertStringToDOM,
} from "@/utils";
import {
  postImage,
  readImage,
  registerImage,
} from "@/utils/memex";
import { ArticleStateInterface } from "@/types/article";
import { MediaFile, UploadedMedia } from "@/types";

const toUploadedMedia = (
  media: MediaFile,
  path: string,
): UploadedMedia => ({
  path,
  originalName: media.originalName,
});

// mediaFiles를 해시로 조회해, 이미 서버에 등록된 것(registered)과
// 실제로 업로드가 필요한 것(pending)으로 나눈다.
export const filterUnregisteredMedia = async (
  mediaFiles: Array<MediaFile>,
) => {
  const registered = new Map<string, UploadedMedia>();
  const pending: Array<MediaFile> = [];

  await Promise.all(
    mediaFiles.map(async (media) => {
      const imageReaded = await readImage(media.hash);
      const hasRegistered = imageReaded?.data;

      if (hasRegistered) {
        registered.set(
          media.hash,
          toUploadedMedia(
            media,
            imageReaded.data.path as string,
          ),
        );
      } else {
        pending.push(media);
      }
    }),
  );

  return { registered, pending };
};

// 이미 서버에 없는 것으로 확인된 mediaFiles만 실제로 업로드한다.
export const uploadPendingMedia = async (
  mediaFiles: Array<MediaFile>,
) => {
  const entries = await Promise.all(
    mediaFiles.map(async (media) => {
      const registeredPath = await registerImage(
        media.file,
      );

      await postImage(
        media.hash,
        registeredPath,
        media.originalName,
      );

      return [
        media.hash,
        toUploadedMedia(media, registeredPath),
      ] as const;
    }),
  );

  return new Map<string, UploadedMedia>(entries);
};

export const isThumbnailChanged = () => {};

export const getThumbnailPath = async (
  article: ArticleStateInterface,
) => {
  const isThumbnailChanged = Boolean(
    article.thumbnail,
  );

  return isThumbnailChanged
    ? await getRegisteredThumbnailPath(article)
    : article.thumbnailPath;
};

export const getRegisteredThumbnailPath = async (
  article: ArticleStateInterface,
) => {
  const hash = await hashFile(article.thumbnail!);
  const registeredImage = await readImage(hash);

  return registeredImage?.data
    ? registeredImage.data.path
    : await registerAndPostImage(article, hash);
};

export const registerAndPostImage = async (
  article: ArticleStateInterface,
  hash: string,
) => {
  const registeredPath = await registerImage(
    article.thumbnail!,
  );

  await postImage(
    hash,
    registeredPath,
    processFilename(article.thumbnail!.name),
  );

  return registeredPath;
};

// 기존 태그의 표시 속성(width/style/align)은 유지한 채, src/alt만
// 업로드 결과로 갈아끼운 새 <img> 태그 문자열을 만든다.
const buildResolvedImageTag = (
  dom: HTMLImageElement | null,
  uploaded: UploadedMedia,
) => {
  const width = dom?.getAttribute("width") ?? "";
  const style = dom?.getAttribute("style") ?? "";
  const align = dom?.getAttribute("align") ?? "";

  const newImage = new Image();
  newImage.src = uploaded.path;
  newImage.alt = uploaded.originalName;
  newImage.setAttribute("style", style ?? "");
  newImage.setAttribute("align", align ?? "");

  if (width) {
    newImage.width = parseInt(width);
  }

  return convertDOMToString(newImage);
};

export const replaceImageTags = curry(
  (
    newContents: string,
    uploadedByHash: Map<string, UploadedMedia>,
  ) => {
    const resolveImageTag = (
      originalImageTag: string,
    ) => {
      const dom = convertStringToDOM(originalImageTag);
      const src = dom?.getAttribute("src") ?? "";
      const isPendingUpload =
        src.startsWith("data:");

      const hash = dom?.alt || "";
      const uploaded = isPendingUpload
        ? uploadedByHash.get(hash)
        : undefined;

      if (uploaded) {
        return buildResolvedImageTag(dom, uploaded);
      }

      return originalImageTag;
    };

    return newContents.replace(
      /<img\s+[^>]*src="([^"]+)"[^>]*>/g,
      resolveImageTag,
    );
  },
);

export const processFilename = (filename: string) => {
  return sanitize(filename).trim();
};

// 파일명만으로는 "같은 이미지"를 보장할 수 없어(다른 사진인데 이름만 같은 경우),
// 이미지의 진짜 정체성으로 쓰기 위한 내용 기반 해시.
export const hashFile = async (
  file: File,
): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    buffer,
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};
