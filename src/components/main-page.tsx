"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from "react-hook-form";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Sun, Moon } from 'lucide-react';
import { createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';

interface Token {
  name: string,
  imageUrl: string,
  symbol: string,
  totalSupply: number
}

export function MainPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false); // To ensure client-side rendering

  const wallet = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    setMounted(true); // This ensures the component is mounted on the client
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const createToken = async () => {
  
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const mintAccountKeyPair = Keypair.generate();
    const mintAccountPublicKey = mintAccountKeyPair.publicKey;

    if (!wallet.publicKey) {
      toast.warning('Connect your wallet before creating a token', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintAccountPublicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(mintAccountPublicKey, 6, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID)
    );

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.partialSign(mintAccountKeyPair);

    await wallet.sendTransaction(transaction, connection);
    console.log(`Token mint created at ${mintAccountPublicKey.toBase58()}`);

    toast.success('Token created successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    // reset();
  };

  if (!mounted) {
    return null; // Ensures server and client renders match
  }


  return (
    <div className={`min-h-screen  p-4 flex justify-center transition-colors duration-200 ${darkMode ? 'dark bg-black' : 'bg-white'}`}>
      <div className="container mx-auto max-w-7xl">
        <div className='flex justify-between items-center mb-6'>
          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className="data-[state=checked]:bg-white data-[state=unchecked]:bg-black"
            />
            <Label htmlFor="dark-mode" className="sr-only">
              Toggle dark mode
            </Label>
            {darkMode ? <Moon className="h-4 w-4 text-white" /> : <Sun className="h-4 w-4 text-black" />}
          </div>
          <h1 className="text-3xl font-bold text-center ml-24 text-black dark:text-white">Shar</h1>
          <WalletMultiButton style={{ background: darkMode ? "white" : "black", color: darkMode ? "black" : 'white' }} />
        </div>
        <Tabs defaultValue="create" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-gray-200 dark:bg-gray-800">
            <TabsTrigger value="create" className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">Create Token</TabsTrigger>
            <TabsTrigger value="view" className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">View Tokens</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Create New Token</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Enter the details for your new token.</CardDescription>
              </CardHeader>
              <CardContent>
                
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name" className="text-black dark:text-white">Name</Label>
                      <Input id="name"  placeholder="Token Name" className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="symbol" className="text-black dark:text-white">Symbol</Label>
                      <Input id="symbol" placeholder="Token Symbol" className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="imageUrl" className="text-black dark:text-white">Image URL</Label>
                      <Input id="imageUrl"  placeholder="https://example.com/image.png" className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="totalSupply" className="text-black dark:text-white">Total Supply</Label>
                      <Input id="totalSupply"  type="number" placeholder="1000000" className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
                    </div>
                  </div>
                  <CardFooter className="flex justify-between mt-6 px-0">
                    <Button onClick={createToken} className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black">Create Token</Button>
                  </CardFooter>
      
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="view">
            <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Your Tokens</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">View all your created tokens.</CardDescription>
              </CardHeader>
              <CardContent>
                {tokens.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">No tokens created yet. Create your first token!</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tokens.map((token: Token, index: number) => (
                      <Card key={index} className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                            <img src={token.imageUrl} alt={token.name} className="w-8 h-8 rounded-full" />
                            {token.name}
                          </CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-400">{token.symbol}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700 dark:text-gray-300">Total Supply: {token.totalSupply}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <ToastContainer />
      </div>
    </div>
  )
}