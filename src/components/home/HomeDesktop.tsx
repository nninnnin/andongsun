import React from "react";
import { useMemo } from "react";

import Home from "@/app/page";
import Section from "@/components/Section";
import { SectionNames } from "@/constants";

const HomeDesktop = () => {
  const sections = useMemo(
    () =>
      Object.values(SectionNames).map(
        (sectionName) => (
          <Section
            key={sectionName}
            sectionName={sectionName}
          />
        )
      ),
    []
  );

  return <Home.Container>{sections}</Home.Container>;
};

export default HomeDesktop;
