import useMemex from "@/hooks/useMemex";
import useSWR from "swr";

const useTags = () => {
  const { getTags } = useMemex();

  return useSWR("getTags", getTags);
};

export default useTags;
