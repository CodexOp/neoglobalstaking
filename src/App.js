import { useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import "@rainbow-me/rainbowkit/dist/index.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { darkTheme } from "@rainbow-me/rainbowkit";
import Staking from "./components/Staking";

function App() {

  const BSCchain = {
    id: 97,
    name: "BSC test",
    network: "BSC test",
    iconUrl: "https://www.logo.wine/a/logo/Binance/Binance-Icon-Logo.wine.svg",
    iconBackground: "#fff",
    nativeCurrency: {
      decimals: 18,
      name: "Binance Smart Chain",
      symbol: "BNB",
    },
    rpcUrls: {
      default: "https://bsctestapi.terminet.io/rpc",
    },
    blockExplorers: {
      default: { name: "SnowTrace", url: "https://bscscan.com" },
      etherscan: { name: "SnowTrace", url: "https://bscscan.com" },
    },
    testnet: false,
  };

  const Avaxchain = {
    id: 43114,
    name: "Avalanche Network",
    network: "Avalanche Network",
    iconUrl: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
    iconBackground: "#fff",
    nativeCurrency: {
      decimals: 18,
      name: "Avalanche",
      symbol: "AVAX",
    },
    rpcUrls: {
      default: "https://rpc.ankr.com/avalanche",
    },
    blockExplorers: {
      default: { name: "SnowTrace", url: "https://snowtrace.io/" },
      etherscan: { name: "SnowTrace", url: "https://snowtrace.io/" },
    },
    testnet: false,
  };

  const { chains, provider } = configureChains(
    [Avaxchain, BSCchain, chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
    [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "baby-cracken",
    chains,
  });
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme({ borderRadius: "medium" })}
      >
        <Staking />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
