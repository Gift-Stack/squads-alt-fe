"use client";
import { useRouter } from "next/navigation";
import SignupButton from "./signup-button";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ArrowRight } from "lucide-react";

export default function SignupButtonWithRouter() {
  const { primaryWallet } = useDynamicContext();
  const router = useRouter();

  return (
    <SignupButton
      className="bg-white text-black hover:bg-zinc-200 px-6 py-6 text-lg rounded-md"
      onAfterConnectionClick={() => {
        router.push("/dashboard");
      }}
    >
      {primaryWallet ? (
        <div className="flex items-center gap-2 text-sm">
          <span>Go to dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      ) : undefined}
    </SignupButton>
  );
}
