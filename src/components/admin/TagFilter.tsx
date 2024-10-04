import { atom, useRecoilState } from "recoil";
import React from "react";

import Dropdown from "@/components/common/Dropdown";
import useArticleTags from "@/hooks/useArticleTags";

const 필터제거옵션 = "필터 제거";
export const 필터기본값 = "Tag";

export const tagFilterState = atom({
  key: "tagFilterState",
  default: 필터기본값,
});

const TagFilter = () => {
  const articleTags = useArticleTags();

  const [selectedTag, setSelectedTag] = useRecoilState(
    tagFilterState
  );

  const options = selectedTag
    ? [...articleTags, { tagName: 필터제거옵션 }]
    : articleTags;

  return (
    <Dropdown
      className="text-themeBlue"
      options={options.map((tag) => ({
        label: tag.tagName,
        value: tag.tagName,
      }))}
      onChange={(value) => {
        if (value === 필터제거옵션) {
          setSelectedTag(필터기본값);
          return;
        }

        setSelectedTag(value as string);
      }}
      selected={selectedTag}
    />
  );
};

export default TagFilter;
