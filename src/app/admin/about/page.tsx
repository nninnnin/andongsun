"use client";

import clsx from "clsx";
import React from "react";
import { useOverlay } from "@toss/use-overlay";

import Spinner from "@/components/admin/common/Spinner";
import useEditAbout from "./useEditAbout";

const EditAbout = () => {
  const { value, setValue, articleId, handleSubmit } =
    useEditAbout();
  const overlay = useOverlay();

  return (
    <EditAbout.Container>
      <EditAbout.Editor
        value={value}
        onChange={setValue}
      />
      <EditAbout.SubmitButton
        onClick={() => {
          if (!articleId) return;
          overlay.open(() => (
            <Spinner
              contents="수정 중입니다… ⌛…"
              onMount={async () => {
                await handleSubmit();
                overlay.close();
              }}
            />
          ));
        }}
      />
    </EditAbout.Container>
  );
};

EditAbout.Container = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div
    className={clsx(
      "editor",
      "w-[60vw] min-w-[750px] h-full mx-auto",
      "flex flex-col justify-start items-end",
      "fixed left-1/2 -translate-x-1/2 top-[90px]",
    )}
  >
    {children}
  </div>
);

EditAbout.Editor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <textarea
    className="w-full h-[50vh] resize-none outline-none p-3"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

EditAbout.SubmitButton = ({
  onClick,
}: {
  onClick: () => void;
}) => (
  <button
    className={clsx(
      "p-3 py-2 bg-themeBlue border-white border-[1px] text-white",
      "mt-3 cursor-pointer",
    )}
    onClick={onClick}
  >
    수정하기
  </button>
);

export default EditAbout;
