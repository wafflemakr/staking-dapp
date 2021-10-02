import React, {
  useState,
  useReducer,
  useEffect,
  useCallback,
  createContext,
} from "react";

import { Web3Reducer } from "./reducer";

import { ERC20_ABI, DAI_ADDRESS } from "./constants";

import notify from "../utils/notify";

import history from "../history";

import { useWeb3React } from "@web3-react/core";

import { connectorsByName } from "./connectors";

const initialState = {
  contracts: {
    token: null,
  },
};

export const AppContext = createContext(initialState);

export const AppProvider = ({ children }) => {
  const { connector, chainId, account, activate, deactivate, library } =
    useWeb3React();

  console.log(library);

  const [activatingConnector, setActivatingConnector] = useState();

  const [state, dispatch] = useReducer(Web3Reducer, initialState);

  const { contracts } = state;

  // STATE MANAGEMENT
  const setContracts = (contracts) => {
    dispatch({
      type: "SET_CONTRACTS",
      payload: contracts,
    });
  };

  // const setProtocol = async () => {
  //   console.log(library.provider);
  //   // Contract Instances
  //   window.token = new library.provider.Contract(ERC20_ABI, DAI_ADDRESS);
  //   setContracts({
  //     token: window.token,
  //   });
  // };

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
    if (account) {
      console.log("Account connected", account);
      // setProtocol();
      library.getBalance(account).then(console.log);
    }
  }, [account]);

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
