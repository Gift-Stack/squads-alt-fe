"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Wallet,
  Users,
  ArrowRight,
} from "lucide-react";
import DashboardHeader from "@/app/dashboard/components/dashboard-header";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import Vaults from "./vaults";

export default function HomeTabs() {
  const [activeTab, setActiveTab] = useState("vaults");

  const transactions = [
    {
      id: "tx-1",
      vault: "Founders Squad",
      type: "Transfer",
      amount: "25,000.00",
      recipient: "0x1a2...3b4c",
      status: "pending",
      signatures: "1/2",
      created: "2 hours ago",
    },
    {
      id: "tx-2",
      vault: "Founders Squad",
      type: "Contract Interaction",
      amount: "5,000.00",
      recipient: "0x4d5...6e7f",
      status: "pending",
      signatures: "1/2",
      created: "5 hours ago",
    },
    {
      id: "tx-3",
      vault: "Development Fund",
      type: "Transfer",
      amount: "10,000.00",
      recipient: "0x7g8...9h0i",
      status: "completed",
      signatures: "2/2",
      created: "1 day ago",
    },
  ];

  return (
    <Tabs
      defaultValue="vaults"
      className="space-y-6"
      onValueChange={setActiveTab}
    >
      <TabsList className="bg-zinc-900 border border-zinc-800">
        <TabsTrigger
          value="vaults"
          className="gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400"
        >
          <Wallet className="h-4 w-4" /> Vaults
        </TabsTrigger>
        <TabsTrigger
          value="transactions"
          className="gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400"
        >
          <ArrowUpRight className="h-4 w-4" /> Transactions
        </TabsTrigger>
        <TabsTrigger
          value="members"
          className="gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400"
        >
          <Users className="h-4 w-4" /> Team Members
        </TabsTrigger>
      </TabsList>

      <TabsContent value="vaults" className="space-y-6">
        <Vaults />
      </TabsContent>

      <TabsContent value="transactions" className="space-y-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="border-b border-zinc-800">
            <h3 className="text-lg font-bold text-white">
              Recent Transactions
            </h3>
            <p className="text-zinc-400 text-sm">
              View and manage your multi-signature transactions
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-800"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-full ${
                        tx.status === "pending"
                          ? "bg-amber-900"
                          : "bg-green-900"
                      }`}
                    >
                      {tx.status === "pending" ? (
                        <Clock className="h-5 w-5 text-amber-400" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white flex items-center gap-2">
                        {tx.type}
                        <Badge
                          variant={
                            tx.status === "pending" ? "outline" : "secondary"
                          }
                          className="border-amber-500 text-amber-400 bg-transparent"
                        >
                          {tx.status === "pending" ? "Pending" : "Completed"}
                        </Badge>
                      </div>
                      <div className="text-sm text-zinc-400">
                        ${tx.amount} to {tx.recipient}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {tx.vault} • {tx.created}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm font-medium text-white">
                      Signatures: {tx.signatures}
                    </div>
                    {tx.status === "pending" && (
                      <Link href={`/dashboard/transactions/${tx.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-zinc-700 text-white hover:bg-zinc-800"
                        >
                          Review
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="members" className="space-y-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="border-b border-zinc-800">
            <h3 className="text-lg font-bold text-white">Team Members</h3>
            <p className="text-zinc-400 text-sm">
              Manage your team members and their permissions
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-zinc-700 flex items-center justify-center">
                    <span className="text-white font-medium">JD</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">John Doe</div>
                    <div className="text-sm text-zinc-400">0x1a2b...3c4d</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-white text-black">Admin</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 text-white hover:bg-zinc-800"
                  >
                    Manage
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-zinc-700 flex items-center justify-center">
                    <span className="text-white font-medium">AS</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">Alice Smith</div>
                    <div className="text-sm text-zinc-400">0x5e6f...7g8h</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-zinc-600 text-zinc-400"
                  >
                    Member
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 text-white hover:bg-zinc-800"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
