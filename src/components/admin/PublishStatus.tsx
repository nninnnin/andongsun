import React from "react";
import Dropdown from "@/components/common/Dropdown";
import useArticle from "@/hooks/useArticle";

const PublishStatus = () => {
  const { value, handleChange } =
    useArticle<boolean>("published");

  return (
    <Dropdown
      className="font-normal !w-[100px] !mb-[-1px]"
      options={[
        {
          label: "공개",
          value: true,
        },
        {
          label: "비공개",
          value: false,
        },
      ]}
      onChange={handleChange}
      selected={value ? "공개" : "비공개"}
    />
  );
};

export default PublishStatus;
