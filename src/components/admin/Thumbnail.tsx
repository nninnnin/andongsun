import React, {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import { atom, useRecoilValue } from "recoil";

import useArticle from "@/hooks/useArticle";

import "./thumbnail.css";

export const thumbnailInputWidthState = atom<
  null | number
>({
  key: "thumbnailInputWidthState",
  default: null,
});

const Thumbnail = () => {
  const [label, setLabel] = useState("Image");

  const thumbnailInputWidth = useRecoilValue(
    thumbnailInputWidthState
  );

  const { value, handleChange } =
    useArticle<File>("thumbnail");

  const onChange = (file: File) => {
    handleChange(file);
  };

  return (
    <div
      className="selector bg-white mb-[1px]"
      style={{
        width: thumbnailInputWidth ?? 0,
        overflow: "hidden",
      }}
    >
      <label className="w-full h-full flex justify-between">
        {label}

        <object data="/button--add-image.svg" />
      </label>
      <input
        className="hidden"
        type="file"
        onChange={(
          e: ChangeEvent<HTMLInputElement>
        ) => {
          const file = e.target.files![0];

          if (!file) {
            setLabel("Image");
          } else {
            setLabel(file.name);
          }

          onChange(file);
        }}
      />
    </div>
  );
};

export default Thumbnail;
