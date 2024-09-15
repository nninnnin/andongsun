import React from "react";

import Dropdown from "@/components/common/Dropdown";
import {
  SectionNames,
  SectionTitles,
} from "@/constants";

import "./categorySelect.css";
import { useSetRecoilState } from "recoil";
import { articleState } from "@/states";

const CategorySelect = () => {
  const setArticle = useSetRecoilState(articleState);

  return (
    <div>
      <Dropdown
        options={Object.values(SectionNames).map(
          (sectionName) => {
            return {
              label: SectionTitles[sectionName],
              value: sectionName,
            };
          }
        )}
        onChange={(selectedOption) => {
          setArticle((prev) => ({
            ...prev,
            ["articleType"]:
              selectedOption as SectionNames,
          }));
        }}
      />
    </div>
  );
};

export default CategorySelect;
