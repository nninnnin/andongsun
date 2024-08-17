"use client";

import Section from "@/components/Section";
import { SectionNames } from "@/constants";

export default function Home() {
  const sections = Object.values(SectionNames).map(
    (sectionName) => (
      <Section
        key={sectionName}
        sectionName={sectionName}
      />
    )
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
