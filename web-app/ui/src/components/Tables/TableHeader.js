import React from "react";

export const TableHeader = ({headers}) => {
  return (
    <thead className="thead-light">
    <tr>
      {headers &&
        headers.map((column) => (
          <th key={column} scope="col">{column}</th>
        ))
      }
    </tr>
    </thead>
  );
};

