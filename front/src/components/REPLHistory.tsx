import { Dispatch } from "react";
import React, { Component } from "react";
import "../styles/main.css";
import TableComponent from "./TableComponent";
/**
 * This is the component that manages the scrollable history by creating a TableComponent of an HTMLTable.
 */

/**
 * The props consist of commands which is a string[][] where the commands are processed.
 */
interface REPLHistoryProps {
  commands: string[][][];
}
/**
 * This function creates the table and maps the command to the index and bind the data to it.
 */
export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history">
      {props.commands.map((command, index) => (
        <TableComponent data={command} />
      ))}
    </div>
  );
}
