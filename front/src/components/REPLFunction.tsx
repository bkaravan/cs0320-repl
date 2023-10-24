import "../styles/main.css";
import { Dispatch, SetStateAction, isValidElement, useState } from "react";

export interface REPLFunction {
  (args: string[]): Promise<String>;
}

export interface REPLFunctionProps {
  output: string;
  setOut: Dispatch<SetStateAction<string>>;
}

interface LoadProperties {
  result: string;
  loaded: string;
}

function isLoadResponse(rjson: any): rjson is LoadProperties {
  if (!("result" in rjson)) return false;
  if (!("loaded" in rjson)) return false;
  // we could check for more, but these 4 are all we care about today
  return true;
}

const REPLMap: { [key: string]: REPLFunction } = {};
REPLMap["load_file"] = loadHandler;
// REPLMap["search"] = search;
// REPLMap["view"] = view;
// REPLMap["broadband"] = broadband;

export function commandHandler(command: string, args: string[]): string {
  if (REPLMap[command!]) {
    let output = "1";
    let promise = REPLMap[command](args);
    return output;
  } else {
    return "Command " + command + " not found";
  }
}

function loadHandler(args: string[]): Promise<String> {
  const url = "http://localhost:3232/loadcsv?filepath=data/csvtest/test.csv";
  return fetch(url).then((response: Response) => {
    return response.json();
  });
}

function load(fetchedJson: Promise<String>): string {
  let output = "";
  let fetchedJson2 = loadHandler([]);
  fetchedJson2.then((response) => {
    if (isLoadResponse(response)) {
      console.log(response);
      const variable: string = response.result;
      console.log(variable);
      output += variable;
      output += "3";
      return response.result;
    }
    output += "faile";
  });
  return output;
}

export function loadTest(): string {
  return load(loadHandler([]));
}
