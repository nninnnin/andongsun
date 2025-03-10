import {
  CategoryInterface,
  LanguageMap,
  MediaInterface,
  RelationInterface,
} from "@/types/memex";
import { SectionNames } from "@/constants";

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
    tags: string[];
    thumbnailPath: string;
    thumbnailName: string;
    hidden: string;
    removed: string;
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
    thumbnailPath: string;
    thumbnailName: string;
    caption: string;
    contents: string;
    credits: string;
    producedAt: string;
  };
}

export interface ArticleInterface {
  uid?: string;
  id?: string;
  title: string;
  caption: string;
  contents: string;
  credits: string;
  producedAt: string;
  articleType: SectionNames;
  tags: Array<{
    uid: string;
    tagName: string;
  }>;
  thumbnailPath: string;
  thumbnailName: string;
  hidden: boolean;
  removed: boolean;
}

export interface ArticleStateInterface {
  title: string;
  caption: string;
  credits: string;
  contents: string;
  year: string;
  published: boolean;
  articleType: SectionNames | null;
  thumbnail: File | null;
  thumbnailName: string | null;
  thumbnailPath: string | null;
  tag: string;
}
