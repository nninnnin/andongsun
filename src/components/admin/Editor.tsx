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
      <Editor.Row className="w-fit">
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
            {/* <Tags /> */}
            <ProductionMonth />
          </div>

          <div className="flex">
            <DeleteButton />
            <PublishStatus />
            <SubmitButton />
          </div>
        </div>
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

      <RichTextEditor />
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
      <div className="w-full">{children}</div>
    </div>
  );
};

export default Editor;
