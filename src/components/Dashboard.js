import React, { useContext } from "react";
import { AppContext } from "../web3";

export default function Dashboard() {
  const { balances } = useContext(AppContext);

  return (
    <div className="app-container">
      <h1 className="text-center mt-5">User Dashboard</h1>
      <p>ETH Balance: {balances.ETH}</p>
      <p>DAI Balance: {balances.DAI}</p>
    </div>
  );
}
