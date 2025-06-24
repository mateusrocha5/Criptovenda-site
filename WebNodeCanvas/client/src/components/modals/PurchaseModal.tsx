import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Token {
  id: string;
  name: string;
  symbol: string;
  price: {
    amount: number;
    currency: string;
  };
  available: number;
  minimum: number;
  progress: number;
  tag: {
    text: string;
    type: string;
  };
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
}

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: Token;
}

const PurchaseModal = ({ isOpen, onClose, token }: PurchaseModalProps) => {
  const { connected } = useWallet();
  const [quantity, setQuantity] = useState(token.minimum);
  const [selectedPayment, setSelectedPayment] = useState("pix");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const paymentMethods: PaymentMethod[] = [
    {
      id: "pix",
      name: "Pix",
      icon: "bolt",
      iconColor: "text-primary",
    },
    {
      id: "bnb",
      name: "BNB",
      icon: "monetization_on",
      iconColor: "text-amber-500",
    },
    {
      id: "usdt",
      name: "USDT",
      icon: "attach_money",
      iconColor: "text-green-500",
    },
  ];

  // Reset quantity when token changes
  useEffect(() => {
    if (token) {
      setQuantity(token.minimum);
    }
  }, [token]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= token.minimum) {
      setQuantity(value);
    } else {
      setQuantity(token.minimum);
    }
  };

  const calculateTotal = () => {
    const amount = quantity * token.price.amount;
    // Apply a 1% fee
    const fee = amount * 0.01;
    return {
      amount,
      fee,
      total: amount + fee,
    };
  };

  const formatCurrency = (value: number) => {
    if (selectedPayment === "pix") {
      return `R$ ${value.toFixed(2)}`;
    }
    return `${value.toFixed(2)} ${selectedPayment.toUpperCase()}`;
  };

  const handleConfirmPurchase = () => {
    if (!connected) {
      toast({
        title: "Carteira não conectada",
        description: "Por favor, conecte sua carteira antes de fazer uma compra.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Compra confirmada!",
        description: `Você comprou ${quantity} ${token.symbol}. Acompanhe o status na sua carteira.`,
      });
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  const { amount, fee, total } = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-medium hover:text-dark"
        >
          <span className="material-icons">close</span>
        </button>
        <h3 className="text-2xl font-bold mb-6">
          Comprar {token.name} ({token.symbol})
        </h3>

        <div className="mb-6">
          <h4 className="font-medium text-medium mb-2">
            Selecione o método de pagamento:
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`payment-method border-2 ${
                  selectedPayment === method.id
                    ? "border-primary bg-primary bg-opacity-5"
                    : "border-gray-200"
                } rounded-lg p-3 cursor-pointer flex flex-col items-center justify-center`}
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  <span className={`material-icons ${method.iconColor}`}>
                    {method.icon}
                  </span>
                </div>
                <span className="text-sm font-medium mt-1">{method.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="purchaseAmount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Quantidade ({token.symbol})
          </label>
          <div className="flex">
            <Input
              id="purchaseAmount"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min={token.minimum}
              className="rounded-r-none"
            />
            <div className="bg-light border border-l-0 border-gray-300 rounded-r-lg flex items-center px-3">
              <span className="text-medium font-medium">{token.symbol}</span>
            </div>
          </div>
          <div className="text-right text-sm text-medium mt-1">
            Mínimo: {token.minimum} {token.symbol}
          </div>
        </div>

        <div className="mb-6 p-4 bg-light rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-medium">Valor:</span>
            <span className="font-bold">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-medium">Taxa (1%):</span>
            <span className="font-medium">{formatCurrency(fee)}</span>
          </div>
          <div className="border-t border-gray-300 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Total:</span>
            <span className="font-bold text-lg">{formatCurrency(total)}</span>
          </div>
        </div>

        <Button
          onClick={handleConfirmPurchase}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              Processando...
            </>
          ) : (
            "Confirmar Compra"
          )}
        </Button>
      </div>
    </div>
  );
};

export default PurchaseModal;
