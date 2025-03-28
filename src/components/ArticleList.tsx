import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  AnimatePresence,
  motion,
  useAnimation,
} from "framer-motion";

import { ArticleInterface } from "@/types/article";
import { SectionNames } from "@/constants";
import useArticles from "@/hooks/useArticles";
import useBreakpoint from "@/hooks/useBreakpoint";
import { selectedTagState } from "@/components/ArticleTags";
import { filterArticleList } from "@/utils/filters";
import { orderBy } from "lodash";
import useResetScroll from "@/hooks/useResetScroll";

const ArticleList = ({
  sectionName,
  className,
}: {
  sectionName: SectionNames;
  className?: string;
}) => {
  const { data: articles } = useArticles();

  const selectedTag = useRecoilValue(selectedTagState);

  const { containerRef } =
    useResetScroll<HTMLUListElement>([selectedTag]);

  const { isMobile } = useBreakpoint();

  const controls = useAnimation();

  useEffect(() => {
    controls.set({ opacity: 0 });

    controls.start({
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
      },
    });
  }, [controls, selectedTag]);

  if (!articles) {
    return <></>;
    ``;
  }

  const filteredArticles = filterArticleList(
    articles,
    sectionName,
    selectedTag
  );

  const sortedArticles = orderBy(
    filteredArticles,
    ["producedAt", "updatedAt"],
    ["desc", "desc"]
  );

  return (
    <motion.ul
      animate={controls}
      className={clsx(
        "w-full flex flex-wrap justify-between pb-[24px] px-[44px]",
        "absolute top-0 left-0",
        "pt-[133.5px]",
        isMobile && "pt-[100px]",
        "h-full overflow-y-scroll",
        className
      )}
      ref={containerRef}
    >
      {sortedArticles.map(
        (article: ArticleInterface) => {
          const articleId = article.id ?? article.uid;

          return (
            <ArticleList.Item
              key={`article-list-item-${articleId}`}
              article={article}
            />
          );
        }
      )}

      {filteredArticles.length % 3 === 2 && (
        <li
          className={clsx(
            isMobile
              ? "w-full"
              : "w-[calc(calc(100%-min(96px,3vw))/3)]",
            "text-large",
            "cursor-default",
            "flex flex-col",
            "space-y-[6px]",
            "mb-[24px]"
          )}
        ></li>
      )}
    </motion.ul>
  );
};

ArticleList.Item = ({
  article,
}: {
  article: ArticleInterface;
}) => {
  const [isThumbnailLoaded, setIsThumbnailLoaded] =
    useState(false);

  const { isMobile } = useBreakpoint();

  const hasArticleThumbnail = !!article.thumbnailPath;

  return (
    <li
      className={clsx(
        isMobile
          ? "w-full"
          : "w-[calc(calc(100%-min(96px,3vw))/3)]",
        "h-fit min-h-[300px]",
        "text-large",
        "cursor-pointer",
        "flex flex-col",
        "space-y-[6px]",
        "mb-[120px]",
        isMobile && "mb-[60px]"
      )}
      onClick={(e) => {
        e.stopPropagation();

        const params = new URLSearchParams();

        params.set(
          "articleId",
          article.id ?? article.uid ?? ""
        );

        window.history.pushState(
          {},
          "",
          `${
            window.location.pathname
          }?${params.toString()}`
        );
      }}
    >
      {hasArticleThumbnail ? (
        <Thumbnail
          article={article}
          isThumbnailLoaded={isThumbnailLoaded}
          onThumbnailLoaded={() =>
            setIsThumbnailLoaded(true)
          }
        />
      ) : (
        <Caption article={article} />
      )}

      <Title article={article} />

      {isMobile && (
        <div className="text-small font-medium leading-[166%] mt-[6px] text-center">
          {article.producedAt.split(".")[0]}
        </div>
      )}
    </li>
  );
};

const Title = ({
  article,
}: {
  article: ArticleInterface;
}) => {
  return (
    <div
      className={clsx(
        "w-full h-[20px]",
        "text-small font-bold",
        "flex justify-center items-center",
        "!mt-[12px]"
      )}
    >
      {article.title}
    </div>
  );
};

const Caption = ({
  article,
}: {
  article: ArticleInterface;
}) => {
  return (
    <div
      className={clsx(
        "w-full",
        "border-t-[1px] border-black",
        "text-large leading-[150%] pt-[10px]",
        "line-clamp-[8]",
        "break-keep"
      )}
    >
      {article.caption}
    </div>
  );
};

const Thumbnail = ({
  article,
  isThumbnailLoaded,
  onThumbnailLoaded,
}: {
  article: ArticleInterface;
  isThumbnailLoaded: boolean;
  onThumbnailLoaded: () => void;
}) => {
  return (
    <div className={clsx("w-full h-full", "relative")}>
      <img
        className={clsx(
          "w-full h-auto",
          "object-cover"
        )}
        src={article.thumbnailPath}
        alt={`${article.title}-thumbnail`}
        onLoad={onThumbnailLoaded}
      />

      <AnimatePresence>
        {!isThumbnailLoaded && (
          <motion.div
            className={clsx(
              "bg-[#f1f1f1]",
              "w-full h-full",
              "absolute top-0 left-0"
            )}
            exit={{
              opacity: 0,
            }}
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArticleList;
