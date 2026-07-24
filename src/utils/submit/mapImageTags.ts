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
    imageTagStrings: RegExpMatchArray
  ) => {
    // 원본 태그 배열과 정확히 같은 길이/순서로 정렬된 상태를 유지해야
    // replaceImageTags가 각 태그를 올바른 자리에 치환할 수 있다.
    // (여기서 실패한 항목을 걸러내 압축하면 안 됨 - 자세한 이유는
    // replaceImageTags 주석 참고)
    const resolvedImageTags = await tagStringsToPaths(
      mediaFiles,
      imageTagStrings
    );

    const newContent = replaceImageTags(
      contents,
      resolvedImageTags
    );

    return newContent;
  }
);
