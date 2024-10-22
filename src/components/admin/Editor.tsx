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
    <div
      className={clsx(
        "w-full h-[calc(100%-90px)]",
        "mt-auto flex",
        "flex justify-between space-x-[39px]",
        "pl-[73px] pr-[52px]"
      )}
    >
      <Editor.Metadata />
      <Editor.RichTextEditor />
      <Editor.Buttons />
    </div>
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
        className
      )}
    >
      {children}
    </div>
  );
};

Editor.Metadata = () => {
  return (
    <div className="w-[calc(calc(100vw-333px)/3*1.2)] min-w-[452px]">
      <Editor.Row className="z-[9999]">
        <CategorySelect />
        <Tags />
        <ProductionMonth />
      </Editor.Row>

      <Editor.Row>
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
    </div>
  );
};

Editor.RichTextEditor = () => {
  return (
    <div
      className={clsx(
        "w-[calc(calc(100vw-333px)/3*1.8)] min-w-[500px]",
        "h-[calc(100dvh-120px)]"
      )}
    >
      <RichTextEditor />
    </div>
  );
};

Editor.Buttons = () => {
  return (
    <div
      className={clsx("flex flex-col text-themeBlue")}
    >
      <DeleteButton />
      <PublishStatus />
      <SubmitButton />
    </div>
  );
};

export default Editor;
