import { selectedSectionNameState } from "@/components/Section";
import {
  SectionColors,
  SectionNames,
  SectionTitles,
} from "@/constants";
import clsx from "clsx";
import { last } from "lodash";
import React, {
  MouseEvent,
  useEffect,
  useState,
} from "react";
import {
  atom,
  useRecoilState,
  useSetRecoilState,
} from "recoil";

const openMenuState = atom({
  key: "openMenuState",
  default: false,
});

const MenuMobile = ({
  className,
}: {
  className?: string;
}) => {
  const [openMenu, setOpenMenu] =
    useRecoilState(openMenuState);

  const handleMenuClick = () => {
    setOpenMenu((prev) => !prev);
  };

  const [selectedSectionName, setSelectedSectionName] =
    useRecoilState(selectedSectionNameState);

  useEffect(() => {
    if (!selectedSectionName) {
      setSelectedSectionName(SectionNames.About);
    }
  }, [selectedSectionName]);

  const [items, setItems] = useState<SectionNames[]>(
    []
  );

  useEffect(() => {
    if (!selectedSectionName) {
      return;
    }

    setTimeout(() => {
      setItems(
        Object.values(SectionNames).filter(
          (name) => name !== selectedSectionName
        )
      );
    }, 600);
  }, [selectedSectionName]);

  return (
    <div
      className={clsx(
        "bg-slate-200 mt-auto",
        "w-full",
        "absolute bottom-[-2px] left-0 z-[9999]",
        className
      )}
      onClick={handleMenuClick}
      style={{
        transition: "all 0.5s",
        minHeight: openMenu
          ? `${60 * (items.length + 1)}px`
          : "64px",
      }}
    >
      <MenuMobile.Item className="absolute bottom-[0px] z-[100]">
        <img
          className={clsx(
            "mr-[11.5px]",
            "transition-all duration-500",
            openMenu && "rotate-180"
          )}
          src="/arrow--top.svg"
        />
      </MenuMobile.Item>

      <MenuMobile.ItemList items={items} />
    </div>
  );
};

MenuMobile.ItemList = ({
  items,
}: {
  items: SectionNames[];
}) => {
  const [openMenu, setOpenMenu] =
    useRecoilState(openMenuState);
  const setSelectedSectionName = useSetRecoilState(
    selectedSectionNameState
  );

  const transitionOpacity = clsx(
    "transition-all duration-500",
    openMenu ? "opacity-100" : "opacity-0"
  );

  const handleItemClick =
    (sectionName: SectionNames) =>
    (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();

      setSelectedSectionName(sectionName);
      setOpenMenu(false);
    };

  return (
    <ul
      className={clsx(
        "w-full",
        "pb-[10px]",
        "absolute left-0 top-0"
      )}
    >
      {items.map((item, index) => {
        return (
          <MenuMobile.Item
            key={item}
            handleClick={handleItemClick(item)}
            className={clsx(
              transitionOpacity,
              `delay-[${100 * (index + 1)}]`,
              `bg-${SectionColors[item]}`
            )}
          >
            {SectionTitles[item]}
          </MenuMobile.Item>
        );
      })}

      <MenuMobile.Item
        className={clsx(
          "border-none",
          transitionOpacity,
          `delay-[${items.length * 100}`,
          `bg-${SectionColors[last(items)!]}`
        )}
      >
        {""}
      </MenuMobile.Item>
    </ul>
  );
};

MenuMobile.Item = ({
  className,
  children,
  handleClick,
}: {
  className?: string;
  children: React.ReactNode;
  handleClick?: (e: MouseEvent<HTMLElement>) => void;
}) => {
  return (
    <div
      className={clsx(
        "h-[60px] w-full",
        "flex items-center justify-start",
        "pl-[18px]",
        "text-large",
        className
      )}
      onClick={(e) => {
        if (handleClick) {
          handleClick(e);
        }
      }}
    >
      {children}
    </div>
  );
};

export default MenuMobile;
