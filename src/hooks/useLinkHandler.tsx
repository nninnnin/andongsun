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
    overlay.open(({ isOpen, close }) => {
      return (
        <>
          {isOpen &&
            createPortal(
              <LinkHandler
                onButtonClick={(input) => {
                  console.log(quillStore.current);

                  const quill = quillStore.current;
                  quill?.focus();

                  const editor = quill?.getEditor();

                  const range = editor?.getSelection();

                  console.log(range);

                  if (range) {
                    editor?.insertText(
                      range.index,
                      input,
                      { link: input }
                    );

                    // move cursor to the end of the input
                    editor?.setSelection(
                      range.index + input.length,
                      0
                    );
                  }

                  console.log(input);
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
