import { curry } from "@fxts/core";
import sanitize from "sanitize-filename";

import {
  convertStringToDOM,
  convertDOMToString,
} from "@/utils";
import {
  postImage,
  readImage,
  readImagesByName,
  registerImage,
} from "@/utils/memex";
import { ArticleStateInterface } from "@/types/article";

// 본문에서 정규식으로 뽑아낸 <img ...> 태그 하나를 통째로 담은 HTML 문자열.
// (예: `<img src="..." alt="사진1.jpg" width="300">`)
type ImageTagHtml = `<img${string}`;

// 이미지 태그 하나를 서버에 등록/조회해서 얻은, 본문에 다시 그려넣을 때 필요한 정보.
// 경로(path)뿐 아니라 표시용 속성(width/style/align)까지 담고 있어 "이미지 패스"라고 부르면 부정확하다.
export interface ResolvedImageTag {
  name: string;
  path: string;
  width: string;
  style: string;
  align: string;
}

export const tagStringsToPaths = curry(
  async (
    unregisteredMediaFiles: Array<{
      name: string;
      file: File;
    }>,
    imageTags: Array<string>
  ) => {
    return await Promise.all(
      imageTags.map(async (rawImageTag: string) => {
        const imageTag = rawImageTag as ImageTagHtml;
        const dom = convertStringToDOM(imageTag);

        const imageName = dom?.alt || "";

        if (!imageName) {
          console.log("이미지 네임이 없다");

          return false;
        }

        const width = dom?.getAttribute("width") ?? "";
        const style = dom?.getAttribute("style") ?? "";
        const align = dom?.getAttribute("align") ?? "";

        // 이번 세션에서 실제로 새로 선택한 파일이 있는 경우:
        // 이름만 보고 재사용하지 않고, 파일 내용 해시로 "진짜 같은 이미지인지"까지 확인한다.
        const media = unregisteredMediaFiles.find(
          (media) => media.name === imageName
        );

        if (media) {
          const hash = await hashFile(media.file);

          const candidates = await readImagesByName(
            imageName
          );

          const matchedByHash = candidates.find(
            (candidate) =>
              candidate.data.hash === hash
          );

          if (matchedByHash) {
            return {
              name: imageName,
              path: matchedByHash.data.path,
              width,
              style,
              align,
            };
          }

          const registeredPath = await registerImage(
            media.file
          );

          await postImage(
            imageName,
            registeredPath,
            hash
          );

          return {
            name: imageName,
            path: registeredPath,
            width,
            style,
            align,
          };
        }

        // 이번 세션에서 새로 올린 파일이 아니면 (이미 저장돼 있던 기존 이미지),
        // 비교할 파일이 없으니 이름으로 조회한 기존 경로를 그대로 사용한다.
        const registeredImage = await readImage(
          imageName
        );

        if (!registeredImage?.data) {
          console.log(
            "미디어에 찾는 이미지가 없다",
            unregisteredMediaFiles,
            imageName
          );

          return false;
        }

        return {
          name: imageName,
          path: registeredImage.data.path as string,
          width,
          style,
          align,
        };
      })
    );
  }
);

export const isThumbnailChanged = () => {};

export const getThumbnailPath = async (
  article: ArticleStateInterface
) => {
  const isThumbnailChanged = Boolean(
    article.thumbnail
  );

  return isThumbnailChanged
    ? await getRegisteredThumbnailPath(article)
    : article.thumbnailPath;
};

export const getRegisteredThumbnailPath = async (
  article: ArticleStateInterface
) => {
  const thumbnailName = article.thumbnail!.name;
  const hasImageAlready = await readImage(
    thumbnailName
  );

  return hasImageAlready
    ? hasImageAlready.data.path
    : await registerAndPostImage(article);
};

export const registerAndPostImage = async (
  article: ArticleStateInterface
) => {
  const registeredPath = await registerImage(
    article.thumbnail!
  );

  const thumbnailName = article.thumbnail!.name;
  await postImage(thumbnailName, registeredPath);

  return registeredPath;
};

export const replaceImageTags = curry(
  (
    newContents: string,
    // 원본 태그 개수와 정확히 같은 길이로 정렬된 배열이어야 한다.
    // (실패한 항목을 filter로 미리 압축해서 넘기면, 아래에서 순서대로
    // shift()할 때 실패 이후의 모든 이미지가 한 칸씩 밀려서 엉뚱한
    // 이미지로 치환되는 사고가 난다 - 반드시 원본과 1:1 대응 상태로 넘길 것.)
    resolvedImageTags: Array<ResolvedImageTag | false>
  ) =>
    newContents.replace(
      /<img\s+[^>]*src="([^"]+)"[^>]*>/g,
      (originalImageTag) => {
        const resolvedImageTag =
          resolvedImageTags.shift();

        if (!resolvedImageTag) {
          // 해석에 실패했다고 이미지를 지워버리면 안 되니, 원본을 그대로 보존한다.
          return originalImageTag;
        }

        const { path, name, width, style, align } =
          resolvedImageTag;

        const newImage = new Image();
        newImage.src = path;
        newImage.alt = name;
        newImage.setAttribute("style", style ?? "");
        newImage.setAttribute("align", align ?? "");

        if (width) {
          newImage.width = parseInt(width);
        }

        return convertDOMToString(newImage);
      }
    )
);

export const processFilename = (filename: string) => {
  return sanitize(filename).trim();
};

// 파일명만으로는 "같은 이미지"를 보장할 수 없어(다른 사진인데 이름만 같은 경우),
// 이름이 겹칠 때 실제로 같은 파일인지 판별하기 위한 내용 기반 해시.
export const hashFile = async (
  file: File
): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    buffer
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};
