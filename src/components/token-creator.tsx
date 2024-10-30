"use client"

import { useState, useEffect } from "react"
import { Rocket, Moon, Sun, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export default function TokenCreatorComponent() {
  
  const [isDarkMode, setIsDarkMode] = useState(false)
  // const []
  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }



function createToken() {

}


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-none mx-auto bg-white dark:bg-gray-800 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
              <Rocket className="mr-2" />
              SHAR Token Creator
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
              <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          <CardDescription className="text-center text-gray-600 dark:text-gray-300 font-bold text-2xl">
            Create your Solana token
          </CardDescription>
        </CardHeader>
        
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <WalletMultiButton style={{width: "70vw", background: "#3b82f6", color: "white", display:"flex", justifyContent:"center", alignItems:"center"}}/>
          </div>
          <div className="space-y-2 flex flex-col items-center">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-200 self-start ml-[12.5%]">Token Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter token name"
              // onChange={handleInputChange}
              required
              className="w-3/4 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="space-y-2 flex flex-col items-center">
            <Label htmlFor="symbol" className="text-gray-700 dark:text-gray-200 self-start ml-[12.5%]">Symbol</Label>
            <Input
              id="symbol"
              name="symbol"
              placeholder="Enter token symbol"
              // onChange={handleInputChange}
              required
              className="w-3/4 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="space-y-2 flex flex-col items-center">
            <Label htmlFor="imageUrl" className="text-gray-700 dark:text-gray-200 self-start ml-[12.5%]">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="Enter image URL"
              // onChange={handleInputChange}
              required
              className="w-3/4 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="space-y-2 flex flex-col items-center">
            <Label htmlFor="decimals" className="text-gray-700 dark:text-gray-200 self-start ml-[12.5%]">Decimals</Label>
            <Input
              id="decimals"
              name="decimals"
              type="number"
              placeholder="Enter the number of decimals (default : 9)"
              // onChange={handleInputChange}
              className="w-3/4 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="space-y-2 flex flex-col items-center">
            <Label htmlFor="totalSupply" className="text-gray-700 dark:text-gray-200 self-start ml-[12.5%]">Total Supply</Label>
            <Input
              id="totalSupply"
              name="totalSupply"
              type="number"
              placeholder="Enter total supply"
              // onChange={handleInputChange}
              required
              min="1"
              className="w-3/4 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-3/4 bg-green-500 hover:bg-green-600 text-white" >
            Create Token
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Disclaimer: This will create a token on the Solana devnet.
          </p>
        </CardFooter>
    </Card>
    </div >
  )
}