import React, { FC, useEffect } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { useRouter } from "next/navigation";
import { clusterApiUrl } from "@solana/web3.js";
import mitt, { type Emitter } from "mitt";
import { DynamicSolanaProvider } from "./DynamicSolanaProvider";

const endpoint =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("mainnet-beta");

type WalletEvents = {
  connect: string;
  disconnect: unknown;
};

export const emitter: Emitter<WalletEvents> = mitt<WalletEvents>();

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_LABS_ENVIRONMENT_ID!,
        walletConnectors: [SolanaWalletConnectors],

        events: {
          // onLogout: () => {
          //   router.push("/");
          // },
        },
      }}
    >
      <ConnectionProvider endpoint={endpoint}>
        <SolanaWalletProvider wallets={[]} autoConnect>
          <DynamicSolanaProvider>{children}</DynamicSolanaProvider>
          <SolanaDynamicHandler />
        </SolanaWalletProvider>
      </ConnectionProvider>
    </DynamicContextProvider>
  );
}

type WalletName<T extends string = string> = T & {
  __brand__: "WalletName";
};

export const SolanaDynamicHandler: FC = () => {
  const { disconnect, select } = useWallet();
  useEffect(() => {
    emitter.on("connect", async (connectorName) => {
      select(connectorName as WalletName);
    });
    emitter.on("disconnect", async () => {
      await disconnect();
    });
    return () => emitter.all.clear();
  }, [disconnect, select]);
  return null;
};
