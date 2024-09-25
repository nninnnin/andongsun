import {
  convertStringToDOM,
  convertDOMToString,
} from "@/utils";
import {
  postImage,
  readImage,
  registerImage,
} from "@/utils/memex";
import { ArticleStateInterface } from "@/types/article";
import sanitize from "sanitize-filename";

export const tagStringsToPaths = async (
  tagStrings: Array<string>,
  mediaContents: Array<{
    name: string;
    file: File;
  }>
) => {
  return await Promise.all(
    tagStrings.map(async (tagString: string) => {
      const dom = convertStringToDOM(tagString);

      const imageName = dom?.alt || "";

      if (!imageName) {
        console.log("이미지 네임이 없다");

        return false;
      }

      const hasImageAlready = await readImage(
        imageName
      );

      if (hasImageAlready) {
        return {
          name: imageName,
          path: hasImageAlready.data.path,
          width: dom?.getAttribute("width"),
          style: dom?.getAttribute("style"),
          align: dom?.getAttribute("align"),
        };
      }

      const media = mediaContents.find(
        (media) => media.name === imageName
      );

      if (!media) {
        console.log(
          "미디어에 찾는 이미지가 없다",
          mediaContents,
          imageName
        );

        return false;
      }

      const registeredPath = await registerImage(
        media.file
      );

      await postImage(imageName, registeredPath);

      return {
        name: imageName,
        path: registeredPath,
        width: dom?.getAttribute("width"),
        style: dom?.getAttribute("style"),
        align: dom?.getAttribute("align"),
      };
    })
  );
};

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

export const replaceImageTags = (
  imagePaths: Array<Record<string, string>>,
  newContents: string
) =>
  newContents.replace(
    /<img\s+[^>]*src="([^"]+)"[^>]*>/g,
    () => {
      const imagePath = imagePaths.shift();

      if (!imagePath) {
        return "<img src='nothing' />";
      }

      const { path, name, width, style, align } =
        imagePath;

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
  );

export const processFilename = (filename: string) => {
  return sanitize(filename).trim();
};
