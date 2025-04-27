"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { connectWallet } from "@/lib/web3-utils"
import { Shield, Wallet, ArrowRight, Loader2 } from "lucide-react"

export default function ConnectWallet() {
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      await connectWallet()
      router.push("/dashboard")
    } catch (err) {
      setError("Failed to connect wallet. Please try again.")
      setIsConnecting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">SquadVault</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
            <CardDescription>Connect your wallet to access the multi-signature platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">MetaMask</p>
                  <p className="text-sm text-muted-foreground">Connect to your MetaMask wallet</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting
                  </>
                ) : (
                  <>Connect</>
                )}
              </Button>
            </div>

            <div className="rounded-lg border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">WalletConnect</p>
                  <p className="text-sm text-muted-foreground">Scan with your mobile wallet</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>

            <div className="rounded-lg border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Coinbase Wallet</p>
                  <p className="text-sm text-muted-foreground">Connect to Coinbase Wallet</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>

            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground text-center">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
            </p>
            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full gap-2">
                <ArrowRight className="h-4 w-4" /> Back to Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
