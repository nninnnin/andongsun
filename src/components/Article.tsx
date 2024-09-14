import {
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import React from "react";

import useArticles from "@/hooks/useArticles";
import { selectedArticleState } from "@/states";
import { ArticleInterface } from "@/types/article";
import { selectedSectionNameState } from "@/components/Section";

const Article = () => {
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
    <div
      className="h-full flex flex-col px-[68px] relative"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <header className="space-y-[16px] pb-[40px] text-center">
        <img
          className="h-[340px] object-cover mx-auto mb-[36px]"
          src={thumbnailPath}
        />

        <p className="text-[20px] leading-[150%]">
          {title}
        </p>

        <p className="font-semibold">{producedAt}</p>

        <p>{credits}</p>
      </header>

      <p
        dangerouslySetInnerHTML={{
          __html: contents,
        }}
      ></p>

      <div
        className="mt-auto cursor-pointer sticky bottom-0 w-fit translate-x-[-130%]"
        onClick={() => resetSelectedArticle()}
      >
        &lt; List
      </div>
    </div>
  );
};

export default Article;
