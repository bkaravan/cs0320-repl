export interface REPLFunction {
  (args: string[]): Promise<[string, string[][]]>;
}

interface LoadProperties {
  result: string;
  loaded: string;
}

function isLoadResponse(rjson: any): rjson is LoadProperties {
  if (!("result" in rjson)) return false;
  if (!("loaded" in rjson)) return false;
  return true;
}

interface ViewProperties {
  result: string;
  viewData: string[][];
}

interface ViewBadProperties {
  error_type: string;
  type: string;
}

function isViewResponse(
  rjson: ViewBadProperties | ViewProperties
): rjson is ViewProperties {
  //return (rjson as ViewProperties).result !== undefined;
  if (!("result" in rjson)) return false;
  if (!("viewData" in rjson)) return false;

  return true;
}

export const loadHandler: REPLFunction = (args: string[]) => {
  const url = "http://localhost:3232/loadcsv?filepath=" + args[0];
  return fetch(url).then((response: Response) => {
    return response.json().then((json) => {
      if (isLoadResponse(json)) {
        const output: [string, string[][]] = [
          "Succesfully loaded " + json.loaded,
          [],
        ];
        return output;
      }
      return ["Could not find file " + args[0], [[]]];
    });
  });
};

export const viewHandler: REPLFunction = (args: string[]) => {
  const url = "http://localhost:3232/viewcsv";
  return fetch(url).then((response: Response) => {
    return response.json().then((json) => {
      if (isViewResponse(json)) {
        const output: [string, string[][]] = [
          json.result + " view",
          json.viewData,
        ];
        return output;
      } else {
        const output: [string, string[][]] = [json.error_type, []];
        return output;
      }
    });
  });
};

const REPLMap: { [key: string]: REPLFunction } = {};
REPLMap["load_file"] = loadHandler;
// REPLMap["search"] = search;
REPLMap["view"] = viewHandler;
// REPLMap["broadband"] = broadband;

export function commandHandler(command: string, args: string[]) {
  if (REPLMap[command!]) {
    const output = REPLMap[command](args);
    return output;
  } else {
    return Promise.reject(["Command " + command + " not found", []]);
  }
}
