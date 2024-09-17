import React, { useEffect } from "react";

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

  useEffect(() => {
    if (!value) {
      handleChange(SectionNames.About);
    }
  }, [value]);

  return (
    <div>
      <Dropdown
        className="!w-[180px]"
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
        selected={
          SectionTitles[
            value as SectionNames
          ] as string
        }
      />
    </div>
  );
};

export default CategorySelect;
