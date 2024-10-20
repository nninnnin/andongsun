"use client";

import clsx from "clsx";
import React from "react";

import Tags from "@/components/admin/Tags";
import Title from "@/components/admin/Title";
import Caption from "@/components/admin/Caption";
import Credits from "@/components/admin/Credits";
import Thumbnail from "@/components/admin/Thumbnail";
import DeleteButton from "@/components/admin/DeleteButton";
import SubmitButton from "@/components/admin/SubmitButton";
import PublishStatus from "@/components/admin/PublishStatus";
import CategorySelect from "@/components/admin/CategorySelect";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ProductionMonth from "@/components/admin/ProductionMonth";

import "react-quill/dist/quill.snow.css";
import useArticle from "@/hooks/useArticle";
import { matchImageTags } from "@/utils/matcher";

const Editor = () => {
  const { value } = useArticle<string>("contents");

  const imgTags = matchImageTags(value);

  return (
    <>
      <div
        className={clsx(
          "editor",
          "w-[60vw] min-w-[750px] h-full mx-auto",
          "flex flex-col justify-start items-center",
          "fixed left-1/2 -translate-x-1/2 top-[90px]"
        )}
      >
        <div
          className={clsx(
            "bg-white absolute left-[-30px] top-0",
            "-translate-x-[100%]",
            "w-[300px] h-[300px]",
            "overflow-y-scroll"
          )}
        >
          <h1 className="bg-slate-500 text-white p-2 font-bold sticky top-0">
            첨부된 이미지들
          </h1>

          <div
            className={clsx(
              "flex flex-wrap justify-between",
              "[&_img]:border-black [&_img]:border-[1px]",
              "[&_img]:w-[97px] [&_img]:h-[97px] [&_img]:object-cover",
              "[&_img]:mb-[6px]"
            )}
            dangerouslySetInnerHTML={{
              __html: imgTags ?? "",
            }}
          ></div>
        </div>

        <Editor.Row>
          <CategorySelect />
          <Tags />
          <ProductionMonth />
          <Thumbnail />
        </Editor.Row>

        <Editor.Row>
          <Title />
        </Editor.Row>

        <Editor.Row>
          <Caption />
        </Editor.Row>

        <Editor.Row>
          <Credits />
        </Editor.Row>

        <RichTextEditor />
      </div>

      <div className="fixed top-[90px] right-[52px] flex flex-col text-themeBlue">
        <DeleteButton />
        <PublishStatus />
        <SubmitButton />
      </div>
    </>
  );
};

Editor.Row = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "w-full flex justify-center items-center relative",
        "mt-[-1px] first:mt-0",
        "text-themeBlue",
        "bg-violet-500",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Editor;
