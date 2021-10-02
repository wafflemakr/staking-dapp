import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { Web3Provider } from "@ethersproject/providers";

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
  1: process.env.REACT_APP_RPC_URL_1,
  137: process.env.REACT_APP_RPC_URL_137,
};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 137],
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 137: RPC_URLS[137] },
  qrcode: true,
});

export const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};

const ConnectorNames = {
  Injected: "Injected",
  WalletConnect: "WalletConnect",
};

export const connectorsByName = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
};
