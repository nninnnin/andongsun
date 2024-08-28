"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import React, { ChangeEvent, useMemo } from "react";

import CategorySelect from "@/components/admin/CategorySelect";
import "react-quill/dist/quill.snow.css";
import Dropdown from "@/components/common/Dropdown";
import useMemex from "@/hooks/useMemex";
import { useRecoilState } from "recoil";
import { articleState } from "@/states";

const AdminPage = () => {
  const ReactQuill = useMemo(
    () =>
      dynamic(() => import("react-quill"), {
        ssr: false,
      }),
    []
  );

  const { postArticle } = useMemex();

  const [article, setArticle] =
    useRecoilState(articleState);

  const handleChangeArticle =
    (propName: string) => (value: unknown) => {
      console.log(value);

      setArticle((prev) => ({
        ...prev,
        [propName]: value,
      }));
    };

  const handleSubmit = async () => {
    console.log(article);

    // await postArticle()
  };

  return (
    <div
      className={clsx(
        "w-[60vw] min-w-[500px] h-full mx-auto",
        "flex flex-col justify-center items-center"
      )}
    >
      <AdminPage.Row label="">
        <div className="flex justify-between items-center">
          <CategorySelect />

          <Dropdown
            options={[
              {
                label: "공개",
                value: true,
              },
              {
                label: "비공개",
                value: false,
              },
            ]}
            onChange={handleChangeArticle("published")}
          />

          <div
            className="bg-white border-[1px] border-black outline-none h-[30px] flex justify-center items-center px-3 whitespace-nowrap"
            onClick={handleSubmit}
          >
            제출하기
          </div>
        </div>
      </AdminPage.Row>

      <AdminPage.Row label="메인 이미지">
        <AdminPage.MainImage
          onChange={handleChangeArticle("thumbnail")}
        />
      </AdminPage.Row>

      <AdminPage.Row label="메인 설명">
        <input
          type="text"
          className="w-full resize-none outline-none"
          onChange={(e) =>
            handleChangeArticle("caption")(
              e.target.value
            )
          }
          value={article.caption ?? ""}
        />
      </AdminPage.Row>

      <AdminPage.Row label="메인 타이틀">
        <div className="flex">
          <input
            type="text"
            className="w-full resize-none outline-none"
            onChange={(e) =>
              handleChangeArticle("title")(
                e.target.value
              )
            }
            value={article.title ?? ""}
          />

          <div className="flex h-[40px] items-center space-x-[12px] bg-white">
            <label className="whitespace-nowrap p-3 border-l-[1px]">
              작업 연도
            </label>
            <input
              className="bg-transparent"
              type="month"
              onChange={(e) => {
                console.log(e.target.value);
                handleChangeArticle("year")(
                  e.target.value
                );
              }}
              value={article.year ?? ""}
            />
          </div>
        </div>
      </AdminPage.Row>

      <AdminPage.Row label="작업 크레딧">
        <textarea
          className="w-full resize-none outline-none"
          onChange={(e) => {
            handleChangeArticle("credits")(
              e.target.value
            );
          }}
          value={article.credits ?? ""}
        />
      </AdminPage.Row>

      <div className="w-full min-h-[50vh] bg-white">
        <ReactQuill
          className={clsx(
            "w-full h-[50vh] overflow-y-scroll bg-white flex flex-col"
          )}
          onChange={(value) => {
            handleChangeArticle("contents")(value);
          }}
          value={article.contents ?? ""}
        />
      </div>
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
        "w-full min-h-[60px] bg-white flex justify-center items-center relative",
        "border-[1px] mt-[-1px] first:mt-0 mb-[8px]",
        "p-3 py-2"
      )}
    >
      <label className="w-fit absolute left-[-16px] -translate-x-full text-white">
        {label}
      </label>

      <div className="w-full">{children}</div>
    </div>
  );
};

AdminPage.MainImage = ({
  onChange,
}: {
  onChange: (file: File) => void;
}) => {
  return (
    <div>
      <input
        type="file"
        onChange={(
          e: ChangeEvent<HTMLInputElement>
        ) => {
          const file = e.target.files![0];

          onChange(file);
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
