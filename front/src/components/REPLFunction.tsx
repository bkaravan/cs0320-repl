import "../styles/main.css";
import { Dispatch, SetStateAction, isValidElement, useState } from "react";

export interface REPLFunction {
  (args: string[]): Promise<string | [string, string[][]]>;
}

export interface REPLFunctionProps {
  output: string;
  setOut: Dispatch<SetStateAction<string>>;
}

interface LoadProperties {
  result: string;
  loaded: string;
}

export function isLoadResponse(rjson: any): rjson is LoadProperties {
  if (!("result" in rjson)) return false;
  if (!("loaded" in rjson)) return false;
  // we could check for more, but these 4 are all we care about today
  return true;
}

export const loadHandler: REPLFunction = (args: string[]) => {
  const url = "http://localhost:3232/loadcsv?filepath=" + args[0];
  return fetch(url).then((response: Response) => {
    return response.json().then((json) => {
      if (isLoadResponse(json)) {
        const output: string = json.loaded;
        return output;
      }
      return "Error: bad request";
    });
  });
};

const REPLMap: { [key: string]: REPLFunction } = {};
REPLMap["load_file"] = loadHandler;
// REPLMap["search"] = search;
// REPLMap["view"] = view;
// REPLMap["broadband"] = broadband;

export function commandHandler(command: string, args: string[]) {
  if (REPLMap[command!]) {
    const output = REPLMap[command](args);
    return output;
  } else {
    return "Command " + command + " not found";
  }
}
