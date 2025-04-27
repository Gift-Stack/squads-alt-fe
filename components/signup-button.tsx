"use client";

import React, { useRef } from "react";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { cn, shortenAddress } from "@/lib/utils";
import { useRouter } from "next/navigation";

const SignupButton = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const walletConnectRef = useRef<HTMLSpanElement>(null);
  const { primaryWallet } = useDynamicContext();
  const router = useRouter();

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
            router.push("/dashboard");
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
              Get started <ArrowRight className="ml-2 h-4 w-4" />
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
