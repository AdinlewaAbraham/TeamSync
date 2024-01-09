import { TableColumn } from "@/interfaces/Table";
import React from "react";

const TableHeaderColumn = ({
  tableColumnObject,
}: {
  tableColumnObject: TableColumn;
}) => {
  return (
    <li className="w-[20%] border-r border-border-default px-2 py-2 last:border-r-0">
      {tableColumnObject.title}
    </li>
  );
};

export default TableHeaderColumn;
