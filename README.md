# REPL

This is the REPL Project for Sprint 4. CS32 at Brown University.

### _Completed by Julia Stepanenko (ystepane) and Bohdan Karavan (bkaravan)._

The project took about _*30 hours*_ to complete. \
\
Github https://github.com/cs0320-f23/repl-bkaravan-ystepane!

## About

This project is a web application that combines front- and back-end developement. It allows to load, view, and search CSV data using a command-prompt interface. Additionally, it allows the lookup of a broadband number by calling an ACS API. The application uses HTML and CSS to create the interface, and TypeScript with React to organize components and process events. Back end uses Java to run a local server, from which data is retrieved. The application also supports switching between 'brief' and 'verbose' output modes, and loading different CSV files, as well as viewing and searching them.
REPL can use both mock data and real data. To switch the mode of opeartion, the user would need to input the "mock" command to the command prompt.

## Program Design

We divided our project into two main folders: `front` and `back`. The `front` folder contains the front end code written in React and TypeScript. The `back` folder contains the back end code written in Java.

The web application consists of two main components: the front end and the back end. The front end is built with React and TypeScript, and it provides the user interface for creating and displaying data visualizations. The back-end uses Java, where the Main class runs the server using Spark. Its main functionality is split across various handlers that cover different endpoints.

The user can load their own CSV file, if it has a relative path in the backend directory. Upon loading, the user can either view the whole CSV file, or prompt search to look for specific values in that file. All of these commands can be done in brief mode, where the the user will only see the output of their commands, or verbose mode, where every input would be echoed to the user. By using a broadband query, followed by a state and a county, a user is able to get broadband data for that county. Lastly, by using the mock command, the user can switch between operating on mock data (thus not relying on the backend), or fetching data from the local server.

### Commands

There are six commands that can be used: `mode`, `load_file`, `view`, `search`, `broadband`, and `mock`
The project uses React as a framework for creating reusable components and managing state. The main components are:

• `App`: The root component that renders the whole app.

• `REPLHistory`: The component that displays the history of commands, which are rendered as tables, and results in a scrollable area.

• `CommandPrompt`: The component that handles the correct shape of user's input

• `commands`: The component that keeps track different types of output depending on the command (e.g., text, table, error), stores it, and gets mapped onto the website.

• `mode`: The component that allows switching between 'brief' and 'verbose' output modes.

- Program starts with in brief mode
- when `mode` is inputted, the mode switches
- old output does not change when the `mode` is switched

• `view`: a command that allows to view the current loaded file

• `load_file`: a command that allows to load a file from the backend to the webpage

• `search`: a command that allows to search for a specific row or rows withing the loaded file

• `broadband`: a command that is followed by a state and a county and provides the bb data for that specific place

• `mock`: a command that can switch the app between using real API data and mock data

The project uses TypeScript as a superset of JavaScript that adds static type checking and other features. TypeScript helps to catch errors at compile time and improve code quality. The project follows strict type checking rules and avoids type casting.

The project uses CSS to style the components and create a command-prompt interface that resembles a terminal. The project uses CSS variables to define colors and fonts, and CSS grid to layout the components.

`History`

In order to keep track of history and make it scrollable, a function makes a new html table element with the given text for every entry.

- when the input button is clicked, the code processes the input, and maps the appropriate table within the history component

`commandString`

- when the user keypresses, the string appears in the commandString value, which we later split
- after the user clicks submit, the Input value is reset to an empty string

`Response messages`

- After entering any command, the user should see various messages to support the command.

- If the operation was a success, the user will see a success message depending on the command

- When an operation fails, the user should see an informative error message, which will either prompt to enter a correct number of arguments, and mention that some commands can't be run before the others.

### Accessibility

To accomadate REPL to be more user-friendly, small features were implemented to supprt its accessability. For example, there are additional aria-labels for the screen-reader to work with. Also, every item in the history has a tabindex, which also allows the screen reader to read the history. Lastly, CapsLock key serves as a shortcut to zoom in the webpage, and Control on either side can serve as a zoom out shortcut.

## Testing Suites

The test suit has been created to check the functionality of the tool.

The project uses Playwright to write automated tests for the behavior of the front-end web app. The tests cover different shapes of commands and results, as well as different reachable states of the application.

To find integration testing, navigate to App.spec.ts, where there is a comprehensive test suit for every interaction that the front end can have with the backend.

For the mock and unit testing, navigate to mockTests.spec.ts, where the frontend uses specifically mocked data and does not depend on the backend server.

Note: we attempted to write pure unit tests with Jest, but it was challenging to setup. We tried for a few hours to change the config and to configure it, but decided to move on to very extensive integration and mock/unit testing instead.

## Using the Project

Initially, the webpage is loaded and it awaits a command to be inputted.
To do this, press `npm start` and go to `localhost:8000`.
This makes testing from the browser easier, since the parameters can be entered directly there. For the commands to run without the mock command, the user would also need to navigate to the Main class in back/src, where they would need to start the Server.
Here are the examples of how to use the page:

`Mode`:
To switch the mode, enter `mode` with no other arguments and await for the message confirming the mode you switched to.

`Load`:
To load a file, enter `load_file <filepath>` and await for a message to be printed. If your file is valid, it will be loaded, if not -- you will get an error message. Only 2 arguments are allowed here.

`View`:
To view the file, a valid file needs to be loaded. Enter `view` with no other arguments. The file you loaded will be printed or the error appropriate message will be displayed.

`Search`:
To search in the file, a valid file needs to be loaded. Enter `search <column/index> <keyword>`. Only 3 arguments are allowed. The search result will be displayed or an appropriate error will be printed.

`broadband`:
To look for a State and a county, nothing needs to be loaded. Just enter `broadband <state> <county>`. Only 3 arguments are allowed. Not complete search is allowed: this means that a user may input "Rhode" as state and "Rhode Island" will be found.

`reload`:
`reload` endpoint was implemented in order to support for clearing the storage and better testing. It doesn't contain any inputs and serves as an endpoint for back end.

## Building tests

Appropriate Playwright tests for the behavior of the front end web app were written.

Different shapes of command and result were tested.
From different reachable states, tests were performed.

To run the tests, we used the GearUp guide and worked with Playwright.
To build and run a test, input `npx playwright test` which runs tests headless (does not open the browser) in the background. You can also use `npx playwright show-report` which gives more detailed information on test progression.

`npx playwright test --ui` opens a UI to explore what the web app looks like as the test is occurring. There, a user can navigate between App.spec.ts and mockTests.spec.ts, where the two main testing suits are located.

## Some usage notes:

The webpage might look different on different devices (colors may differ, fonts, etc)

## Bugs

Some tests might fail once executed simultaneously but they do work when executed one by one later.

Another implementation bug is if the user wants to input any of the arguments as a two-word (or more) argument, they would have to use %20 instead of the spacebar in order for the arguments not to get parsed in a wrong way.

## Sources / Credits

- GearUp, Mock and Server code served as source codes for this project.
- StackOverflow and ChatGPT generated code was used to figure out some frameworks and set up details.
- We also visited the Collab Section with Patrick and Josh to figure out the testing.

#### Thank you for using this tool, hope it helps you find things faster and more conviniently!
