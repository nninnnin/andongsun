import { selectedSectionNameState } from "@/components/Section";
import {
  SectionColors,
  SectionNames,
  SectionTitles,
} from "@/constants";
import clsx from "clsx";
import { last, set } from "lodash";
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

const MenuMobile = () => {
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
        "relative",
        "bg-slate-200 mt-auto"
      )}
      onClick={handleMenuClick}
      style={{
        transition: "all 0.5s",
        minHeight: openMenu
          ? `${60 * (items.length + 1)}px`
          : "60px",
      }}
    >
      <MenuMobile.Item className="absolute bottom-0 z-[100]">
        <img
          className={clsx(
            "mr-[11.5px]",
            "transition-all duration-500",
            openMenu && "rotate-180"
          )}
          src="/arrow--top.svg"
        />
        <span
          className={clsx(
            "transition-opacity duration-500",
            openMenu ? "opacity-0" : "opacity-100"
          )}
        >
          Menu
        </span>
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
        "absolute left-0 top-0"
      )}
    >
      {items.map((item, index) => {
        return (
          <MenuMobile.Item
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
          `bg-${SectionColors[last(items)!]}`,
          "mt-[-1px]"
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
        "pl-[27px]",
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
