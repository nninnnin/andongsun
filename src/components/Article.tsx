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

import Script from "next/script";

const Article = ({ key }: { key: string }) => {
  const selectedSection = useRecoilValue(
    selectedSectionNameState
  );

  const { isMobile } = useBreakpoint();

  const searchParams = useSearchParams();

  const selectedArticle =
    searchParams.get("articleId");

  const { data: articles } = useArticles();

  const swiperRef = useRef([] as any[]);

  useEffect(() => {
    const article = articles?.find(
      (article: ArticleInterface) =>
        article.id === selectedArticle
    );

    console.log("article changed", article);

    if (!article) return;
    if (!articles) return;

    const initSwipers = () => {
      setTimeout(() => {
        console.log("initialize swipers");

        const swipers =
          document.querySelectorAll(".swiper");

        console.log(swipers);

        if (!swipers) return;

        swipers.forEach((swiper) => {
          // @ts-ignore
          console.log("Has Swiper?", Swiper);

          // @ts-ignore
          const sw = new Swiper(swiper, {});

          sw.update();

          swiperRef.current.push(sw);
        });
      }, 500);
    };

    initSwipers();

    return () => {
      swiperRef.current = [];
    };
  }, [articles]);

  useEffect(() => {
    console.log("isMobile changed");
  }, [isMobile]);

  useEffect(() => {
    console.log("selectedSection changed");
  }, [selectedSection]);

  useEffect(() => {
    console.log("articles changed");
  }, [articles]);

  if (!articles) return <></>;

  const article = articles?.find(
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

  console.log("리렌더링");

  return (
    <motion.div
      key={key}
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
        onLoad={() => {
          console.log("Swiper script is imported");
        }}
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
