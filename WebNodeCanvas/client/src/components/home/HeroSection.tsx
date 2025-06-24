const HeroSection = () => {
  return (
    <section
      id="intro"
      className="bg-gradient-to-r from-primary to-blue-700 text-white py-16"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            CriptoVenda - Invista no Futuro das Criptomoedas
          </h2>
          <p className="text-xl md:text-2xl mb-8">
            Plataforma completa para investir em tokens emergentes com segurança e transparência.
            Criada por Mateus Dias Rocha, mesmo criador da ZumCoin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#tokens"
              className="bg-white text-primary font-medium px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all"
            >
              Ver Tokens Listados
            </a>
            <a
              href="#kyc"
              className="bg-transparent border-2 border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
            >
              Verificação KYC
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
