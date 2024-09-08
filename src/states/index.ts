import { SectionNames } from "@/constants";
import { ArticleStateInterface } from "@/types/article";
import { atom } from "recoil";

export const articleDefault = {
  published: false,
  articleType: null,
  thumbnail: null,
  caption: "",
  title: "",
  year: "",
  credits: "",
  contents: "",
};

export const articleState =
  atom<ArticleStateInterface>({
    key: "articleState",
    default: articleDefault,
  });

export const selectedArticleState = atom<
  string | null
>({
  key: "selectedArticleState",
  default: null,
});
