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
