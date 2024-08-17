import {
  SectionColors,
  SectionNames,
  SectionTitles,
} from "@/constants";
import clsx from "clsx";
import {
  atom,
  useRecoilState,
  useSetRecoilState,
} from "recoil";

const selectedSectionNameState =
  atom<null | SectionNames>({
    key: "selectedSectionNameState",
    default: null,
  });

const Section = ({
  sectionName,
}: {
  sectionName: SectionNames;
}) => {
  const sectionColor = SectionColors[sectionName];
  const sectionTitle = SectionTitles[sectionName];

  const [selectedSectionName, setSelectedSectionName] =
    useRecoilState(selectedSectionNameState);

  console.log(selectedSectionName);

  const handleClick = () => {
    setSelectedSectionName(sectionName);
  };

  const isSelectedSection =
    selectedSectionName === sectionName;

  return (
    <section
      className={clsx(
        "flex-1",
        `bg-${sectionColor}`,
        "cursor-pointer",
        "transition-[min-width] duration-700",
        isSelectedSection
          ? "min-w-[50vw]"
          : "min-w-[calc(50vw/4)]"
      )}
      onClick={handleClick}
    >
      <Section.Header>{sectionTitle}</Section.Header>
    </section>
  );
};

Section.Header = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <h1 className="text-[1em]">{children}</h1>;
};

export default Section;
