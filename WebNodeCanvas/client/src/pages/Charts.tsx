import { useState } from "react";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  DollarSign
} from "lucide-react";

// Mock data for charts
const mockPriceData = [
  { time: "00:00", ZUM: 0.45, PIX: 0.50, META: 0.75, BRT: 0.02 },
  { time: "04:00", ZUM: 0.48, PIX: 0.52, META: 0.78, BRT: 0.021 },
  { time: "08:00", ZUM: 0.52, PIX: 0.49, META: 0.81, BRT: 0.019 },
  { time: "12:00", ZUM: 0.55, PIX: 0.53, META: 0.85, BRT: 0.022 },
  { time: "16:00", ZUM: 0.58, PIX: 0.51, META: 0.88, BRT: 0.020 },
  { time: "20:00", ZUM: 0.60, PIX: 0.54, META: 0.92, BRT: 0.023 },
  { time: "24:00", ZUM: 0.62, PIX: 0.56, META: 0.95, BRT: 0.024 },
];

const mockVolumeData = [
  { name: "ZUM", volume: 1250000, percentage: 35 },
  { name: "PIX", volume: 980000, percentage: 28 },
  { name: "META", volume: 750000, percentage: 21 },
  { name: "BRT", volume: 570000, percentage: 16 },
];

const mockMarketData = [
  { time: "Jan", marketCap: 1500000 },
  { time: "Feb", marketCap: 1750000 },
  { time: "Mar", marketCap: 2100000 },
  { time: "Apr", marketCap: 1950000 },
  { time: "May", marketCap: 2350000 },
  { time: "Jun", marketCap: 2800000 },
];

const tokenColors = {
  ZUM: "#8884d8",
  PIX: "#82ca9d", 
  META: "#ffc658",
  BRT: "#ff7c7c"
};

const Charts = () => {
  const [selectedToken, setSelectedToken] = useState<string>("ZUM");
  const [timeframe, setTimeframe] = useState<string>("24h");

  // Fetch tokens for dropdown
  const { data: tokens = [] } = useQuery({
    queryKey: ['/api/tokens'],
    queryFn: () => apiRequest('/api/tokens'),
  });

  const stats = [
    {
      title: "Volume Total 24h",
      value: "R$ 3.550.000",
      change: "+12.5%",
      trend: "up",
      icon: BarChart3
    },
    {
      title: "Market Cap Total",
      value: "R$ 2.800.000",
      change: "+8.3%", 
      trend: "up",
      icon: PieChartIcon
    },
    {
      title: "Tokens Ativos",
      value: "4",
      change: "0%",
      trend: "neutral",
      icon: Activity
    },
    {
      title: "Preço Médio",
      value: "R$ 0.54",
      change: "+5.2%",
      trend: "up", 
      icon: DollarSign
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gráficos de Mercado</h1>
          <p className="text-muted-foreground">
            Acompanhe preços, volumes e tendências dos tokens em tempo real
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : stat.trend === "down" ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : null}
                  <span className={`text-sm ${
                    stat.trend === "up" ? "text-green-500" : 
                    stat.trend === "down" ? "text-red-500" : 
                    "text-muted-foreground"
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecionar Token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ZUM">ZumCoin (ZUM)</SelectItem>
              <SelectItem value="PIX">PixCoin (PIX)</SelectItem>
              <SelectItem value="META">MetaPix (META)</SelectItem>
              <SelectItem value="BRT">BrasilToken (BRT)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Hora</SelectItem>
              <SelectItem value="24h">24 Horas</SelectItem>
              <SelectItem value="7d">7 Dias</SelectItem>
              <SelectItem value="30d">30 Dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="price" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="price">Preços</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="market">Market Cap</TabsTrigger>
            <TabsTrigger value="comparison">Comparação</TabsTrigger>
          </TabsList>

          <TabsContent value="price" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gráfico de Preços - {selectedToken}</CardTitle>
                <CardDescription>
                  Evolução do preço nas últimas {timeframe === "24h" ? "24 horas" : timeframe}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockPriceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`R$ ${value}`, 'Preço']}
                        labelFormatter={(label) => `Horário: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey={selectedToken} 
                        stroke={tokenColors[selectedToken as keyof typeof tokenColors]} 
                        fill={tokenColors[selectedToken as keyof typeof tokenColors]}
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volume" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Volume de Negociação</CardTitle>
                <CardDescription>
                  Volume de negociação por token nas últimas 24h
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Volume']}
                      />
                      <Bar dataKey="volume" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Market Cap Total</CardTitle>
                <CardDescription>
                  Evolução da capitalização de mercado total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockMarketData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Market Cap']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="marketCap" 
                        stroke="#8884d8" 
                        strokeWidth={3}
                        dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comparação de Preços</CardTitle>
                  <CardDescription>
                    Todos os tokens em um gráfico
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockPriceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="ZUM" stroke={tokenColors.ZUM} />
                        <Line type="monotone" dataKey="PIX" stroke={tokenColors.PIX} />
                        <Line type="monotone" dataKey="META" stroke={tokenColors.META} />
                        <Line type="monotone" dataKey="BRT" stroke={tokenColors.BRT} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Volume</CardTitle>
                  <CardDescription>
                    Participação de cada token no volume total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockVolumeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          dataKey="percentage"
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                        >
                          {mockVolumeData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={tokenColors[entry.name as keyof typeof tokenColors]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
      <WhatsAppChat />
    </div>
  );
};

export default Charts;