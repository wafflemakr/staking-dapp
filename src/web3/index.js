import React, { useState, useReducer, useEffect, createContext } from "react";
import { Web3Reducer } from "./reducer";
import { ERC20_ABI, DAI_ADDRESS_ETH, DAI_ADDRESS_POLY } from "./constants";
import notify from "../utils/notify";
import history from "../history";
import { useWeb3React } from "@web3-react/core";
import { connectorsByName } from "./connectors";
import { Contract } from "@ethersproject/contracts";
import { formatEther } from "@ethersproject/units";

const initialState = {
  contracts: {
    token: null,
  },
  balances: null,
};

export const AppContext = createContext(initialState);

export const AppProvider = ({ children }) => {
  const { connector, chainId, account, activate, deactivate, library } =
    useWeb3React();

  const [activatingConnector, setActivatingConnector] = useState();

  const [state, dispatch] = useReducer(Web3Reducer, initialState);

  const { contracts } = state;

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
      const tokenAddress = chainId === 1 ? DAI_ADDRESS_ETH : DAI_ADDRESS_POLY;

      const signer = library.getSigner();

      // Contract Instances
      window.token = new Contract(tokenAddress, ERC20_ABI, signer);

      const daiBalance = await window.token.balanceOf(account);
      const ethBalance = await library.getBalance(account);

      setContracts({
        token: window.token,
      });
      setBalances({
        DAI: formatEther(daiBalance),
        ETH: formatEther(ethBalance),
      });
    } catch (error) {
      console.log(error);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
