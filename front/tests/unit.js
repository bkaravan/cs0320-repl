// // Assume your imports are properly configured
// import { loadHandler } from "../src/components/REPLFunction";

// // Mock the fetch function
// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({ filepath: "data/stars/ten-star.csv" }),
//   })
// );

// describe("loadHandler", () => {
//   test("returns the correct output when a valid file is loaded", async () => {
//     const args = ["data/stars/ten-star.csv"];
//     const result = await loadHandler(args);
//     expect(result).toEqual(["data/stars/ten-star.csv", []]);

//     // Ensure fetch was called with the correct URL
//     expect(fetch).toHaveBeenCalledWith(
//       "http://localhost:2020/loadcsv?filepath=data/stars/ten-star.csv"
//     );
//   });

//   test("returns an error message when an invalid file is loaded", async () => {
//     // Mocking fetch to return an invalid response
//     global.fetch.mockReturnValueOnce(
//       Promise.resolve({
//         json: () => Promise.resolve({ error: "File not found" }),
//       })
//     );

//     const args = ["nonexistent.csv"];
//     const result = await loadHandler(args);
//     expect(result).toEqual(["Could not find file nonexistent.csv", []]);

//     // Ensure fetch was called with the correct URL
//     expect(fetch).toHaveBeenCalledWith(
//       "http://localhost:2020/loadcsv?filepath=nonexistent.csv"
//     );
//   });
// });
