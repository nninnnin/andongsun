import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import useArticles from "@/hooks/useArticles";
import useBreakpoint from "@/hooks/useBreakpoint";
import { ArticleInterface } from "@/types/article";
import { removePrefixZero } from "@/utils";
import { useSearchParams } from "next/navigation";
import { SectionColors } from "@/constants";
import { useRecoilValue } from "recoil";
import { selectedSectionNameState } from "@/components/Section";

import { debounce } from "lodash";
import Script from "next/script";

const Article = ({ key }: { key: string }) => {
  const selectedSection = useRecoilValue(
    selectedSectionNameState
  );

  const { isMobile } = useBreakpoint();

  const searchParams = useSearchParams();

  const selectedArticle =
    searchParams.get("articleId");

  const { data: articles, isLoading } = useArticles();

  const previousArticle =
    useRef<ArticleInterface | null>(null);

  const memoizedArticle = React.useMemo(() => {
    if (!articles || isLoading) return null;

    const article = articles.find(
      (article: ArticleInterface) =>
        article.id === selectedArticle
    );

    if (article) {
      previousArticle.current = article;

      return article;
    }

    return previousArticle.current;
  }, [articles]);

  const swiperRef = useRef([] as any[]);

  useEffect(() => {
    if (!selectedArticle) return;

    const initSwipers = () => {
      console.log("initialize swipers");

      setTimeout(() => {
        const swipers =
          document.querySelectorAll(".swiper");

        if (!swipers) return;

        swipers.forEach((swiper) => {
          // @ts-ignore
          const sw = new Swiper(swiper, {});

          sw.update();

          swiperRef.current.push(sw);
        });
      }, 500);
    };

    initSwipers();
  }, [selectedArticle]);

  useEffect(() => {
    const handler = debounce(() => {
      swiperRef.current.forEach((sw) => {
        console.log(sw, "will be updated!");

        sw.update();
      });
    }, 300);

    window.addEventListener("resize", handler);
  }, []);

  if (!articles || isLoading) return <></>;

  const {
    title,
    contents,
    credits,
    producedAt,
    thumbnailPath,
  } = memoizedArticle ?? {
    title: "",
    contents: "",
    credits: "",
    producedAt: "",
    thumbnailPath: "",
  };

  return (
    <motion.div
      key={key} // This should be exist to be able to exit animate
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      exit={isMobile ? undefined : { opacity: 0 }}
      className={clsx(
        "absolute top-0 left-0",
        "pt-[133.5px]",
        isMobile && "pt-[100px]",
        "w-full h-full flex flex-col px-[92px]",
        isMobile && "!px-[1.5em] h-[calc(100%-40px)]",
        "overflow-y-scroll",
        `bg-${SectionColors[selectedSection!]}`
      )}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Script
        strategy="afterInteractive"
        src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
        onLoad={() =>
          console.log("Swiper script is imported")
        }
      ></Script>

      <header className="space-y-[16px] pb-[90px] text-center">
        {thumbnailPath && (
          <img
            className="object-cover mx-auto mb-[36px] max-h-[75dvh]"
            src={thumbnailPath}
            alt={`${title}-thumbnail`}
            onLoad={() => {
              const section =
                document.querySelector(".section");

              section?.scrollTo(0, 0);
            }}
          />
        )}

        <p className="text-large leading-[150%] font-bold">
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
  );
};

export default Article;
