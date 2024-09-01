import {
  articleDefault,
  articleState,
} from "@/states";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { format } from "date-fns";

const useArticle = <T,>(
  propName: keyof typeof articleDefault
) => {
  const [article, setArticle] =
    useRecoilState(articleState);

  useEffect(() => {
    // year 값 없으면 초기화
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
