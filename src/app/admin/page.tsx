"use client";

import CategorySelect from "@/components/admin/CategorySelect";
import clsx from "clsx";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AdminPage = () => {
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
