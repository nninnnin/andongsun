import React from "react";
import Dropdown from "@/components/common/Dropdown";

const Tags = () => {
  return (
    <Dropdown
      options={[{ label: "태그1", value: "tag1" }]}
    />
  );
};

export default Tags;
