import { atom, useSetRecoilState } from "recoil";
import clsx from "clsx";
import { MouseEvent } from "react";
import { AnimatePresence } from "framer-motion";

import ArticleTags, {
  selectedTagState,
} from "@/components/ArticleTags";
import ArticleList from "@/components/ArticleList";
import Article from "@/components/Article";
import { SectionNames } from "@/constants";
import useBreakpoint from "@/hooks/useBreakpoint";
import { useSearchParams } from "next/navigation";

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
        "flex-1",
        "transition-[min-width min-height width height] duration-700",
        "p-[24px] py-[18px]",
        isMobile && "pb-0 px-[1.5em]",
        "flex flex-col",
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
    <h1
      className={clsx(
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
  );
};

Section.Contents = ({
  sectionName,
}: {
  sectionName: SectionNames;
}) => {
  const searchParams = useSearchParams();

  const selectedArticle =
    searchParams.get("articleId");

  const { isMobile } = useBreakpoint();

  const animateFadeIn = clsx("opacity-0", "fade-in");

  return (
    <div
      className={clsx(
        "section-contents",
        "pointer-events-none",
        animateFadeIn,
        "flex-1 overflow-y-scroll",
        isMobile && "!mb-[40px]"
      )}
    >
      <ArticleTags
        className="mb-[60px]"
        sectionName={sectionName}
      />

      <AnimatePresence>
        {selectedArticle ? (
          <Article />
        ) : (
          <ArticleList sectionName={sectionName} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Section;
