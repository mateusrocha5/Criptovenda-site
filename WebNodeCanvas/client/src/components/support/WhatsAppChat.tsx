import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Eu sou a assistente virtual do CriptoVenda. Como posso te ajudar hoje?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(newMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("preço") || input.includes("valor") || input.includes("cotação")) {
      return "Os preços dos tokens variam constantemente. Você pode verificar os preços atuais na seção 'Gráficos' do nosso site. ZumCoin está cotada a R$ 0,62, PixCoin a R$ 0,56, MetaPix a R$ 0,95 e BrasilToken a R$ 0,024.";
    }
    
    if (input.includes("comprar") || input.includes("investir") || input.includes("adquirir")) {
      return "Para comprar tokens, você precisa: 1) Conectar sua carteira Web3, 2) Completar o processo de KYC, 3) Escolher o token desejado na página inicial. Aceitamos pagamentos em PIX, BNB e USDT.";
    }
    
    if (input.includes("carteira") || input.includes("wallet") || input.includes("metamask")) {
      return "Suportamos várias carteiras Web3 como MetaMask, TrustWallet e WalletConnect. Acesse a seção 'Carteira' para conectar e gerenciar seus tokens.";
    }
    
    if (input.includes("kyc") || input.includes("verificação") || input.includes("documento")) {
      return "O processo de KYC é obrigatório para compras. Você precisa fornecer: nome completo, CPF, telefone, endereço e data de nascimento. A verificação leva até 24 horas.";
    }
    
    if (input.includes("suporte") || input.includes("ajuda") || input.includes("contato")) {
      return "Para suporte especializado, entre em contato pelo WhatsApp: +55 11 97382-9459. Nossa equipe está disponível de segunda a sexta, das 9h às 18h.";
    }
    
    if (input.includes("zumcoin") || input.includes("zum")) {
      return "ZumCoin é o token principal criado por Mateus Dias Rocha. É um token inovador com foco em pagamentos rápidos e seguros. Preço atual: R$ 0,62 com alta de 5,2% nas últimas 24h.";
    }
    
    if (input.includes("mateus") || input.includes("criador") || input.includes("fundador")) {
      return "Mateus Dias Rocha é o criador do CriptoVenda e também da famosa ZumCoin. Com anos de experiência no mercado cripto, ele desenvolveu esta plataforma para democratizar o acesso a tokens emergentes.";
    }
    
    if (input.includes("segurança") || input.includes("seguro") || input.includes("confiável")) {
      return "Utilizamos as mais avançadas tecnologias de segurança: criptografia de ponta, autenticação multi-fator, armazenamento seguro de dados e smart contracts auditados.";
    }
    
    if (input.includes("oi") || input.includes("olá") || input.includes("hello")) {
      return "Olá! Bem-vindo ao CriptoVenda! Como posso te ajudar hoje? Posso esclarecer dúvidas sobre tokens, processos de compra, carteiras ou qualquer outra questão.";
    }
    
    return "Entendi sua pergunta! Para um atendimento mais personalizado, recomendo entrar em contato pelo WhatsApp: +55 11 97382-9459. Nossa equipe especializada poderá te ajudar melhor. Ou você pode perguntar sobre: preços, como comprar, carteiras, KYC, ZumCoin ou segurança.";
  };

  const handleWhatsAppRedirect = () => {
    const message = "Olá! Vim do site CriptoVenda e gostaria de mais informações sobre os tokens.";
    const whatsappUrl = `https://wa.me/5511973829459?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg bg-green-500 hover:bg-green-600"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 h-96 shadow-xl">
        <CardHeader className="bg-green-500 text-white rounded-t-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-green-600 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm">CriptoVenda Assistant</CardTitle>
                <p className="text-xs opacity-90">Online agora</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-green-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col h-80">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1"
              />
              <Button type="submit" size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            
            <div className="mt-2">
              <Button
                onClick={handleWhatsAppRedirect}
                variant="outline"
                size="sm"
                className="w-full text-green-600 border-green-600 hover:bg-green-50"
              >
                Falar no WhatsApp Real
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppChat;