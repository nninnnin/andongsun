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
    <ul className={clsx("flex flex-wrap gap-[24px]")}>
      {articles?.map((article: ArticleInterface) => {
        return (
          <li
            key={article.id}
            className={clsx(
              "bg-slate-200 min-w-[160px]",
              "text-[20px]",
              "cursor-pointer",
              "flex flex-col bg-blue-300",
              "space-y-[6px]"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedArticle(article.id);
            }}
          >
            <div
              className={clsx(
                "min-h-[160px] max-h-[240px]",
                "flex items-center justify-center",
                "bg-green-200",
                "w-full"
              )}
            >
              {article.caption}
            </div>

            <div
              className={clsx(
                "w-full h-[20px]",
                "bg-red-300 text-[12px] font-bold",
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
