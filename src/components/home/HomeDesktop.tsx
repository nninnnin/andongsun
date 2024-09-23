import React from "react";
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

  return useMemo(() => {
    return Object.values(SectionNames).map(
      (sectionName) => {
        const sectionTitle =
          SectionTitles[sectionName];

        const isSelectedSection =
          selectedSectionName === sectionName;

        const sectionColor =
          SectionColors[sectionName];

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
                "w-[calc(100%-0px)] whitespace-nowrap overflow-hidden",
                "text-large",
                isSelectedSection && "font-bold"
              )}
            >
              {sectionTitle}
            </Section.Header>

            {isSelectedSection &&
              sectionName !== SectionNames.About && (
                <Section.Contents
                  sectionName={sectionName}
                />
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
                  />

                  <div className="flex-1 mt-[60px]">
                    {!!selectedTag ? (
                      <Section.Contents
                        sectionName={sectionName}
                      />
                    ) : (
                      <div
                        className={clsx(
                          "max-w-[454px] break-keep font-medium"
                        )}
                        dangerouslySetInnerHTML={{
                          __html:
                            about?.contents.replaceAll(
                              "\n",
                              "<br>"
                            ) ?? "",
                        }}
                      ></div>
                    )}
                  </div>
                </div>
              )}
          </Section.Container>
        );
      }
    );
  }, [selectedSectionName, selectedTag, about]);
};

export default HomeDesktop;
