"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, Plus, Trash2, Info, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DashboardHeader from "@/app/components/dashboard-header"

export default function CreateVault() {
  const [owners, setOwners] = useState([
    { address: "", name: "" },
    { address: "", name: "" },
  ])
  const [requiredSignatures, setRequiredSignatures] = useState(2)

  const addOwner = () => {
    setOwners([...owners, { address: "", name: "" }])
  }

  const removeOwner = (index: number) => {
    if (owners.length <= 2) return
    const newOwners = [...owners]
    newOwners.splice(index, 1)
    setOwners(newOwners)
    if (requiredSignatures > newOwners.length) {
      setRequiredSignatures(newOwners.length)
    }
  }

  const updateOwner = (index: number, field: "address" | "name", value: string) => {
    const newOwners = [...owners]
    newOwners[index][field] = value
    setOwners(newOwners)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6 md:p-8 pt-6">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Vault</h1>
            <p className="text-muted-foreground">Set up a new multi-signature wallet for your team</p>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="owners">Owners & Signatures</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details for your multi-signature vault</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="vault-name">Vault Name</Label>
                  <Input id="vault-name" placeholder="Team Treasury" />
                  <p className="text-sm text-muted-foreground">A name to easily identify this vault</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vault-description">Description (Optional)</Label>
                  <Input id="vault-description" placeholder="Main treasury for our team's funds" />
                  <p className="text-sm text-muted-foreground">A brief description of this vault's purpose</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="network">Network</Label>
                  <Select defaultValue="ethereum">
                    <SelectTrigger id="network">
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ethereum">Ethereum Mainnet</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="arbitrum">Arbitrum</SelectItem>
                      <SelectItem value="optimism">Optimism</SelectItem>
                      <SelectItem value="goerli">Goerli Testnet</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    The blockchain network where this vault will be deployed
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
                <Button>Continue</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="owners">
            <Card>
              <CardHeader>
                <CardTitle>Owners & Signatures</CardTitle>
                <CardDescription>Add wallet addresses that can sign transactions from this vault</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Each owner will need to sign transactions according to the signature requirements you set.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {owners.map((owner, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`owner-name-${index}`}>Owner Name</Label>
                        <Input
                          id={`owner-name-${index}`}
                          placeholder="John Doe"
                          value={owner.name}
                          onChange={(e) => updateOwner(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`owner-address-${index}`}>Wallet Address</Label>
                        <Input
                          id={`owner-address-${index}`}
                          placeholder="0x..."
                          value={owner.address}
                          onChange={(e) => updateOwner(index, "address", e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOwner(index)}
                          disabled={owners.length <= 2}
                        >
                          <Trash2 className="h-5 w-5 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" className="w-full gap-2" onClick={addOwner}>
                    <Plus className="h-4 w-4" /> Add Owner
                  </Button>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label>Required Signatures</Label>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{requiredSignatures}</p>
                        <p className="text-sm text-muted-foreground">of {owners.length} owners</p>
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            This is the number of signatures required to approve and execute a transaction from this
                            vault.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <Slider
                    value={[requiredSignatures]}
                    min={1}
                    max={owners.length}
                    step={1}
                    onValueChange={(value) => setRequiredSignatures(value[0])}
                  />

                  <p className="text-sm text-muted-foreground">
                    {requiredSignatures === 1
                      ? "Only 1 signature is required. This provides minimal security."
                      : requiredSignatures === owners.length
                        ? "All owners must sign. This provides maximum security but may delay transactions."
                        : `${requiredSignatures} of ${owners.length} owners must sign each transaction.`}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Back</Button>
                <Button>Continue</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Configure additional security and operational settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="daily-limit">Daily Transaction Limit</Label>
                      <p className="text-sm text-muted-foreground">
                        Maximum amount that can be transferred in a 24-hour period
                      </p>
                    </div>
                    <div className="w-[180px]">
                      <div className="flex items-center">
                        <Input id="daily-limit" placeholder="5.0" />
                        <Select defaultValue="eth">
                          <SelectTrigger className="w-[80px] border-l-0 rounded-l-none">
                            <SelectValue placeholder="ETH" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eth">ETH</SelectItem>
                            <SelectItem value="usdc">USDC</SelectItem>
                            <SelectItem value="dai">DAI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Time Lock</Label>
                      <p className="text-sm text-muted-foreground">
                        Delay between approval and execution of transactions
                      </p>
                    </div>
                    <div className="w-[180px]">
                      <Select defaultValue="none">
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="1h">1 hour</SelectItem>
                          <SelectItem value="6h">6 hours</SelectItem>
                          <SelectItem value="24h">24 hours</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <Label>Emergency Recovery</Label>
                      <p className="text-sm text-muted-foreground">Allow recovery of funds if access is lost</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <Label>Contract Interaction</Label>
                      <p className="text-sm text-muted-foreground">Allow vault to interact with smart contracts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Back</Button>
                <Button>Create Vault</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
