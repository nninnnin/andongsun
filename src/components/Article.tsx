import {
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import clsx from "clsx";
import React from "react";
import { motion } from "framer-motion";

import { SectionColors } from "@/constants";
import useArticles from "@/hooks/useArticles";
import { selectedArticleState } from "@/states";
import useBreakpoint from "@/hooks/useBreakpoint";
import { ArticleInterface } from "@/types/article";
import { selectedSectionNameState } from "@/components/Section";
import { removePrefixZero } from "@/utils";

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
          "h-full flex flex-col px-[68px] relative",
          isMobile && "!px-[0px] h-[calc(100%-40px)]"
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
              __html: credits,
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
          <span className="text-large">List</span>
        </div>
      </motion.div>

      {isMobile && (
        <div
          className={clsx(
            "w-[calc(100%)] h-[40px]",
            "flex justify-start items-center",
            "absolute bottom-[0px] left-[0px]",
            `bg-${SectionColors[selectedSection!]}`
          )}
          onClick={() => resetSelectedArticle()}
        >
          <img
            className="rotate-[270deg] h-[20px] mx-[6.5px]"
            src="/arrow--top.svg"
          />{" "}
          <span className="text-large">List</span>
        </div>
      )}
    </>
  );
};

export default Article;
