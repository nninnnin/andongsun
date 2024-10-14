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
  // const isAuthenticated = useRecoilValue(
  //   isAuthenticatedState
  // );
  const isAuthenticated = true;

  return (
    <OverlayProvider>
      {isAuthenticated ? (
        <div className="bg-[#333333] flex flex-col h-[100dvh] w-screen overflow-y-scroll pb-[10em]">
          <AdminHeader />

          <div className="flex-1">{children}</div>
        </div>
      ) : (
        <Password />
      )}
    </OverlayProvider>
  );
};

export default AdminLayout;
