export interface REPLFunction {
  (args: string[]): Promise<[string, string[][]]>;
}

interface MODEfunction {
  (mode: boolean): string;
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

const loadHandler: REPLFunction = (args: string[]) => {
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
      return ["Could not find file " + args[0], []];
    });
  });
};

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

const viewHandler: REPLFunction = (args: string[]) => {
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

interface SearchGoodResponse {
  result: string;
  view_data: string[][];
}

function isSearchResponse(rjson: any): rjson is SearchGoodResponse {
  if (!("result" in rjson)) return false;
  if (!("view_data" in rjson)) return false;
  return true;
}

function argSetup(args: string[]): string[] {
  if (args.length < 3) {
    args = [...args, "false"];
  }
  let narrow = args[0];
  let index: number = parseInt(narrow);
  if (Number.isNaN(index)) {
    args[0] = "nam:" + narrow;
  } else {
    args[0] = "ind:" + narrow;
  }

  return args;
}

const searchHandler: REPLFunction = (args: string[]) => {
  if (args.length < 2) {
    return Promise.resolve([
      "Not enough args for search, expected column identifier and a target word",
      [],
    ]);
  }
  args = argSetup(args);
  console.log(args);
  const url =
    "http://localhost:3232/searchcsv?search=" +
    args[1] +
    "&header=" +
    args[2] +
    "&narrow=" +
    args[0];
  console.log(url);
  return fetch(url).then((response: Response) => {
    return response.json().then((json) => {
      if (isSearchResponse(json)) {
        const output: [string, string[][]] = [
          json.result + " search",
          json.view_data,
        ];
        return output;
      } else {
        const output: [string, string[][]] = [json.error_type, []];
        return output;
      }
    });
  });
};

interface BroadBandGoodResponse {
  result: string;
  county: string;
  broadband_access: string;
  state: string;
  timestamp: string;
}

function isBroadbandResponse(rjson: any): rjson is BroadBandGoodResponse {
  if (!("result" in rjson)) return false;
  if (!("county" in rjson)) return false;
  if (!("broadband_access" in rjson)) return false;
  if (!("state" in rjson)) return false;
  if (!("timestamp" in rjson)) return false;
  return true;
}

const broadbandHandler: REPLFunction = (args: string[]) => {
  if (args.length < 2) {
    return Promise.resolve([
      "Not enough args for broadband, expected a state and a county",
      [],
    ]);
  }
  console.log(args);
  const url =
    "http://localhost:3232/broadband?state=" + args[0] + "&county=" + args[1];
  console.log(url);
  return fetch(url).then((response: Response) => {
    return response.json().then((json) => {
      if (isBroadbandResponse(json)) {
        const output: [string, string[][]] = [
          json.result + " search",
          [[json.county, json.broadband_access, json.state, json.timestamp]],
        ];
        return output;
      } else {
        const output: [string, string[][]] = [json.error_type, []]; // specify county or state
        return output;
      }
    });
  });
};

const REPLMap: { [key: string]: REPLFunction } = {};
REPLMap["load_file"] = loadHandler;
REPLMap["search"] = searchHandler;
REPLMap["view"] = viewHandler;
REPLMap["broadband"] = broadbandHandler;
// REPLMap["mode"] = modeHanlder;

export function commandHandler(command: string, args: string[]) {
  if (REPLMap[command!]) {
    const output = REPLMap[command](args);
    return output;
  } else {
    return Promise.resolve(["Command " + command + " not found", [[]]]);
  }
}
