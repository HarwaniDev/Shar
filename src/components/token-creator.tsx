"use client"

import { useState, useEffect } from "react"
import { Rocket, Moon, Sun, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js"
import { createAssociatedTokenAccount, createAssociatedTokenAccountInstruction, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, createMintToInstruction, ExtensionType, getAssociatedTokenAddressSync, getMintLen, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata"
import 'dotenv/config'

export default function TokenCreatorComponent() {

  const { connection } = useConnection();
  const wallet = useWallet();

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [url, setUrl] = useState("");
  const [decimals, setDecimals] = useState(0);
  const [totalSupply, setTotalSupply] = useState("");

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }




  async function createToken() {
    if(!wallet.publicKey) {
      return
    }
    const mintAccountKeypair = Keypair.generate();
    const metadata = {
      mint: mintAccountKeypair.publicKey,
      name: "LUMINA",
      symbol: "LUM",
      uri: "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
      additionalMetadata: []
    }


    const mintLength = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLength = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

    const lamports = await connection.getMinimumBalanceForRentExemption(mintLength + metadataLength);

    const transaction = new Transaction().add(
      // creating mint account
      SystemProgram.createAccount({
        //@ts-ignore
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintAccountKeypair.publicKey,
        space: mintLength,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID
      }),
      // links the Mint Account to its metadata.
      createInitializeMetadataPointerInstruction(mintAccountKeypair.publicKey, wallet.publicKey, mintAccountKeypair.publicKey, TOKEN_2022_PROGRAM_ID),

      //sets up the Mint Account with specific details
      //@ts-ignore
      createInitializeMintInstruction(mintAccountKeypair.publicKey, decimals, wallet.publicKey, wallet.publicKey, TOKEN_2022_PROGRAM_ID),

      // createInitializeInstruction initializes the metadata within the Mint Account, adding fields like name, symbol, uri, etc
      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        mint: mintAccountKeypair.publicKey,
        metadata: mintAccountKeypair.publicKey,
        name: metadata.name,
        uri: metadata.uri,
        //@ts-ignore
        mintAuthority: wallet.publicKey,
        //@ts-ignore
        updateAuthority: wallet.publicKey,
        symbol: metadata.symbol
      })
    )

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.partialSign(mintAccountKeypair);

    await wallet.sendTransaction(transaction, connection);
    console.log(`Token mint created at ${mintAccountKeypair.publicKey.toBase58()}`);
    
    //get the public key of ata
    const associatedTokenAccount = getAssociatedTokenAddressSync(
      mintAccountKeypair.publicKey,
      wallet.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    )
    console.log(associatedTokenAccount.toBase58());

    const transaction2 = new Transaction().add(
      //create ata with the public key we got from getAssociatedTokenAddressSync
      createAssociatedTokenAccountInstruction(wallet.publicKey,associatedTokenAccount,wallet.publicKey, mintAccountKeypair.publicKey, TOKEN_2022_PROGRAM_ID)
    )

    await wallet.sendTransaction(transaction2,connection);

    const transaction3 = new Transaction().add(
      //mint token to ata
      createMintToInstruction(mintAccountKeypair.publicKey, associatedTokenAccount,wallet.publicKey,1000000000,[], TOKEN_2022_PROGRAM_ID)
    )

    await wallet.sendTransaction(transaction3,connection);
    console.log("Minted!")
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
            <WalletMultiButton style={{ width: "70vw", background: "#3b82f6", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }} />
          </div>
          <div className="space-y-2 flex flex-col items-center">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-200 self-start ml-[12.5%]">Token Name</Label>
            <Input
              id="name"
              name="name"
              placeholder={process.env.RPC_ENDPOINT}
              onChange={(e) => {
                setName(e.target.value);
              }}
              
              className="w-3/4 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="space-y-2 flex flex-col items-center">
            <Label htmlFor="symbol" className="text-gray-700 dark:text-gray-200 self-start ml-[12.5%]">Symbol</Label>
            <Input
              id="symbol"
              name="symbol"
              placeholder="Enter token symbol"
              onChange={(e) => {
                setSymbol(e.target.value);
              }}
              
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
              onChange={(e) => {
                setUrl(e.target.value);
              }}
              
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
              onChange={(e) => {
                setDecimals(Number(e.target.value));
              }}
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
              onChange={(e) => {
                setTotalSupply(e.target.value);
              }}
              
              min="1"
              className="w-3/4 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" onClick={createToken} className="w-3/4 bg-green-500 hover:bg-green-600 text-white" >
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