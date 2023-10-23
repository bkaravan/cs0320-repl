// /*
//   Demo: test ordinary Java/TypeScript
// */

// import { Dispatch, SetStateAction, isValidElement, useState } from "react";
// import { test, expect } from "@playwright/test";

// // all exports from main will now be available as main.X
// // import * as main from '../mock/src/main';
// import * as input from "../src/components/REPLInput";

// interface REPLInputPropsex {
//   commands: string[][][];
//   file: string[][];
//   setFile: Dispatch<SetStateAction<string[][]>>;
//   setHistory: Dispatch<SetStateAction<string[][][]>>;
// }

// const [history, setHistory] = useState<string[][][]>([[[]]]);
// const [file, setFile] = useState<string[][]>([[]]);

// const props: REPLInputPropsex = {
//   commands: history,
//   file: file,
//   setFile: setFile,
//   setHistory: setHistory,
// };

// // Notice how you can test vanilla TS functions using Playwright as well!
// test("handleLoad should return false on nonexistant data", () => {
//   expect(input.handleLoad("Something", props)).toBe(false);
// });

// test("handleLoad should return true on correct data", () => {
//   expect(input.handleLoad("stars", props)).toBe(true);
//   expect(props.file[0]).toBe(["StarID", "ProperName", "X", "Y", "Z"]);
// });

// test("handleLoad properly updates when there is more than one load", () => {
//   expect(input.handleLoad("stars", props)).toBe(true);
//   expect(input.handleLoad("ex2", props)).toBe(true);
//   expect(props.file[0]).toBe(["name", "class", "position"]);
// });

// test("Switching from brief to verbose", () => {
//   expect(input.handleMode(true)).toBe("Mode switched to verbose");
// });

// test("Switching from verbose to brief", () => {
//   expect(input.handleMode(true)).toBe("Mode switched to brief");
// });

// test("handleSearch fails when it can't find arguments", () => {
//   expect(input.handleSearch("Not", "Exist")).toBe([
//     ["Error: ", "search", "failed. ", " Keyword", "not ", "found."],
//     ["Args", "Not", "Exist"],
//   ]);
// });

// test("handleSearch correctly finds proper arguments", () => {
//   expect(input.handleSearch("position", "left")).toBe([
//     ["bohdan", "second", "left"],
//   ]);
//   expect(input.handleSearch("State", "RI")).toBe([
//     ["RI", "White", " $1,058.47", "395773.6521", "$1.00", "75%"],
//     ["RI", "Black", "$770.26", "30424.80376", "$0.73", "6%"],
//     [
//       "RI",
//       "Native American/American Indian",
//       "$471.07",
//       "2315.505646",
//       "$0.45",
//       "0%",
//     ],
//     ["RI", "Asian-Pacific Islander", "$1,080.09", "18956.71657", "$1.02", "4%"],
//     ["RI", "Hispanic/Latino", "$673.14", "74596.18851", "$0.64", "14%"],
//     ["RI", "Multiracial", "$971.89", "8883.049171", "$0.92", "2%"],
//   ]);
// });

// test.afterEach(() => {
//   props.setFile([[]]);
//   props.setHistory([[[]]]);
// });
