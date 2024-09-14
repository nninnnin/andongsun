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
                ? "min-w-[max(50vw,650px)]"
                : "min-w-[calc(calc(100vw-max(50vw,650px))/4)]"
            )}
            key={sectionName}
            handleClick={handleClick}
          >
            <Section.Header>
              {sectionTitle}
            </Section.Header>

            {isSelectedSection && (
              <Section.Contents
                sectionName={sectionName}
              />
            )}
          </Section.Container>
        );
      }
    );
  }, [selectedSectionName]);
};

export default HomeDesktop;
