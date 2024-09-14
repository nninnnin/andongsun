import { MouseEvent } from "react";
import clsx from "clsx";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import { selectedArticleState } from "@/states";
import ArticleList from "@/components/ArticleList";
import Article from "@/components/Article";
import {
  SectionColors,
  SectionNames,
} from "@/constants";
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
  return (
    <section
      className={clsx(
        "flex-1",
        "transition-[min-width min-height width height] duration-700",
        "p-[24px]",
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
}: {
  children: React.ReactNode;
}) => {
  return <h1 className="text-[1em]">{children}</h1>;
};

Section.Contents = ({
  sectionName,
}: {
  sectionName: SectionNames;
}) => {
  const selectedArticle = useRecoilValue(
    selectedArticleState
  );

  const { isMobile } = useBreakpoint();

  const animateFadeIn = clsx("opacity-0", "fade-in");

  return (
    <div
      className={clsx(
        "pointer-events-none",
        animateFadeIn,
        "flex-1 mt-[59px] overflow-y-scroll",
        isMobile && "mb-[40px]"
      )}
    >
      {selectedArticle ? (
        <Article />
      ) : (
        <ArticleList sectionName={sectionName} />
      )}
    </div>
  );
};

export default Section;
