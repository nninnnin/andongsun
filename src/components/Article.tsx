import { useRecoilValue } from "recoil";
import clsx from "clsx";
import React from "react";
import { motion } from "framer-motion";

import { SectionColors } from "@/constants";
import useArticles from "@/hooks/useArticles";
import useBreakpoint from "@/hooks/useBreakpoint";
import { ArticleInterface } from "@/types/article";
import { selectedSectionNameState } from "@/components/Section";
import { removePrefixZero } from "@/utils";
import { useSearchParams } from "next/navigation";

const Article = () => {
  const { isMobile } = useBreakpoint();

  const selectedSection = useRecoilValue(
    selectedSectionNameState
  );

  const searchParams = useSearchParams();

  const selectedArticle =
    searchParams.get("articleId");

  const resetSelectedArticle = () => {
    window.history.pushState(
      null,
      "",
      window.location.pathname
    );
  };

  const { data: articles, isLoading } = useArticles();

  if (!articles || isLoading) return <></>;

  const article = articles.find(
    (article: ArticleInterface) =>
      article.id === selectedArticle
  );

  if (!article) return <></>;

  const {
    title,
    contents,
    credits,
    producedAt,
    thumbnailPath,
  } = article;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        exit={{ opacity: 0 }}
        className={clsx(
          "absolute top-0 left-0",
          "mt-[133.5px]",
          isMobile && "mt-[100px]",
          "h-full flex flex-col px-[92px]",
          isMobile && "!px-[1.5em] h-[calc(100%-40px)]"
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <header className="space-y-[16px] pb-[40px] text-center">
          {thumbnailPath && (
            <img
              className="object-cover mx-auto mb-[36px]"
              src={thumbnailPath}
            />
          )}

          <p className="text-large leading-[150%]">
            {title}
          </p>

          <p className="font-semibold text-small">
            {removePrefixZero(producedAt)}
          </p>

          <p
            className="text-small"
            dangerouslySetInnerHTML={{
              __html: credits.replaceAll("\n", "<br>"),
            }}
          ></p>

          <p
            className={clsx(
              "leading-[180%] text-left break-keep",
              "border-t-[1px] border-black pt-[36px] !mt-[36px]",
              "text-medium"
            )}
            dangerouslySetInnerHTML={{
              __html: contents,
            }}
          ></p>
        </header>
      </motion.div>
    </>
  );
};

export default Article;
