import React from "react";
import { useMemo, MouseEvent } from "react";
import {
  useRecoilState,
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
import { selectedArticleState } from "@/states";
import { selectedSectionNameState } from "@/components/Section";

const HomeDesktop = () => {
  return (
    <Home.Container>
      <HomeDesktop.Sections />
    </Home.Container>
  );
};

HomeDesktop.Sections = () => {
  const [selectedSectionName, setSelectedSectionName] =
    useRecoilState(selectedSectionNameState);

  const resetSelectedArticle = useResetRecoilState(
    selectedArticleState
  );

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
                "text-[20px]",
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
                <div className="opacity-0 pointer-events-none fade-in">
                  <div className="text-[20px]">
                    Art Diary
                  </div>

                  <div
                    className={clsx(
                      "mt-[60px] max-w-[454px] break-keep font-medium"
                    )}
                  >
                    Harper’s Bazaar Korea 피처 디렉터
                    출신으로 현재 프리랜서 에디터로
                    활동하며 출판과 전시를 기획한다. IG{" "}
                    <a
                      className="underline"
                      href="https://instagram.com/andongza"
                    >
                      @andongza
                    </a>
                  </div>
                </div>
              )}
          </Section.Container>
        );
      }
    );
  }, [selectedSectionName]);
};

export default HomeDesktop;
