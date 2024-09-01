import useArticle from "@/hooks/useArticle";
import React from "react";
import { ChangeEvent } from "react";

const Thumbnail = () => {
  const { value, handleChange } =
    useArticle<File>("thumbnail");

  const onChange = (file: File) => {
    handleChange(file);
  };

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
    </div>
  );
};

export default Thumbnail;
