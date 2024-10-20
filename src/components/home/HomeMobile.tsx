import clsx from "clsx";
import React, {
  useLayoutEffect,
  useMemo,
} from "react";
import { useRecoilValue } from "recoil";

import Section, {
  selectedSectionNameState,
} from "@/components/Section";
import MenuMobile from "@/components/home/MenuMobile";
import {
  SectionColors,
  SectionNames,
  SectionTitles,
} from "@/constants";
import ArticleTags, {
  selectedTagState,
} from "@/components/ArticleTags";
import useAbout from "@/hooks/useAbout";
import useBreakpoint from "@/hooks/useBreakpoint";

const HomeMobile = () => {
  const selectedSection = useRecoilValue(
    selectedSectionNameState
  );

  const selectedTag = useRecoilValue(selectedTagState);

  const about = useAbout();

  const { isMobile } = useBreakpoint();

  return (
    <div
      className={clsx("h-[100dvh]", "flex flex-col")}
    >
      <div className="w-full h-[calc(100dvh-60px)] absolute top-0">
        {selectedSection && (
          <Section.Container
            className={clsx(
              "h-full",
              `bg-${SectionColors[selectedSection]}`
            )}
          >
            <Section.Header
              className={clsx("font-bold text-large")}
            >
              {SectionTitles[selectedSection]}
            </Section.Header>

            {selectedSection === SectionNames.About ? (
              <>
                <ArticleTags
                  sectionName={SectionNames.About}
                  className={clsx(
                    "mb-[50px]",
                    isMobile &&
                      "!mb-[50px] !fixed !left-0 !w-screen"
                  )}
                />

                {!!selectedTag ? (
                  <Section.Contents
                    sectionName={SectionNames.About}
                  />
                ) : (
                  <p
                    className={clsx(
                      "max-w-[307px]",
                      "break-keep text-medium",
                      isMobile && "mt-[50px]"
                    )}
                    dangerouslySetInnerHTML={{
                      __html:
                        about?.contents.replaceAll(
                          "\n",
                          "<br>"
                        ) ?? "",
                    }}
                  ></p>
                )}
              </>
            ) : (
              <Section.Contents
                sectionName={selectedSection}
              />
            )}
          </Section.Container>
        )}
      </div>

      <MenuMobile />
    </div>
  );
};

export default HomeMobile;
