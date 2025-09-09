import { useState, useEffect, useCallback, useRef } from 'react';

export const useColumnResize = (initialWidths: number[]) => {
  const [widths, setWidths] = useState(initialWidths);
  const isResizing = useRef<number | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const handleMouseDown = (index: number) => {
    isResizing.current = index;
  };

  const handleMouseUp = useCallback(() => {
    isResizing.current = null;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing.current === null || !tableRef.current) return;

    const tableWidth = tableRef.current.offsetWidth;
    const minWidthPercent = 5; // Minimum 5% width for a column

    setWidths(prevWidths => {
      const newWidths = [...prevWidths];
      const currentIndex = isResizing.current!;
      const nextIndex = currentIndex + 1;

      // Calculate the change in width as a percentage of the table width
      const dxPercent = (e.movementX / tableWidth) * 100;

      // Ensure columns don't get too small
      if (newWidths[currentIndex] + dxPercent < minWidthPercent || (newWidths[nextIndex] && newWidths[nextIndex] - dxPercent < minWidthPercent)) {
        return prevWidths;
      }
      
      // Adjust the current column and the next column
      newWidths[currentIndex] += dxPercent;
      if (newWidths[nextIndex]) {
        newWidths[nextIndex] -= dxPercent;
      }

      return newWidths;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return { widths, handleMouseDown, tableRef, setWidths };
};