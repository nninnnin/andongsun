import clsx from "clsx";
import React, { useEffect } from "react";
import {
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { motion, useAnimation } from "framer-motion";

import { ArticleInterface } from "@/types/article";
import { SectionNames } from "@/constants";
import useArticles from "@/hooks/useArticles";
import { selectedArticleState } from "@/states";
import useBreakpoint from "@/hooks/useBreakpoint";
import { selectedTagState } from "@/components/ArticleTags";

const ArticleList = ({
  sectionName,
}: {
  sectionName: SectionNames;
}) => {
  const { data: articles } = useArticles(sectionName);

  const setSelectedArticle = useSetRecoilState(
    selectedArticleState
  );

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

  const filteredArticles = articles
    // 1. '삭제' 상태인 게시물은 제외
    .filter((article) => {
      return !article.removed;
    })
    // 1. '숨김' 상태인 게시물은 제외
    .filter((article) => {
      return !article.hidden;
    })
    // 2. 선택된 태그에 해당하는 게시물만 필터링
    .filter((article) => {
      if (selectedTag === null) return true;

      if (!article.tags || !article.tags[0])
        return false;

      return article.tags[0].tagName === selectedTag;
    });

  return (
    <motion.ul
      animate={controls}
      className={clsx(
        "w-full flex justify-between flex-wrap pb-[24px] px-[min(24px,3/4vw)]"
      )}
    >
      {filteredArticles.map(
        (article: ArticleInterface) => {
          return (
            <li
              key={article.id}
              className={clsx(
                isMobile
                  ? "w-full"
                  : "w-[calc(calc(100%-min(96px,3vw))/3)]",
                "text-[20px]",
                "cursor-pointer",
                "flex flex-col",
                "space-y-[6px]",
                "mb-[24px]"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedArticle(article.id);
              }}
            >
              {article.thumbnailPath ? (
                <img
                  className="min-h-[160px] max-h-[240px] object-cover"
                  src={article.thumbnailPath}
                />
              ) : (
                <div
                  className={clsx(
                    "w-full",
                    "border-t-[1px] border-black",
                    "text-[20px] leading-[150%] pt-[8px]",
                    "line-clamp-[8]"
                  )}
                >
                  {article.caption}
                </div>
              )}

              <div
                className={clsx(
                  "w-full h-[20px]",
                  "text-[12px] font-bold",
                  "flex justify-center items-center",
                  isMobile && "!mt-[24px]"
                )}
              >
                {article.title}
              </div>

              {isMobile && (
                <div className="text-[9px] font-medium leading-[166%] mt-[6px] text-center">
                  {article.producedAt.split(".")[0]}
                </div>
              )}
            </li>
          );
        }
      )}
    </motion.ul>
  );
};

export default ArticleList;
