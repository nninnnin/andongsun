import { useEffect, useRef } from "react";

const useResetScroll = <
  ContainerType extends HTMLElement
>(
  resetDependencies: Array<unknown>
) => {
  const containerRef = useRef<null | ContainerType>(
    null
  );

  const resetScroll = (el: typeof containerRef) => {
    if (!el.current) return;

    el.current.scrollTo(0, 0);
  };

  useEffect(() => {
    resetScroll(containerRef);
  }, [...resetDependencies]);

  return {
    containerRef,
  };
};

export default useResetScroll;
