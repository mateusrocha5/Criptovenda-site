import { createContext, useContext, useState, ReactNode } from "react";

type WalletType = "MetaMask" | "TrustWallet" | "WalletConnect" | null;

interface WalletContextType {
  connected: boolean;
  walletType: WalletType;
  walletAddress: string | null;
  connectWallet: (type: WalletType) => Promise<boolean>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // This is a mock implementation since we don't have actual wallet connection
  // In production, this would use Web3.js or Ethers.js to connect to wallets
  const connectWallet = async (type: WalletType): Promise<boolean> => {
    // Simulate connection delay
    return new Promise((resolve) => {
      setTimeout(() => {
        setConnected(true);
        setWalletType(type);
        setWalletAddress("0x1234...5678"); // Mock address
        resolve(true);
      }, 1000);
    });
  };

  const disconnectWallet = () => {
    setConnected(false);
    setWalletType(null);
    setWalletAddress(null);
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        walletType,
        walletAddress,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
