import React from "react";
import Dropdown from "@/components/common/Dropdown";
import useArticle from "@/hooks/useArticle";

const Published = () => {
  const { value, handleChange } =
    useArticle<boolean>("published");

  return (
    <Dropdown
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
    />
  );
};

export default Published;
