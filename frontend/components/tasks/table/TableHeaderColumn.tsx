import { TableColumn } from "@/interfaces/Table";
import React, { useEffect, useState } from "react";

const TableHeaderColumn = ({
  tableColumsRenderObject,
  tableColumsRenderArray,
  setTableColumsRenderArray,
}: {
  tableColumsRenderObject: TableColumn;
  tableColumsRenderArray: TableColumn[];
  setTableColumsRenderArray: (c: TableColumn[]) => void;
}) => {
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [tableHeaderColumnWidth, setTableHeaderColumnWidth] = useState(
    tableColumsRenderObject.width || 230,
  );
  const [initialX, setInitialX] = useState<number>(0);
  const setTableHeaderWidth = (newWidth: number) => {};
  useEffect(() => {
    const minHeaderWidth = 150;
    const maxHeaderWidth = 500;
    let newWidth: number = 0;
    const handleMouseUp = () => {
      document.body.classList.remove("select-none");
      setIsResizing(false);
      const newTableColumsRenderArray = tableColumsRenderArray.map((column) => {
        if (column.id === tableColumsRenderObject.id) {
          return { ...tableColumsRenderObject, width: tableHeaderColumnWidth };
        } else {
          return column;
        }
      });
      setTableColumsRenderArray(newTableColumsRenderArray);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        newWidth = tableHeaderColumnWidth + (e.clientX - initialX);
        if (newWidth <= minHeaderWidth) {
          setTableHeaderColumnWidth(minHeaderWidth);
          return;
        }
        if (newWidth >= maxHeaderWidth) {
          setTableHeaderColumnWidth(maxHeaderWidth);
          return;
        }

        setTableHeaderColumnWidth(newWidth);
        setInitialX(e.clientX);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, tableHeaderColumnWidth, initialX]);
  return (
    <li
      className="relative border-r border-border-default px-2 py-2"
      style={{ width: tableHeaderColumnWidth }}
    >
      {tableColumsRenderObject.title}
      <span
        onMouseDown={(e) => {
          document.body.classList.add("select-none");
          setIsResizing(true);
          setInitialX(e.clientX);
        }}
        onMouseUp={() => {
          setIsResizing(false);
          document.body.classList.remove("select-none");
        }}
        className={`${
          isResizing ? "bg-accent-blue" : "bg-transparent"
        }  absolute -right-[3px] bottom-0 top-0 w-1.5 cursor-col-resize bg-transparent transition-all duration-150 hover:bg-accent-blue`}
      />
      {isResizing && (
        <span className="absolute z-[99] -right-px bottom-0 top-0 h-[9999px] w-px bg-accent-blue" />
      )}
    </li>
  );
};

export default TableHeaderColumn;
