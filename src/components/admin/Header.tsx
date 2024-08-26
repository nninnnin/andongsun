import { SectionNames } from "@/constants";
import React from "react";

const AdminHeader = () => {
  return (
    <div className="flex justify-between px-7 py-5 bg-white">
      {Object.values(SectionNames).map(
        (sectionName) => (
          <div key={sectionName}>{sectionName}</div>
        )
      )}
    </div>
  );
};

export default AdminHeader;
