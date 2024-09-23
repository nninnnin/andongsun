import useArticles from "@/hooks/useArticles";

const useAbout = () => {
  const { data: articles } = useArticles();

  const about = (articles ?? []).find(
    // @ts-ignore
    (article) => article.articleType === "AboutEditor"
  );

  return about;
};

export default useAbout;
