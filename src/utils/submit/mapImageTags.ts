import { pipe } from "@rebel9/memex-fetcher";
import { curry } from "@fxts/core";

import {
  replaceImageTags,
  tagStringsToPaths,
} from "@/utils/submit";
import { matchImageTags } from "@/utils/matcher";

export const mapImageTags = curry(
  (
    mediaFiles: {
      name: string;
      file: File;
    }[],
    contents: string
  ) => {
    const imageTagStrings = matchImageTags(contents);

    if (!imageTagStrings) return contents;

    return pipe(
      imageTagStrings,
      mapImageTagToPath(mediaFiles, contents)
    );
  }
);

const mapImageTagToPath = curry(
  async (
    mediaFiles: {
      name: string;
      file: File;
    }[],
    contents: string,
    imageString: RegExpMatchArray
  ) => {
    const imagePaths = await tagStringsToPaths(
      mediaFiles,
      imageString
    );

    const filtered = imagePaths.filter(
      (imagePath) => imagePath
    );

    const newContent = replaceImageTags(
      contents,
      filtered as Record<string, string>[]
    );

    return newContent;
  }
);
