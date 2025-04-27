"use client";

import React from "react";
import WalletProvider from "./wallet";
import TanstackQueryProvider from "./tanstack-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TanstackQueryProvider>
      <WalletProvider>{children}</WalletProvider>
    </TanstackQueryProvider>
  );
}
