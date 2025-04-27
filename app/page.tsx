import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import SignupButton from "@/components/signup-button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <header className="border-b border-zinc-800">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md border border-zinc-700 flex items-center justify-center">
              <div className="h-4 w-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-white">Squads</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#"
              className="text-sm font-medium text-zinc-400 hover:text-white"
            >
              Squads
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-zinc-400 hover:text-white"
            >
              Protocol
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-zinc-400 hover:text-white"
            >
              Extension
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-zinc-400 hover:text-white"
            >
              Use Cases
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-zinc-400 hover:text-white"
            >
              About
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-zinc-400 hover:text-white"
            >
              Blog
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <SignupButton />
          </div>
        </div>
      </header>
      <main className="flex-1 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 grid grid-cols-6 gap-4 opacity-20 pointer-events-none">
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl border-4 border-zinc-700 rotate-45"
            ></div>
          ))}
        </div>

        <div className="container relative z-10 py-20 md:py-32">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Squads simplifies management of developer and treasury assets for
              on-chain organizations
            </h1>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl">
              Secure your treasury, programs, validators, tokens in a multisig
              and manage them with your team.
            </p>

            <SignupButton className="bg-white text-black hover:bg-zinc-200 px-6 py-6 text-lg rounded-md" />
          </div>

          <div className="mt-20 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden max-w-5xl mx-auto">
            <div className="p-4 border-b border-zinc-800 flex items-center">
              <div className="h-6 w-6 rounded-md border border-zinc-700 flex items-center justify-center mr-2">
                <div className="h-3 w-3 bg-white rounded-sm"></div>
              </div>
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                SQUADS
              </span>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <div className="text-sm text-zinc-500 mb-1">
                    Founders Squad
                  </div>
                  <div className="text-3xl font-bold text-white">
                    $4,324,078.00
                  </div>
                  <div className="text-sm text-green-500 mt-1">
                    +10,000.00 last month
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-zinc-800 text-white hover:bg-zinc-700">
                    Send
                  </Button>
                  <Button className="bg-zinc-800 text-white hover:bg-zinc-700">
                    Deposit
                  </Button>
                  <Button className="bg-zinc-800 text-white hover:bg-zinc-700">
                    Trade
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-800 p-4 rounded-md">
                  <div className="text-3xl font-bold text-white mb-1">3</div>
                  <div className="text-sm text-zinc-400">Members</div>
                </div>
                <div className="bg-zinc-800 p-4 rounded-md">
                  <div className="text-3xl font-bold text-white mb-1">2/3</div>
                  <div className="text-sm text-zinc-400">Threshold</div>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <div className="flex gap-4 mb-2">
                  <button className="text-sm font-medium text-white border-b-2 border-white pb-2">
                    Accounts
                  </button>
                  <button className="text-sm font-medium text-zinc-500 pb-2">
                    Assets
                  </button>
                  <button className="text-sm font-medium text-zinc-500 pb-2">
                    NFT
                  </button>
                </div>

                <div className="bg-zinc-800 p-4 rounded-md flex justify-between items-center">
                  <div className="text-sm text-white">Main Wallet</div>
                  <div className="text-sm font-bold text-white">$27,000.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t border-zinc-800 py-6">
        <div className="container flex justify-between items-center">
          <div className="text-sm text-zinc-500">
            © 2024 Squads. All rights reserved.
          </div>
          <Button
            variant="outline"
            className="text-white bg-transparent border-zinc-700 hover:bg-zinc-800"
          >
            Contact us
          </Button>
        </div>
      </footer>
    </div>
  );
}
