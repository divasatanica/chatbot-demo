import { useLayoutEffect, useRef, useState } from "react";

export function useAttachedToEdge(initRight = 24, initBottom = 120) {
  const draggingRef = useRef(false);
  const containerRef = useRef<any>(null);
  const [right, setRight] = useState(initRight);
  const [bottom, setBottom] = useState(initBottom);

  // Add event listener on element and window
  // To support dragging interaction.
  useLayoutEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const onMouseUp = (e: MouseEvent) => {
      if (!draggingRef.current) {
        return;
      }
      const { clientX } = e;
      draggingRef.current = false;
      if (clientX < (window.innerWidth / 2)) {
        setRight(window.innerWidth - (containerRef.current.clientWidth + initRight));
      } else {
        setRight(initRight);
      }

    };
    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) {
        return;
      }
      const { clientY, clientX } = e;
      e.preventDefault();

      setBottom(
        Math.min(window.innerHeight - 40, window.innerHeight - clientY),
      );
      setRight(Math.min(window.innerWidth - 40, window.innerWidth - clientX));
    };
    const onMouseDown = () => {
      draggingRef.current = true;
    }
    const container = containerRef.current;

    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseup', onMouseUp);
    };
  }, [initBottom, initRight]);

  return {
    right,
    bottom,
    containerRef,
  }
}
