import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Glide from "@glidejs/glide";

import useArticles from "@/hooks/useArticles";
import useBreakpoint from "@/hooks/useBreakpoint";
import { ArticleInterface } from "@/types/article";
import { removePrefixZero } from "@/utils";
import { useSearchParams } from "next/navigation";
import { SectionColors } from "@/constants";
import { useRecoilValue } from "recoil";
import { selectedSectionNameState } from "@/components/Section";

import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

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

  const glidesRef = useRef<null | Glide[]>(null);

  useEffect(() => {
    if (!selectedArticle) return;

    setTimeout(() => {
      const glideElements =
        document.querySelectorAll(".glide");

      if (!glideElements) return;

      glideElements.forEach((glideElement) => {
        const glide = new Glide(
          glideElement as HTMLElement,
          {
            rewind: false,
          }
        ).mount();

        if (!glidesRef.current) {
          glidesRef.current = [glide];
        } else {
          glidesRef.current.push(glide);
        }
      });
    }, 1000);

    return () => {
      glidesRef.current?.forEach((glide) => {
        glide.destroy();
      });
    };
  }, [selectedArticle]);

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
