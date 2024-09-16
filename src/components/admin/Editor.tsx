"use client";

import clsx from "clsx";
import React from "react";
import { useSetRecoilState } from "recoil";

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
import { thumbnailInputWidthState } from "@/components/admin/Thumbnail";

import "react-quill/dist/quill.snow.css";

const Editor = () => {
  return (
    <>
      <div
        className={clsx(
          "w-[60vw] min-w-[750px] h-full mx-auto",
          "flex flex-col justify-start items-center",
          "fixed left-1/2 -translate-x-1/2 top-[90px]"
        )}
      >
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
