"use client";

import React, { useEffect } from "react";
import {
  useRecoilState,
  useResetRecoilState,
} from "recoil";

import { articleState, mediaState } from "@/states";
import { useParams } from "next/navigation";
import useArticles from "@/hooks/useArticles";
import Editor from "@/components/admin/Editor";

const EditPage = () => {
  const [article, setArticle] =
    useRecoilState(articleState);
  const resetArticle =
    useResetRecoilState(articleState);
  const resetMediaContents =
    useResetRecoilState(mediaState);

  const { articleId } = useParams();

  const { data: articles } = useArticles();

  useEffect(() => {
    if (article.title && article.contents) return;

    if (!articles) return;

    const articleFromServer = articles.find(
      (article) => article.id === articleId
    );

    if (!articleFromServer) return;

    setArticle((prev) => {
      const {
        title,
        caption,
        credits,
        contents,
        producedAt,
        articleType,
        thumbnailPath,
        thumbnailName,
        tags,
      } = articleFromServer;

      return {
        ...prev,
        title,
        caption,
        credits,
        contents,
        year: producedAt.split(".").join("-"),
        articleType,
        thumbnailPath,
        thumbnailName,
        tag: tags[0].tagName,
      };
    });
  }, [articles]);

  useEffect(() => {
    return () => {
      resetArticle();
      resetMediaContents();
    };
  }, []);

  if (!articles) return <></>;

  const articleFromServer = articles.find(
    (article) => article.id === articleId
  );

  if (!articleFromServer) return <></>;

  return <Editor />;
};

export default EditPage;
