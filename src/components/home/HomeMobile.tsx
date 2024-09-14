import clsx from "clsx";
import React from "react";
import { useRecoilValue } from "recoil";

import Section, {
  selectedSectionNameState,
} from "@/components/Section";
import MenuMobile from "@/components/home/MenuMobile";
import {
  SectionNames,
  SectionTitles,
} from "@/constants";

const HomeMobile = () => {
  const selectedSection = useRecoilValue(
    selectedSectionNameState
  );

  return (
    <div
      className={clsx("h-[100dvh]", "flex flex-col")}
    >
      <div className="w-full h-[calc(100dvh-60px)] absolute top-0">
        {selectedSection && (
          <Section.Container className="h-full">
            <Section.Header>
              <b>{SectionTitles[selectedSection]}</b>
            </Section.Header>

            {selectedSection === SectionNames.About ? (
              <p className="mt-[30px] max-w-[307px] break-keep">
                Harper’s Bazaar Korea 피처 디렉터
                출신으로 현재 프리랜서 에디터로
                활동하며 출판과 전시를 기획한다. IG{" "}
                <a
                  className="underline"
                  href="https://instagram.com/andongza"
                >
                  @andongza
                </a>
              </p>
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
