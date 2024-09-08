"use client";

import clsx from "clsx";

import Section from "@/components/Section";
import { SectionNames } from "@/constants";
import useBreakpoint from "@/hooks/useBreakpoint";
import { useMemo } from "react";

export default function Home() {
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
