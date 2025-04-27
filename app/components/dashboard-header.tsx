"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, LogOut } from "lucide-react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { shortenAddress } from "@/lib/utils";

export default function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { primaryWallet, handleLogOut: disconnect } = useDynamicContext();

  const walletAddress = primaryWallet?.address;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#121212]/95 backdrop-blur supports-[backdrop-filter]:bg-[#121212]/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md border border-zinc-700 flex items-center justify-center">
              <div className="h-4 w-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-white hidden md:inline-block">
              Squads
            </span>
          </Link>
        </div>

        <nav
          className={`${
            mobileMenuOpen
              ? "absolute inset-x-0 top-16 border-b border-zinc-800 bg-[#121212] p-6 md:hidden"
              : "hidden md:flex"
          } items-center gap-6`}
        >
          <Link href="/dashboard" className="text-sm font-medium text-white">
            Dashboard
          </Link>
          <Link
            href="/dashboard?tab=transactions"
            className="text-sm font-medium text-zinc-400 hover:text-white"
          >
            Transactions
          </Link>
          <Link
            href="/dashboard?tab=members"
            className="text-sm font-medium text-zinc-400 hover:text-white"
          >
            Members
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            {shortenAddress(walletAddress || "")}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 bg-zinc-800"
              >
                <span className="text-white font-medium text-sm">JD</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-900 border-zinc-800"
            >
              <DropdownMenuLabel className="text-zinc-400">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem
                onClick={() => {
                  disconnect();
                }}
                className="gap-2 text-zinc-300 focus:bg-zinc-800 focus:text-white"
              >
                <LogOut className="h-4 w-4" /> Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
