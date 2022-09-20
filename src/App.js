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
    id: 56,
    name: "BSC",
    network: "BSC",
    iconUrl: "https://user-images.githubusercontent.com/12424618/54043975-b6cdb800-4182-11e9-83bd-0cd2eb757c6e.png",
    iconBackground: "#fff",
    nativeCurrency: {
      decimals: 18,
      name: "Binance Smart Chain",
      symbol: "BNB",
    },
    rpcUrls: {
      default: "https://bsc-dataseed.binance.org/",
    },
    blockExplorers: {
      default: { name: "bscScan", url: "https://bscscan.com" },
      etherscan: { name: "bscScan", url: "https://bscscan.com" },
    },
    testnet: false,
  };


  const { chains, provider } = configureChains(
    [BSCchain, chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
    [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "NOE",
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
