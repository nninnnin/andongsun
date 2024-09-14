"use client";

import clsx from "clsx";

import useBreakpoint from "@/hooks/useBreakpoint";
import HomeDesktop from "@/components/home/HomeDesktop";
import HomeMobile from "@/components/home/HomeMobile";

export default function Home() {
  const { isMobile } = useBreakpoint();

  if (isMobile === null) return <></>;
  if (isMobile === true) return <HomeMobile />;

  return <HomeDesktop />;
}

Home.Container = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className={clsx("flex h-[100dvh]")}>
      {children}
    </div>
  );
};
