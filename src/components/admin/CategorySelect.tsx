import React from "react";

import Dropdown from "@/components/common/Dropdown";
import {
  SectionNames,
  SectionTitles,
} from "@/constants";

import "./categorySelect.css";
import useArticle from "@/hooks/useArticle";

const CategorySelect = () => {
  const { value, handleChange } =
    useArticle("articleType");

  return (
    <div>
      <Dropdown
        className="w-[180px]"
        options={Object.values(SectionNames).map(
          (sectionName) => {
            return {
              label: SectionTitles[sectionName],
              value: sectionName,
            };
          }
        )}
        onChange={(selectedOption) =>
          handleChange(selectedOption)
        }
        selected={value as string}
      />
    </div>
  );
};

export default CategorySelect;
