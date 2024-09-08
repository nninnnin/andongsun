import {
  CategoryInterface,
  LanguageMap,
  MediaInterface,
  RelationInterface,
} from "@/types/memex";

export interface ArticleBody {
  publish: boolean;
  data: {
    title: {
      KO: string;
    };
    articleType: number[];
    contents: string;
    caption: string;
    producedAt: string;
    credits: string;
  };
}

export interface BareArticle {
  uid: string;
  order: number;
  data: {
    title: LanguageMap;
    articleType: CategoryInterface[];
    tags: RelationInterface[];
    thumbnail: MediaInterface[];
    caption: string;
    contents: string;
    credits: string;
    producedAt: string;
  };
}

export interface ArticleInterface {
  id: string;
  title: string;
  caption: string;
  contents: string;
  credits: string;
  producedAt: string;
  tags: Array<{
    uid: string;
    tagName: string;
  }>;
}
