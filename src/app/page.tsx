"use client";

import clsx from "clsx";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

import useBreakpoint from "@/hooks/useBreakpoint";
import HomeDesktop from "@/components/home/HomeDesktop";
import HomeMobile from "@/components/home/HomeMobile";
import { selectedSectionNameState } from "@/components/Section";
import { useRouter } from "next/navigation";

export default function Home() {
  const selectedSection = useRecoilValue(
    selectedSectionNameState
  );

  const router = useRouter();

  useEffect(() => {
    if (!selectedSection) {
      router.replace("/");
    }
  }, [selectedSection]);

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
