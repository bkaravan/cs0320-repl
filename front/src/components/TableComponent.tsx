import React from "react";
/**
 * This component handles the table for history.
 */

/**
 * This interface includes the prop used in the component.
 */
interface Props {
  data: string[][];
}
/**
 * This component is used to create a table out of the string[][] `data`.
 */
const TableComponent: React.FC<Props> = ({ data }) => {
  return (
    <table className="centered-table">
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
