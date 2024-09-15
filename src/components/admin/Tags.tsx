import React from "react";
import Dropdown from "@/components/common/Dropdown";

const Tags = () => {
  return (
    <div>
      <Dropdown
        options={[{ label: "태그1", value: "tag1" }]}
      />
    </div>
  );
};

export default Tags;
