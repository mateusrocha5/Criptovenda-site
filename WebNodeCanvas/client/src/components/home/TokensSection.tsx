import { useState } from "react";
import PurchaseModal from "../modals/PurchaseModal";

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
    type: "hot" | "new" | "limited";
  };
}

const TokensSection = () => {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const tokens: Token[] = [
    {
      id: "1",
      name: "PixCoin",
      symbol: "PXC",
      price: {
        amount: 0.01,
        currency: "BNB",
      },
      available: 1000000,
      minimum: 100,
      progress: 65,
      tag: {
        text: "Em Alta",
        type: "hot",
      },
    },
    {
      id: "2",
      name: "MetaPix",
      symbol: "MPX",
      price: {
        amount: 0.5,
        currency: "USDT",
      },
      available: 500000,
      minimum: 50,
      progress: 42,
      tag: {
        text: "Novo",
        type: "new",
      },
    },
    {
      id: "3",
      name: "ZumbiCoin",
      symbol: "ZUN",
      price: {
        amount: 0.02,
        currency: "BNB",
      },
      available: 250000,
      minimum: 200,
      progress: 87,
      tag: {
        text: "Limitado",
        type: "limited",
      },
    },
  ];

  const openPurchaseModal = (token: Token) => {
    setSelectedToken(token);
    setIsPurchaseModalOpen(true);
  };

  const closePurchaseModal = () => {
    setIsPurchaseModalOpen(false);
  };

  const getTagColor = (type: string) => {
    switch (type) {
      case "hot":
        return "bg-accent";
      case "new":
        return "bg-green-500";
      case "limited":
        return "bg-red-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <>
      <section id="tokens" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tokens Disponíveis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tokens.map((token) => (
              <div
                key={token.id}
                className="token-card bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-transform hover:translate-y-[-4px] hover:shadow-xl"
              >
                <div className="bg-primary bg-opacity-10 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-primary">
                      {token.name} ({token.symbol})
                    </h3>
                    <span
                      className={`${getTagColor(
                        token.tag.type
                      )} text-white text-xs font-bold px-2 py-1 rounded-full`}
                    >
                      {token.tag.text}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-medium">Preço:</span>
                    <span className="font-bold">
                      {token.price.amount} {token.price.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-medium">Disponível:</span>
                    <span className="font-bold">
                      {token.available.toLocaleString()} {token.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-medium">Mínimo:</span>
                    <span className="font-bold">
                      {token.minimum} {token.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-medium">Progresso:</span>
                    <span className="font-bold text-green-500">
                      {token.progress}%
                    </span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${token.progress}%` }}
                    ></div>
                  </div>
                  <button
                    onClick={() => openPurchaseModal(token)}
                    className="w-full bg-primary text-white font-medium px-4 py-3 rounded-lg mt-6 hover:bg-blue-700 transition-all"
                  >
                    Comprar Agora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedToken && (
        <PurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={closePurchaseModal}
          token={selectedToken}
        />
      )}
    </>
  );
};

export default TokensSection;
