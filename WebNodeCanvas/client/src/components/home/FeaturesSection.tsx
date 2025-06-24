interface Feature {
  icon: string;
  title: string;
  description: string;
}

const FeaturesSection = () => {
  const features: Feature[] = [
    {
      icon: "account_balance_wallet",
      title: "Conexão de Carteiras",
      description:
        "Integração com carteiras populares como MetaMask, Trust Wallet e outras opções seguras para transações.",
    },
    {
      icon: "show_chart",
      title: "Gráficos Dinâmicos",
      description:
        "Visualize gráficos em tempo real de compra e venda, histórico de preços e movimentação do mercado.",
    },
    {
      icon: "payments",
      title: "Múltiplos Pagamentos",
      description:
        "Pague com Pix para transações em reais, ou utilize BNB e USDT para operações com criptomoedas.",
    },
    {
      icon: "verified_user",
      title: "Verificação KYC",
      description:
        "Processo de verificação de identidade simples e seguro para garantir a segurança de todas as transações.",
    },
    {
      icon: "security",
      title: "Segurança Avançada",
      description:
        "Proteção de dados e transações com criptografia de ponta e autenticação em múltiplos fatores.",
    },
    {
      icon: "support_agent",
      title: "Suporte 24/7",
      description:
        "Equipe de suporte disponível a qualquer momento para resolver dúvidas e auxiliar em suas operações.",
    },
  ];

  return (
    <section id="features" className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Funcionalidades
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-center w-12 h-12 bg-primary bg-opacity-10 rounded-full mb-4">
                <span className="material-icons text-primary">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-medium">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
