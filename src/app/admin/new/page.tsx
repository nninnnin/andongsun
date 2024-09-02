"use client";

import clsx from "clsx";
import React from "react";
import { useSetRecoilState } from "recoil";

import "react-quill/dist/quill.snow.css";

import CategorySelect from "@/components/admin/CategorySelect";
import SubmitButton from "@/components/admin/SubmitButton";
import Credits from "@/components/admin/Credits";
import Editor from "@/components/admin/Editor";
import Thumbnail, {
  thumbnailInputWidthState,
} from "@/components/admin/Thumbnail";
import Caption from "@/components/admin/Caption";
import Title from "@/components/admin/Title";
import ProductionMonth from "@/components/admin/\bProductionMonth";
import DeleteButton from "@/components/admin/DeleteButton";
import PublishStatus from "@/components/admin/PublishStatus";
import Tags from "@/components/admin/Tags";

const NewArticlePage = () => {
  const setThumbnailInputWidth = useSetRecoilState(
    thumbnailInputWidthState
  );

  return (
    <div
      className={clsx(
        "w-[60vw] min-w-[750px] h-full mx-auto",
        "flex flex-col justify-center items-center"
      )}
    >
      <NewArticlePage.Row className="w-fit">
        <div className="flex justify-between items-center w-full">
          <div
            className="flex"
            ref={(ref) => {
              if (ref) {
                setThumbnailInputWidth(
                  ref.offsetWidth + 0.5
                );
              }
            }}
          >
            <CategorySelect />
            <Tags />
            <ProductionMonth />
          </div>

          <div className="flex">
            <DeleteButton />
            <PublishStatus />
            <SubmitButton />
          </div>
        </div>
      </NewArticlePage.Row>

      <NewArticlePage.Row>
        <Thumbnail />
      </NewArticlePage.Row>

      <NewArticlePage.Row>
        <Title />
      </NewArticlePage.Row>

      <NewArticlePage.Row>
        <Caption />
      </NewArticlePage.Row>

      <NewArticlePage.Row>
        <Credits />
      </NewArticlePage.Row>

      <Editor />
    </div>
  );
};

NewArticlePage.Row = ({
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
      <div className="w-full">{children}</div>
    </div>
  );
};

export default NewArticlePage;
