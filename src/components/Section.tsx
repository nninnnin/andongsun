import {
  atom,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import clsx from "clsx";
import {
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { useSearchParams } from "next/navigation";

import ArticleTags, {
  selectedTagState,
} from "@/components/ArticleTags";
import ArticleList from "@/components/ArticleList";
import Article from "@/components/Article";
import { SectionNames } from "@/constants";
import useBreakpoint from "@/hooks/useBreakpoint";

export const selectedSectionNameState =
  atom<null | SectionNames>({
    key: "selectedSectionNameState",
    default: null,
  });

const Section = ({}: {}) => {
  return <></>;
};

Section.Container = ({
  children,
  className,
  handleClick,
}: {
  children: React.ReactNode;
  className?: string;
  handleClick?: (e: MouseEvent) => void;
}) => {
  const { isMobile } = useBreakpoint();

  return (
    <section
      className={clsx(
        "section",
        "flex-1",
        "transition-[min-width min-height width height] duration-700",
        "p-[24px] py-[18px]",
        "flex flex-col",
        isMobile && "pb-0 px-[1.5em]",
        className
      )}
      onClick={handleClick}
    >
      {children}
    </section>
  );
};

Section.Header = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const setSelectedTag = useSetRecoilState(
    selectedTagState
  );

  const resetArticleId = () => {
    window.history.pushState(
      null,
      "",
      window.location.pathname
    );
  };

  return (
    <div
      className={clsx(
        "flex flex-col",
        "sticky top-0 z-[9999]"
      )}
    >
      <h1
        className={clsx(
          "relative z-[9999]",
          "text-[1em] cursor-pointer",
          className
        )}
        onClick={() => {
          resetArticleId();
          setSelectedTag(null);
        }}
      >
        {children}
      </h1>
    </div>
  );
};

Section.Contents = ({
  sectionName,
}: {
  sectionName: SectionNames;
}) => {
  const searchParams = useSearchParams();
  const articleId = searchParams.get("articleId");

  const selectedSection = useRecoilValue(
    selectedSectionNameState
  );

  const [articleSelected, setArticleSelected] =
    useState<string | null>(null);

  useEffect(() => {
    setArticleSelected(articleId);
  }, [articleId]);

  const { isMobile } = useBreakpoint();

  const animateFadeIn = clsx("opacity-0", "fade-in");

  return (
    <div
      className={clsx(
        !isMobile && "section-contents",
        "h-full",
        "pointer-events-none",
        animateFadeIn,
        "flex-1 overflow-y-scroll",
        isMobile && "!mb-[40px]",
        "transition-opacity duration-500"
      )}
    >
      {selectedSection !== SectionNames.About && (
        <ArticleTags
          className={clsx(
            "mb-[60px]",
            isMobile &&
              "!mb-[50px] !fixed !left-0 !w-screen overflow-x-scroll hide-scrollbar"
          )}
          sectionName={sectionName}
        />
      )}

      <AnimatePresence>
        <ArticleList sectionName={sectionName} />

        {articleSelected && <Article />}
      </AnimatePresence>
    </div>
  );
};

export default Section;
