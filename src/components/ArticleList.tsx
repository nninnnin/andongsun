import clsx from "clsx";
import React from "react";
import {
  useRecoilValue,
  useSetRecoilState,
} from "recoil";

import { ArticleInterface } from "@/types/article";
import { SectionNames } from "@/constants";
import useArticles from "@/hooks/useArticles";
import { selectedArticleState } from "@/states";
import useBreakpoint from "@/hooks/useBreakpoint";
import { selectedTagState } from "@/components/ArticleTags";

const ArticleList = ({
  sectionName,
}: {
  sectionName: SectionNames;
}) => {
  const { data: articles } = useArticles(sectionName);

  const setSelectedArticle = useSetRecoilState(
    selectedArticleState
  );

  const selectedTag = useRecoilValue(selectedTagState);

  const { isMobile } = useBreakpoint();

  if (!articles) {
    return <></>;
    ``;
  }

  const filteredArticles = articles
    // 1. '숨김' 상태인 게시물은 제외
    .filter((article) => {
      return !article.hidden;
    })
    // 2. 선택된 태그에 해당하는 게시물만 필터링
    .filter((article) => {
      if (selectedTag === null) return true;

      if (!article.tags || !article.tags[0])
        return false;

      return article.tags[0].tagName === selectedTag;
    });

  return (
    <ul
      className={clsx(
        "w-full flex flex-wrap gap-[24px] pb-[24px]"
      )}
    >
      {filteredArticles.map(
        (article: ArticleInterface) => {
          return (
            <li
              key={article.id}
              className={clsx(
                isMobile ? "w-full" : "w-[200px]",
                "text-[20px]",
                "cursor-pointer",
                "flex flex-col",
                "space-y-[6px]"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedArticle(article.id);
              }}
            >
              {article.thumbnailPath ? (
                <img
                  className="min-h-[160px] max-h-[240px] object-cover"
                  src={article.thumbnailPath}
                />
              ) : (
                <div
                  className={clsx(
                    "max-h-[240px]",
                    "w-full",
                    "border-t-[1px] border-black",
                    "text-[20px] leading-[150%] pt-[8px]"
                  )}
                >
                  {article.caption}
                </div>
              )}

              <div
                className={clsx(
                  "w-full h-[20px]",
                  "text-[12px] font-bold",
                  "flex justify-center items-center",
                  isMobile && "!mt-[24px]"
                )}
              >
                {article.title}
              </div>

              {isMobile && (
                <div className="text-[9px] font-medium leading-[166%] mt-[6px] text-center">
                  {article.producedAt.split(".")[0]}
                </div>
              )}
            </li>
          );
        }
      )}
    </ul>
  );
};

export default ArticleList;
