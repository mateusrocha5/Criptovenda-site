import { useState } from "react";
import { useWallet } from "@/context/WalletContext";

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  bgColor: string;
}

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletConnectModal = ({ isOpen, onClose }: WalletConnectModalProps) => {
  const { connectWallet } = useWallet();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const walletOptions: WalletOption[] = [
    {
      id: "metamask",
      name: "MetaMask",
      icon: "account_balance_wallet",
      iconColor: "text-amber-500",
      bgColor: "bg-amber-100",
    },
    {
      id: "trustwallet",
      name: "Trust Wallet",
      icon: "shield",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      icon: "grid_view",
      iconColor: "text-primary",
      bgColor: "bg-primary bg-opacity-10",
    },
  ];

  const handleWalletSelect = async (id: string) => {
    setSelectedWallet(id);
    setIsConnecting(true);

    try {
      const walletType = id === "metamask" 
        ? "MetaMask" 
        : id === "trustwallet" 
          ? "TrustWallet" 
          : "WalletConnect";
      
      await connectWallet(walletType);
      onClose();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-medium hover:text-dark"
        >
          <span className="material-icons">close</span>
        </button>
        <h3 className="text-2xl font-bold mb-6">Conectar Carteira</h3>
        <p className="text-medium mb-8">
          Escolha um dos provedores abaixo para conectar sua carteira digital:
        </p>

        <div className="space-y-3">
          {walletOptions.map((wallet) => (
            <div
              key={wallet.id}
              onClick={() => handleWalletSelect(wallet.id)}
              className={`wallet-option border-2 ${
                selectedWallet === wallet.id
                  ? "border-primary bg-primary bg-opacity-5"
                  : "border-gray-200"
              } rounded-lg p-4 cursor-pointer flex items-center justify-between`}
            >
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full ${wallet.bgColor} flex items-center justify-center mr-3`}
                >
                  <span className={`material-icons ${wallet.iconColor}`}>
                    {wallet.icon}
                  </span>
                </div>
                <span className="font-medium">{wallet.name}</span>
              </div>
              {isConnecting && selectedWallet === wallet.id ? (
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
              ) : (
                <span className="material-icons text-medium">arrow_forward</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;
