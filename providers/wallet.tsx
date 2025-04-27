import React from "react";

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_LABS_ENVIRONMENT_ID!,
        walletConnectors: [SolanaWalletConnectors],
      }}
    >
      {children}
      <DynamicWidget />
    </DynamicContextProvider>
  );
}
