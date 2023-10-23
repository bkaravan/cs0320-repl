import { test, expect } from "@playwright/test";

/**
  The general shapes of tests in Playwright Test are:
    1. Navigate to a URL
    2. Interact with the page
    3. Assert something about the page against your expectations
  Look for this pattern in the tests below!
 */

// If you needed to do something before every test case...
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000/");
  // ... you'd put it here.
  // TODO: Is there something we need to do before every test case to avoid repeating code?
});

/**
 * Don't worry about the "async" yet. We'll cover it in more detail
 * for the next sprint. For now, just think about "await" as something
 * you put before parts of your test that might take time to run,
 * like any interaction with the page.
 */
test("on page load, i see an input bar", async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await expect(page.getByLabel("Command input")).toBeVisible();
});
/**
 * This is a given test, it checks that the input in the box changes.
 */
test("after I type into the input box, its text changes", async ({ page }) => {
  // Step 1: Navigate to a URL

  // Step 2: Interact with the page
  // Locate the element you are looking for
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("Awesome command");

  // Step 3: Assert something about the page
  // Assertions are done by using the expect() function
  const mock_input = `Awesome command`;
  await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
});
/**
 * This test checks that the button is visible.
 */
test("on page load, i see a button", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Submitted 0 times" })
  ).toBeVisible();
});
/**
 * This test checks that the button changes the
 * times it has been submitted based on the clicks.
 */
test("after I click the button, its label increments", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Submitted 0 times" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  await page.getByRole("button", { name: "Submitted 3 times" }).click();
  await expect(
    page.getByRole("button", { name: "Submitted 4 times" })
  ).toBeVisible();
});

/**
 * This test checks that the "Mock" title is visible and is on the page.
 */
test("has title", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Mock/);
});
/**
 * This test checks that an empty submit results in an error.
 */
test("supports empty submit", async ({ page }) => {
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:Error:badcommand.isnotarealcommand" })
  ).toBeVisible();
});
/**
 *This test checks that mode switching is working.
 */
test("supports mode switching", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Modeswitchedtoverbose" })
  ).toBeVisible();
});

/**
 * This test checks that multiple switching of modes is supported.
 */
test("multiple submits", async ({ page }) => {
  //first submit
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Modeswitchedtoverbose" })
  ).toBeVisible();
  // second submit
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Modeswitchedtobrief" })
  ).toBeVisible();
});
/**
 * This test checks that loading an invalid file results in an error.
 */
// loading the invalid file
test("failing invalid load", async ({ page }) => {
  //first submit
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file badfile");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Couldnotfindbadfile" })
  ).toBeVisible();
});
/**
 * This tests checks that loading a valid file results in successful loading.
 */
// loading a good file
test("good single load", async ({ page }) => {
  //first submit
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file way");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:load_fileofwaysuccessful!" })
  ).toBeVisible();
});
/**
 * This test checks that when loading two valid files in a row, both give sucessfull outputs.
 */
// loading twice
test("double load", async ({ page }) => {
  //first submit
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file way");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:load_fileofwaysuccessful!" })
  ).toBeVisible();
  // second load
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file fire");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:load_fileoffiresuccessful!" })
  ).toBeVisible();
});
// loading one good and one bad file

/**
 * This test checks that a double load with an invalid second file results in an error being produced.
 */
test("double invalid load", async ({ page }) => {
  //first submit
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file way");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:load_fileofwaysuccessful!" })
  ).toBeVisible();
  // second load
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file badfile");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Couldnotfindbadfile" })
  ).toBeVisible();
});
/**
 * This test checks that view without load results in an error.
 */
// view without load
test("failing invalid view", async ({ page }) => {
  //first submit
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Error:nofileswereloaded." })
  ).toBeVisible();
});
// view with a good load
/**
 * This test checks that a view of a valid file is possible.
 */
test("good view", async ({ page }) => {
  //load
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file way");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:load_fileofwaysuccessful!" })
  ).toBeVisible();
  //view
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Successfulview!" })
  ).toBeVisible();
  await expect(
    page.locator("table").filter({ hasText: "12345" })
  ).toBeVisible();
  await expect(
    page.locator("table").filter({ hasText: "Iwantitthatway" })
  ).toBeVisible();
});
// view with a bad load
/**
 * This test checks that a view with a bad file loaded fails.
 */
test("failing view with bad load", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file badfile");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Couldnotfindbadfile" })
  ).toBeVisible(); //first submit
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Error:nofileswereloaded." })
  ).toBeVisible();
});
// view with >1 arg
/**
 * This test checks that the program doesn't support viewing with an invlaid
 * number of arugments.
 */
test("failing view with many args", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file badfile");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Couldnotfindbadfile" })
  ).toBeVisible(); //first submit
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view file");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(
    page.locator("table").filter({
      hasText: "Output:Error:viewonlytakesin1argument.Takecs32again!",
    })
  ).toBeVisible();
});
// view with two good loads & view twice diff things
/**
 * This test checks that it is possible to load and vieew, and then load and view again,
 * but with two different things.
 */
test("good view twice", async ({ page }) => {
  //load
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file way");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:load_fileofwaysuccessful!" })
  ).toBeVisible();
  //view
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:Successfulview!12345Iwantitthatway" })
  ).toBeVisible();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file noheader");
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:load_fileofnoheadersuccessful!" })
  ).toBeVisible();
  //view
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submitted 3 times" }).click();
  await expect(
    page.locator("table").filter({
      hasText: "Output:Successfulview!KevinCIT32JoeMetCalf330CarlaBarus32",
    })
  ).toBeVisible();
});
/**
 * This test checks that a view with a first bad load and a second valid load.
 * The output prints the valid file.
 */
// view with a bad and a good load
test("view with bad and good load", async ({ page }) => {
  //first submit
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file badfile");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Couldnotfindbadfile" })
  ).toBeVisible();
  // second load
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file noheader");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:load_fileofnoheadersuccessful!" })
  ).toBeVisible();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  await expect(
    page.locator("table").filter({
      hasText: "Output:Successfulview!KevinCIT32JoeMetCalf330CarlaBarus32",
    })
  ).toBeVisible();
});
// search without load
/**
 * This test checks that a view without a previous load -- fails.
 */
test("fails search without load & bad input", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 1second");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:Error:searchneedsthreeargs" })
  ).toBeVisible();
});
/**
 * This test checks that a search without load and with bad arguments -- fails.
 */
test("fails search without load & bad args", async ({ page }) => {
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 1 second");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:Error:searchrequiresaload" })
  ).toBeVisible();
});
// search with view and load
/**
 * This test checks that a valid search fully works with load and view.
 */
test("valid search with view and load", async ({ page }) => {
  //load
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file way");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:load_fileofwaysuccessful!" })
  ).toBeVisible();
  //view
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:Successfulview!12345Iwantitthatway" })
  ).toBeVisible();
  // search
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 1 want");
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:Searching!:)Iwantitthatway" })
  ).toBeVisible();
});
// search with load
/**
 * This test checks that search works while searching without viewing first.
 */
test("valid index search with load", async ({ page }) => {
  //load
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file way");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:load_fileofwaysuccessful!" })
  ).toBeVisible();
  // search
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 1 want");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:Searching!:)Iwantitthatway" })
  ).toBeVisible();
});

/**
 * Test that shows that a bad search shows an error not found
 */
test("failed bad search with load", async ({ page }) => {
  //load an existing file
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file way");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:load_fileofwaysuccessful!" })
  ).toBeVisible();
  // search an invalid input
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search bad input");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  // expect to see error and show the arguments
  await expect(
    page.locator("table").filter({
      hasText: "Output:Searching!:)",
    })
  ).toBeVisible();
  await expect(
    page.locator("tr").filter({
      hasText: "Error: searchfailed. Keywordnot found.",
    })
  ).toBeVisible();
  await expect(
    page.locator("tr").filter({
      hasText: "Argsbadinput",
    })
  ).toBeVisible();
});
/**
 * Test that shows an error when searching with too many arguments
 */
test("failed bad search too many args", async ({ page }) => {
  //load an existing file
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file way");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:load_fileofwaysuccessful!" })
  ).toBeVisible();
  // search with more than two key inputs
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search bad input long");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  // expect an error
  await expect(
    page.locator("table").filter({
      hasText: "Output:Error:searchneedsthreeargs",
    })
  ).toBeVisible();
});

/**
 * Testing an error message when only one argument is provided for search
 */
test("failed bad search not enough args", async ({ page }) => {
  // load a proper file
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file way");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:load_fileofwaysuccessful!" })
  ).toBeVisible();
  // search only one argument
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search bad");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  // expect to see an error
  await expect(
    page.locator("table").filter({
      hasText: "Output:Error:searchneedsthreeargs",
    })
  ).toBeVisible();
});
/**
 * This test checks that when the command is not recognized, it can correctly
 * output an error message
 */
test("failed invalid command", async ({ page }) => {
  //fill the box with an unreal command
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("badcommand");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  //expect an informative error message
  await expect(
    page.locator("table").filter({
      hasText: "Output:Error:badcommand.badcommandisnotarealcommand",
    })
  ).toBeVisible();
});

/**
 * A test that shows that full functionality is supported in verbose mode
 */

test("valid search with load verbose", async ({ page }) => {
  // switch mode to verbose
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:modeswitchedtoverbose" })
  ).toBeVisible();
  // load an example file
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file ex2");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  await expect(
    page.locator("tr").filter({ hasText: "Command: load_fileex2" })
  ).toBeVisible();
  await expect(
    page.locator("tr").filter({ hasText: "Output:load_fileofex2successful!" })
  ).toBeVisible();
  // show that search is correct
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 1 second");
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  await expect(
    page.locator("tr").filter({ hasText: "jakesecondright" })
  ).toBeVisible();
  //expect view to not break
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submitted 3 times" }).click();
});

/**
 * This test shows that we can correctly switch to verbose output and then switch
 * back to brief
 */

test("brief to verbose to brief", async ({ page }) => {
  // switch mode to verbose
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:modeswitchedtoverbose" })
  ).toBeVisible();
  await page.getByLabel("Command input").click();
  // switch mode again
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  //expect both command and output
  await expect(
    page.locator("tr").filter({ hasText: "Command: mode" })
  ).toBeVisible();
  await expect(
    page.locator("tr").filter({ hasText: "Output:modeswitchedtobrief" })
  ).toBeVisible();
  // load a file and expect only an output now
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file stars");
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:load_fileofstarssuccessful!" })
  ).toBeVisible();
});

/**
 * This test checks if we can correctly upload an empty file, and show and error
 * if we view it
 */

test("view with an empty load", async ({ page }) => {
  // switch the mode for practice
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:modeswitchedtoverbose" })
  ).toBeVisible();
  //load the empty file
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file empty");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  // expect both command and output because of verbose
  await expect(
    page.locator("tr").filter({ hasText: "Command: load_fileempty" })
  ).toBeVisible();
  await expect(
    page.locator("tr").filter({ hasText: "Output:load_fileofemptysuccessful!" })
  ).toBeVisible();
  // view shows an error
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Error:nofileswereloaded" })
  ).toBeVisible();
});

/**
 * This test checks that we can correctly load and view files of weird shapes,
 * such as just having one column
 */

test("view with one column shape", async ({ page }) => {
  // switch the mode for more testing
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  // expect mode change
  await expect(
    page.locator("table").filter({ hasText: "Output:modeswitchedtoverbose" })
  ).toBeVisible();
  //load a file
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file col");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  //expect command and output because of the mode switch
  await expect(
    page.locator("tr").filter({ hasText: "Command: load_filecol" })
  ).toBeVisible();
  await expect(
    page.locator("tr").filter({ hasText: "Output:load_fileofcolsuccessful!" })
  ).toBeVisible();
  // view the file and expect to see only one value in rows
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByRole("button", { name: "Submitted 2 times" }).click();
  await expect(
    page.locator("table").filter({ hasText: "Output:Successfulview!" })
  ).toBeVisible();
  await expect(page.locator("tr").filter({ hasText: "1" })).toBeVisible();
  await expect(page.locator("tr").filter({ hasText: "2" })).toBeVisible();
});

/**
 * This test checks that we can correctly mock search with a name of the column
 * and a target
 */

test("valid name search with load", async ({ page }) => {
  //load a file
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file stars");
  await page.getByRole("button", { name: "Submitted 0 times" }).click();
  //check that it's there
  await expect(
    page
      .locator("table")
      .filter({ hasText: "Output:load_fileofstarssuccessful!" })
  ).toBeVisible();
  // search the file with a column name
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search ProperName Sol");
  await page.getByRole("button", { name: "Submitted 1 times" }).click();
  // c
  await expect(page.locator("tr").filter({ hasText: "0Sol000" })).toBeVisible();
});
