import React, { useRef } from "react";

import "./main.css";

const App = () => {
  const canvasRef = useRef(null);
  const canvasObj = canvasRef.current;
  const ctx = canvasObj.getContext("2d");
  console.log(ctx);
  return (
    <>
      <canvas class="wrapeer" id="tutorial"></canvas>
    </>
  );
};

export default App;
