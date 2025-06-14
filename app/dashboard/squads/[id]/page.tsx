"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ChevronLeft,
  ArrowUpRight,
  Users,
  Settings,
  Copy,
  ExternalLink,
  BarChart3,
  History,
} from "lucide-react";
import DashboardHeader from "@/app/dashboard/components/dashboard-header";
import { useSquad } from "@/store/multi-sig";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { copyToClipboard } from "@/lib/utils";
import { useBalances } from "@/store/account";
import SquadAssets from "./(components)/assets";
import AddMemberModal from "@/modals/add-member";
import Transactions from "./(components)/transactions";
import { toast } from "sonner";

export default function VaultDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const { primaryWallet } = useDynamicContext();
  const paramsData = use(params);
  const [showAddMember, setShowAddMember] = useState(false);

  const {
    data: squad,
    isLoading,
    error,
  } = useSquad({
    walletAddress: primaryWallet?.address,
    squadId: paramsData.id,
  });

  const { data: balances } = useBalances({
    walletAddress: paramsData.id,
  });

  if (!primaryWallet?.address) {
    return <div>Please connect your wallet</div>;
  }

  if (isLoading || !paramsData.id) {
    // Add a loading state
    return <div>Loading...</div>;
  }

  if (error) {
    // Add an error state
    return <div>Error: {error?.message}</div>;
  }

  if (!squad) {
    // Add a not found state
    return <div>Squad not found</div>;
  }

  return (
    <>
      <main className="flex-1 p-6 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {squad.metadata.name}
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                  {squad.defaultVault}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={async () => {
                    const success = await copyToClipboard(squad.defaultVault);
                    toast(success ? "Copied!" : "Copy failed", {
                      description: success
                        ? "Vault address copied to clipboard."
                        : "Could not copy address.",
                    });
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <a
                  href={`https://solscan.io/account/${squad.defaultVault}`}
                  target="_blank"
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href={`/dashboard/vaults/${paramsData.id}/new-transaction`}>
              <Button className="gap-2">
                <ArrowUpRight className="h-4 w-4" /> New Transaction
              </Button>
            </Link>
            <Link href={`/dashboard/vaults/${paramsData.id}/settings`}>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" /> Settings
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ≈{" "}
                {balances?.totalUsd.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {squad.account.transactionIndex}
              </div>
              <p className="text-sm text-muted-foreground">
                Requiring signatures
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {squad.account.threshold} of {squad.account.members.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Signatures required
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs
          defaultValue="overview"
          className="space-y-6"
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <History className="h-4 w-4" /> Transactions
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2">
              <Users className="h-4 w-4" /> Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SquadAssets balances={balances?.balances || []} />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  View and manage transactions from this vault
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Transactions vaultAddress={squad.address} />
              </CardContent>
              <CardFooter>
                <Link
                  href={`/dashboard/vaults/${paramsData.id}/transactions`}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    View All Transactions
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Members</CardTitle>
                <CardDescription>
                  Manage members and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {squad.account.members.map((owner, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {/* TODO: get avatar */}
                            {/* @ts-expect-error I will be fixing this soon */}
                            {owner.name
                              ?.split(" ")
                              ?.map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          {/* <div className="font-medium">{owner.name}</div> */}
                          <div className="text-sm text-muted-foreground">
                            {owner.key}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            owner.permissions.mask === 7 ? "default" : "outline"
                          }
                        >
                          {owner.permissions.mask === 7 ? "Admin" : "Member"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowAddMember(true)}
                >
                  <Users className="h-4 w-4" /> Add Member
                </Button>
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" /> Manage Roles
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <AddMemberModal
        userWalletAddress={primaryWallet.address}
        squad={squad}
        open={showAddMember}
        onClose={() => setShowAddMember(false)}
      />
    </>
  );
}
