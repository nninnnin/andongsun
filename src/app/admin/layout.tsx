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
      <div className="bg-black flex flex-col h-[100dvh] w-screen">
        <AdminHeader />

        <div className="flex-1">{children}</div>
      </div>
    </OverlayProvider>
  );
};

export default AdminLayout;
