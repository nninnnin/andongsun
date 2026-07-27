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
    contents: string,
  ) => {
    const imageTagStrings = matchImageTags(contents);

    if (!imageTagStrings) return contents;

    return pipe(
      imageTagStrings,
      resolveImages(mediaFiles, contents),
    );
  },
);

const resolveImages = curry(
  async (
    mediaFiles: {
      name: string;
      file: File;
    }[],
    contents: string,
    imageTagStrings: RegExpMatchArray,
  ) => {
    const resolvedImageTags = await tagStringsToPaths(
      mediaFiles,
      imageTagStrings,
    );

    const newContent = replaceImageTags(
      contents,
      resolvedImageTags,
    );

    return newContent;
  },
);
