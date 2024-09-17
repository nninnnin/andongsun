import clsx from "clsx";
import React, { useLayoutEffect, useRef } from "react";

const Dropdown = ({
  options,
  onChange,
  selected,
  className,
}: {
  options: {
    label: string;
    value: unknown;
  }[];
  onChange?: (value: unknown) => void;
  selected: string;
  className?: string;
}) => {
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
      Math.ceil(listRef.current.scrollWidth) + 1
    }px`;
  }, [listRef]);

  return (
    <div
      className={clsx(
        "container relative h-[43px] w-full z-[9999] mt-[-1px]",
        !isOpen && "overflow-hidden",
        "cursor-pointer",
        "font-bold outline-none",
        className
      )}
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
    >
      <ul
        className={clsx(
          "w-full",
          isOpen && "absolute top-0 z-[9999]"
        )}
        ref={listRef}
      >
        <Dropdown.Item onClick={handleListClick}>
          {selected}

          <object
            className="pointer-events-none"
            width="14px"
            data="/arrow--down.svg"
          />
        </Dropdown.Item>

        {options.map((option, index) => {
          return (
            <Dropdown.Item
              key={`${option}-${index}`}
              onClick={(e) => {
                if (!isOpen) return;

                e.stopPropagation();

                setIsOpen(false);

                if (onChange) {
                  onChange(option.value);
                }
              }}
            >
              <div>{option.label}</div>
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
        "w-full h-[43px] flex items-center justify-center whitespace-nowrap bg-white relative z-[9999]",
        "border-[1px] border-themeBlue",
        "mt-[-1px] first:mt-0",
        "border-b-0 first:border-b-[1px] last:border-b-[1px]",
        "px-[13px] py-[10px]",
        "flex justify-between items-center",
        "select-none",
        "outline-none"
      )}
      {...props}
    >
      {props.children}
    </li>
  );
};

export default Dropdown;
