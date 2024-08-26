import AdminHeader from "@/components/admin/Header";
import React from "react";

const AdminLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-violet-50 flex flex-col h-[100dvh] w-screen">
      <AdminHeader />

      <div className="flex-1">{children}</div>
    </div>
  );
};

export default AdminLayout;
