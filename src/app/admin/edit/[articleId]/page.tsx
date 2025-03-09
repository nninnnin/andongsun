"use client";

import React, { useEffect } from "react";
import {
  useRecoilState,
  useResetRecoilState,
} from "recoil";
import { useSWRConfig } from "swr";
import { useParams } from "next/navigation";

import useArticles from "@/hooks/useArticles";
import Editor from "@/components/admin/Editor";
import { ArticleInterface } from "@/types/article";
import { articleState, mediaState } from "@/states";

const EditPage = () => {
  const [article, setArticle] =
    useRecoilState(articleState);
  const resetArticle =
    useResetRecoilState(articleState);
  const resetMediaContents =
    useResetRecoilState(mediaState);

  const { articleId } = useParams();

  const { data: articles } = useArticles();

  const { mutate } = useSWRConfig();

  useEffect(() => {
    (async function () {
      const articlesFromServer = await mutate(
        "articles"
      );

      if (!articlesFromServer) return;

      const articleFromServer =
        articlesFromServer.find(
          (article: ArticleInterface) =>
            article.id === articleId
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
          hidden,
          removed,
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
          tag: tags[0]?.tagName ?? "",
          published: !hidden,
          removed,
        };
      });
    })();
  }, []);

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
