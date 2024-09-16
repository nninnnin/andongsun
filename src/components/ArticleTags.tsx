import clsx from "clsx";
import { atom, useRecoilState } from "recoil";
import React, { useEffect } from "react";

import { SectionNames } from "@/constants";
import useArticles from "@/hooks/useArticles";

export const selectedTagState = atom<null | string>({
  key: "selectedTagState",
  default: null,
});

const ArticleTags = ({
  sectionName,
  className,
}: {
  sectionName: SectionNames;
  className?: string;
}) => {
  const [selectedTag, setSelectedTag] = useRecoilState(
    selectedTagState
  );

  useEffect(() => {
    return () => setSelectedTag(null);
  }, []);

  const { data: articles } = useArticles(sectionName);

  if (!articles) return <></>;

  const tags = Array.from(
    new Set(
      articles
        .map((article) => article.tags[0])
        .filter((tag) => tag)
    )
  );

  return (
    <ul
      className={clsx(
        "flex space-x-[24px] mt-[0.2em]",
        className
      )}
    >
      <li
        className={clsx(
          "cursor-pointer",
          selectedTag === null && "underline"
        )}
        onClick={() => setSelectedTag(null)}
      >
        All
      </li>

      {tags.map((tag) => {
        const isSelectedTag =
          selectedTag === tag.tagName;

        return (
          <li
            key={tag.uid}
            className={clsx(
              "capitalize cursor-pointer",
              isSelectedTag && "underline"
            )}
            onClick={() => setSelectedTag(tag.tagName)}
          >
            {tag.tagName}
          </li>
        );
      })}
    </ul>
  );
};

export default ArticleTags;
