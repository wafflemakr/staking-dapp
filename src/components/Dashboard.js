import React, { useContext } from "react";
import { AppContext } from "../web3";
import { Button } from "react-bootstrap";

export default function Dashboard() {
  const { balances, signPermit } = useContext(AppContext);

  return (
    <div className="app-container">
      <h1 className="text-center mt-5">User Dashboard</h1>
      {balances && (
        <div className="mt-5">
          <p>MATIC Balance: {balances.ETH}</p>
          <p>LP Balance: {balances.LP}</p>
          <Button onClick={signPermit}>{`Sign & Stake`}</Button>
        </div>
      )}
    </div>
  );
}
