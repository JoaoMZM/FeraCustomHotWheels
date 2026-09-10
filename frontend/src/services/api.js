const API_URL = 'https://localhost:443';

export const cadastrarUsuario = async (dadosUsuario) => {
  try {
    const response = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosUsuario),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.mensagem || errorData.message || 'Erro ao cadastrar usuário.'
      );
    }

    return await response.json();

  } catch (error) {
    console.error('Erro no serviço de cadastro:', error);
    throw error;
  }
};

export const fazerLogin = async (dadosLogin) => {
  try {
    const response = await fetch(`${API_URL}/clientes/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(dadosLogin),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.mensagem || errorData.message || 'Erro ao realizar login.'
      );
    }

    return await response.json();

  } catch (error) {
    console.error('Erro no serviço de login:', error);
    throw error;
  }
};

export const solicitarRecuperacao = async (email) => {
  try {
    const response = await fetch(`${API_URL}/senha/recuperar-senha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.mensagem || errorData.message || 'Erro ao solicitar recuperação.'
      );
    }

    return await response.json();

  } catch (error) {
    console.error('Erro no serviço de recuperação:', error);
    throw error;
  }
};

export const redefinirSenha = async ({ id_cliente, token, novaSenha }) => {
  try {
    const response = await fetch(`${API_URL}/senha/redefinir-senha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_cliente, token, novaSenha }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.mensagem || errorData.message || 'Erro ao redefinir senha.'
      );
    }

    return await response.json();

  } catch (error) {
    console.error('Erro no serviço de redefinição:', error);
    throw error;
  }
};

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