import { format } from "date-fns";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

import {
  articleDefault,
  articleState,
} from "@/states";

const useArticle = <T,>(
  propName: keyof typeof articleDefault
) => {
  const [article, setArticle] =
    useRecoilState(articleState);

  useEffect(() => {
    if (!article.year) {
      setArticle((prev) => ({
        ...prev,
        ["year"]: format(new Date(), "yyyy-MM"),
      }));
    }
  }, [article]);

  const handleChange = (value: unknown) => {
    setArticle((prev) => ({
      ...prev,
      [propName]: value,
    }));
  };

  const value = article[propName] as T;

  return {
    handleChange,
    value,
  };
};

export default useArticle;
