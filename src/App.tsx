import { useEffect, useState } from "react";
import "./App.css";

const initialState = new Array(100000).fill(0);

function App() {
  const [state, setState] = useState(initialState);
  const [currentPos, setCurrentPost] = useState(0);

  const moveRight = () => {
    setCurrentPost((prev) => prev + 1);
  };

  useEffect(() => {
    const keyDownListener = (e) => {
      if (e.keyCode === 39) {
        // arrow right
        moveRight();
      }
    };

    window.addEventListener("keydown", keyDownListener);

    return () => window.removeEventListener("keydown", keyDownListener);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        overflow: "wrap",
        width: "100vw",
        flexWrap: "wrap",
      }}
    >
      {state.map((item, i) => (
        <div
          style={{
            border: "1px solid black",
            height: "26px",
            width: "26px",
            backgroundColor: currentPos === i ? "red" : "white",
          }}
          key={i}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export default App;
