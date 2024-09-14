import {
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import React from "react";

import useArticles from "@/hooks/useArticles";
import { selectedArticleState } from "@/states";
import { ArticleInterface } from "@/types/article";
import { selectedSectionNameState } from "@/components/Section";
import clsx from "clsx";
import useBreakpoint from "@/hooks/useBreakpoint";
import { SectionColors } from "@/constants";

const Article = () => {
  const { isMobile } = useBreakpoint();

  const selectedSection = useRecoilValue(
    selectedSectionNameState
  );

  const selectedArticle = useRecoilValue(
    selectedArticleState
  );

  const resetSelectedArticle = useResetRecoilState(
    selectedArticleState
  );

  const { data: articles, isLoading } = useArticles(
    selectedSection!
  );

  if (!articles || isLoading) return <></>;

  const article = articles.find(
    (article: ArticleInterface) =>
      article.id === selectedArticle
  );

  if (!article) return <></>;

  const {
    title,
    caption,
    contents,
    credits,
    producedAt,
    tags,
    thumbnailPath,
  } = article;

  return (
    <>
      <div
        className={clsx(
          "h-full flex flex-col px-[68px] relative",
          isMobile &&
            "px-0 h-[calc(100%-40px)] mb-[40px]"
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <header className="space-y-[16px] pb-[40px] text-center">
          {thumbnailPath && (
            <img
              className="h-[340px] object-cover mx-auto mb-[36px]"
              src={thumbnailPath}
            />
          )}

          <p className="text-[20px] leading-[150%]">
            {title}
          </p>

          <p className="font-semibold">{producedAt}</p>

          <p>{credits}</p>

          <p
            dangerouslySetInnerHTML={{
              __html: contents,
            }}
          ></p>
        </header>

        <div
          className={clsx(
            "mt-auto cursor-pointer sticky bottom-0 w-fit translate-x-[-130%]",
            "flex justify-start items-center",
            isMobile && "hidden"
          )}
          onClick={() => resetSelectedArticle()}
        >
          <img
            className="rotate-[270deg] mr-[0.5em] h-[0.8em]"
            src="/arrow--top.svg"
          />{" "}
          List
        </div>
      </div>

      {isMobile && (
        <div
          className={clsx(
            "w-[calc(100%-48px)] h-[40px]",
            "flex justify-start items-center",
            "absolute bottom-[0px]",
            `bg-${SectionColors[selectedSection!]}`
          )}
          onClick={() => resetSelectedArticle()}
        >
          <img
            className="rotate-[270deg] mr-[0.5em] h-[0.8em]"
            src="/arrow--top.svg"
          />{" "}
          List
        </div>
      )}
    </>
  );
};

export default Article;
