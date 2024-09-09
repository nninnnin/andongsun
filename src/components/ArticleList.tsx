import clsx from "clsx";
import React from "react";
import { useSetRecoilState } from "recoil";

import { ArticleInterface } from "@/types/article";
import { SectionNames } from "@/constants";
import useArticles from "@/hooks/useArticles";
import { selectedArticleState } from "@/states";

const ArticleList = ({
  sectionName,
}: {
  sectionName: SectionNames;
}) => {
  const {
    data: articles,
    error,
    isLoading,
  } = useArticles(sectionName);

  const setSelectedArticle = useSetRecoilState(
    selectedArticleState
  );

  if (!articles) {
    return <></>;
    ``;
  }

  return (
    <ul
      className={clsx(
        "w-full flex flex-wrap gap-[24px]"
      )}
    >
      {articles?.map((article: ArticleInterface) => {
        return (
          <li
            key={article.id}
            className={clsx(
              "w-[200px]",
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
                  "flex items-center justify-center",
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
                "flex justify-center items-center"
              )}
            >
              {article.title}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ArticleList;
