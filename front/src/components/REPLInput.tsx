import "../styles/main.css";
import {
  Dispatch,
  SetStateAction,
  isValidElement,
  useState,
  useEffect,
} from "react";
import { ControlledInput } from "./ControlledInput";
import { data, searchdata } from "./MockData";
import { commandHandler } from "./REPLFunction";
/**
 * This component is responsible for managing the input from the page, as well as processing the avaialbe commands.
 */
/**
 * This interface includes the props used below.
 */
export interface REPLInputProps {
  commands: string[][][];
  file: string[][];
  setFile: Dispatch<SetStateAction<string[][]>>;
  setHistory: Dispatch<SetStateAction<string[][][]>>;
}

/**
 * This function sets the needed const to useState.
 */
export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");
  const [count, setCount] = useState(Number);
  const [mode, setMode] = useState<boolean>(true);
  const [file, setFile] = useState<string[][]>([[]]);
  /**
   * This function handles the submission entered by the user.
   * There is a switch case that works with a splitted input and processes the commands.
   */

  // this is for oneTime empty load, but it does not quite work

  useEffect(() => {
    async function fetchEmptyLoad() {
      // const rest = await fetch(
      //   "http://localhost:3232/loadcsv?filepath=data/csvtest/duplicate.csv"
      // );
      // const json = rest.json();
      // const emptyFile: string[][] = await json["loaded"];
      // props.setFile(emptyFile);
      setFile([[]]);
    }
    fetchEmptyLoad();
  }, []);

  // this should call the mapping from REPLFunction
  async function handleSubmit(commandString: string) {
    setCount(count + 1);
    let output = "Output: ";
    let result: string[][] = [[]];
    let splitInput = commandString.split(" ");
    if (splitInput[0] == "mode") {
      setMode(!mode);
      output += handleMode(mode);
    } else {
      let response = await commandHandler(splitInput[0], splitInput.slice(1));
      output += response[0];
      result = response[1]; // make this work with setFile? Will allow mocking?
    }

    // switch (splitInput[0]) {
    //   case "mode": {
    //     setMode(!mode);
    //     output += handleMode(mode);
    //     break;
    //   }
    //   case "load_fil": {
    //     if (splitInput.length != 2) {
    //       output += "Error: bad filepath!";
    //     } else {
    //       if (handleLoad(splitInput[1], props)) {
    //         output = output + "load_file of " + splitInput[1] + " successful!";
    //       } else {
    //         output = output + "Could not find " + splitInput[1];
    //       }
    //     }
    //     break;
    //   }
    //   case "view": {
    //     //call view
    //     if (splitInput.length != 1) {
    //       output += "Error: view only takes in 1 argument. Take cs32 again!";
    //       // break;
    //     } else {
    //       if (props.file[0].length !== 0) {
    //         // check if we need the index
    //         viewFlag = true;
    //         output += "Successful view!";
    //       } else {
    //         output += "Error: no files were loaded.";
    //       }
    //     }
    //     break;
    //   }
    //   case "search": {
    //     if (splitInput.length !== 3) {
    //       output += "Error: search needs three args";
    //     } else {
    //       if (props.file[0].length !== 0) {
    //         searchRes = handleSearch(splitInput[1], splitInput[2]);
    //         output += "Searching! :)";
    //       } else {
    //         output += "Error: search requires a load";
    //       }
    //     }
    //     break;
    //   }
    //   default: {
    //     output =
    //       output +
    //       "Error: bad command. " +
    //       commandString +
    //       " is not a real command";
    //     break;
    //   }
    // }
    handleOutput(props, mode, output, splitInput, result);
    setCommandString("");
  }

  return (
    <div className="repl-input">
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      <button onClick={() => handleSubmit(commandString)}>
        Submitted {count} times
      </button>
    </div>
  );
}
/**
 * This function works on checking if the loaded file is valid and sets the data to be that file if it is.
 */
export function handleLoad(pathFile: string, props: REPLInputProps): boolean {
  let file = data.get(pathFile);
  if (file !== undefined) {
    props.setFile(file);
    return true;
  }
  return false;
}

/**
 * This function works with switching the mode and does it, as well as returns the output
 * stating which mode the user swithed to.
 */
export function handleMode(state: boolean): string {
  let output = "Mode switched to ";
  if (state) {
    output += "verbose";
  } else {
    output += "brief";
  }
  return output;
}
/**
 * This function handles search and checks if the keyword is valid,
 * as well as outputs the result of search or the error message.
 */
export function handleSearch(arg1: string, arg2: string): string[][] {
  let result = searchdata.get(arg1 + arg2);
  if (result !== undefined) {
    return result;
  }
  return [
    ["Error: ", "search", "failed. ", " Keyword", "not ", "found."],
    ["Args", arg1, arg2],
  ];
}
/**
 * This function consolidates the output and works on printing out the results to the history.
 */
export function handleOutput(
  props: REPLInputProps,
  mode: boolean,
  output: string,
  command: string[],
  result: string[][]
): void {
  let outputArray: string[][];
  let newCommand = ["Command: "].concat(command);
  outputArray = [newCommand];
  outputArray = outputArray.concat([output.split(" ")]);

  outputArray = outputArray.concat(result);

  if (mode) {
    props.setHistory([...props.commands, outputArray.slice(1)]);
  } else {
    props.setHistory([...props.commands, outputArray]);
  }
}
