"use client"
import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import dynamic from 'next/dynamic';
import 'dotenv/config';

const TokenCreatorComponent = dynamic(() => import("@/components/token-creator"), {ssr:false});

export default function Home() {
  return (
    <ConnectionProvider endpoint={process.env.RPC_ENDPOINT ?? "https://dummyendpoint.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <TokenCreatorComponent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
