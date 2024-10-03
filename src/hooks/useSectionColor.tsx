import { useMemo } from "react";
import { shuffle } from "lodash";

import { SectionNames } from "@/constants/index";

const DEFAULT_COLORS = {
  [SectionNames.About]: "white",
  [SectionNames.Writing]: "pastelBlue1",
  [SectionNames.Directing]: "pastelBlue2",
  [SectionNames.Curating]: "pastelBlue3",
  [SectionNames.Moderating]: "pastelBlue4",
};

const useSectionColor = () => {
  return useMemo(() => randomize(DEFAULT_COLORS), []);
};

const randomize = (
  defaultColors: typeof DEFAULT_COLORS
) => {
  const sectionNames = Object.keys(defaultColors);
  const shuffledColors = shuffle(
    Object.values(defaultColors)
  );

  return sectionNames.reduce((acc, cur) => {
    acc[cur as SectionNames] =
      shuffledColors.pop() as string;

    return acc;
  }, {} as Record<SectionNames, string>);
};

export default useSectionColor;
