import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Nav, Image } from "react-bootstrap";

import { useWeb3React } from "@web3-react/core";
import { AppContext } from "../web3";
import { RPC_EXPLORERS } from "../web3/constants";

export default function Header() {
  const { logout, connectWeb3 } = useContext(AppContext);
  const { account, chainId, connector } = useWeb3React();

  return (
    <Container fluid>
      <Row className="header-container border-bottom ">
        <Col sm="3">
          <div className="w-25">
            <Image
              style={{ maxHeight: "60px" }}
              id="logo-image"
              src="https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg"
              alt="eth-logo"
            />
          </div>
        </Col>
        <Col sm="4">
          <Nav activeKey="/">
            <Nav.Item className="mr-4">
              <Link to="/">Dashboard</Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col>
          {account ? (
            <Row>
              <Col sm="4" className="align-self-center">
                <h6>
                  Account:{" "}
                  <a
                    href={`${RPC_EXPLORERS[chainId]}/address/${account}`}
                    target="_blank"
                    rel="noreferrer"
                    className="account-link"
                  >
                    {account.substring(0, 4) +
                      "..." +
                      account.substring(38, 42)}
                  </a>
                </h6>
              </Col>

              <Col sm="4" className="align-self-center">
                <h6>Chain Id: {chainId}</h6>
              </Col>

              <Col>
                <Button
                  className="rounded-pill"
                  variant="outline-secondary"
                  onClick={logout}
                >
                  Logout
                </Button>
              </Col>
            </Row>
          ) : (
            <Button
              className="rounded-pill"
              variant="outline-secondary"
              onClick={() => connectWeb3("Injected")}
            >
              Login
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}
