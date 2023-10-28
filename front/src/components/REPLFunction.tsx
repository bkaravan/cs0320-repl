/**
 * This interface sets up the format of the REPLFunction's output.
 */
export interface REPLFunction {
  (args: string[]): Promise<[string, string[][]]>;
}
/**
 * This interface checks the mode.
 */
interface MODEfunction {
  (mode: boolean): string;
}
/**
 * This interface checks the properties of the Load.
 */
interface LoadProperties {
  filepath: string;
}
/**
 * This function checks if the LoadResponse is a valid response that can be processed.
 *
 * @param rjson -- does the filepath exist.
 * @returns -- boolean whether the response is valid.
 */
function isLoadResponse(rjson: any): rjson is LoadProperties {
  if (!("filepath" in rjson)) return false;
  return true;
}
/**
 * This function handles the load by fetching the load query from the backend server.
 *
 * @param args -- arguments that are being handed in, the filepath.
 * @returns -- a Promise, that contains the response, either success or error.
 */
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
/**
 * This interface checks the properties of view.
 */
interface ViewProperties {
  result: string;
  view_data: string[][];
}

/**
 * This interface checks for bad properties.
 */

interface ViewBadProperties {
  error_type: string;
  type: string;
}

/**
 * This function checks if the response for view is valid.
 *
 * @param rjson -- the response.
 * @returns -- boolean whether the response is valid.
 */
function isViewResponse(
  rjson: ViewBadProperties | ViewProperties
): rjson is ViewProperties {
  //return (rjson as ViewProperties).result !== undefined;
  if (!("result" in rjson)) return false;
  if (!("view_data" in rjson)) return false;

  return true;
}

/**
 * This function handles the view by fetching it from our back-end.
 * @param args -- the argumnents that are getting passed in.
 * @returns -- A promise with a response of success or error.
 */

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

/**
 * This interfaces checks whether the response to search is valid.
 */

interface SearchGoodResponse {
  result: string;
  data: string[][];
}
/**
 * This function checks the validity of the search response.
 *
 * @param rjson -- the response.
 * @returns --boolean whether the response is valid.
 */
function isSearchResponse(rjson: any): rjson is SearchGoodResponse {
  if (!("result" in rjson)) return false;
  if (!("data" in rjson)) return false;
  return true;
}

/**
 * This function handles setting up the arguments and checking whether the lenght is permittable, as well as
 * differentiating between columns and indeces.
 *
 * @param args -- the arguments passed in.
 * @returns -- the "parsed"/processed arguments.
 */

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

/**
 * This function handles search.
 *
 * @param args -- parsed arguments.
 * @returns -- a Promise with a response.
 */
const searchHandler: REPLFunction = (args: string[]) => {
  if (args.length < 2 || args.length > 3) {
    return Promise.resolve([
      "Search expects a column identifier, a target word and an optional header",
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

/**
 * This interfaces checks for broadband responses.
 */
interface BroadBandGoodResponse {
  result: string;
  address: string;
  bbNumber: string;
  timestamp: string;
}

/**
 * This function checks whether the broadband respones is valid.
 *
 * @param rjson -- the response.
 * @returns -- boolean whether the response is valid.
 */
function isBroadbandResponse(rjson: any): rjson is BroadBandGoodResponse {
  if (!("result" in rjson)) return false;
  if (!("address" in rjson)) return false;
  if (!("bbNumber" in rjson)) return false;
  if (!("timestamp" in rjson)) return false;
  return true;
}

/**
 * This function handles the broadband by calling our back end or displaying error messages.
 * @param args -- the arguments passed in.
 * @returns  -- a Promise with the response.
 */
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
          [[json.address, "bb number: " + json.bbNumber, json.timestamp]],
        ];
        return output;
      } else {
        const output: [string, string[][]] = [json.error_type, []]; // specify county or state
        return output;
      }
    });
  });
};

/**
 * This interface checks the properties of the load.
 */

interface LoadProperties {
  reload: string;
}

/**
 * This function checks whether the response to the reload is valid.
 * @param rjson -- the response to check.
 * @returns -- boolean whether the response is valid.
 */
function isReloadResponse(rjson: any): rjson is LoadProperties {
  if (!("reload" in rjson)) return false;
  return true;
}

/**
 * This function handles reloading the page through our back end for the purposes of clean integration testing.
 *
 * @param args -- the arguments
 * @returns -- the response.
 */
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

/**
 * This map contains references from a string representation of a command to an actual function.
 */
const REPLMap: { [key: string]: REPLFunction } = {};
REPLMap["load_file"] = loadHandler;
REPLMap["search"] = searchHandler;
REPLMap["view"] = viewHandler;
REPLMap["broadband"] = broadbandHandler;
REPLMap["reload"] = reloadHandler;

/**
 * This function handles the commands that are being passed in.
 *
 * @param command -- the command.
 * @param args -- the arguments.
 * @returns -- an output that is a command with a call of the arguments passed in or an error message for an invalid command.
 */
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
