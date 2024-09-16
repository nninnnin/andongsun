import useArticle from "@/hooks/useArticle";
import useTags from "@/hooks/useTags";

import clsx from "clsx";
import { debounce } from "lodash";
import React, {
  ChangeEvent,
  useCallback,
  useMemo,
  useState,
} from "react";

const Tags = () => {
  const [showTags, setShowTags] = useState(false);

  const {
    handleChange,
    value,
  }: {
    handleChange: (value: string) => void;
    value: string;
  } = useArticle("tag");

  const { data: tags } = useTags();

  const recognizeValue = useCallback(
    debounce(
      (value: string) => {
        if (value.length > 0) {
          setShowTags(true);
        } else {
          setShowTags(false);
        }
      },
      300,
      {
        leading: false,
        trailing: true,
      }
    ),
    []
  );

  const itemStyle = clsx(
    "w-full h-[44px] border-b-[1px] border-themeBlue last:border-b-0",
    "flex items-center justify-start",
    "pl-[15px]",
    "cursor-pointer"
  );

  const handleItemClick = (value: string) => () => {
    setShowTags(false);
    handleChange(value);
  };

  const filteredTags = useMemo(
    () =>
      (tags ?? []).filter((tag) => {
        const regex = new RegExp(`^${value}`, "i");

        return regex.test(tag.name);
      }),
    [tags, value]
  );

  return (
    <div className="relative ml-[-2px] h-[44px]">
      <div
        className={clsx(
          "flex items-center",
          "bg-white text-themeBlue border-[1px] border-themeBlue",
          "pr-[15px]"
        )}
      >
        <input
          className="h-[42px] w-[140px] pl-[15px] outline-none border-none mr-[3px]"
          placeholder="태그를 입력"
          onChange={(
            e: ChangeEvent<HTMLInputElement>
          ) => {
            handleChange(e.target.value);

            recognizeValue(e.target.value);
          }}
          value={value as string}
        />

        <object data="/hashtag.svg" />
      </div>

      {showTags &&
        !!value.length &&
        filteredTags?.length && (
          <ul
            className={clsx(
              "w-[calc(100%)]",
              "flex flex-col items-center",
              "absolute top-[42px] left-[0px] z-[100]",
              "border-[1px] border-themeBlue",
              "bg-white"
            )}
            style={{
              height: `${44 * filteredTags.length}px`,
            }}
          >
            {filteredTags.map((tag) => {
              return (
                <li
                  key={tag.id}
                  onClick={handleItemClick(tag.name)}
                  className={itemStyle}
                >
                  {tag.name}
                </li>
              );
            })}
          </ul>
        )}
    </div>
  );
};

export default Tags;
