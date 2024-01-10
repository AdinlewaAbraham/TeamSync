import { TableColumn } from "@/interfaces/Table";
import React from "react";

const TableHeaderColumn = ({
  tableColumsRenderArray,
  setTableColumsRenderArray,
}: {
  tableColumsRenderArray: TableColumn;
  setTableColumsRenderArray: (c: TableColumn[]) => void;
}) => {
  return (
    <li
      className="border-r border-border-default px-2 py-2"
      style={{ width: tableColumsRenderArray.width || 230 }}
    >
      {tableColumsRenderArray.title}
    </li>
  );
};

export default TableHeaderColumn;
