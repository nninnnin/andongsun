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
import Dropdown from "@/components/common/Dropdown";
import AdminHeader from "@/components/admin/Header";

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
        "w-[60vw] h-full mx-auto",
        "flex flex-col justify-center items-center"
      )}
    >
      <AdminPage.Row label="">
        <div className="flex justify-between items-center">
          <CategorySelect />

          <Dropdown options={["공개", "비공개"]} />

          <div className="bg-white border-[1px] border-black outline-none h-[30px] flex justify-center items-center px-3">
            제출하기
          </div>
        </div>
      </AdminPage.Row>

      <AdminPage.Row label="메인 이미지">
        <AdminPage.MainImage />
      </AdminPage.Row>

      <AdminPage.Row label="메인 설명">
        <input
          type="text"
          className="w-full resize-none outline-none"
        />
      </AdminPage.Row>

      <AdminPage.Row label="메인 타이틀">
        <input
          type="text"
          className="w-full resize-none outline-none"
        />
      </AdminPage.Row>

      <AdminPage.Row label="작업 크레딧">
        <textarea className="w-full resize-none outline-none" />
      </AdminPage.Row>

      <ReactQuill
        className={clsx(
          "w-full min-h-[50vh] bg-white flex flex-col"
        )}
      />
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
    <div
      className={clsx(
        "w-full bg-slate-100 flex relative",
        "border-[1px] border-slate-300 mt-[-1px] first:mt-0 mb-[8px]",
        "p-3 py-2"
      )}
    >
      <label className="bg-slate-50 w-fit absolute left-[-16px] -translate-x-full">
        {label}
      </label>

      <div className="w-full">{children}</div>
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
      {/* <button
        disabled={!selectedImage}
        onClick={async () =>
          await memexFetcher.postMedia(
            "cbbcc6cd",
            selectedImage!
          )
        }
      >
        이미지 저장하기
      </button> */}
    </div>
  );
};

export default AdminPage;
