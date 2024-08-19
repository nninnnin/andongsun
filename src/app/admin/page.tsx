"use client";

import CategorySelect from "@/components/admin/CategorySelect";
import clsx from "clsx";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import "react-quill/dist/quill.snow.css";

const AdminPage = () => {
  const ReactQuill = useMemo(
    () =>
      dynamic(() => import("react-quill"), {
        ssr: false,
      }),
    []
  );

  return (
    <div
      className={clsx(
        "bg-violet-200 w-screen h-screen",
        "flex justify-center items-center"
      )}
    >
      <CategorySelect />

      <ReactQuill
        className={clsx(
          "w-[50vw] min-h-[50vh] bg-white flex flex-col"
        )}
      />
    </div>
  );
};

export default AdminPage;
