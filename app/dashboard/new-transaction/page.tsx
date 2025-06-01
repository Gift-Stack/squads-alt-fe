"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DashboardHeader from "@/app/dashboard/components/dashboard-header";

export default function NewTransaction() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionType, setTransactionType] = useState("transfer");

  // Mock vaults data
  const vaults = [
    {
      id: "vault-1",
      name: "Team Treasury",
      balance: "45.32 ETH",
    },
    {
      id: "vault-2",
      name: "Development Fund",
      balance: "12.75 ETH",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate transaction proposal
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/dashboard/transactions/tx-new");
    } catch (error) {
      console.error("Error proposing transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 p-6 md:p-8 pt-6">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Transaction</h1>
          <p className="text-muted-foreground">
            Create a new transaction for approval
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
                <CardDescription>
                  Enter the details for this transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="vault">From Vault</Label>
                  <Select defaultValue="vault-1">
                    <SelectTrigger id="vault">
                      <SelectValue placeholder="Select vault" />
                    </SelectTrigger>
                    <SelectContent>
                      {vaults.map((vault) => (
                        <SelectItem key={vault.id} value={vault.id}>
                          {vault.name} ({vault.balance})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction-type">Transaction Type</Label>
                  <Select
                    defaultValue="transfer"
                    onValueChange={(value) => setTransactionType(value)}
                  >
                    <SelectTrigger id="transaction-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transfer">Transfer ETH</SelectItem>
                      <SelectItem value="token-transfer">
                        Transfer Tokens
                      </SelectItem>
                      <SelectItem value="contract">
                        Contract Interaction
                      </SelectItem>
                      <SelectItem value="custom">Custom Transaction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Input id="recipient" placeholder="0x..." />
                  <p className="text-sm text-muted-foreground">
                    The wallet or contract address that will receive the
                    transaction
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="flex">
                    <Input
                      id="amount"
                      placeholder="0.0"
                      type="number"
                      step="0.0001"
                      min="0"
                    />
                    <Select defaultValue="eth">
                      <SelectTrigger className="w-[120px] border-l-0 rounded-l-none">
                        <SelectValue placeholder="ETH" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eth">ETH</SelectItem>
                        <SelectItem value="usdc">USDC</SelectItem>
                        <SelectItem value="link">LINK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {transactionType === "contract" && (
                  <div className="space-y-2">
                    <Label htmlFor="data">Contract Data</Label>
                    <Textarea
                      id="data"
                      placeholder="0x..."
                      className="font-mono text-sm h-24"
                    />
                    <p className="text-sm text-muted-foreground">
                      The encoded function call data for the contract
                      interaction
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Payment for development work"
                    className="h-20"
                  />
                  <p className="text-sm text-muted-foreground">
                    A description to help other signers understand the purpose
                    of this transaction
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-medium">Team Treasury</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">To</p>
                  <p className="font-medium text-muted-foreground italic">
                    Not specified
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold">0.0 ETH</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Gas Estimate</p>
                  <p className="font-medium">~0.002 ETH</p>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-4">
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating
                      Transaction...
                    </>
                  ) : (
                    <>
                      Create Transaction <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
              </CardFooter>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                This transaction will require{" "}
                {vaults[0].id === "vault-1" ? "3" : "2"} signatures before it
                can be executed.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </form>
    </main>
  );
}
