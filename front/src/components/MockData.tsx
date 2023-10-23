/**
 * This is the Mock Dataset.
 * There are examples for load, search, and view that can be loaded into the program.
 */

const CSVEx1v = [
  ["1", "2", "3", "4", "5"],
  ["I", "want", "it", "that", "way"],
];
const TestFile = [["You", "are", "my", "fire"]];

const CSVEx2 = [
  ["name", "class", "position"],
  ["jake", "second", "right"],
  ["bohdan", "second", "left"],
  ["alex", "first", "right"],
];

const CSVEx3 = [
  ["Kevin", "CIT", "32"],
  ["Joe", "MetCalf", "330"],
  ["Carla", "Barus", "32"],
];

const emptyCSV = [[]];

const CSVcol = [["1"], ["2"], ["3"]];

const starCSV = [
  ["StarID", "ProperName", "X", "Y", "Z"],
  ["0", "Sol", "0", "0", "0"],
  ["1", "", "282.43485", "0.00449", "5.36884"],
  ["2", "", "43.04329", "0.00285", "-15.24144"],
  ["3", "", "277.11358", "0.02422", "223.27753"],
  ["3759", "96 G. Psc", "7.26388", "1.55643", "0.68697"],
  ["70667", "Proxima Centauri", "-0.47175", "-0.36132", "-1.15037"],
  ["71454", "Rigel Kentaurus B", "-0.50359", "-0.42128", "-1.1767"],
  ["71457", "Rigel Kentaurus A", "-0.50362", "-0.42139", "-1.17665"],
  ["87666", "Barnard's Star", "-0.01729", "-1.81533", "0.14824"],
  ["118721", "", "-2.28262", "0.64697", "0.29354"],
];

const earningCSV = [
  [
    "State",
    "Data Type",
    "Average Weekly Earnings",
    "Number of Workers",
    "Earnings Disparity",
    "Employed Percent",
  ],
  ["RI", "White", " $1,058.47", "395773.6521", "$1.00", "75%"],
  ["RI", "Black", "$770.26", "30424.80376", "$0.73", "6%"],
  [
    "RI",
    "Native American/American Indian",
    "$471.07",
    "2315.505646",
    "$0.45",
    "0%",
  ],
  ["RI", "Asian-Pacific Islander", "$1,080.09", "18956.71657", "$1.02", "4%"],
  ["RI", "Hispanic/Latino", "$673.14", "74596.18851", "$0.64", "14%"],
  ["RI", "Multiracial", "$971.89", "8883.049171", "$0.92", "2%"],
];

const search1: string[][] = [["I", "want", "it", "that", "way"]];
const search2 = [
  ["jake", "second", "right"],
  ["bohdan", "second", "left"],
];
const search3 = [["bohdan", "second", "left"]];
const search4 = [["Kevin", "CIT", "32"]];
const search5 = [["0", "Sol", "0", "0", "0"]];
const search6 = [
  ["RI", "White", " $1,058.47", "395773.6521", "$1.00", "75%"],
  ["RI", "Black", "$770.26", "30424.80376", "$0.73", "6%"],
  [
    "RI",
    "Native American/American Indian",
    "$471.07",
    "2315.505646",
    "$0.45",
    "0%",
  ],
  ["RI", "Asian-Pacific Islander", "$1,080.09", "18956.71657", "$1.02", "4%"],
  ["RI", "Hispanic/Latino", "$673.14", "74596.18851", "$0.64", "14%"],
  ["RI", "Multiracial", "$971.89", "8883.049171", "$0.92", "2%"],
];

export let data = new Map<string, string[][]>();

data.set("way", CSVEx1v);
data.set("fire", TestFile);
data.set("ex2", CSVEx2);
data.set("noheader", CSVEx3);
data.set("stars", starCSV);
data.set("earnings", earningCSV);
data.set("empty", emptyCSV);
data.set("col", CSVcol);

export let searchdata = new Map<string, string[][]>(); //tuples didn't work
searchdata.set("1want", search1);
searchdata.set("2it", search1);
searchdata.set("classsecond", search2);
searchdata.set("1second", search2);
searchdata.set("positionleft", search3);
searchdata.set("2left", search3);
searchdata.set("0Kevin", search4);
searchdata.set("ProperNameSol", search5);
searchdata.set("1Sol", search5);
searchdata.set("StateRI", search6);
searchdata.set("0RI", search6);
