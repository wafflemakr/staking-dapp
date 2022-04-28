import React, { useState, useReducer, useEffect, createContext } from "react";
import { Web3Reducer } from "./reducer";
import {
  ERC20_ABI,
  LP_ABI,
  STAKING_ABI,
  LP_ADDRESS,
  LP_STAKING,
} from "./constants";
import notify from "../utils/notify";
import history from "../history";
import { useWeb3React } from "@web3-react/core";
import { connectorsByName } from "./connectors";
import { Contract } from "@ethersproject/contracts";
import { formatEther, parseEther } from "@ethersproject/units";

const initialState = {
  contracts: {
    token: null,
  },
  balances: null,
};

export const AppContext = createContext(initialState);

export const AppProvider = ({ children }) => {
  const { connector, chainId, account, activate, deactivate, library, error } =
    useWeb3React();

  const [activatingConnector, setActivatingConnector] = useState();

  const [state, dispatch] = useReducer(Web3Reducer, initialState);

  const { contracts, balances } = state;

  // === STATE MANAGEMENT ===
  const setContracts = (contracts) => {
    dispatch({
      type: "SET_CONTRACTS",
      payload: contracts,
    });
  };

  const setBalances = (_balances) => {
    console.log(_balances);
    dispatch({
      type: "SET_BALANCES",
      payload: _balances,
    });
  };

  const setProtocol = async () => {
    try {
      const signer = library.getSigner();

      // Contract Instances
      window.token = new Contract(LP_ADDRESS, LP_ABI, signer);

      const lpBalance = await window.token.balanceOf(account);
      const ethBalance = await library.getBalance(account);

      setContracts({
        token: window.token,
      });
      setBalances({
        LP: formatEther(lpBalance),
        ETH: formatEther(ethBalance),
      });
    } catch (error) {
      console.log(error);
      notify("error", error.message);
    }
  };

  const signPermit = async () => {
    try {
      const deadline = Math.floor(Date.now() / 1000) + 360;

      const nonce = await contracts.token.nonces(account);

      const domain = {
        name: "Uniswap V2",
        version: "1",
        chainId,
        verifyingContract: LP_ADDRESS, // DAI-USDC
      };

      const values = {
        owner: account,
        spender: LP_STAKING, // DAI-USDC QUICK STAKING
        value: parseEther(balances.LP),
        nonce: nonce,
        deadline,
      };

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const signer = library.getSigner();

      const res = await signer._signTypedData(domain, types, values);
      const signature = res.substring(2);
      const r = "0x" + signature.substring(0, 64);
      const s = "0x" + signature.substring(64, 128);
      const v = parseInt(signature.substring(128, 130), 16);

      console.log("v", v);
      console.log("r", r);
      console.log("s", s);

      const stakingContract = new Contract(LP_STAKING, STAKING_ABI, signer);

      await stakingContract.stakeWithPermit(
        parseEther(balances.LP),
        deadline,
        v,
        r,
        s
      );
    } catch (error) {
      console.log(error);
      notify("error", error.message);
    }
  };

  // === HELPERS === //
  const logout = () => {
    dispatch({
      type: "CLEAR_STATE",
      payload: initialState,
    });
    deactivate();
    history.push("/");
  };

  // === MAIN FUNCTIONS === //
  const connectWeb3 = async (providerName) => {
    try {
      console.log("connecting", providerName);

      const _connector = connectorsByName[providerName];

      setActivatingConnector(_connector);
      activate(_connector);
    } catch (error) {
      notify("error", "Could not connect to web3!");
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (account && library) {
      console.log("Account connected", account);
      setProtocol();
    }
  }, [account, library]);

  useEffect(() => {
    if (chainId) console.log("chainId connected", chainId);
  }, [chainId]);

  useEffect(() => {
    if (error) {
      console.log("error", error);
      notify("error", error.message);
    }
  }, [error]);

  useEffect(() => {
    if (activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        connectWeb3,
        logout,
        signPermit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
