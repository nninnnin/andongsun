import React, { useEffect, useState } from "react";
import { useMemo, MouseEvent } from "react";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import clsx from "clsx";

import Home from "@/app/page";
import Section from "@/components/Section";
import {
  SectionNames,
  SectionTitles,
  SectionColors,
} from "@/constants";
import { selectedSectionNameState } from "@/components/Section";
import ArticleTags, {
  selectedTagState,
} from "@/components/ArticleTags";
import useAbout from "@/hooks/useAbout";
import useSectionColor from "@/hooks/useSectionColor";
import useBreakpoint from "@/hooks/useBreakpoint";
import { useSearchParams } from "next/navigation";

const HomeDesktop = () => {
  return (
    <Home.Container>
      <HomeDesktop.Sections />
    </Home.Container>
  );
};

HomeDesktop.Sections = () => {
  const selectedTag = useRecoilValue(selectedTagState);

  const [selectedSectionName, setSelectedSectionName] =
    useRecoilState(selectedSectionNameState);

  const resetSelectedArticle = () => {
    window.history.pushState(
      null,
      "",
      window.location.pathname
    );
  };

  const about = useAbout();

  const sectionColors = useSectionColor();

  const { isMobile } = useBreakpoint();

  const [articleSelected, setArticleSelected] =
    useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    setArticleSelected(searchParams.get("articleId"));
  }, [searchParams.get("articleId")]);

  return useMemo(() => {
    return Object.values(SectionNames).map(
      (sectionName) => {
        const sectionTitle =
          SectionTitles[sectionName];

        const isSelectedSection =
          selectedSectionName === sectionName;

        const sectionColor =
          sectionColors[sectionName];

        const handleClick = (e: MouseEvent) => {
          if (selectedSectionName === sectionName)
            return;

          setSelectedSectionName(sectionName);
          resetSelectedArticle();
        };

        return (
          <Section.Container
            className={clsx(
              `bg-${sectionColor}`,
              isSelectedSection
                ? "min-w-[max(60vw,650px)]"
                : "min-w-[calc(calc(100vw-max(60vw,650px))/4)]"
            )}
            key={sectionName}
            handleClick={handleClick}
          >
            <Section.Header
              className={clsx(
                "w-[calc(100%-0px)] min-h-[25.5px] whitespace-nowrap overflow-hidden",
                "text-large",
                isSelectedSection && "font-bold"
              )}
            >
              {sectionTitle}
            </Section.Header>

            {isSelectedSection &&
              sectionName !== SectionNames.About && (
                <>
                  <Section.Contents
                    sectionName={sectionName}
                  />
                  {!isMobile && articleSelected && (
                    <BackButton />
                  )}
                </>
              )}

            {isSelectedSection &&
              SectionNames.About === sectionName && (
                <div
                  className={clsx(
                    "flex flex-col pointer-events-none h-full opacity-0 fade-in",
                    "opacity-0",
                    "fade-in"
                  )}
                >
                  <ArticleTags
                    sectionName={SectionNames.About}
                    className="mb-[60px] !px-0"
                  />

                  {!!selectedTag ? (
                    <div className="flex-1 mb-[24px]">
                      <Section.Contents
                        sectionName={sectionName}
                      />
                    </div>
                  ) : (
                    <>
                      <div
                        className={clsx(
                          "max-w-[454px]",
                          "break-keep text-medium"
                        )}
                        dangerouslySetInnerHTML={{
                          __html:
                            about?.contents.replaceAll(
                              "\n",
                              "<br>"
                            ) ?? "",
                        }}
                      ></div>

                      <footer className="mt-auto opacity-40 font-medium text-[6px]">
                        © 2024 Dongsun An All right
                        reserved.｜Site Development by
                        Donggyu Lee｜Design by Daesoon
                        Kim
                      </footer>
                    </>
                  )}
                </div>
              )}
          </Section.Container>
        );
      }
    );
  }, [
    selectedSectionName,
    selectedTag,
    about,
    articleSelected,
  ]);
};

const BackButton = () => {
  const { isMobile } = useBreakpoint();

  const resetSelectedArticle = () => {
    window.history.pushState(
      null,
      "",
      window.location.pathname
    );
  };

  return (
    <div
      className={clsx(
        "w-full",
        "sticky bottom-0 left-0",
        "flex justify-start items-center",
        "mt-auto",
        "cursor-pointer",
        isMobile && "hidden"
      )}
      onClick={() => resetSelectedArticle()}
    >
      <img
        className="rotate-[270deg] mr-[0.5em] h-[1.5em]"
        src="/arrow--top.svg"
      />{" "}
    </div>
  );
};

export default HomeDesktop;
