import { MouseEvent } from "react";
import clsx from "clsx";
import { atom, useRecoilValue } from "recoil";
import { selectedArticleState } from "@/states";
import ArticleList from "@/components/ArticleList";
import Article from "@/components/Article";
import { SectionNames } from "@/constants";
import useBreakpoint from "@/hooks/useBreakpoint";
import ArticleTags from "@/components/ArticleTags";

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
        "p-[24px]",
        isMobile && "pb-0",
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
  return (
    <h1 className={clsx("text-[1em]", className)}>
      {children}
    </h1>
  );
};

Section.Contents = ({
  sectionName,
}: {
  sectionName: SectionNames;
}) => {
  const selectedArticle = useRecoilValue(
    selectedArticleState
  );

  const animateFadeIn = clsx("opacity-0", "fade-in");

  return (
    <div
      className={clsx(
        "pointer-events-none",
        animateFadeIn,
        "flex-1 overflow-y-scroll"
      )}
    >
      <ArticleTags
        className="mb-[60px]"
        sectionName={sectionName}
      />

      {selectedArticle ? (
        <Article />
      ) : (
        <ArticleList sectionName={sectionName} />
      )}
    </div>
  );
};

export default Section;
