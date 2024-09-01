import React from "react";
import clsx from "clsx";
import ReactQuill from "react-quill";

import useArticle from "@/hooks/useArticle";

const Editor = () => {
  const { handleChange, value } =
    useArticle<string>("contents");

  return (
    <div className="w-full min-h-[50vh] bg-white mt-[24px]">
      <ReactQuill
        className={clsx(
          "w-full h-[50vh] overflow-y-scroll bg-white flex flex-col"
        )}
        onChange={(value) => {
          handleChange(value);
        }}
        value={value}
      />
    </div>
  );
};

export default Editor;
