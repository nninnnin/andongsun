import React from "react";
import Dropdown from "@/components/common/Dropdown";

const PublishStatus = () => {
  return (
    <Dropdown
      options={[
        { label: "공개", value: true },
        { label: "비공개", value: false },
      ]}
    />
  );
};

export default PublishStatus;
