import clsx from "clsx";
import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import { useSearchParams } from "next/navigation";

import useArticles from "@/hooks/useArticles";
import useBreakpoint from "@/hooks/useBreakpoint";
import { ArticleInterface } from "@/types/article";
import { removePrefixZero } from "@/utils";
import { SectionColors } from "@/constants";
import { selectedSectionNameState } from "@/components/Section";

import Script from "next/script";

const Article = () => {
  const selectedSection = useRecoilValue(
    selectedSectionNameState
  );

  const { isMobile } = useBreakpoint();

  const searchParams = useSearchParams();

  const selectedArticleId =
    searchParams.get("articleId");

  const { data: articles } = useArticles();

  const swiperRef = useRef([] as any[]);

  useEffect(() => {
    const article = articles?.find(
      (article: ArticleInterface) =>
        (article.id ?? article.uid) ===
        selectedArticleId
    );

    if (!article) return;
    if (!articles) return;

    const initSwipers = () => {
      const swipers =
        document.querySelectorAll(".swiper");

      if (!swipers) return;

      swipers.forEach((swiper, swiperIndex) => {
        const currentNextButton =
          document.querySelectorAll(
            ".swiper-button-next"
          )[swiperIndex];

        const currentPrevButton =
          document.querySelectorAll(
            ".swiper-button-prev"
          )[swiperIndex];

        // @ts-ignore
        const sw = new Swiper(swiper, {
          navigation: {
            nextEl: currentNextButton,
            prevEl: currentPrevButton,
          },
        });

        sw.update();

        const images = swiper.querySelectorAll("img");

        if (images) {
          images.forEach((image) => {
            if (image.complete) {
              image.classList.add("show-image");
            } else {
              image.onload = () =>
                image.classList.add("show-image");
            }
          });
        }

        swiperRef.current.push(sw);
      });
    };

    setTimeout(initSwipers, 700);

    return () => {
      swiperRef.current = [];
    };
  }, [articles]);

  if (!articles) return <></>;

  const article = articles?.find(
    (article: ArticleInterface) =>
      (article.id ?? article.uid) === selectedArticleId
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
    <motion.div
      key={`article-details-${article.uid}`}
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
          <Article.Thumbnail
            src={thumbnailPath}
            alt={`${title}-thumbnail`}
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

        <Article.Contents contents={contents} />
      </header>
    </motion.div>
  );
};

Article.Contents = ({
  contents,
}: {
  contents: string;
}) => {
  const [containerRef, setContainerRef] =
    useState<null | HTMLDivElement>(null);

  useEffect(() => {
    const images =
      containerRef?.querySelectorAll("img");

    images?.forEach((image) => {
      if (image.complete) {
      } else {
        image.onload = () =>
          image.classList.add("show-image");
      }
    });
  }, [containerRef, contents]);

  return (
    <p
      className={clsx(
        "leading-[180%] text-left break-keep",
        "border-t-[1px] border-black pt-[36px] !mt-[36px]",
        "text-medium",
        "article-contents"
      )}
      dangerouslySetInnerHTML={{
        __html: contents,
      }}
      ref={(ref) => setContainerRef(ref)}
    ></p>
  );
};

Article.Thumbnail = ({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full max-h-[75dvh] relative">
      <img
        className={clsx(
          "w-full h-fit max-h-[55dvh]",
          "object-contain",
          "mx-auto mb-[36px]",
          "transition-opacity duration-[730ms]",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        src={src}
        alt={alt}
        onLoad={() => {
          const section =
            document.querySelector(".section");

          section?.scrollTo(0, 0);

          setIsLoading(false);
        }}
      />

      {isLoading && (
        <div
          className={clsx(
            "w-full h-full",
            "absolute top-0 left-0",
            "bg-[#f1f1f1]"
          )}
        ></div>
      )}
    </div>
  );
};

export default Article;
