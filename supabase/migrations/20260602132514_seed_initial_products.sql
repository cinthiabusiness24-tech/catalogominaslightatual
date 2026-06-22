/*
  # Seed inicial de categorias e produtos da Minas Light

  Insere as categorias e 12 produtos originais do catálogo estático
  com suas respectivas imagens, para que o catálogo público esteja
  imediatamente populado após a migração.

  Cada produto recebe:
  - Dados completos (nome, descrição, características, etc.)
  - Uma imagem primária (URL Pexels)
  - Status 'active' e ordem de exibição sequencial
*/

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO categories (name, slug) VALUES
  ('Tela Tensionada', 'tela-tensionada'),
  ('Pendentes', 'pendentes'),
  ('Lineares', 'lineares'),
  ('Embutidos', 'embutidos'),
  ('Decorativos', 'decorativos')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- PRODUCTS + IMAGES (usando CTE para manter referências)
-- ============================================================

WITH inserted AS (
  INSERT INTO products (name, category, short_description, full_description, features, ideal_environments, light_type, material, tag, is_featured, display_order, status)
  VALUES
    (
      'Painel Tensionado Luminoso XL',
      'Tela Tensionada',
      'Painel de tela tensionada retroiluminado com difusão uniforme e acabamento premium.',
      'O Painel Tensionado Luminoso XL é a expressão máxima da iluminação arquitetural contemporânea. Construído com tecido tensionado de alta precisão e iluminação LED de espectro completo, oferece difusão de luz absolutamente uniforme, eliminando qualquer ponto de sombra ou variação de brilho.',
      ARRAY['Difusão de luz 100% uniforme','Estrutura de alumínio aeronáutico','Tecido translúcido premium antirreflexo','LED de alto CRI (>95)','Temperatura de cor ajustável 2700K–6500K','Compatível com sistema dimmers'],
      ARRAY['Salas de estar','Lobbies corporativos','Showrooms','Spas e hotéis'],
      'LED retroiluminado de espectro completo',
      'Alumínio anodizado + Tecido tensionado PVC premium',
      'Destaque',
      true, 1, 'active'
    ),
    (
      'Painel Circular Backlight',
      'Tela Tensionada',
      'Painel circular retroiluminado com estrutura de precisão e efeito visual impactante.',
      'Design escultural em formato circular, o Painel Circular Backlight transforma qualquer ambiente com um focal point de impacto máximo. A estrutura anelar em alumínio polido permite instalação em teto, parede ou como elemento suspenso.',
      ARRAY['Formato circular sob medida','Estrutura anelar em alumínio polido','Difusor de tecido premium','LED perimetral de alta eficiência','Acabamento em dourado, prata ou preto mate'],
      ARRAY['Suítes master','Salas de jantar','Recepções exclusivas'],
      'LED perimetral com difusor central',
      'Alumínio polido + Tecido tensionado de alta transmitância',
      NULL,
      false, 2, 'active'
    ),
    (
      'Luminária Linear Slim Pro',
      'Lineares',
      'Perfil linear de altíssima precisão para iluminação arquitetural de teto e parede.',
      'A Luminária Linear Slim Pro representa a evolução da iluminação linear contemporânea. Com apenas 15mm de espessura, integra-se perfeitamente em qualquer superfície, criando linhas de luz puras e contínuas.',
      ARRAY['Perfil ultra-slim de 15mm','Alumínio extrudado grau aeronáutico','Comprimentos contínuos de até 6 metros','Driver integrado alta eficiência','IP44 disponível para banheiros','Acabamento anodizado ou lacado'],
      ARRAY['Corredores','Cozinhas','Banheiros','Áreas comerciais'],
      'LED linear de alta eficiência (CRI >90)',
      'Alumínio extrudado + Difusor PMMA',
      'Novo',
      false, 3, 'active'
    ),
    (
      'Pendente Arquitectural Sphere',
      'Pendentes',
      'Pendente esférico de design escultural com luz difusa e acabamento artesanal.',
      'O Pendente Arquitectural Sphere é uma peça de design onde a forma e a luz se fundem em harmonia perfeita. A esfera translúcida em vidro soprado artesanal cria uma difusão de luz absolutamente singular.',
      ARRAY['Vidro soprado artesanalmente','Cúpula dourado fosco 24K','Dimmerável 0-100%','Fonte de alimentação oculta','Cabo têxtil premium incluso','Altura ajustável'],
      ARRAY['Salas de jantar','Entradas','Ambientes de alto padrão'],
      'LED E27 filamento premium',
      'Vidro borossilicato soprado + Latão banhado a ouro',
      NULL,
      false, 4, 'active'
    ),
    (
      'Plafon Embutido Slim 75',
      'Embutidos',
      'Downlight de recorte 75mm com óptica de precisão e zero ofuscamento.',
      'O Plafon Embutido Slim 75 redefine o padrão dos downlights premium. Desenvolvido com tecnologia anti-ofuscamento UGR<19, elimina completamente o desconforto visual enquanto entrega iluminação precisa e sofisticada.',
      ARRAY['Recorte mínimo de 75mm','UGR < 19 anti-ofuscamento','CRI > 97 (luz natural)','Acabamento flush com o teto','Ângulos 15°, 24° e 38° disponíveis','Garantia de 5 anos'],
      ARRAY['Quartos','Home offices','Galerias de arte','Restaurantes'],
      'LED de alto CRI integrado',
      'Alumínio fundido de alta precisão',
      NULL,
      false, 5, 'active'
    ),
    (
      'Painel Tensionado Arquitetural',
      'Tela Tensionada',
      'Solução modular de grande formato para tetos e sancas com iluminação integrada.',
      'Pensado para grandes projetos arquiteturais, o Painel Tensionado Arquitetural oferece uma solução completa e modular para cobrir extensas superfícies com iluminação perfeitamente uniforme.',
      ARRAY['Sistema modular sem costuras','Grande formato até 10m x 10m','Uniformidade luminosa >90%','Estrutura autoportante','Manutenção simplificada','Personalização de layout'],
      ARRAY['Lobbies corporativos','Centros comerciais','Hospitais','Aeroportos'],
      'LED de alta potência com controlador DALI',
      'Perfil estrutural de alumínio + Tecido translúcido ignífugo',
      'Premium',
      true, 6, 'active'
    ),
    (
      'Spot Trilho Magnético',
      'Embutidos',
      'Sistema de trilho magnético com spots modulares para total flexibilidade criativa.',
      'O sistema de Trilho Magnético representa o futuro da iluminação adaptável. Os spots encaixam magneticamente ao trilho embutido no teto, permitindo reposicionamento instantâneo sem ferramentas.',
      ARRAY['Encaixe magnético instantâneo','Repositório em qualquer posição','Ópticas intercambiáveis','Mini-dimensões ultra-discretas','Rotação 350° + inclinação 90°','Compatível com protocolo DALI'],
      ARRAY['Galerias','Lojas premium','Museus','Residências contemporâneas'],
      'LED spot de alta eficiência 20W',
      'Alumínio anodizado mate + Componentes magnéticos de precisão',
      'Novo',
      false, 7, 'active'
    ),
    (
      'Arandela Escultural Bronze',
      'Decorativos',
      'Arandela de parede em bronze fundido com difusor de alabastro natural.',
      'A Arandela Escultural Bronze é uma obra de arte funcional, fundida artesanalmente em bronze e finalizada com alabastro natural selecionado à mão.',
      ARRAY['Bronze fundido artesanalmente','Alabastro natural selecionado','Cada peça é única','Patina envelhecida natural','Fiação oculta por dentro da parede','Acabamentos personalizados'],
      ARRAY['Suítes','Salas de estar','Corredores nobres','Áreas de leitura'],
      'LED G9 dimmerável',
      'Bronze maciço + Alabastro natural',
      'Exclusivo',
      false, 8, 'active'
    ),
    (
      'Sanca Iluminada Premium',
      'Lineares',
      'Sistema completo de iluminação indireta para sancas com perfil de alumínio oculto.',
      'O sistema de Sanca Iluminada Premium oferece uma solução completa e sofisticada para criar aquela iluminação indireta perfeita que todo projeto de alto padrão merece.',
      ARRAY['Perfil de alumínio embutível','Ângulo de direcionamento ajustável','Fita LED de alta CRI integrada','Conectores sem solda','Kit completo de instalação','Personalização de comprimento'],
      ARRAY['Salas de estar','Dormitórios','Áreas de TV','Espaços comerciais'],
      'Fita LED de alta densidade (CRI >92)',
      'Alumínio anodizado + Difusor opalino premium',
      NULL,
      false, 9, 'active'
    ),
    (
      'Painel Backlight Translúcido',
      'Tela Tensionada',
      'Painel com impressão digital em tela translúcida e retroiluminação LED uniforme.',
      'Combine arte e luz no Painel Backlight Translúcido. A tecnologia de impressão UV sobre tela translúcida permite criar murais luminosos de impacto excepcional.',
      ARRAY['Impressão UV de alta resolução','Tela translúcida premium','Retroiluminação uniforme','Personalização total de imagens','Troca de imagem possível','Estrutura desmontável'],
      ARRAY['Lojas','Estandes','Áreas corporativas','Recepções'],
      'LED retroiluminado de espectro amplo',
      'Tela PVC translúcida + Estrutura de alumínio',
      NULL,
      false, 10, 'active'
    ),
    (
      'Luminária de Piso Arquitectural',
      'Decorativos',
      'Luminária de chão de design minimalista com difusor em mármore natural.',
      'A Luminária de Piso Arquitectural é uma declaração de design que ilumina e decora simultaneamente. O fuste em latão escovado sustenta um difusor em mármore Carrara selecionado.',
      ARRAY['Fuste em latão escovado','Difusor em mármore Carrara','Base em granito natural','Ajuste de altura','Cabeamento têxtil premium','Dimmerável 0-100%'],
      ARRAY['Salas de estar','Escritórios','Lounges','Ambientes de leitura'],
      'LED E27 filamento vintage premium',
      'Latão escovado + Mármore Carrara + Granito',
      'Exclusivo',
      false, 11, 'active'
    ),
    (
      'Perfil Linear de Embutir Angular',
      'Lineares',
      'Perfil para canto de 90° com iluminação bidirecional e acabamento imperceptível.',
      'Desenvolvido para criar transições luminosas nas arestas dos espaços, o Perfil Linear Angular oferece iluminação bidirecional a 90° com acabamento que se integra perfeitamente ao reboco.',
      ARRAY['Ângulo exato de 90°','Iluminação bidirecional','Integração perfeita a reboco','Extrusão de alumínio de precisão','Comprimento sob medida','Difusor fosco incluso'],
      ARRAY['Tetos com recuos','Nichos de iluminação','Passagens arquiteturais'],
      'Fita LED premium bidirecional',
      'Alumínio extrudado de precisão + Difusor PC opalino',
      NULL,
      false, 12, 'active'
    )
  RETURNING id, name
)
INSERT INTO product_images (product_id, url, storage_path, is_primary, display_order)
SELECT
  p.id,
  CASE p.name
    WHEN 'Painel Tensionado Luminoso XL'       THEN 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1'
    WHEN 'Painel Circular Backlight'            THEN 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1'
    WHEN 'Luminária Linear Slim Pro'            THEN 'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1'
    WHEN 'Pendente Arquitectural Sphere'        THEN 'https://images.pexels.com/photos/2506990/pexels-photo-2506990.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1'
    WHEN 'Plafon Embutido Slim 75'              THEN 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1'
    WHEN 'Painel Tensionado Arquitetural'       THEN 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1'
    WHEN 'Spot Trilho Magnético'                THEN 'https://images.pexels.com/photos/3225529/pexels-photo-3225529.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1'
    WHEN 'Arandela Escultural Bronze'           THEN 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1'
    WHEN 'Sanca Iluminada Premium'              THEN 'https://images.pexels.com/photos/1488327/pexels-photo-1488327.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1'
    WHEN 'Painel Backlight Translúcido'         THEN 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1'
    WHEN 'Luminária de Piso Arquitectural'      THEN 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1'
    WHEN 'Perfil Linear de Embutir Angular'     THEN 'https://images.pexels.com/photos/4846461/pexels-photo-4846461.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1'
  END,
  '',
  true,
  0
FROM inserted p;
