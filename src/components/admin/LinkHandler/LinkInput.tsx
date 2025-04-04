import clsx from "clsx";
import React, { useState } from "react";

const LinkInput = ({
  onButtonClick,
}: {
  onButtonClick: (input: string) => void;
}) => {
  const [input, setInput] = useState("");

  const hasInput = !!input;

  return (
    <div className="flex border-[1px] border-white">
      <input
        type="text"
        className={clsx(
          "text-black",
          "text-[0.8em] pl-[0.5em]",
          "placeholder:text-[0.8em] placeholder:pl-[0.5em]",
          "outline-none"
        )}
        onChange={(e) => setInput(e.target.value)}
        value={input}
        placeholder="URL을 입력하세요."
      />

      <button
        className={clsx(
          hasInput
            ? "cursor-pointer"
            : "cursor-auto pointer-events-none"
        )}
        onClick={() => onButtonClick(input)}
      >
        <svg
          width={30}
          height={30}
          viewBox="0 0 100 100"
        >
          <rect
            width="100"
            height="100"
            fill={hasInput ? "#0067FF" : "#d1d5dc"}
          ></rect>

          <polyline
            stroke="white"
            strokeWidth={10}
            shapeRendering={"geometricPrecision"}
            fill="none"
            points="25,30 50,60 75,30"
          ></polyline>
        </svg>
      </button>
    </div>
  );
};

export default LinkInput;
