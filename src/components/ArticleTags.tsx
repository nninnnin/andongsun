import clsx from "clsx";
import {
  atom,
  useRecoilState,
  useSetRecoilState,
} from "recoil";
import React, { useEffect } from "react";

import { SectionNames } from "@/constants";
import useArticles from "@/hooks/useArticles";
import { filterArticleList } from "@/utils/filters";

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

  const { data: articles } = useArticles();

  if (!articles) return <></>;

  const filteredArticles = filterArticleList(
    articles,
    sectionName,
    null
  );

  const tags = filteredArticles
    .map((article) => article.tags[0])
    .filter((tag) => tag)
    .reduce((acc, cur) => {
      if (acc.find((tag) => tag.uid === cur.uid))
        return acc;

      return [...acc, cur];
    }, [] as { tagName: string; uid: string }[]);

  const resetSelectedArticle = () => {
    window.history.pushState(
      null,
      "",
      window.location.pathname
    );
  };

  return (
    <ul
      className={clsx(
        "sticky top-0 z-[9999]",
        "flex space-x-[24px] pt-[0.2em]",
        "text-large",
        className
      )}
    >
      {tags && !!tags.length && (
        <li
          className={clsx(
            "cursor-pointer",
            selectedTag === null &&
              "border-t-[1px] border-black"
          )}
          onClick={() => {
            setSelectedTag(null);
            resetSelectedArticle();
          }}
        >
          All
        </li>
      )}

      {tags.map((tag) => {
        const isSelectedTag =
          selectedTag === tag.tagName;

        return (
          <li
            key={tag.uid}
            className={clsx(
              "capitalize cursor-pointer",
              isSelectedTag &&
                "border-t-[1px] border-black"
            )}
            onClick={() => {
              setSelectedTag(tag.tagName);
              resetSelectedArticle();
            }}
          >
            {tag.tagName}
          </li>
        );
      })}
    </ul>
  );
};

export default ArticleTags;
