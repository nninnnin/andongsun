"use client";

import React from "react";
import { useRecoilValue } from "recoil";
import { OverlayProvider } from "@toss/use-overlay";

import AdminHeader from "@/components/admin/Header";
import Password, {
  isAuthenticatedState,
} from "@/components/Password";

const AdminLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isAuthenticated = useRecoilValue(
    isAuthenticatedState
  );

  return (
    <OverlayProvider>
      {isAuthenticated ? (
        <div className="bg-[#333333] flex flex-col h-[100dvh] w-screen overflow-y-scroll">
          <AdminHeader />

          <div className="h-full flex">{children}</div>
        </div>
      ) : (
        <Password />
      )}
    </OverlayProvider>
  );
};

export default AdminLayout;
