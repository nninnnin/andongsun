"use client";

import React from "react";
import { OverlayProvider } from "@toss/use-overlay";

import AdminHeader from "@/components/admin/Header";

const AdminLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <OverlayProvider>
      <div className="bg-[#333333] flex flex-col h-[100dvh] w-screen overflow-y-scroll pb-[10em]">
        <AdminHeader />

        <div className="flex-1">{children}</div>
      </div>
    </OverlayProvider>
  );
};

export default AdminLayout;
