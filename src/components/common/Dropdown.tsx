import clsx from "clsx";
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

const Dropdown = ({
  options,
  onChange,
}: {
  options: {
    label: string;
    value: unknown;
  }[];
  onChange?: (value: unknown) => void;
}) => {
  const [selected, setSelected] = React.useState(
    options[0].label
  );

  const [isOpen, setIsOpen] = React.useState(false);

  const handleListClick = () =>
    setIsOpen((prev) => !prev);

  const listRef = useRef<HTMLUListElement | null>(
    null
  );

  useEffect(() => {
    if (!onChange) return;

    onChange(options[0].value);
  }, []);

  useLayoutEffect(() => {
    if (!listRef.current) return;

    const container = listRef.current.parentElement;

    if (!container) return;

    container.style.width = `${listRef.current.scrollWidth}px`;
  }, [listRef]);

  return (
    <div
      className={clsx(
        "container relative h-[44px] w-fit z-[999] mr-[-1px]",
        isOpen ? "h-[44px]" : "overflow-hidden",
        "cursor-pointer"
      )}
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
    >
      <ul
        className={clsx(
          "w-fit",
          isOpen && "absolute top-0 z-[9999]"
        )}
        ref={listRef}
      >
        <Dropdown.Item onClick={handleListClick}>
          {selected}

          <object
            className="ml-[30px] pointer-events-none"
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

                setSelected(option.label);
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
        "h-[44px] flex items-center justify-center whitespace-nowrap px-2 bg-white relative z-[999]",
        "border-[1px] border-themeBlue",
        "mt-[-1px] first:mt-0",
        "px-[13.25px] py-[10px]",
        "flex justify-between items-center",
        "select-none"
      )}
      {...props}
    >
      {props.children}
    </li>
  );
};

export default Dropdown;
