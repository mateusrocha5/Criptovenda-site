import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { pt, enUS, es } from "date-fns/locale";
import { BiSearchAlt } from "react-icons/bi";

interface NewsItem {
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

// Componente de card de notícia
const NewsCard = ({ news, language = "PT" }: { news: NewsItem, language?: string }) => {
  // Selecionar o locale correto baseado no idioma
  const getLocale = () => {
    switch (language) {
      case "EN": return enUS;
      case "ES": return es;
      case "PT":
      default: return pt;
    }
  };
  
  // Selecionar o formato de data baseado no idioma
  const getDateFormat = () => {
    switch (language) {
      case "EN": return "MMMM dd, yyyy";
      case "ES": return "dd 'de' MMMM 'de' yyyy";
      case "PT":
      default: return "dd 'de' MMMM 'de' yyyy";
    }
  };
  
  // Texto do botão de leitura baseado no idioma
  const getReadMoreText = () => {
    switch (language) {
      case "EN": return "Read more";
      case "ES": return "Leer más";
      case "PT":
      default: return "Ler mais";
    }
  };
  
  // Formatar data de publicação
  const formattedDate = format(
    new Date(news.published_on * 1000),
    getDateFormat(), 
    { locale: getLocale() }
  );
  
  // Extrair categorias para badges
  const categoryTags = news.categories
    .split('|')
    .filter(cat => cat.trim() !== '')
    .slice(0, 3);
  
  // Limitar o tamanho do corpo da notícia
  const truncatedBody = news.body.length > 150 
    ? news.body.substring(0, 150) + '...' 
    : news.body;
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm text-muted-foreground">
            {formattedDate}
          </div>
          <div className="text-sm text-muted-foreground">
            {news.source_info.name}
          </div>
        </div>
        <CardTitle className="text-xl line-clamp-2">{news.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {news.imageurl && (
          <div className="mb-3 overflow-hidden rounded-md">
            <img 
              src={news.imageurl} 
              alt={news.title} 
              className="w-full h-40 object-cover hover:scale-105 transition-transform"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                // Substituir por um gradiente de fallback ao invés de esconder a imagem
                target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23667eea"/><stop offset="100%" stop-color="%23764ba2"/></linearGradient><rect width="100" height="100" fill="url(%23g)"/></svg>`;
                target.classList.add("news-fallback-image");
              }} 
            />
          </div>
        )}
        <CardDescription className="line-clamp-3 mb-2">
          {truncatedBody}
        </CardDescription>
        <div className="flex flex-wrap gap-2 mt-3">
          {categoryTags.map((category, index) => (
            <Badge key={index} variant="outline">
              {category.trim()}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.open(news.url, '_blank')}
        >
          {getReadMoreText()}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Componente principal de notícias
const NewsSection = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lang, setLang] = useState<string>("PT");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Buscar todas as notícias
  const { 
    data: allNews,
    isLoading: allNewsLoading,
    error: allNewsError,
    refetch: refetchAllNews
  } = useQuery<NewsItem[]>({
    queryKey: ['/api/news', lang],
    queryFn: () => apiRequest(`/api/news?lang=${lang}&limit=12`),
  });
  
  // Buscar notícias por categoria
  const { 
    data: newsByCategory,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery<Record<string, NewsItem[]>>({
    queryKey: ['/api/news/categories', lang],
    queryFn: () => apiRequest(`/api/news/categories?lang=${lang}`),
  });
  
  // Buscar notícias por pesquisa
  const { 
    data: searchResults,
    isLoading: searchLoading,
    error: searchError,
    refetch: refetchSearch
  } = useQuery<NewsItem[]>({
    queryKey: ['/api/news/search', searchQuery, lang],
    queryFn: () => apiRequest(`/api/news/search?q=${searchQuery}&lang=${lang}`),
    enabled: searchQuery.length > 0,
  });
  
  // Função para realizar a pesquisa
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetchSearch();
  };
  
  // Função para obter traduções baseadas no idioma selecionado
  const getTranslations = () => {
    switch(lang) {
      case "EN":
        return {
          title: "Cryptocurrency News",
          subtitle: "Follow the latest news and updates from the cryptocurrency world. Stay informed about market trends and most promising projects.",
          searchPlaceholder: "Search news...",
          noNewsByCat: "No news found for the selected category.",
          noNewsGeneral: "No news found.",
          tryAgain: "Try again",
          readMore: "Read more",
          searchError: "Error searching for news.",
          noResults: `No news found for: "${searchQuery}"`,
          enterKeyword: "Enter a keyword to search for news.",
          categories: "By Category",
          searchResults: "Search Results",
          all: "All"
        };
      case "ES":
        return {
          title: "Noticias de Criptomonedas",
          subtitle: "Sigue las últimas noticias y actualizaciones del mundo de las criptomonedas. Mantente informado sobre las tendencias del mercado y los proyectos más prometedores.",
          searchPlaceholder: "Buscar noticias...",
          noNewsByCat: "No se encontraron noticias para la categoría seleccionada.",
          noNewsGeneral: "No se encontraron noticias.",
          tryAgain: "Intentar de nuevo",
          readMore: "Leer más",
          searchError: "Error al buscar noticias.",
          noResults: `No se encontraron noticias para: "${searchQuery}"`,
          enterKeyword: "Introduce una palabra clave para buscar noticias.",
          categories: "Por Categoría",
          searchResults: "Resultados de Búsqueda",
          all: "Todas"
        };
      case "PT":
      default:
        return {
          title: "Notícias de Criptomoedas",
          subtitle: "Acompanhe as últimas notícias e atualizações do mundo das criptomoedas. Mantenha-se informado sobre as tendências do mercado e os projetos mais promissores.",
          searchPlaceholder: "Pesquisar notícias...",
          noNewsByCat: "Nenhuma notícia encontrada para a categoria selecionada.",
          noNewsGeneral: "Nenhuma notícia encontrada.",
          tryAgain: "Tentar novamente",
          readMore: "Ler mais",
          searchError: "Erro ao pesquisar notícias.",
          noResults: `Nenhuma notícia encontrada para: "${searchQuery}"`,
          enterKeyword: "Digite uma palavra-chave para pesquisar notícias.",
          categories: "Por Categoria",
          searchResults: "Resultados da Pesquisa",
          all: "Todas"
        };
    }
  };
  
  // Array para renderização de cards de carregamento
  const loadingCards = Array(6).fill(0);
  
  // Renderizar notícias com base na categoria selecionada
  const renderNewsByCategory = () => {
    if (categoriesLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingCards.map((_, index) => (
            <Card key={index} className="h-[400px]">
              <CardHeader>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-6 w-full mb-1" />
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }
    
    if (categoriesError) {
      return (
        <div className="text-center py-10">
          <p className="text-red-500">{getTranslations().searchError}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            {getTranslations().tryAgain}
          </Button>
        </div>
      );
    }
    
    if (!newsByCategory || Object.keys(newsByCategory).length === 0) {
      return (
        <div className="text-center py-10">
          <p>{getTranslations().noNewsGeneral}</p>
        </div>
      );
    }
    
    // Se a categoria ativa for 'all', exibir todas as notícias
    if (activeCategory === 'all') {
      if (allNewsLoading) {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingCards.map((_, index) => (
              <Card key={index} className="h-[400px]">
                <CardHeader>
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-6 w-full mb-1" />
                  <Skeleton className="h-6 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-40 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        );
      }
      
      if (allNewsError) {
        return (
          <div className="text-center py-10">
            <p className="text-red-500">{getTranslations().searchError}</p>
            <Button
              variant="outline"
              onClick={() => refetchAllNews()}
              className="mt-4"
            >
              {getTranslations().tryAgain}
            </Button>
          </div>
        );
      }
      
      if (!allNews || allNews.length === 0) {
        return (
          <div className="text-center py-10">
            <p>{getTranslations().noNewsGeneral}</p>
          </div>
        );
      }
      
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allNews.map(news => (
            <NewsCard key={news.id} news={news} language={lang} />
          ))}
        </div>
      );
    }
    
    // Exibir notícias da categoria selecionada
    const newsForCategory = newsByCategory[activeCategory] || [];
    
    if (newsForCategory.length === 0) {
      return (
        <div className="text-center py-10">
          <p>{getTranslations().noNewsByCat}</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsForCategory.map(news => (
          <NewsCard key={news.id} news={news} language={lang} />
        ))}
      </div>
    );
  };
  
  // Renderizar resultados da pesquisa
  const renderSearchResults = () => {
    if (searchLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingCards.map((_, index) => (
            <Card key={index} className="h-[400px]">
              <CardHeader>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-6 w-full mb-1" />
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }
    
    if (searchError) {
      return (
        <div className="text-center py-10">
          <p className="text-red-500">{getTranslations().searchError}</p>
          <Button
            variant="outline"
            onClick={() => refetchSearch()}
            className="mt-4"
          >
            {getTranslations().tryAgain}
          </Button>
        </div>
      );
    }
    
    if (!searchResults || searchResults.length === 0) {
      return (
        <div className="text-center py-10">
          <p>{getTranslations().noResults}</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map(news => (
          <NewsCard key={news.id} news={news} language={lang} />
        ))}
      </div>
    );
  };
  
  return (
    <section id="news" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">{getTranslations().title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {getTranslations().subtitle}
          </p>
        </div>
        
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <form 
            onSubmit={handleSearch}
            className="relative w-full md:w-1/3"
          >
            <Input
              type="text"
              placeholder={getTranslations().searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Button 
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full"
            >
              <BiSearchAlt className="h-5 w-5" />
              <span className="sr-only">{getTranslations().searchPlaceholder}</span>
            </Button>
          </form>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Select
              value={lang}
              onValueChange={setLang}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={lang === "EN" ? "Language" : lang === "ES" ? "Idioma" : "Idioma"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PT">Português</SelectItem>
                <SelectItem value="EN">English</SelectItem>
                <SelectItem value="ES">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="w-full md:w-auto mb-6 grid grid-cols-2">
            <TabsTrigger value="categories">{getTranslations().categories}</TabsTrigger>
            <TabsTrigger value="search">{getTranslations().searchResults}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            <div className="mb-6 overflow-x-auto">
              <div className="flex space-x-2 min-w-max pb-2">
                <Button
                  variant={activeCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory('all')}
                  className="min-w-20"
                >
                  {getTranslations().all}
                </Button>
                {newsByCategory && Object.keys(newsByCategory).map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                    className="min-w-20"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            {renderNewsByCategory()}
          </TabsContent>
          
          <TabsContent value="search">
            {searchQuery ? renderSearchResults() : (
              <div className="text-center py-10">
                <p>{getTranslations().enterKeyword}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default NewsSection;