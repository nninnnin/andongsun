"use client";

import Section from "@/components/Section";
import {
  SectionColors,
  SectionNames,
  SectionTitles,
} from "@/constants";

export default function Home() {
  const sections = Object.values(SectionNames).map(
    (sectionName) => {
      const sectionColor = SectionColors[sectionName];
      const sectionTitle = SectionTitles[sectionName];

      return (
        <Section
          className={`bg-${sectionColor}`}
          key={sectionName}
        >
          <Section.Header>
            {sectionTitle}
          </Section.Header>
        </Section>
      );
    }
  );

  return <Home.Container>{sections}</Home.Container>;
}

Home.Container = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-[100dvh]">{children}</div>
  );
};
