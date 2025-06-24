
import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const CreateTokenSection = () => {
  const { connected, walletAddress } = useWallet();
  const { toast } = useToast();
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [supply, setSupply] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bnb');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      toast({
        title: "Conecte sua carteira",
        description: "É necessário conectar uma carteira para criar um token.",
        variant: "destructive"
      });
      return;
    }

    // Aqui você implementaria a lógica de pagamento e criação do token
    toast({
      title: "Solicitação recebida",
      description: "Sua solicitação de criação de token foi recebida.",
    });
  };

  return (
    <section id="create-token" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Criar Novo Token</h2>
        <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome do Token</label>
                <Input
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="Ex: Meu Token"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Símbolo</label>
                <Input
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  placeholder="Ex: MTK"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Supply Total</label>
                <Input
                  type="number"
                  value={supply}
                  onChange={(e) => setSupply(e.target.value)}
                  placeholder="Ex: 1000000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Método de Pagamento</label>
                <select
                  className="w-full p-2 border rounded"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="bnb">BNB</option>
                  <option value="usdt">USDT</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-white"
              >
                Criar Token
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateTokenSection;
