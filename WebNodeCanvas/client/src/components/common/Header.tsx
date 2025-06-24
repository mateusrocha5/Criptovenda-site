import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Settings } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const Header = () => {
  const [location] = useLocation();
  const { connected, connectWallet, disconnectWallet, walletAddress } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Início", href: "/" },
    { name: "Carteira", href: "/wallet" },
    { name: "Gráficos", href: "/charts" },
    { name: "Suporte", href: "https://wa.me/5511973829459", external: true },
    { name: "Admin", href: "/admin" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CV</span>
              </div>
              <span className="font-bold text-lg">CriptoVenda</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    className="font-medium"
                  >
                    {item.name}
                  </Button>
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                >
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className="font-medium"
                  >
                    {item.name}
                  </Button>
                </Link>
              )
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {connected ? (
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                </div>
                <Button variant="outline" size="sm" onClick={disconnectWallet}>
                  Desconectar
                </Button>
              </div>
            ) : (
              <Button onClick={() => connectWallet("MetaMask")}>
                Conectar Carteira
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-6">
                {navigation.map((item) => (
                  item.external ? (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start font-medium"
                      >
                        {item.name}
                      </Button>
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant={isActive(item.href) ? "default" : "ghost"}
                        className="w-full justify-start font-medium"
                      >
                        {item.name}
                      </Button>
                    </Link>
                  )
                ))}
                
                <div className="pt-4 border-t">
                  {connected ? (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground px-3">
                        {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => {
                          disconnectWallet();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Desconectar
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => {
                        connectWallet("MetaMask");
                        setMobileMenuOpen(false);
                      }}
                    >
                      Conectar Carteira
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;