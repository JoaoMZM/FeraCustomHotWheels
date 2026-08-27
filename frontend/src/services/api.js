const API_URL = 'http://localhost:8080';

// ==========================================================
// MOCK DE DADOS — remover quando o backend estiver disponível
// ==========================================================

const CHAVE_CARRINHO = 'fera_carrinho_mock';

const PRODUTOS_MOCK = [
  {
    id: '1',
    sku: '1001',
    nome: 'Miniatura Guerreiro Élfico - Linha Fantasia',
    categoria: 'Fantasia',
    preco: 89.9,
    precoOriginal: 109.9,
    estoque: 12,
    imagemUrl: '',
  },
  {
    id: '2',
    sku: '1002',
    nome: 'Miniatura Dragão Ancião - Linha Fantasia',
    categoria: 'Fantasia',
    preco: 149.9,
    precoOriginal: null,
    estoque: 4,
    imagemUrl: '',
  },
  {
    id: '3',
    sku: '1003',
    nome: 'Miniatura Soldado Espacial - Linha Sci-Fi',
    categoria: 'Sci-Fi',
    preco: 74.5,
    precoOriginal: null,
    estoque: 0,
    imagemUrl: '',
  },
  {
    id: '4',
    sku: '1004',
    nome: 'Miniatura Robô de Combate - Linha Sci-Fi',
    categoria: 'Sci-Fi',
    preco: 129.0,
    precoOriginal: 159.0,
    estoque: 8,
    imagemUrl: '',
  },
  {
    id: '5',
    sku: '1005',
    nome: 'Diorama Base Rochosa 10cm',
    categoria: 'Acessórios',
    preco: 39.9,
    precoOriginal: null,
    estoque: 20,
    imagemUrl: '',
  },
];

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

const lerCarrinho = () => {
  try {
    const dados = localStorage.getItem(CHAVE_CARRINHO);
    return dados ? JSON.parse(dados) : [];
  } catch {
    return [];
  }
};

const salvarCarrinho = (itens) => {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
};

// ==========================================================
// PRODUTOS
// ==========================================================

/**
 * @param {{ busca?: string, categoria?: string }} filtros
 */
export const listarProdutos = async (filtros = {}) => {
  await delay();

  let resultado = [...PRODUTOS_MOCK];

  if (filtros.busca) {
    const termo = filtros.busca.toLowerCase();
    resultado = resultado.filter((p) => p.nome.toLowerCase().includes(termo));
  }

  if (filtros.categoria && filtros.categoria !== 'todas') {
    resultado = resultado.filter((p) => p.categoria === filtros.categoria);
  }

  return resultado;
};

export const buscarProduto = async (id) => {
  await delay();

  const produto = PRODUTOS_MOCK.find((p) => String(p.id) === String(id));

  if (!produto) {
    throw new Error('Produto não encontrado.');
  }

  return produto;
};

// ==========================================================
// CARRINHO
// ==========================================================

/**
 * Retorna os itens do carrinho já combinados com os dados do produto
 * (nome, preço, imagem, estoque disponível).
 */
export const listarCarrinho = async () => {
  await delay(200);

  const carrinho = lerCarrinho();

  return carrinho
    .map((item) => {
      const produto = PRODUTOS_MOCK.find(
        (p) => String(p.id) === String(item.produtoId)
      );

      if (!produto) return null;

      return {
        id: item.id,
        produtoId: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        imagemUrl: produto.imagemUrl,
        estoque: produto.estoque,
        quantidade: item.quantidade,
      };
    })
    .filter(Boolean);
};

/**
 * @param {{ produtoId: string|number, quantidade: number }} item
 */
export const adicionarAoCarrinho = async ({ produtoId, quantidade }) => {
  await delay(200);

  const produto = PRODUTOS_MOCK.find((p) => String(p.id) === String(produtoId));

  if (!produto) {
    throw new Error('Produto não encontrado.');
  }

  if (produto.estoque <= 0) {
    throw new Error('Produto sem estoque disponível.');
  }

  const carrinho = lerCarrinho();
  const existente = carrinho.find((i) => String(i.produtoId) === String(produtoId));

  if (existente) {
    const novaQtd = Math.min(existente.quantidade + quantidade, produto.estoque);
    existente.quantidade = novaQtd;
  } else {
    carrinho.push({
      id: `${produtoId}-${Date.now()}`,
      produtoId,
      quantidade: Math.min(quantidade, produto.estoque),
    });
  }

  salvarCarrinho(carrinho);

  return { sucesso: true };
};

/**
 * Atualiza a quantidade de um item já existente no carrinho.
 * Se a quantidade final for <= 0, remove o item.
 *
 * @param {string} id - id do item no carrinho (não é o id do produto)
 * @param {number} quantidade
 */
export const atualizarQuantidadeCarrinho = async (id, quantidade) => {
  await delay(150);

  let carrinho = lerCarrinho();
  const item = carrinho.find((i) => i.id === id);

  if (!item) {
    throw new Error('Item não encontrado no carrinho.');
  }

  const produto = PRODUTOS_MOCK.find(
    (p) => String(p.id) === String(item.produtoId)
  );

  const estoqueMax = produto ? produto.estoque : 99;

  if (quantidade <= 0) {
    carrinho = carrinho.filter((i) => i.id !== id);
  } else {
    item.quantidade = Math.min(quantidade, estoqueMax);
  }

  salvarCarrinho(carrinho);

  return { sucesso: true };
};

export const removerDoCarrinho = async (id) => {
  await delay(150);

  const carrinho = lerCarrinho().filter((i) => i.id !== id);
  salvarCarrinho(carrinho);

  return { sucesso: true };
};

export const finalizarCompra = async () => {
  await delay(500);

  const carrinho = lerCarrinho();

  if (carrinho.length === 0) {
    throw new Error('Seu carrinho está vazio.');
  }

  const pedido = {
    id: `PED-${Date.now()}`,
    itens: carrinho,
    data: new Date().toISOString(),
  };

  salvarCarrinho([]);

  return pedido;
};

// ==========================================================
// USUÁRIOS (mantido igual — quando o backend voltar, ativa de novo)
// ==========================================================

export const cadastrarUsuario = async (dadosUsuario) => {
  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosUsuario),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensagem || 'Erro ao cadastrar usuário.');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no serviço de cadastro:', error);
    throw error;
  }
};