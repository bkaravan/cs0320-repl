# REPL

This is the REPL Project for Sprint 4. CS32 at Brown University.

### _Completed by Julia Stepanenko (ystepane) and Bohdan Karavan (bkaravan)._

The project took about _*30 hours*_ to complete. \
\
Github https://github.com/cs0320-f23/repl-bkaravan-ystepane!

## About

This project is a web application that combines front- and back-end developement. It allows to load, view, and search CSV data using a command-prompt interface. The application uses HTML and CSS to create the interface, and TypeScript with React to organize components and process events. Back end uses Java. The application also supports switching between 'brief' and 'verbose' output modes, and loading different CSV files, as well as viewing and searching them.
The project uses mock data.

## Program Design

We divided our project into two main folders: `front` and `back`. The `front` folder contains the front end code written in React and TypeScript. The `back` folder contains the back end code written in Java.

The web application consists of two main components: the front end and the back end. The front end is built with React and TypeScript, and it provides the user interface for creating and displaying data visualizations. The back end is built with Flask and Python, and it handles the data processing and storage using MongoDB. The web application also integrates with external APIs such as Google Maps, OpenWeather, and Spotify to enrich the data sources and visualizations.

The user can upload their own data files in CSV or JSON format, or select from the available data sources provided by the external APIs. The user can also add interactive elements such as buttons, sliders, dropdowns, etc. to control the data and visualizations. The user can preview their project at any time, and save it to their dashboard. The user can also share their project with others by generating a unique URL or embedding it in another website.

There are four commands that can be used: `mode`, `load_file`, `view`, `search`.
The project uses React as a framework for creating reusable components and managing state. The main components are:

• `App`: The root component that renders the whole app.

• `REPLHistory`: The component that displays the history of commands and results in a scrollable area.

• `CommandPrompt`: The component that handles user input and displays a prompt symbol.

• `commands`: The component that keeps track different types of output depending on the command (e.g., text, table, error), stores it, and gets mapped onto the website.

• `mode`: The component that allows switching between 'brief' and 'verbose' output modes.

- Program starts with in brief mode
- when `mode` is inputted, the mode switches
- old output does not change when the `mode` is switched

• `view`: a command that allows to view the current loaded file

• `load_file`: a command that allows to load a file from the backend to the webpage

• `search`: a command that allows to search for a specific row withing the loaded file

The project uses TypeScript as a superset of JavaScript that adds static type checking and other features. TypeScript helps to catch errors at compile time and improve code quality. The project follows strict type checking rules and avoids type casting.

The project uses CSS to style the components and create a command-prompt interface that resembles a terminal. The project uses CSS variables to define colors and fonts, and CSS grid to layout the components.

`History`

In order to keep track of history and make it scrollable, a function makes a new html table element with the given text for every entry.

- when the input button is clicked, history appears with the appropriate message.

`commandString`

- when the user keypresses, the string appears in the commandString value, which we later split
- after the user clicks submit, the Input value is reset to an empty string

`Response messages`

- After entering load_file <file path>, loadedCSV is updated to match the contents of the file path

- Success message is printed.

- When the file path is not valid, an appropriate error message is printed.

- When an incorrect number of arguments is provided for any command, an appropriate error message is printed.

## Testing Suites `MockData`

The test suit has been created to check the functionality of the tool.

The project uses Playwright to write automated tests for the behavior of the front-end web app. The tests cover different shapes of commands and results, as well as different reachable states of the application.

The tests use mocked data and results to verify that the app displays the correct output for each command.

To mock loading functionality, we used a dictionary that maps “file paths” to the corresponding mock CSV data. This allows us to quickly retrieve CSV data when needed, as if it was being loaded from a file path.

## Using the Project

Initially, the webpage is loaded and it awawits a command to be inputted.
To do this, press `npm start` and go to `localhost:8000`.
This makes testing from the browser easier, since the parameters can be entered directly there.
Here are the examples of how to use the page:

`Mode`:
To switch the mode, enter `mode` with no other arguments and await for the message confirming the mode you switched to.

`Load`:
To load a file, enter `load_file <filepath>` and await for a message to be printed. If your file is valid, it will be loaded, if not -- you will get an error message. Only 2 arguments are allowed here.

`View`:
To view the file, a valid file needs to be loaded. Enter `view` with no other arguments. The file you loaded will be printed or the error appropriate message will be displayed.

`Search`:
To search in the file, a valid file needs to be loaded. Enter `search <column/index> <keyword>`. Only 3 arguments are allowed. The search result will be displayed or an appropriate error will be printed.

## Building tests

Appropriate Playwright tests for the behavior of the front end web app were written.

Different shapes of command and result were tested.
From different reachable states, tests were performed.

To run the tests, we used the GearUp guide and worked with Playwright.
To build and run a test, input `npx playwright test` which runs tests headless (does not open the browser) in the background. You can also use `npx playwright show-report` which gives more detailed information on test progression.

`npx playwright test --ui` opens a UI to explore what the web app looks like as the test is occurring.

## Some usage notes:

- The webpage might look different on different devices (colors may differ, fonts, etc)
- For this project, the user can only load the data that has already been predetermined since we are using exclusively mock data.

## Bugs

At the moments, there are no bugs in this code.

## Sources / Credits

- GearUp code served as source code for this project.
- StackOverflow and ChatGPT generated code was used to figure out some frameworks and set up details.
- We also visited the Collab Section with Partic and Molly to figure out the testing in the basic-example.spec.ts

#### Thank you for using this tool, hope it helps you find things faster and more conviniently!
