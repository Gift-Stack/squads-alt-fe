import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Balance } from "@/store/account";
import { Wallet } from "lucide-react";
import Image from "next/image";
import React from "react";

const SquadAssets = ({ balances }: { balances: Balance[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets</CardTitle>
        <CardDescription>Tokens held in this vault</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {balances.map((token, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                {token.logoUri ? (
                  <Image
                    src={token.logoUri}
                    alt={token.name}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <div className="size-7 flex items-center justify-center rounded-full bg-primary/10">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{token.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {token.symbol}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{token.uiAmount}</p>
                <p className="text-sm text-muted-foreground">
                  {token.uiPrice.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Deposit Funds
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SquadAssets;
