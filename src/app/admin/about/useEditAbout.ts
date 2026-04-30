import { useEffect, useRef, useState } from "react";
import { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";

import { getCategoryId } from "@/utils/index";
import useAbout from "@/hooks/useAbout";
import useMemex from "@/hooks/useMemex";

const useEditAbout = () => {
  const about = useAbout();
  const [value, setValue] = useState("");
  const initialized = useRef(false);

  const { mutate } = useSWRConfig();
  const { updateArticle, getArticleCategories } = useMemex();
  const router = useRouter();

  useEffect(() => {
    if (!about || initialized.current) return;
    // @ts-ignore
    setValue(about.contents ?? "");
    initialized.current = true;
  }, [about]);

  // @ts-ignore
  const articleId: string = about?.id ?? about?.uid ?? "";

  const handleSubmit = async () => {
    const categories = await getArticleCategories();
    // @ts-ignore
    const categoryId = getCategoryId("AboutEditor", categories);

    await updateArticle(articleId, {
      publish: true,
      data: {
        title: { KO: "Dongsun An" },
        articleType: [categoryId!],
        contents: value,
        caption: "",
        credits: "",
        producedAt: "",
        tags: [],
        thumbnailPath: "",
        thumbnailName: "",
        hidden: "false",
        removed: "false",
      },
    });

    mutate("articles");
    router.push("/admin");
  };

  return { value, setValue, articleId, handleSubmit };
};

export default useEditAbout;
