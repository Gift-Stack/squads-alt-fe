import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSquads } from "@/store/multi-sig";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Vaults = () => {
  const { primaryWallet } = useDynamicContext();
  const { data: multisigAccounts, isLoading } = useSquads({
    walletAddress: primaryWallet?.address,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {multisigAccounts?.map((vault) => (
        <Card key={vault.address} className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-3 border-b border-zinc-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {vault.metadata.name}
                </h3>
                {vault.metadata.description && (
                  <p className="text-zinc-400 text-sm">
                    {vault.metadata.description}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Balance:</p>
                <p className="text-2xl font-bold text-white">
                  {/* TODO: get balance */}
                  {/* @ts-expect-error I will be fixing this soon */}$
                  {vault.balance}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800 p-3 rounded-md">
                  <p className="text-sm text-zinc-400 mb-1">Pending:</p>
                  <p className="text-lg font-bold text-white">
                    {/* TODO: get pending transactions */}
                    {vault.account.transactionIndex}
                  </p>
                </div>
                <div className="bg-zinc-800 p-3 rounded-md">
                  <p className="text-sm text-zinc-400 mb-1">Signatures:</p>
                  <p className="text-lg font-bold text-white">
                    {vault.account.threshold}/{vault.account.members.length}
                  </p>
                </div>
              </div>
              <Link
                href={`/dashboard/squads/${vault.defaultVault}`}
                className="w-full"
              >
                <Button
                  variant="outline"
                  className="w-full gap-2 border-zinc-700 text-white hover:bg-zinc-800"
                >
                  Manage Vault <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border-dashed border-zinc-800 bg-zinc-900">
        <CardContent className="flex flex-col items-center justify-center h-full py-8">
          <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">+</span>
          </div>
          <p className="text-zinc-400 mb-4 text-center">
            Create a new multi-signature vault
          </p>
          <Link href="/dashboard/create-vault">
            <Button className="bg-zinc-800 text-white hover:bg-zinc-700 border-none">
              Create Vault
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Vaults;
