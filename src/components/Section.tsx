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
  SectionTitles,
} from "@/constants";
import useBreakpoint from "@/hooks/useBreakpoint";

export const selectedSectionNameState =
  atom<null | SectionNames>({
    key: "selectedSectionNameState",
    default: null,
  });

const Section = ({
  sectionName,
}: {
  sectionName: SectionNames;
}) => {
  const sectionTitle = SectionTitles[sectionName];

  const selectedSectionName = useRecoilValue(
    selectedSectionNameState
  );
  const isSelectedSection =
    selectedSectionName === sectionName;

  return (
    <Section.Container sectionName={sectionName}>
      <Section.Header>{sectionTitle}</Section.Header>

      {isSelectedSection && (
        <Section.Contents sectionName={sectionName} />
      )}
    </Section.Container>
  );
};

Section.Container = ({
  sectionName,
  children,
}: {
  sectionName: SectionNames;
  children: React.ReactNode;
}) => {
  const { isMobile } = useBreakpoint();

  const sectionColor = SectionColors[sectionName];

  const [selectedSectionName, setSelectedSectionName] =
    useRecoilState(selectedSectionNameState);

  const resetSelectedArticle = useResetRecoilState(
    selectedArticleState
  );

  const handleClick = (e: MouseEvent) => {
    if (selectedSectionName === sectionName) return;

    setSelectedSectionName(sectionName);
    resetSelectedArticle();
  };

  const isSelectedSection =
    selectedSectionName === sectionName;

  return (
    <section
      className={clsx(
        "flex-1",
        `bg-${sectionColor}`,
        "transition-[min-width min-height width height] duration-700",
        isSelectedSection
          ? isMobile
            ? "min-h-[50dvh]"
            : "min-w-[650px]"
          : isMobile
          ? "min-h-[calc(50dvh/4)]"
          : "min-w-[calc(calc(100vw-650px)/4)]",
        "p-[24px]",
        "flex flex-col"
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

  const animateFadeIn = clsx("opacity-0", "fade-in");

  return (
    <div
      className={clsx(
        "pointer-events-none",
        animateFadeIn,
        "min-w-[calc(50vw-48px)] flex-1 mt-[59px]"
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
