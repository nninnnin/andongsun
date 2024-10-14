export const matchImageTags = (str: string) => {
  return str.match(/<img\s+[^>]*src="([^"]+)"[^>]*>/g);
};
