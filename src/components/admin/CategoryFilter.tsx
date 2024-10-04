import React from "react";
import { atom, useRecoilState } from "recoil";

import Dropdown from "@/components/common/Dropdown";
import useArticleCategories from "@/hooks/useArticleCategories";

const 필터제거옵션 = "필터 제거";
export const 필터기본값 = "Category";

export const categoryFilterState = atom({
  key: "categoryFilterState",
  default: 필터기본값,
});

const CategoryFilter = () => {
  const categories = useArticleCategories();

  const [selected, setSelected] = useRecoilState(
    categoryFilterState
  );

  const options = selected
    ? [...categories, 필터제거옵션]
    : categories;

  return (
    <Dropdown
      className="text-themeBlue"
      options={options.map((category) => ({
        label: category,
        value: category,
      }))}
      onChange={(value) => {
        if (value === 필터제거옵션) {
          setSelected(필터기본값);
          return;
        }

        setSelected(value as string);
      }}
      selected={selected}
    />
  );
};

export default CategoryFilter;
