import { useState, useCallback } from 'react';

export interface GameState {
  phase: 'setup' | 'naming' | 'playing' | 'reveal';
  numberOfPlayers: number;
  playerNames: string[];
  currentPlayerIndex: number;
  impostorIndex: number;
  secretWord: string;
  playerCards: string[];
  revealedPlayers: Set<number>;
}

const WORDS = [
  // Animais
  'Gato', 'Cachorro', 'Leão', 'Tigre', 'Elefante', 'Girafa', 'Zebra', 'Macaco', 'Pinguim', 'Pássaro',
  'Peixe', 'Tubarão', 'Golfinho', 'Baleia', 'Urso', 'Lobo', 'Raposa', 'Coelho', 'Veado', 'Cobra',
  'Aranha', 'Borboleta', 'Abelha', 'Formiga', 'Coruja', 'Gavião', 'Flamingo', 'Papagaio', 'Crocodilo', 'Hipopótamo',
  
  // Comida e Bebida
  'Pizza', 'Hambúrguer', 'Sorvete', 'Chocolate', 'Café', 'Suco', 'Refrigerante', 'Cerveja', 'Vinho', 'Champagne',
  'Pão', 'Bolo', 'Biscoito', 'Doce', 'Caramelo', 'Brigadeiro', 'Beijinho', 'Pão de Queijo', 'Feijoada', 'Churrasco',
  'Moqueca', 'Acarajé', 'Pastel', 'Coxinha', 'Empada', 'Lasanha', 'Macarrão', 'Arroz', 'Feijão', 'Salada',
  'Sopa', 'Caldo', 'Fruta', 'Maçã', 'Banana', 'Laranja', 'Morango', 'Melancia', 'Abacaxi', 'Melão',
  'Uva', 'Pêra', 'Limão', 'Coco', 'Goiaba', 'Manga', 'Mamão', 'Cereja', 'Amora',
  
  // Tecnologia
  'Computador', 'Celular', 'Tablet', 'Notebook', 'Teclado', 'Mouse', 'Monitor', 'Impressora', 'Scanner', 'Câmera',
  'Telefone', 'Fone', 'Microfone', 'Webcam', 'Drone', 'Smartwatch', 'Videogame', 'Controle', 'Joystick', 'Carregador',
  'Internet', 'WiFi', 'Bluetooth', 'Aplicativo', 'Software', 'Programa', 'Arquivo', 'Pasta', 'Desktop', 'Ícone',
  
  // Lugares e Pontos Turísticos Mundiais
  'Torre Eiffel', 'Big Ben', 'Estátua da Liberdade', 'Cristo Redentor', 'Coliseu', 'Pirâmides do Egito', 'Taj Mahal',
  'Muro da China', 'Stonehenge', 'Machu Picchu', 'Angkor Wat', 'Sagrada Família', 'Palácio de Versalhes', 'Kremlin',
  'Palácio de Buckingham', 'Basílica de São Pedro', 'Ópera de Sydney', 'Ponte do Brooklyn', 'Golden Gate', 'Ponte de Londres',
  
  // Cidades Mundiais
  'Paris', 'Londres', 'Nova York', 'Tóquio', 'Berlim', 'Roma', 'Madri', 'Amsterdã', 'Barcelona', 'Veneza',
  'Praga', 'Viena', 'Moscou', 'Dubai', 'Singapura', 'Hong Kong', 'Bangkok', 'Istambul', 'Cairo', 'Marrakech',
  'Cidade do México', 'Buenos Aires', 'Lima', 'Cartagena', 'Havana', 'Toronto', 'Vancouver', 'Los Angeles', 'Chicago', 'Miami',
  
  // Países
  'Brasil', 'Portugal', 'Itália', 'Espanha', 'França', 'Alemanha', 'Holanda', 'Bélgica', 'Suíça', 'Áustria',
  'Suécia', 'Noruega', 'Dinamarca', 'Finlândia', 'Polônia', 'República Tcheca', 'Hungria', 'Romênia', 'Grécia', 'Turquia',
  'Egito', 'Marrocos', 'África do Sul', 'Quênia', 'Japão', 'China', 'Índia', 'Tailândia', 'Vietnã', 'Indonésia',
  'Austrália', 'Nova Zelândia', 'Canadá', 'Estados Unidos', 'México', 'Argentina', 'Chile', 'Colômbia', 'Peru', 'Equador',
  
  // Celebridades Mundiais - Futebolistas
  'Neymar', 'Pelé', 'Ronaldinho', 'Ronaldo', 'Cristiano Ronaldo', 'Messi', 'Mbappé', 'Haaland', 'Benzema', 'Modric',
  'Iniesta', 'Xavi', 'Zidane', 'Maradona', 'Eusébio', 'Cruyff', 'Beckham', 'Vinicius Junior', 'Richarlison', 'Gabriel Jesus', 'Antony',
  
  // Celebridades Mundiais - Música
  'Taylor Swift', 'Beyoncé', 'Rihanna', 'Ariana Grande', 'Dua Lipa', 'The Weeknd', 'Drake', 'Bad Bunny', 'Post Malone', 'Billie Eilish',
  'Ed Sheeran', 'Bruno Mars', 'Justin Bieber', 'Shakira', 'Anitta', 'Ludmilla', 'Pabllo Vittar', 'Ivete Sangalo', 'Claudia Leitte',
  'Gal Costa', 'Gilberto Gil', 'Tom Jobim', 'João Gilberto', 'Caetano Veloso', 'Legião Urbana', 'Titãs', 'Engenheiros do Hawaii',
  
  // Celebridades Mundiais - Cinema e TV
  'Tom Hanks', 'Leonardo DiCaprio', 'Brad Pitt', 'Johnny Depp', 'Morgan Freeman', 'Denzel Washington', 'Will Smith', 'Tom Cruise', 'Keanu Reeves',
  'Meryl Streep', 'Angelina Jolie', 'Jennifer Aniston', 'Scarlett Johansson', 'Margot Robbie', 'Zendaya', 'Emma Watson', 'Millie Bobby Brown',
  'Bruna Marquezine', 'Camila Queiroz', 'Grazi Massafera',
  
  // Celebridades Brasileiras
  'Gisele Bündchen', 'Fernanda Montenegro', 'Sônia Braga',
  
  // Temas Brasileiros
  'Samba', 'Carnaval', 'Bossa Nova', 'Forró', 'Axé', 'Tropicália', 'Sertanejo', 'Funk Carioca', 'Pagode', 'Samba-Enredo',
  'Capoeira', 'Futebol', 'Praia', 'Floresta Amazônica', 'Pantanal', 'Cerrado', 'Mata Atlântica', 'Açaí', 'Guaraná', 'Cachaça',
  'Cacau', 'Café', 'Açúcar', 'Cana-de-Açúcar', 'Etanol', 'Petróleo', 'Minério de Ferro', 'Ouro', 'Diamante', 'Esmeralda',
  
  // São Paulo - Pontos Turísticos e Locais Famosos
  'Avenida Paulista', 'MASP', 'Pinacoteca', 'Mercadão', 'Rua 25 de Março', 'Pátio do Colégio', 'Catedral da Sé', 'Mosteiro de São Bento',
  'Parque do Ibirapuera', 'Museu do Ipiranga', 'Estádio do Morumbi', 'Estádio do Pacaembu', 'Estádio do Corinthians', 'Estádio do Palmeiras',
  'Zona Leste', 'Zona Oeste', 'Zona Norte', 'Zona Sul', 'Centro', 'Vila Madalena', 'Pinheiros', 'Consolação', 'Bom Retiro', 'Brás',
  'Tatuapé', 'Penha', 'Itaquera', 'Itaim Bibi', 'Mooca', 'Saúde', 'Ipiranga', 'Santo Amaro', 'Diadema', 'São Caetano do Sul',
  'Osasco', 'Barueri', 'Guarulhos', 'Campinas', 'Sorocaba', 'Ribeirão Preto', 'Araraquara', 'Piracicaba', 'Limeira', 'Jundiaí',
  'Viaduto do Chá', 'Ponte Estaiada', 'Ponte Imigrantes', 'Rodoviária', 'Estação da Luz', 'Estação Julio Prestes', 'Teatro Municipal',
  'Sala São Paulo', 'Sesc Pompéia', 'Sesc Belenzinho', 'Sesc Carmo', 'Biblioteca Mário de Andrade', 'Biblioteca Alceu Amoroso Lima',
  
  // Litoral Paulista e Cidades Litorâneas
  'Guarujá', 'Ubatuba', 'Ilhabela', 'São Sebastião', 'Caraguatatuba', 'Bertioga', 'Praia Grande', 'Mongaguá', 'Peruíbe', 'Iguape',
  'Cananéia', 'Copacabana', 'Ipanema', 'Leblon', 'Barra da Tijuca', 'Niterói', 'Búzios', 'Cabo Frio', 'Arraial do Cabo', 'Paraty',
  'Angra dos Reis', 'Mangaratiba', 'Itanhaém', 'Praia do Rosa', 'Garopaba', 'Laguna', 'Bombinhas', 'Balneário Camboriú', 'Blumenau',
  
  // Natureza e Paisagens
  'Montanha', 'Praia', 'Floresta', 'Deserto', 'Savana', 'Tundra', 'Pântano', 'Lago', 'Rio', 'Cachoeira',
  'Caverna', 'Vulcão', 'Geleira', 'Recife de Coral', 'Mangue', 'Cerrado', 'Caatinga', 'Litoral', 'Estuário', 'Delta',
  'Lua', 'Sol', 'Estrela', 'Planeta', 'Cometa', 'Asteroide', 'Nuvem', 'Chuva', 'Arco-íris', 'Trovão',
  'Relâmpago', 'Neblina', 'Orvalho', 'Geada', 'Neve', 'Granizo', 'Tornado', 'Furacão', 'Terremoto', 'Tsunami',
  
  // Esportes
  'Futebol', 'Basquete', 'Tênis', 'Natação', 'Atletismo', 'Ginástica', 'Judô', 'Karatê', 'Boxe', 'MMA',
  'Vôlei', 'Handebol', 'Hóquei', 'Críquete', 'Beisebol', 'Golfe', 'Esqui', 'Snowboard', 'Surfe', 'Skate',
  'Escalada', 'Paraquedismo', 'Bungee Jump', 'Mergulho', 'Vela', 'Canoagem', 'Rafting', 'Ciclismo', 'Hipismo', 'Arco e Flecha',
  'Curling', 'Bobsled', 'Patinação', 'Dança', 'Yoga', 'Pilates', 'Crossfit', 'Musculação', 'Corrida',
  
  // Artes e Cultura
  'Pintura', 'Escultura', 'Fotografia', 'Cinema', 'Teatro', 'Dança', 'Música', 'Literatura', 'Poesia', 'Prosa',
  'Quadrinho', 'Animação', 'Documentário', 'Série', 'Filme', 'Novela', 'Telenovela', 'Reality Show', 'Game Show', 'Jornal',
  'Revista', 'Podcast', 'Blog', 'Vlog', 'TikTok', 'Instagram', 'YouTube', 'Twitch', 'Discord',
  
  // Cores
  'Vermelho', 'Azul', 'Verde', 'Amarelo', 'Roxo', 'Laranja', 'Rosa', 'Marrom', 'Preto', 'Branco',
  'Cinza', 'Bege', 'Turquesa', 'Magenta', 'Ciano', 'Ouro', 'Prata', 'Bronze', 'Cobre', 'Violeta',
  
  // Profissões
  'Médico', 'Enfermeiro', 'Dentista', 'Psicólogo', 'Advogado', 'Juiz', 'Promotor', 'Policial', 'Bombeiro', 'Militar',
  'Engenheiro', 'Arquiteto', 'Designer', 'Programador', 'Desenvolvedor', 'Hacker', 'Jornalista', 'Fotógrafo', 'Diretor', 'Produtor',
  'Ator', 'Cantante', 'Músico', 'Compositor', 'Maestro', 'Dançarino', 'Coreógrafo', 'Professor', 'Pesquisador', 'Cientista',
  'Astrônomo', 'Biólogo', 'Químico', 'Físico', 'Matemático', 'Historiador', 'Arqueólogo', 'Antropólogo', 'Sociólogo', 'Economista',
  'Contador', 'Auditor', 'Consultor', 'Gerente', 'CEO', 'Presidente', 'Ministro', 'Senador', 'Deputado', 'Vereador',
  'Prefeito', 'Governador', 'Embaixador', 'Diplomata', 'Piloto', 'Comissário', 'Capitão', 'Marinheiro', 'Mecânico', 'Eletricista',
  'Encanador', 'Carpinteiro', 'Pedreiro', 'Pintor', 'Jardineiro', 'Fazendeiro', 'Pescador', 'Caçador', 'Chef', 'Cozinheiro',
  'Garçom', 'Barman', 'Sommelier', 'Padeiro', 'Pasteleiro', 'Confeiteiro', 'Açougueiro', 'Fruticultor', 'Florista', 'Veterinário',
  'Zootecnista', 'Agrônomo', 'Geólogo', 'Meteorologista', 'Oceanógrafo', 'Ecólogo', 'Ambientalista',
  
  // Objetos Comuns
  'Livro', 'Caneta', 'Lápis', 'Borracha', 'Caderno', 'Papel', 'Tesoura', 'Cola', 'Fita', 'Clipe',
  'Grampeador', 'Furador', 'Régua', 'Compasso', 'Transferidor', 'Calculadora', 'Relógio', 'Despertador', 'Lanterna', 'Vela',
  'Espelho', 'Pente', 'Escova', 'Toalha', 'Sabonete', 'Shampoo', 'Condicionador', 'Desodorante', 'Perfume', 'Maquiagem',
  'Batom', 'Sombra', 'Rímel', 'Base', 'Pó', 'Blush', 'Bronzer', 'Iluminador', 'Contorno', 'Corretivo',
  'Roupa', 'Camiseta', 'Calça', 'Saia', 'Vestido', 'Jaqueta', 'Casaco', 'Suéter', 'Blusa', 'Camisa',
  'Shorts', 'Bermuda', 'Calção', 'Legging', 'Meia', 'Cueca', 'Sutiã', 'Calcinha', 'Gravata', 'Lenço',
  'Chapéu', 'Boné', 'Gorro', 'Echarpe', 'Cachecol', 'Luva', 'Bota', 'Sapato', 'Tênis', 'Chinelo',
  'Sandália', 'Mule', 'Salto Alto', 'Mocassim', 'Pantufla', 'Mochila', 'Bolsa', 'Carteira', 'Porta-moedas', 'Chaveiro',
  'Cinto', 'Anel', 'Colar', 'Pulseira', 'Brinco', 'Broche', 'Alfinete', 'Corrente', 'Pingente', 'Óculos',
  'Óculos de Sol', 'Lente de Contato', 'Armação', 'Lupa', 'Binóculo', 'Telescópio', 'Microscópio', 'Periscópio',
  
  // Móveis e Decoração
  'Cama', 'Sofá', 'Poltrona', 'Cadeira', 'Mesa', 'Criado', 'Guarda-roupa', 'Cômoda', 'Prateleira', 'Estante',
  'Armário', 'Freezer', 'Geladeira', 'Fogão', 'Forno', 'Micro-ondas', 'Liquidificador', 'Batedeira', 'Torradeira', 'Cafeteira',
  'Panela', 'Frigideira', 'Assadeira', 'Forma', 'Peneira', 'Ralador', 'Escorredor', 'Coador', 'Colher', 'Garfo',
  'Faca', 'Prato', 'Tigela', 'Xícara', 'Copo', 'Garrafa', 'Jarra', 'Bule', 'Chaleira', 'Açucareiro',
  'Manteigueira', 'Saleiro', 'Pimenteiro', 'Molheira', 'Travessa', 'Bandeja', 'Talheres', 'Louça', 'Cristal', 'Vidro',
  'Cerâmica', 'Porcelana', 'Barro', 'Madeira', 'Metal', 'Plástico', 'Silicone', 'Borracha', 'Cortiça', 'Tapete',
  'Cortina', 'Persiana', 'Cortinado', 'Almofada', 'Colcha', 'Edredom', 'Lençol', 'Fronha', 'Manta', 'Quadro',
  'Espelho', 'Luminária', 'Abajur', 'Vela', 'Incenso', 'Difusor', 'Plantas', 'Flores', 'Vasos', 'Potes',
  'Caixas', 'Gavetas', 'Nichos', 'Cabideiro', 'Adesivo', 'Painel',
  
  // Meios de Transporte
  'Carro', 'Bicicleta', 'Moto', 'Ônibus', 'Táxi', 'Uber', 'Trem', 'Metrô', 'Bonde', 'Ônibus Articulado',
  'Caminhão', 'Van', 'Kombi', 'Jipe', 'SUV', 'Sedan', 'Hatchback', 'Perua', 'Conversível', 'Limusine',
  'Ambulância', 'Carro de Polícia', 'Carro de Bombeiros', 'Trator', 'Escavadeira', 'Retroescavadeira', 'Pá Carregadeira', 'Rolo Compressor',
  'Avião', 'Helicóptero', 'Drone', 'Paraquedas', 'Asa Delta', 'Balão', 'Dirigível', 'Foguete', 'Nave Espacial', 'Satélite',
  'Barco', 'Iate', 'Lancha', 'Canoa', 'Caiaque', 'Jangada', 'Navio', 'Navio de Cruzeiro', 'Cargueiro', 'Petroleiro',
  'Submarino', 'Balsa', 'Rebocador', 'Draga', 'Navio Pesqueiro', 'Navio Militar', 'Porta-aviões', 'Destroyer', 'Fragata',
  
  // Edifícios e Construções
  'Casa', 'Apartamento', 'Mansão', 'Castelo', 'Palácio', 'Fortaleza', 'Convento', 'Mosteiro', 'Abadia', 'Catedral',
  'Igreja', 'Mesquita', 'Sinagoga', 'Templo', 'Pagode', 'Pirâmide', 'Mausoléu', 'Monumento', 'Estátua', 'Obelisco',
  'Farol', 'Torre', 'Ponte', 'Viaduto', 'Túnel', 'Barragem', 'Eclusa', 'Porto', 'Aeroporto', 'Estação',
  'Metrô', 'Rodoviária', 'Garagem', 'Estacionamento', 'Hangar', 'Galpão', 'Armazém', 'Fábrica', 'Usina', 'Refinaria',
  'Escola', 'Universidade', 'Biblioteca', 'Museu', 'Galeria', 'Teatro', 'Cinema', 'Estádio', 'Ginásio', 'Piscina',
  'Parque', 'Praça', 'Jardim', 'Zoológico', 'Aquário', 'Circo', 'Parque de Diversões', 'Parque Temático', 'Cassino', 'Hotel',
  'Motel', 'Pousada', 'Albergue', 'Resort', 'Spa', 'Sauna', 'Academia', 'Estúdio de Dança', 'Consultório', 'Clínica',
  'Hospital', 'Maternidade', 'Asilo', 'Orfanato', 'Presídio', 'Quartel', 'Delegacia', 'Bombeiros', 'Polícia', 'Tribunal',
  'Câmara', 'Prefeitura', 'Governadoria', 'Palácio do Governo', 'Banco', 'Bolsa de Valores', 'Loja', 'Supermercado', 'Mercado', 'Feira',
  'Shopping', 'Galeria Comercial', 'Restaurante', 'Bar', 'Café', 'Pizzaria', 'Sorveteria', 'Padaria', 'Açougue', 'Peixaria',
  'Farmácia', 'Drogaria', 'Perfumaria', 'Livraria', 'Banca', 'Tabacaria', 'Joalheria', 'Relojoaria', 'Ótica', 'Sapatos',
  'Roupas', 'Bolsas', 'Acessórios', 'Eletrônicos', 'Informática', 'Móveis', 'Decoração', 'Louças', 'Vidros', 'Espelhos',
  'Tintas', 'Ferragens', 'Ferramentas', 'Materiais de Construção', 'Cimento', 'Areia', 'Brita', 'Tijolos', 'Telhas', 'Madeira',
  
  // Fenômenos Naturais
  'Terremoto', 'Tsunami', 'Furacão', 'Tornado', 'Tempestade', 'Raio', 'Trovão', 'Chuva', 'Neve', 'Granizo',
  'Neblina', 'Nevoeiro', 'Geada', 'Orvalho', 'Arco-íris', 'Aurora Boreal', 'Eclipse', 'Cometa', 'Meteoro', 'Meteorito',
  'Vulcão', 'Lava', 'Cinzas', 'Tremor', 'Fissura', 'Erupção', 'Gêiser', 'Fonte Termal', 'Poço de Petróleo', 'Mina',
  'Avalanche', 'Deslizamento', 'Enchente', 'Seca', 'Deserto', 'Oásis', 'Miragem', 'Areia', 'Poeira', 'Pó',
  
  // Sentimentos e Emoções
  'Alegria', 'Tristeza', 'Raiva', 'Medo', 'Amor', 'Ódio', 'Inveja', 'Ciúmes', 'Orgulho', 'Vergonha',
  'Culpa', 'Esperança', 'Desespero', 'Coragem', 'Covardia', 'Confiança', 'Desconfiança', 'Segurança', 'Insegurança', 'Calma',
  'Ansiedade', 'Stress', 'Relaxamento', 'Tensão', 'Excitação', 'Entusiasmo', 'Apatia', 'Melancolia', 'Euforia', 'Depressão',
  'Mania', 'Paranoia', 'Fobia', 'Pânico', 'Terror', 'Horror', 'Nojo', 'Repugnância', 'Aversão',
  
  // Conceitos Abstratos
  'Tempo', 'Espaço', 'Infinito', 'Eternidade', 'Momento', 'Segundo', 'Minuto', 'Hora', 'Dia', 'Noite',
  'Semana', 'Mês', 'Ano', 'Década', 'Século', 'Milênio', 'Era', 'Época', 'Período', 'Fase',
  'Passado', 'Presente', 'Futuro', 'Antes', 'Depois', 'Agora', 'Então', 'Sempre', 'Nunca', 'Raramente',
  'Frequentemente', 'Ocasionalmente', 'Eventualmente', 'Finalmente', 'Ultimamente', 'Recentemente', 'Antigamente', 'Outrora', 'Jamais',
  'Verdade', 'Mentira', 'Ilusão', 'Realidade', 'Ficção', 'Fantasia', 'Imaginação', 'Criatividade', 'Inteligência', 'Sabedoria',
  'Conhecimento', 'Ignorância', 'Aprendizado', 'Educação', 'Cultura', 'Civilização', 'Progresso', 'Evolução', 'Revolução', 'Transformação',
  'Mudança', 'Permanência', 'Estabilidade', 'Instabilidade', 'Equilíbrio', 'Desequilíbrio', 'Ordem', 'Caos', 'Harmonia', 'Discórdia',
  'Paz', 'Guerra', 'Conflito', 'Trégua', 'Aliança', 'Inimizade', 'Amizade', 'Inimigo', 'Aliado', 'Neutro',
  'Bem', 'Mal', 'Virtude', 'Vício', 'Honra', 'Desonra', 'Glória', 'Infâmia', 'Fama', 'Obscuridade',
  'Riqueza', 'Pobreza', 'Abundância', 'Escassez', 'Prosperidade', 'Miséria', 'Luxo', 'Simplicidade', 'Extravagância', 'Austeridade',
  'Liberdade', 'Escravidão', 'Prisão', 'Libertação', 'Opressão', 'Tirania', 'Democracia', 'Ditadura', 'Monarquia', 'República',
  'Justiça', 'Injustiça', 'Imparcialidade', 'Parcialidade', 'Equidade', 'Iniquidade', 'Igualdade', 'Desigualdade', 'Discriminação', 'Preconceito',
];

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'setup',
    numberOfPlayers: 0,
    playerNames: [],
    currentPlayerIndex: 0,
    impostorIndex: -1,
    secretWord: '',
    playerCards: [],
    revealedPlayers: new Set(),
  });

  const goToNaming = useCallback((numberOfPlayers: number) => {
    setGameState({
      phase: 'naming',
      numberOfPlayers,
      playerNames: Array(numberOfPlayers).fill(''),
      currentPlayerIndex: 0,
      impostorIndex: -1,
      secretWord: '',
      playerCards: [],
      revealedPlayers: new Set(),
    });
  }, []);

  const setPlayerNames = useCallback((names: string[]) => {
    setGameState((prev) => ({
      ...prev,
      playerNames: names,
    }));
  }, []);

  const startGame = useCallback(() => {
    // Use crypto.getRandomValues for better randomness
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    const impostorIndex = randomArray[0] % gameState.numberOfPlayers;
    
    const secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    
    const playerCards = Array.from({ length: gameState.numberOfPlayers }, (_, index) => {
      return index === impostorIndex ? '❓ IMPOSTOR' : `🎯 ${secretWord}`;
    });

    setGameState((prev) => ({
      ...prev,
      phase: 'playing',
      currentPlayerIndex: 0,
      impostorIndex,
      secretWord,
      playerCards,
      revealedPlayers: new Set(),
    }));
  }, [gameState.numberOfPlayers]);

  const nextPlayer = useCallback(() => {
    setGameState((prev) => {
      const nextIndex = (prev.currentPlayerIndex + 1) % prev.numberOfPlayers;
      const newRevealedPlayers = new Set(prev.revealedPlayers);
      newRevealedPlayers.add(prev.currentPlayerIndex);
      
      return {
        ...prev,
        currentPlayerIndex: nextIndex,
        revealedPlayers: newRevealedPlayers,
      };
    });
  }, []);

  const revealPlayer = useCallback(() => {
    setGameState((prev) => {
      const newRevealedPlayers = new Set(prev.revealedPlayers);
      newRevealedPlayers.add(prev.currentPlayerIndex);
      
      return {
        ...prev,
        revealedPlayers: newRevealedPlayers,
      };
    });
  }, []);

  const endGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      phase: 'reveal',
    }));
  }, []);

  const replayWithSameNames = useCallback(() => {
    // Start a new game with the same player names
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    const impostorIndex = randomArray[0] % gameState.numberOfPlayers;
    
    const secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    
    const playerCards = Array.from({ length: gameState.numberOfPlayers }, (_, index) => {
      return index === impostorIndex ? '❓ IMPOSTOR' : `🎯 ${secretWord}`;
    });

    setGameState((prev) => ({
      ...prev,
      phase: 'playing',
      currentPlayerIndex: 0,
      impostorIndex,
      secretWord,
      playerCards,
      revealedPlayers: new Set(),
    }));
    }, [gameState.numberOfPlayers, gameState.playerNames]);

  const resetGame = useCallback(() => {
    setGameState({
      phase: 'setup',
      numberOfPlayers: 0,
      playerNames: [],
      currentPlayerIndex: 0,
      impostorIndex: -1,
      secretWord: '',
      playerCards: [],
      revealedPlayers: new Set(),
    });
  }, []);

  return {
    gameState,
    goToNaming,
    setPlayerNames,
    startGame,
    nextPlayer,
    revealPlayer,
    endGame,
    replayWithSameNames,
    resetGame,
