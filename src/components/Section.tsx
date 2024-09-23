import {
  atom,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import clsx from "clsx";
import {
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();

  const selectedSection = useRecoilValue(
    selectedSectionNameState
  );

  const [articleSelected, setArticleSelected] =
    useState<string | null>(null);

  useEffect(() => {
    setArticleSelected(searchParams.get("articleId"));
  }, [searchParams.get("articleId")]);

  useEffect(() => {
    setTimeout(() => {
      containerRef.current?.scrollTo({
        top: 0,
      });

      setFade(false);
    }, 0);
  }, [containerRef, articleSelected]);

  const { isMobile } = useBreakpoint();

  const animateFadeIn = clsx("opacity-0", "fade-in");

  const [fade, setFade] = useState(false);

  const handleClick = () => {
    setFade(true);
  };

  return (
    <div
      className={clsx(
        !isMobile && "section-contents",
        "h-full",
        "pointer-events-none",
        animateFadeIn,
        "flex-1 overflow-y-scroll",
        isMobile && "!mb-[40px]",
        "transition-opacity duration-500",
        fade ? "opacity-0" : "opacity-100"
      )}
      onClick={handleClick}
      onTouchEnd={handleClick}
      ref={containerRef}
    >
      {selectedSection !== SectionNames.About && (
        <ArticleTags
          className={clsx(
            "mb-[60px]",
            isMobile && "!mb-[50px]"
          )}
          sectionName={sectionName}
        />
      )}

      <AnimatePresence>
        {articleSelected ? (
          <Article />
        ) : (
          <ArticleList sectionName={sectionName} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Section;
