const Footer = () => {
  return (
    <footer className="bg-dark text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">CriptoVenda</h4>
            <p className="text-gray-400">
              A plataforma mais segura e confiável para investir em tokens de criptomoedas emergentes.
            </p>
            <div className="mt-4 text-sm text-gray-400">
              <p>Criado por: <span className="font-medium">Mateus Dias Rocha</span></p>
              <p>Mesmo criador da ZumCoin</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#tokens" className="text-gray-400 hover:text-white">
                  Tokens
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-400 hover:text-white">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#kyc" className="text-gray-400 hover:text-white">
                  Verificação KYC
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white">
                  Contato
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Ajuda</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Suporte
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-2">
              Receba atualizações sobre novos tokens e ofertas.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Seu email"
                className="p-2 rounded-l-lg w-full"
                required
              />
              <button
                type="submit"
                className="bg-primary px-4 rounded-r-lg hover:bg-blue-700"
              >
                <span className="material-icons">send</span>
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 CriptoVenda by Mateus Dias Rocha. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
