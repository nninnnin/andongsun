"use client";

import Section from "@/components/Section";
import { SectionNames } from "@/constants";
import useArticles from "@/hooks/useArticles";
import useBreakpoint from "@/hooks/useBreakpoint";
import clsx from "clsx";

export default function Home() {
  const sections = Object.values(SectionNames).map(
    (sectionName) => (
      <Section
        key={sectionName}
        sectionName={sectionName}
      />
    )
  );

  const articles = useArticles();

  console.log(articles);

  return <Home.Container>{sections}</Home.Container>;
}

Home.Container = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isMobile } = useBreakpoint();

  return (
    <div
      className={clsx(
        "flex h-[100dvh]",
        isMobile && "flex-col"
      )}
    >
      {children}
    </div>
  );
};
