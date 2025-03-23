import ReactQuill from "react-quill";
import { createPortal } from "react-dom";
import { useOverlay } from "@toss/use-overlay";
import React, { MutableRefObject } from "react";

import LinkHandler from "@/components/admin/LinkHandler";

const useLinkHandler = (
  quillStore: MutableRefObject<ReactQuill | null>
) => {
  const overlay = useOverlay();

  const linkHandler = () => {
    const quill = quillStore.current;
    quill?.focus();
    const editor = quill?.getEditor();
    const range = editor?.getSelection();

    const hasSelection = range && range.length > 0;

    if (!hasSelection) {
      alert("링크를 위한 텍스트를 선택해주세요.");
      return;
    }

    overlay.open(({ isOpen, close }) => {
      return (
        <>
          {isOpen &&
            createPortal(
              <LinkHandler
                onButtonClick={(input) => {
                  editor?.formatText(
                    range!.index,
                    range!.length,
                    { link: input }
                  );

                  close();
                }}
              />,
              document.body
            )}
        </>
      );
    });
  };

  return {
    linkHandler,
  };
};

export default useLinkHandler;
