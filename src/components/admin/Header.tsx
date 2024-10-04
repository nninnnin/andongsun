import clsx from "clsx";
import Link from "next/link";
import React from "react";

const AdminHeader = () => {
  return (
    <>
      <div
        className={clsx(
          "fixed",
          "flex bg-transparent text-white w-fit cursor-pointer",
          "text-large leading-[150%]",
          "mt-[18px] ml-[18px]"
        )}
      >
        <Link href="/admin">
          Dongsun An
          <b className="ml-[16px] font-bold">Admin</b>
        </Link>
      </div>

      <div
        className={clsx(
          "fixed right-[30px] top-[18px]",
          "flex bg-transparent text-white w-fit cursor-pointer",
          "text-large leading-[150%]"
        )}
      >
        <Link href="/">Home</Link>
      </div>
    </>
  );
};

export default AdminHeader;
