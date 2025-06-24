import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Wallet from "@/pages/Wallet";
import Charts from "@/pages/Charts";
import AdminPanel from "@/pages/AdminPanel";
import { WalletProvider } from "./context/WalletContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/wallet" component={Wallet} />
      <Route path="/charts" component={Charts} />
      <Route path="/admin" component={AdminPanel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WalletProvider>
      <Router />
      <Toaster />
    </WalletProvider>
  );
}

export default App;
