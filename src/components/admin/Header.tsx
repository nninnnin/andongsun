import Link from "next/link";
import React from "react";

const AdminHeader = () => {
  return (
    <Link href="/admin">
      <div className="flex px-7 py-5 bg-transparent text-white w-fit cursor-pointer">
        Dongsun An
        <b className="ml-[16px] font-bold">Admin</b>
      </div>
    </Link>
  );
};

export default AdminHeader;
