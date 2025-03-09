"use client";

import React from "react";
import { OverlayProvider } from "@toss/use-overlay";

import AdminHeader from "@/components/admin/Header";
import withAuth from "@/utils/withAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: LayoutProps) => {
  return (
    <OverlayProvider>
      <div className="bg-[#333333] flex flex-col h-[100dvh] w-screen overflow-y-scroll">
        <AdminHeader />

        <div className="h-full flex">{children}</div>
      </div>
    </OverlayProvider>
  );
};

export default withAuth<LayoutProps>(AdminLayout);
