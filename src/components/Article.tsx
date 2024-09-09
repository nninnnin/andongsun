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
  } = article;

  return (
    <div
      className="bg-blue-300 h-full flex flex-col"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <p>{title}</p>

      <p
        dangerouslySetInnerHTML={{
          __html: contents,
        }}
      ></p>

      <div
        className="mt-auto bg-red-300 cursor-pointer"
        onClick={() => resetSelectedArticle()}
      >
        Back to List
      </div>
    </div>
  );
};

export default Article;
