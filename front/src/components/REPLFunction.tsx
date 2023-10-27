export interface REPLFunction {
  (args: string[]): Promise<[string, string[][]]>;
}

interface MODEfunction {
  (mode: boolean): string;
}

interface LoadProperties {
  filepath: string;
}

function isLoadResponse(rjson: any): rjson is LoadProperties {
  if (!("filepath" in rjson)) return false;
  return true;
}

const loadHandler: REPLFunction = (args: string[]) => {
  const url = "http://localhost:2020/loadcsv?filepath=" + args[0];
  return fetch(url).then((response: Response) => {
    return response.json().then((json) => {
      if (isLoadResponse(json)) {
        const output: [string, string[][]] = [json.filepath, []];
        return output;
      }
      return ["Could not find file " + args[0], []];
    });
  });
};

interface ViewProperties {
  result: string;
  view_data: string[][];
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
  if (!("view_data" in rjson)) return false;

  return true;
}

const viewHandler: REPLFunction = (args: string[]) => {
  const url = "http://localhost:2020/viewcsv";
  return fetch(url).then((response: Response) => {
    return response.json().then((json) => {
      if (isViewResponse(json)) {
        const output: [string, string[][]] = [
          json.result + " view",
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

interface SearchGoodResponse {
  result: string;
  data: string[][];
}

function isSearchResponse(rjson: any): rjson is SearchGoodResponse {
  if (!("result" in rjson)) return false;
  if (!("data" in rjson)) return false;
  return true;
}

function argSetup(args: string[]): string[] {
  if (args.length < 3) {
    args = [...args, "n"];
  }
  let narrow = args[0];
  let index: number = parseInt(narrow);
  if (Number.isNaN(index)) {
    args[0] = "N:" + narrow;
  } else {
    args[0] = "I:" + narrow;
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
    "http://localhost:2020/searchcsv?search=" +
    args[1] +
    "&" +
    args[0] +
    "&" +
    args[2];
  console.log(url);
  return fetch(url).then((response: Response) => {
    return response.json().then((json) => {
      if (isSearchResponse(json)) {
        const output: [string, string[][]] = [
          json.result + " search",
          json.data,
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
  address: string;
  bbNumber: string;
  timestamp: string;
}

function isBroadbandResponse(rjson: any): rjson is BroadBandGoodResponse {
  if (!("result" in rjson)) return false;
  if (!("address" in rjson)) return false;
  if (!("bbNumber" in rjson)) return false;
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
    "http://localhost:2020/broadband?state=" + args[0] + "&county=" + args[1];
  console.log(url);
  return fetch(url).then((response: Response) => {
    return response.json().then((json) => {
      if (isBroadbandResponse(json)) {
        const output: [string, string[][]] = [
          json.result + " broadband",
          [[json.address, json.bbNumber, json.timestamp]],
        ];
        return output;
      } else {
        const output: [string, string[][]] = [json.error_type, []]; // specify county or state
        return output;
      }
    });
  });
};

interface LoadProperties {
  reload: string;
}

function isReloadResponse(rjson: any): rjson is LoadProperties {
  if (!("reload" in rjson)) return false;
  return true;
}

const reloadHandler: REPLFunction = (args: string[]) => {
  const url = "http://localhost:2020/reload";
  return fetch(url).then((response: Response) => {
    return response.json().then((json) => {
      if (isReloadResponse(json)) {
        const output: [string, string[][]] = [json.reload, []];
        return output;
      }
      return ["Bad response ", []];
    });
  });
};

const REPLMap: { [key: string]: REPLFunction } = {};
REPLMap["load_file"] = loadHandler;
REPLMap["search"] = searchHandler;
REPLMap["view"] = viewHandler;
REPLMap["broadband"] = broadbandHandler;
REPLMap["reload"] = reloadHandler;

export function commandHandler(
  command: string,
  args: string[]
): Promise<[string, string[][]]> {
  if (REPLMap[command!]) {
    const output = REPLMap[command](args);
    return output;
  } else {
    return Promise.resolve(["Command " + command + " not found", [[]]]);
  }
}
