"use client";

import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";

import { articleState } from "@/states";
import { useParams } from "next/navigation";
import useArticles from "@/hooks/useArticles";
import Editor from "@/components/admin/Editor";

const EditPage = () => {
  const setArticles = useSetRecoilState(articleState);

  const { articleId } = useParams();

  const { data: articles } = useArticles();

  useEffect(() => {
    if (!articles) return;

    const article = articles.find(
      (article) => article.id === articleId
    );

    if (!article) return;

    setArticles((prev) => ({
      ...prev,
      title: article.title,
      caption: article.caption,
      credits: article.credits,
      contents: article.contents,
      year: article.producedAt.split(".").join("-"),
      articleType: article.articleType,
    }));
  }, [articles]);

  if (!articles) return <></>;

  const article = articles.find(
    (article) => article.id === articleId
  );

  if (!article) return <></>;

  return <Editor />;
};

export default EditPage;
