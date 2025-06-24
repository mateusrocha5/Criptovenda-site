import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/common/Header";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { 
  Users, 
  FileCheck, 
  ShoppingCart, 
  MessageSquare,
  DollarSign,
  TrendingUp,
  Eye,
  Check,
  X,
  Edit
} from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  cpf: string;
  kycStatus: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Purchase {
  id: number;
  userId: number;
  tokenId: number;
  amount: number;
  price: { amount: number; currency: string };
  paymentMethod: string;
  status: string;
  createdAt: string;
}

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Token {
  id: number;
  name: string;
  symbol: string;
  price: { amount: number; currency: string };
  available: number;
  progress: number;
  active: boolean;
}

const AdminPanel = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [editingToken, setEditingToken] = useState<Token | null>(null);
  const [showCreateTokenForm, setShowCreateTokenForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
    queryFn: () => apiRequest('/api/users'),
  });

  // Fetch purchases
  const { data: purchases = [], isLoading: purchasesLoading } = useQuery<Purchase[]>({
    queryKey: ['/api/purchases'],
    queryFn: () => apiRequest('/api/purchases'),
  });

  // Fetch messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
    queryFn: () => apiRequest('/api/messages'),
  });

  // Fetch tokens
  const { data: tokens = [], isLoading: tokensLoading } = useQuery<Token[]>({
    queryKey: ['/api/tokens'],
    queryFn: () => apiRequest('/api/tokens'),
  });

  // KYC approval mutation
  const kycMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: number; status: string }) =>
      apiRequest(`/api/users/${userId}/kyc-status`, {
        method: 'PUT',
        body: { status }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "KYC Status Atualizado",
        description: "Status do KYC foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar status do KYC.",
        variant: "destructive",
      });
    },
  });

  // Mark message as read mutation
  const markMessageMutation = useMutation({
    mutationFn: (messageId: number) =>
      apiRequest(`/api/messages/${messageId}/read`, {
        method: 'PUT'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
  });

  // Update token mutation
  const updateTokenMutation = useMutation({
    mutationFn: ({ tokenId, data }: { tokenId: number; data: Partial<Token> }) =>
      apiRequest(`/api/tokens/${tokenId}`, {
        method: 'PUT',
        body: data
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tokens'] });
      setEditingToken(null);
      toast({
        title: "Token Atualizado",
        description: "Token foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar token.",
        variant: "destructive",
      });
    },
  });

  // Calculate stats
  const stats = {
    totalUsers: users.length,
    pendingKyc: users.filter(u => u.kycStatus === 'pending').length,
    totalPurchases: purchases.length,
    unreadMessages: messages.filter(m => !m.read).length,
    totalRevenue: purchases
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.price.amount, 0),
  };

  const handleKycApproval = (userId: number, status: 'verified' | 'rejected') => {
    kycMutation.mutate({ userId, status });
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markMessageMutation.mutate(message.id);
    }
  };

  const handleUpdateToken = (tokenData: Partial<Token>) => {
    if (!editingToken) return;
    updateTokenMutation.mutate({ 
      tokenId: editingToken.id, 
      data: tokenData 
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      verified: "default",
      rejected: "destructive",
      completed: "default",
      failed: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          Gerencie usuários, aprovações de KYC, tokens e mensagens
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KYC Pendentes</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingKyc}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compras</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPurchases}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="purchases">Compras</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>
                Gerencie usuários e aprove verificações KYC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status KYC</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getStatusBadge(user.kycStatus)}</TableCell>
                        <TableCell>
                          {user.isAdmin ? <Badge>Admin</Badge> : null}
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: pt })}
                        </TableCell>
                        <TableCell>
                          {user.kycStatus === 'pending' && (
                            <div className="flex gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Aprovar KYC</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja aprovar o KYC de {user.fullName}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleKycApproval(user.id, 'verified')}
                                    >
                                      Aprovar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Rejeitar KYC</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja rejeitar o KYC de {user.fullName}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleKycApproval(user.id, 'rejected')}
                                    >
                                      Rejeitar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Compras</CardTitle>
              <CardDescription>
                Monitore todas as transações de tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Usuário ID</TableHead>
                      <TableHead>Token ID</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell>{purchase.id}</TableCell>
                        <TableCell>{purchase.userId}</TableCell>
                        <TableCell>{purchase.tokenId}</TableCell>
                        <TableCell>{purchase.amount}</TableCell>
                        <TableCell>
                          {purchase.price.currency} {purchase.price.amount}
                        </TableCell>
                        <TableCell>{purchase.paymentMethod.toUpperCase()}</TableCell>
                        <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                        <TableCell>
                          {format(new Date(purchase.createdAt), "dd/MM/yyyy HH:mm", { locale: pt })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Tokens</CardTitle>
              <CardDescription>
                Configure preços e disponibilidade dos tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagem</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Símbolo</TableHead>
                      <TableHead>Blockchain</TableHead>
                      <TableHead>Contrato</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Disponível</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tokens.map((token) => (
                      <TableRow key={token.id}>
                        <TableCell>{token.id}</TableCell>
                        <TableCell>{token.name}</TableCell>
                        <TableCell>{token.symbol}</TableCell>
                        <TableCell>
                          {token.price.currency} {token.price.amount}
                        </TableCell>
                        <TableCell>{token.available}</TableCell>
                        <TableCell>{token.progress}%</TableCell>
                        <TableCell>
                          <Badge variant={token.active ? "default" : "secondary"}>
                            {token.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingToken(token)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Token - {token.name}</DialogTitle>
                                <DialogDescription>
                                  Atualize as configurações do token
                                </DialogDescription>
                              </DialogHeader>
                              <TokenEditForm
                                token={token}
                                onSubmit={handleUpdateToken}
                                isLoading={updateTokenMutation.isPending}
                              />
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mensagens de Contato</CardTitle>
              <CardDescription>
                Mensagens recebidas através do formulário de contato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>{message.id}</TableCell>
                        <TableCell>{message.name}</TableCell>
                        <TableCell>{message.email}</TableCell>
                        <TableCell>{message.subject}</TableCell>
                        <TableCell>
                          <Badge variant={message.read ? "default" : "outline"}>
                            {message.read ? "Lida" : "Não lida"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(message.createdAt), "dd/MM/yyyy HH:mm", { locale: pt })}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewMessage(message)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{message.subject}</DialogTitle>
                                <DialogDescription>
                                  De: {message.name} ({message.email})
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <p className="whitespace-pre-wrap">{message.message}</p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </div>
  );
};

interface TokenEditFormProps {
  token: Token;
  onSubmit: (data: Partial<Token>) => void;
  isLoading: boolean;
}

const TokenEditForm = ({ token, onSubmit, isLoading }: TokenEditFormProps) => {
  const [formData, setFormData] = useState({
    price: token.price.amount,
    available: token.available,
    active: token.active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      price: { ...token.price, amount: formData.price },
      available: formData.available,
      active: formData.active,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="price">Preço ({token.price.currency})</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
        />
      </div>
      
      <div>
        <Label htmlFor="available">Tokens Disponíveis</Label>
        <Input
          id="available"
          type="number"
          value={formData.available}
          onChange={(e) => setFormData({ ...formData, available: parseInt(e.target.value) || 0 })}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          id="active"
          type="checkbox"
          checked={formData.active}
          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
        />
        <Label htmlFor="active">Token Ativo</Label>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
};

interface CreateTokenFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const CreateTokenForm = ({ onSubmit, isLoading }: CreateTokenFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    price: 0,
    currency: "BRL",
    available: 1000000,
    minimum: 100,
    active: true,
    imageUrl: "",
    contractAddress: "",
    blockchain: "BSC",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: { amount: formData.price, currency: formData.currency },
      progress: 0, // Começa com 0% de progresso
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome do Token</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: MinhaCoin"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="symbol">Símbolo</Label>
          <Input
            id="symbol"
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
            placeholder="Ex: MCN"
            maxLength={5}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descrição do token..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Preço</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="currency">Moeda</Label>
          <select
            id="currency"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="BRL">BRL</option>
            <option value="USD">USD</option>
            <option value="USDT">USDT</option>
            <option value="BNB">BNB</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="minimum">Compra Mínima</Label>
          <Input
            id="minimum"
            type="number"
            value={formData.minimum}
            onChange={(e) => setFormData({ ...formData, minimum: parseInt(e.target.value) || 0 })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="available">Tokens Disponíveis</Label>
        <Input
          id="available"
          type="number"
          value={formData.available}
          onChange={(e) => setFormData({ ...formData, available: parseInt(e.target.value) || 0 })}
          required
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">URL da Imagem do Token (opcional)</Label>
        <Input
          id="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://exemplo.com/imagem-token.png"
        />
        <p className="text-sm text-gray-500 mt-1">
          Deixe em branco para usar um ícone padrão
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contractAddress">Endereço do Contrato</Label>
          <Input
            id="contractAddress"
            value={formData.contractAddress}
            onChange={(e) => setFormData({ ...formData, contractAddress: e.target.value })}
            placeholder="0x..."
          />
          <p className="text-sm text-gray-500 mt-1">
            Endereço do smart contract do token
          </p>
        </div>
        
        <div>
          <Label htmlFor="blockchain">Blockchain</Label>
          <select
            id="blockchain"
            value={formData.blockchain}
            onChange={(e) => setFormData({ ...formData, blockchain: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="BSC">Binance Smart Chain (BSC)</option>
            <option value="ETH">Ethereum</option>
            <option value="POLYGON">Polygon</option>
            <option value="SOLANA">Solana</option>
            <option value="CARDANO">Cardano</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          id="active"
          type="checkbox"
          checked={formData.active}
          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
        />
        <Label htmlFor="active">Token Ativo (visível para usuários)</Label>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Criando..." : "Criar Token"}
        </Button>
      </div>
    </form>
  );
};

export default AdminPanel;