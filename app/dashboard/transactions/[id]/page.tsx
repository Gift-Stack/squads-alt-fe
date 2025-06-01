"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import DashboardHeader from "@/app/dashboard/components/dashboard-header";

export default function TransactionDetails({
  params,
}: {
  params: { id: string };
}) {
  const [isSigningInProgress, setIsSigningInProgress] = useState(false);

  // Mock transaction data
  const transaction = {
    id: params.id,
    type: "Transfer",
    status: "pending",
    amount: "2.5 ETH",
    from: "Team Treasury",
    to: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    created: "April 26, 2024 at 10:45 AM",
    createdBy: "John Doe",
    description: "Payment for development work",
    gasEstimate: "0.002 ETH",
    signaturesRequired: 3,
    signaturesReceived: 2,
    signatures: [
      {
        name: "John Doe",
        address: "0x1a2b...3c4d",
        status: "signed",
        time: "2 hours ago",
      },
      {
        name: "Alice Smith",
        address: "0x5e6f...7g8h",
        status: "signed",
        time: "1 hour ago",
      },
      {
        name: "Bob Johnson",
        address: "0x9i0j...1k2l",
        status: "pending",
        time: "",
      },
    ],
  };

  const handleSign = () => {
    setIsSigningInProgress(true);
    // Simulate signing process
    setTimeout(() => {
      setIsSigningInProgress(false);
    }, 2000);
  };

  return (
    <main className="flex-1 p-6 md:p-8 pt-6">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/dashboard/transactions">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Transaction Details
          </h1>
          <p className="text-muted-foreground">
            Review and sign transaction #{params.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {transaction.type}
                    <Badge
                      variant={
                        transaction.status === "pending"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {transaction.status === "pending"
                        ? "Pending"
                        : "Completed"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Created by {transaction.createdBy} on {transaction.created}
                  </CardDescription>
                </div>
                <div className="p-2 rounded-full bg-amber-100">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-medium">{transaction.from}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">To</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{transaction.to}</p>
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold">{transaction.amount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Gas Estimate</p>
                  <p className="font-medium">{transaction.gasEstimate}</p>
                </div>
              </div>

              {transaction.description && (
                <div className="space-y-1 pt-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{transaction.description}</p>
                </div>
              )}

              <div className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">
                    Signatures: {transaction.signaturesReceived} of{" "}
                    {transaction.signaturesRequired}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(
                      (transaction.signaturesReceived /
                        transaction.signaturesRequired) *
                        100
                    )}
                    %
                  </p>
                </div>
                <Progress
                  value={
                    (transaction.signaturesReceived /
                      transaction.signaturesRequired) *
                    100
                  }
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Data</CardTitle>
              <CardDescription>
                Raw transaction data and parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
                {`{
  "to": "${transaction.to}",
  "value": "2500000000000000000",
  "data": "0x",
  "operation": 0,
  "nonce": 5
}`}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Signatures</CardTitle>
              <CardDescription>
                {transaction.signaturesReceived} of{" "}
                {transaction.signaturesRequired} required signatures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transaction.signatures.map((signature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {signature.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{signature.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {signature.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {signature.status === "signed" ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <span className="text-xs text-muted-foreground">
                            {signature.time}
                          </span>
                        </>
                      ) : (
                        <Clock className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4">
              <Button
                className="w-full gap-2"
                onClick={handleSign}
                disabled={isSigningInProgress}
              >
                {isSigningInProgress ? (
                  <>Signing...</>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Sign Transaction
                  </>
                )}
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <XCircle className="h-4 w-4" /> Reject
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Security Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Always verify transaction details before signing. Check the
                recipient address and amount carefully.
              </p>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Recipient verified:
                  </span>
                  <span className="font-medium">No</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Previous transactions:
                  </span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
