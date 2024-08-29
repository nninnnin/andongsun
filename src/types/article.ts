export interface ArticleBody {
  publish: boolean;
  data: {
    title: {
      KO: string;
    };
    articleType: string[];
    contents: string;
    caption: string;
    producedAt: string;
    credits: string;
  };
}
