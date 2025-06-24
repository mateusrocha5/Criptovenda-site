import axios from 'axios';

// Tipos para as notícias
export interface CryptoNews {
  id: string;
  guid: string;
  published_on: number;
  imageurl: string;
  title: string;
  url: string;
  source: string;
  body: string;
  tags: string;
  categories: string;
  upvotes: number;
  downvotes: number;
  lang: string;
  source_info: {
    name: string;
    lang: string;
    img: string;
  };
}

// Tipos para a resposta da API
interface CryptoNewsResponse {
  Type: number;
  Message: string;
  Promoted: any[];
  Data: CryptoNews[];
  RateLimit: any;
  HasWarning: boolean;
}

// Obter a chave da API das variáveis de ambiente
const API_KEY = process.env.CRYPTOCOMPARE_API_KEY;
const BASE_URL = 'https://min-api.cryptocompare.com/data';

/**
 * Busca as notícias mais recentes sobre criptomoedas
 * @param categories Categorias para filtrar notícias (e.g. BTC, ETH, XRP)
 * @param excludeCategories Categorias para excluir
 * @param lang Código do idioma (PT para Português, EN para Inglês)
 * @param sortOrder Ordem de classificação ('latest' ou 'popular')
 * @param limit Número máximo de notícias a serem retornadas
 */
export async function getLatestNews(
  categories?: string,
  excludeCategories?: string,
  lang: string = 'PT', // Default para Português
  sortOrder: 'latest' | 'popular' = 'latest',
  limit: number = 10
): Promise<CryptoNews[]> {
  try {
    const response = await axios.get<CryptoNewsResponse>(`${BASE_URL}/v2/news/`, {
      params: {
        categories: categories,
        excludeCategories: excludeCategories,
        lang: lang,
        sortOrder: sortOrder,
        limit: limit
      },
      headers: {
        'authorization': `Apikey ${API_KEY}`
      }
    });

    return response.data.Data;
  } catch (error) {
    console.error('Erro ao buscar notícias de criptomoedas:', error);
    return [];
  }
}

/**
 * Busca notícias por termo de pesquisa
 * @param query Termo de pesquisa
 * @param lang Código do idioma (PT para Português, EN para Inglês)
 * @param limit Número máximo de notícias a serem retornadas
 */
export async function searchNews(
  query: string,
  lang: string = 'PT',
  limit: number = 10
): Promise<CryptoNews[]> {
  try {
    const allNews = await getLatestNews('', '', lang, 'latest', 50);
    
    // Filtra as notícias que contêm o termo de pesquisa no título ou corpo
    const filteredNews = allNews.filter(news => 
      news.title.toLowerCase().includes(query.toLowerCase()) || 
      news.body.toLowerCase().includes(query.toLowerCase())
    );
    
    return filteredNews.slice(0, limit);
  } catch (error) {
    console.error('Erro ao pesquisar notícias:', error);
    return [];
  }
}

/**
 * Retorna notícias de criptomoedas agrupadas por categoria
 */
export async function getNewsByCategory(
  lang: string = 'PT',
  limit: number = 5
): Promise<Record<string, CryptoNews[]>> {
  try {
    // Principais categorias de interesse
    const categories = ['Bitcoin', 'Ethereum', 'BNB', 'Altcoin', 'DeFi', 'NFT'];
    const result: Record<string, CryptoNews[]> = {};
    
    // Busca notícias para cada categoria
    for (const category of categories) {
      result[category] = await getLatestNews(category, '', lang, 'latest', limit);
    }
    
    return result;
  } catch (error) {
    console.error('Erro ao buscar notícias por categoria:', error);
    return {};
  }
}