"use client"
import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { MainPage } from '@/components/main-page';
import '@solana/wallet-adapter-react-ui/styles.css';


export default function Home() {
  return (
    <ConnectionProvider endpoint={"https://solana-devnet.g.alchemy.com/v2/4DaeWytC_FliNNYs-DZdZcQ8VAQ__EwH"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <MainPage />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
