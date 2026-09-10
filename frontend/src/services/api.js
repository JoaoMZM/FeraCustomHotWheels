const API_URL = 'https://localhost:443';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let mensagemErro = 'Erro ao processar requisição.';
    try {
      const errorData = await response.json();
      mensagemErro = errorData.mensagem || errorData.message || mensagemErro;
    } catch {
      // Caso a resposta de erro não venha em formato JSON
    }
    throw new Error(mensagemErro);
  }

  if (response.status === 204) {
    return { sucesso: true };
  }

  return await response.json();
}

/**
 * Busca todas as categorias cadastradas.
 */
export const listarCategorias = async () => {
  return await request('/categorias');
};

/**
 * Busca produtos aplicando os filtros de busca e categoria via Query Params.
 * @param {{ busca?: string, categoria?: string }} filtros
 */
export const listarProdutos = async (filtros = {}) => {
  const params = new URLSearchParams();

  if (filtros.busca) {
    params.append('busca', filtros.busca);
  }

  if (filtros.categoria && filtros.categoria !== 'todas') {
    params.append('categoria', filtros.categoria);
  }

  const query = params.toString();
  return await request(`/produtos${query ? `?${query}` : ''}`);
};

/**
 * Busca os detalhes de um produto pelo ID.
 * @param {string|number} id
 */
export const buscarProduto = async (id) => {
  return await request(`/produtos/${id}`);
};

/**
 * Lista os itens que estão no carrinho do usuário.
 */
export const listarCarrinho = async () => {
  return await request('/carrinho');
};

/**
 * Adiciona um produto ao carrinho.
 * @param {{ produtoId: string|number, quantidade: number }} item
 */
export const adicionarAoCarrinho = async ({ produtoId, quantidade }) => {
  return await request('/carrinho', {
    method: 'POST',
    body: JSON.stringify({ produtoId, quantidade }),
  });
};

/**
 * Atualiza a quantidade de um item do carrinho.
 * @param {string|number} id - ID do item no carrinho
 * @param {number} quantidade
 */
export const atualizarQuantidadeCarrinho = async (id, quantidade) => {
  return await request(`/carrinho/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantidade }),
  });
};

/**
 * Remove um item do carrinho pelo ID.
 * @param {string|number} id
 */
export const removerDoCarrinho = async (id) => {
  return await request(`/carrinho/${id}`, {
    method: 'DELETE',
  });
};

export const finalizarCompra = async () => {
  return await request('/pedidos', {
    method: 'POST',
  });
};

/**
 * Realiza o cadastro de um novo usuário.
 * @param {Object} dadosUsuario
 */
export const cadastrarUsuario = async (dadosUsuario) => {
  return await request('/usuarios', {
    method: 'POST',
    body: JSON.stringify(dadosUsuario),
  });
};