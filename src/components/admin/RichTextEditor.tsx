import clsx from "clsx";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";

import useArticle from "@/hooks/useArticle";

const RichTextEditor = () => {
  const { handleChange, value } =
    useArticle<string>("contents");

  const ReactQuill = useMemo(() => {
    return dynamic(() => import("react-quill"), {
      ssr: false,
    });
  }, []);

  return (
    <div className="w-full min-h-[50vh] bg-white mt-[24px]">
      {useMemo(
        () => (
          <ReactQuill
            className={clsx(
              "w-full h-[50vh] overflow-y-scroll bg-white flex flex-col"
            )}
            onChange={(value) => {
              handleChange(value);
            }}
            value={value}
          />
        ),
        [value]
      )}
    </div>
  );
};

export default RichTextEditor;
