import React from "react";

import Dropdown from "@/components/common/Dropdown";
import {
  SectionNames,
  SectionTitles,
} from "@/constants";

import "./categorySelect.css";

const CategorySelect = () => {
  return (
    <Dropdown
      options={Object.values(SectionNames).map(
        (sectionName) => {
          return SectionTitles[sectionName];
        }
      )}
    />
  );
};

export default CategorySelect;
