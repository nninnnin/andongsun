"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import React, { ChangeEvent, useMemo } from "react";
import Mf from "@rebel9/memex-fetcher";

const memexFetcher = Mf.createMemexFetcher(
  process.env.MEMEX_TOKEN ?? ""
);

import CategorySelect from "@/components/admin/CategorySelect";
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

      <AdminPage.MainImage />
    </div>
  );
};

AdminPage.Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={clsx("flex flex-col")}>
      <label>{label}</label>
      {children}
    </div>
  );
};

AdminPage.MainImage = () => {
  const [selectedImage, setSelectedImage] =
    React.useState<File | null>(null);

  return (
    <div>
      <input
        type="file"
        onChange={(
          e: ChangeEvent<HTMLInputElement>
        ) => {
          console.log(e.target.files);

          setSelectedImage(
            e.target.files?.[0] ?? null
          );
        }}
      />
      <button
        disabled={!selectedImage}
        onClick={async () =>
          await memexFetcher.postMedia(
            "cbbcc6cd",
            selectedImage!
          )
        }
      >
        이미지 저장하기
      </button>
    </div>
  );
};

export default AdminPage;
