import clsx from "clsx";
import React from "react";
import { useRecoilValue } from "recoil";

import Section, {
  selectedSectionNameState,
} from "@/components/Section";
import MenuMobile from "@/components/home/MenuMobile";
import { SectionNames } from "@/constants";

const HomeMobile = () => {
  const selectedSection = useRecoilValue(
    selectedSectionNameState
  );

  return (
    <div
      className={clsx(
        "bg-red-300 h-[100dvh]",
        "flex flex-col"
      )}
    >
      <Section
        sectionName={
          selectedSection ?? SectionNames.About
        }
      />

      <MenuMobile />
    </div>
  );
};

export default HomeMobile;
