import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { Web3ReactProvider } from "@web3-react/core";
import { AppProvider } from "./web3";
import { getLibrary } from "./web3/connectors";

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <AppProvider>
      <App />
    </AppProvider>
  </Web3ReactProvider>,
  document.getElementById("root")
);
