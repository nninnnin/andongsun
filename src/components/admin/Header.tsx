import clsx from "clsx";
import Link from "next/link";
import React from "react";

const AdminHeader = () => {
  return (
    <Link href="/admin">
      <div
        className={clsx(
          "fixed",
          "flex bg-transparent text-white w-fit cursor-pointer",
          "text-large leading-[150%]",
          "mt-[18px] ml-[32px]"
        )}
      >
        Dongsun An
        <b className="ml-[16px] font-bold">Admin</b>
      </div>
    </Link>
  );
};

export default AdminHeader;
