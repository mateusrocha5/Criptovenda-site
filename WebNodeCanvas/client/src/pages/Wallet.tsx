import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import WhatsAppChat from "@/components/support/WhatsAppChat";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/context/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Copy,
  ExternalLink,
  Coins,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface TokenBalance {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
}

interface Transaction {
  id: string;
  type: "buy" | "sell" | "transfer";
  token: string;
  amount: number;
  value: number;
  date: string;
  status: "completed" | "pending" | "failed";
  txHash?: string;
}

const Wallet = () => {
  const { connected, connectWallet, walletAddress, walletType } = useWallet();
  const { toast } = useToast();
  const [selectedToken, setSelectedToken] = useState<string>("all");

  // Mock data for demonstration - in real app this would come from blockchain
  const mockBalances: TokenBalance[] = [
    {
      symbol: "ZUM",
      name: "ZumCoin", 
      balance: 1500.50,
      value: 750.25,
      change24h: 5.2
    },
    {
      symbol: "PIX",
      name: "PixCoin",
      balance: 2300.00,
      value: 1150.00,
      change24h: -2.1
    },
    {
      symbol: "BNB",
      name: "Binance Coin",
      balance: 0.85,
      value: 204.15,
      change24h: 1.8
    }
  ];

  const mockTransactions: Transaction[] = [
    {
      id: "1",
      type: "buy",
      token: "ZUM",
      amount: 100,
      value: 50,
      date: new Date().toISOString(),
      status: "completed",
      txHash: "0x1234567890abcdef"
    },
    {
      id: "2", 
      type: "sell",
      token: "PIX",
      amount: 200,
      value: 100,
      date: new Date(Date.now() - 86400000).toISOString(),
      status: "completed",
      txHash: "0xabcdef1234567890"
    }
  ];

  const totalPortfolioValue = mockBalances.reduce((sum, token) => sum + token.value, 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Endereço copiado para a área de transferência.",
    });
  };

  const handleConnectWallet = async () => {
    const success = await connectWallet("MetaMask");
    if (success) {
      toast({
        title: "Carteira Conectada",
        description: "Sua carteira foi conectada com sucesso!",
      });
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Card>
              <CardHeader>
                <WalletIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Conectar Carteira</CardTitle>
                <CardDescription>
                  Conecte sua carteira Web3 para acessar seu portfólio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleConnectWallet} className="w-full">
                  Conectar MetaMask
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Minha Carteira</h1>
          <p className="text-muted-foreground">
            Gerencie seus tokens e acompanhe seu portfólio
          </p>
        </div>

        {/* Wallet Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WalletIcon className="h-5 w-5" />
              Informações da Carteira
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Endereço</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                  </code>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(walletAddress || "")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                <Badge variant="outline">{walletType}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Valor Total</p>
                <p className="text-2xl font-bold">R$ {totalPortfolioValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockBalances.map((token) => (
                <Card key={token.symbol}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{token.symbol}</CardTitle>
                        <CardDescription>{token.name}</CardDescription>
                      </div>
                      <Coins className="h-6 w-6 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-2xl font-bold">{token.balance.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          R$ {token.value.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className={`h-4 w-4 ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                        <span className={`text-sm ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {token.change24h > 0 ? '+' : ''}{token.change24h}%
                        </span>
                        <span className="text-sm text-muted-foreground">24h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Transações</CardTitle>
                <CardDescription>
                  Suas transações recentes com tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          tx.type === 'buy' ? 'bg-green-100 text-green-600' : 
                          tx.type === 'sell' ? 'bg-red-100 text-red-600' : 
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {tx.type === 'buy' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium">
                            {tx.type === 'buy' ? 'Compra' : tx.type === 'sell' ? 'Venda' : 'Transferência'} de {tx.token}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(tx.date), "dd/MM/yyyy HH:mm", { locale: pt })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {tx.type === 'buy' ? '+' : '-'}{tx.amount.toLocaleString()} {tx.token}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          R$ {tx.value.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={tx.status === 'completed' ? 'default' : tx.status === 'pending' ? 'outline' : 'destructive'}>
                            {tx.status === 'completed' ? 'Concluída' : tx.status === 'pending' ? 'Pendente' : 'Falhou'}
                          </Badge>
                          {tx.txHash && (
                            <Button size="sm" variant="ghost" onClick={() => window.open(`https://bscscan.com/tx/${tx.txHash}`, '_blank')}>
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
      <WhatsAppChat />
    </div>
  );
};

export default Wallet;