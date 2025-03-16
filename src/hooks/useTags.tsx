import useSWR from "swr";

import useMemex from "@/hooks/useMemex";

const useTags = () => {
  const { getTags, postTag } = useMemex();

  const swrResult = useSWR("getTags", getTags);

  const hasTag = (tagName: string) => {
    const tags = swrResult.data;

    return tags
      ?.map((tag) => tag.name)
      .includes(tagName);
  };

  const getTagId = async (tagName: string) => {
    const tags = swrResult.data;

    const tagFounded = tags?.find(
      (tag) => tag.name === tagName
    );
    const hasTag = Boolean(tagFounded);

    const tagId = hasTag
      ? tagFounded?.id
      : await postTag(tagName);

    return tagId;
  };

  return { ...swrResult, hasTag, getTagId };
};

export default useTags;
