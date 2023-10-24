import { useState } from "react";
import "../styles/main.css";
import { REPLHistory } from "./REPLHistory";
import { REPLInput } from "./REPLInput";
/**
 * This is the main REPL class. It binds history and the REPLInput together.
 */

export default function REPL() {
  const [history, setHistory] = useState<string[][][]>([[[]]]); // history that records everything as a table
  const [file, setFile] = useState<string[][]>([[]]);

  return (
    <div className="repl">
      <REPLHistory commands={history} />
      <hr></hr>
      <REPLInput
        commands={history}
        file={file}
        setFile={setFile}
        setHistory={setHistory}
      />
    </div>
  );
}
