import React, { useState } from "react";
import {
  atom,
  useRecoilState,
  useRecoilValue,
} from "recoil";

import useArticle from "@/hooks/useArticle";

import "./thumbnail.css";
import { articleState } from "@/states";

export const thumbnailInputWidthState = atom<
  null | number
>({
  key: "thumbnailInputWidthState",
  default: null,
});

const Thumbnail = () => {
  const [label, setLabel] = useState("");

  const thumbnailInputWidth = useRecoilValue(
    thumbnailInputWidthState
  );

  const { value, handleChange } =
    useArticle<File>("thumbnail");

  const [article, setArticle] =
    useRecoilState(articleState);

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.addEventListener("change", () => {
      const file = input.files?.[0];

      if (!file) return;

      handleChange(file);

      setLabel(file.name);
    });

    input.click();
  };

  return (
    <div
      className="selector bg-white mb-[1px] cursor-pointer"
      style={{
        width: thumbnailInputWidth ?? 0,
        overflow: "hidden",
      }}
      onClick={handleClick}
    >
      <label className="w-full h-full flex justify-between cursor-pointer">
        <span className="text-ellipsis whitespace-nowrap overflow-hidden flex-1 mr-[16px]">
          {label || article.thumbnailName}
        </span>

        <object
          className="pointer-events-none cursor-pointer"
          data="/button--add-image.svg"
        />
      </label>
    </div>
  );
};

export default Thumbnail;
