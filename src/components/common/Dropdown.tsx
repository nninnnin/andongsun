import clsx from "clsx";
import React, { useLayoutEffect, useRef } from "react";

const Dropdown = ({
  options,
}: {
  options: string[];
}) => {
  const [selected, setSelected] = React.useState(
    options[0]
  );

  const [isOpen, setIsOpen] = React.useState(false);

  const handleListClick = () =>
    setIsOpen((prev) => !prev);

  const listRef = useRef<HTMLUListElement | null>(
    null
  );

  useLayoutEffect(() => {
    if (!listRef.current) return;

    const container = listRef.current.parentElement;

    if (!container) return;

    container.style.width = `${
      listRef.current.scrollWidth + 2
    }px`;
  }, [listRef]);

  console.log(selected);

  return (
    <div
      className={clsx(
        "container relative h-[30px] z-[999]",
        isOpen ? "h-[30px]" : "overflow-hidden"
      )}
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
    >
      <ul
        className={clsx(
          "w-fit",
          isOpen && "absolute top-0 z-[9999]"
        )}
        onClick={handleListClick}
        ref={listRef}
      >
        <Dropdown.Item>{selected}</Dropdown.Item>

        {options.map((option, index) => {
          return (
            <Dropdown.Item
              key={`${option}-${index}`}
              onClick={(e) => {
                if (!isOpen) return;

                e.stopPropagation();

                setSelected(option);
                setIsOpen(false);
              }}
            >
              {option}
            </Dropdown.Item>
          );
        })}
      </ul>
    </div>
  );
};

Dropdown.Item = (
  props: React.PropsWithChildren<{
    onClick?: (e: React.MouseEvent) => void;
  }>
) => {
  return (
    <li
      className={clsx(
        "h-[30px] flex items-center justify-center whitespace-nowrap px-2 bg-white relative z-[999]",
        "border-[1px] border-black",
        "mt-[-1px] first:mt-0"
      )}
      {...props}
    >
      {props.children}
    </li>
  );
};

export default Dropdown;
