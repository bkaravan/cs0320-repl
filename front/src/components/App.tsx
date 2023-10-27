import "../styles/App.css";
import { useEffect } from "react";
import REPL from "./REPL";

/**
 * This is the highest level component!
 */

function App() {
  // tracking key pressing for zooming
  useEffect(() => {
    const detectKeyDown = (e: { key: string }) => {
      //if someone is pressing down shift, we are zooming in
      if (e.key === "CapsLock") {
        console.log("CapsLock is pressed. Calling zoom-in function...");
        document.body.style.fontSize = `${
          parseInt(getComputedStyle(document.body).fontSize) + 2
        }px`;
        // if someone is pressing down control, we are zooming out
      } else if (e.key === "Control") {
        console.log("Ctrl key pressed. Calling zoom-out function...");
        document.body.style.fontSize = `${
          parseInt(getComputedStyle(document.body).fontSize) - 2
        }px`;
      }
    };

    document.addEventListener("keydown", detectKeyDown, true);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("keydown", detectKeyDown, true);
    };
  }, []);

  return (
    <div className="App">
      <p className="App-header">
        <h1>REPL</h1>
      </p>
      <REPL />
    </div>
  );
}

export default App;
