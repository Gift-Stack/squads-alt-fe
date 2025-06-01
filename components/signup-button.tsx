"use client";

import React, { useRef } from "react";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";
import { cn, shortenAddress } from "@/lib/utils";

const SignupButton = ({
  children,
  className,
  onAfterConnectionClick,
}: {
  children?: React.ReactNode;
  className?: string;
  onAfterConnectionClick?: () => void;
}) => {
  const walletConnectRef = useRef<HTMLSpanElement>(null);
  const { primaryWallet } = useDynamicContext();

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "text-white bg-transparent border-zinc-700 hover:bg-zinc-800",
          className
        )}
        onClick={(e) => {
          if (primaryWallet) {
            onAfterConnectionClick?.();
            return;
          }
          walletConnectRef.current?.click();
        }}
      >
        {children ??
          (primaryWallet ? (
            <>{shortenAddress(primaryWallet.address)}</>
          ) : (
            <>
              Connect <Wallet className="ml-2 h-4 w-4" />
            </>
          ))}
      </Button>

      <span className="sr-only">
        <DynamicWidget innerButtonComponent={<span ref={walletConnectRef} />} />
      </span>
    </>
  );
};

export default SignupButton;
