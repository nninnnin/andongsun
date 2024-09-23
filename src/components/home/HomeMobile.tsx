import clsx from "clsx";
import React from "react";
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

const HomeMobile = () => {
  const selectedSection = useRecoilValue(
    selectedSectionNameState
  );

  const selectedTag = useRecoilValue(selectedTagState);

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
                />

                <div className="mt-[50px]">
                  {!!selectedTag ? (
                    <Section.Contents
                      sectionName={SectionNames.About}
                    />
                  ) : (
                    <p className="max-w-[307px] break-keep">
                      Harper’s Bazaar Korea 피처 디렉터
                      출신으로 현재 프리랜서 에디터로
                      활동하며 출판과 전시를 기획한다.
                      IG{" "}
                      <a
                        className="underline"
                        href="https://instagram.com/andongza"
                      >
                        @andongza
                      </a>
                    </p>
                  )}
                </div>
              </>
            ) : (
              <Section.Contents
                sectionName={selectedSection}
              />
            )}
          </Section.Container>
        )}
      </div>

      <MenuMobile className="absolute bottom-0 left-0 z-[9999]" />
    </div>
  );
};

export default HomeMobile;
