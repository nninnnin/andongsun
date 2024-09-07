import React, { useMemo } from "react";
import clsx from "clsx";

import useArticle from "@/hooks/useArticle";
import dynamic from "next/dynamic";

const Editor = () => {
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

export default Editor;
