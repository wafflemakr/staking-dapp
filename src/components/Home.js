import React, { useContext } from "react";
import { Container, Jumbotron, Image, Button } from "react-bootstrap";

import { AppContext } from "../web3";
import { useWeb3React } from "@web3-react/core";

export default function Home() {
  const { connectWeb3 } = useContext(AppContext);
  const { account } = useWeb3React();

  return (
    <div className="app-container h-100">
      <Jumbotron className="home-page mt-5">
        {account ? (
          <h3>Connected!</h3>
        ) : (
          <Container className="text-center">
            <Button
              className="mr-3"
              variant="outline-warning"
              onClick={() => connectWeb3("Injected")}
            >
              Metamask
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => connectWeb3("WalletConnect")}
            >
              WalletConnect
            </Button>
          </Container>
        )}
      </Jumbotron>
    </div>
  );
}
