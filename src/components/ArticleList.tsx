import clsx from "clsx";
import React, { useEffect } from "react";
import {
  atom,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { motion, useAnimation } from "framer-motion";

import { ArticleInterface } from "@/types/article";
import { SectionNames } from "@/constants";
import useArticles from "@/hooks/useArticles";
import useBreakpoint from "@/hooks/useBreakpoint";
import { selectedTagState } from "@/components/ArticleTags";
import { filterArticleList } from "@/utils/filters";
import { orderBy } from "lodash";

const ArticleList = ({
  sectionName,
  className,
}: {
  sectionName: SectionNames;
  className?: string;
}) => {
  const { data: articles } = useArticles();

  const selectedTag = useRecoilValue(selectedTagState);

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
    >
      {sortedArticles.map(
        (article: ArticleInterface) => {
          return (
            <li
              key={article.id}
              className={clsx(
                isMobile
                  ? "w-full"
                  : "w-[calc(calc(100%-min(96px,3vw))/3)]",
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

                params.set("articleId", article.id);

                window.history.pushState(
                  {},
                  "",
                  `${
                    window.location.pathname
                  }?${params.toString()}`
                );
              }}
            >
              {article.thumbnailPath ? (
                <img
                  className="object-cover"
                  src={article.thumbnailPath}
                  alt={`${article.title}-thumbnail`}
                />
              ) : (
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
              )}

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

              {isMobile && (
                <div className="text-small font-medium leading-[166%] mt-[6px] text-center">
                  {article.producedAt.split(".")[0]}
                </div>
              )}
            </li>
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

export default ArticleList;
