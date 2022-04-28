import React from "react";
import { Switch, Router, Route, Redirect } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import history from "./history";

// COMPONENTS
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

export default function App() {
  const { account } = useWeb3React();

  return (
    <>
      <Router history={history}>
        <Header />
        {account && (
          <Route path="/" exact>
            <Dashboard />
          </Route>
        )}
      </Router>
    </>
  );
}
