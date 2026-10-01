import axios from 'axios';

const API_URL = 'https://localhost:443';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      if (originalRequest.url === '/clientes/refresh') {
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        await api.post('/clientes/refresh');

        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const getErrorMessage = (error, mensagemPadrao) => {
  return (
    error.response?.data?.mensagem ||
    error.response?.data?.message ||
    mensagemPadrao
  );
};

export const cadastrarUsuario = async (dadosUsuario) => {
  try {
    const response = await api.post('/clientes', dadosUsuario);
    return response.data;
  } catch (error) {
    console.error('Erro no serviço de cadastro:', error);
    throw new Error(getErrorMessage(error, 'Erro ao cadastrar usuário.'));
  }
};

export const buscarProdutos = async (idCategoria = null) => {
  try {
    const endpoint = idCategoria && idCategoria !== 'todas'
      ? `/produtos/categoria/${idCategoria}`
      : '/produtos';

    const response = await api.get(endpoint);

    const dados = response.data;
    if (Array.isArray(dados)) return dados;
    if (Array.isArray(dados?.data)) return dados.data;
    if (Array.isArray(dados?.produtos)) return dados.produtos;

    return [];
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw new Error(getErrorMessage(error, 'Erro ao carregar a lista de produtos.'));
  }
};

export const obterProdutoPorId = async (id) => {
  try {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produto com ID ${id}:`, error);
    throw new Error(getErrorMessage(error, 'Erro ao carregar os detalhes do produto.'));
  }
};

export const fazerLogin = async (dadosLogin) => {
  try {
    const response = await api.post('/clientes/login', dadosLogin, {
      withCredentials: true,
    });

    localStorage.setItem('payload', JSON.stringify(response.data.payload));

    return response.data;

  } catch (error) {
    console.error('Erro no serviço de login:', error);
    throw new Error(getErrorMessage(error, 'Erro ao realizar login.'));
  }
};

export const validarLogin = async () => {
  try {
    const response = await api.get('/clientes/validate', {
      withCredentials: true,
    });
    if(response.status != 200) {
      return false;
    }
    return response.data.logado;
  } catch (error) {
    return false;
  }
}

export const solicitarRecuperacao = async (email) => {
  try {
    const response = await api.post('/senha/recuperar-senha', { email });
    return response.data;
  } catch (error) {
    console.error('Erro no serviço de recuperação:', error);
    throw new Error(getErrorMessage(error, 'Erro ao solicitar recuperação.'));
  }
};

export const redefinirSenha = async ({ id_cliente, token, novaSenha }) => {
  try {
    const response = await api.post('/senha/redefinir-senha', {
      id_cliente,
      token,
      novaSenha,
    });
    return response.data;
  } catch (error) {
    console.error('Erro no serviço de redefinição:', error);
    throw new Error(getErrorMessage(error, 'Erro ao redefinir senha.'));
  }
};

async function request(endpoint, options = {}) {
  try {
    const response = await api({
      url: endpoint,
      ...options,
    });

    if (response.status === 204) {
      return { sucesso: true };
    }

    return response.data;
  } catch (error) {
    const mensagemErro = getErrorMessage(error, 'Erro ao processar requisição.');
    throw new Error(mensagemErro);
  }
}

export const listarProdutos = (filtros = {}) =>
  api.get("/produtos", { params: filtros });

/**
 * Busca os detalhes de um produto pelo ID.
 * @param {string|number} id
 */
export const buscarProduto = async (id) => {
  return await request(`/produtos/${id}`);
};

/**
 * Adiciona um produto ao carrinho.
 * @param {{ produtoId: string|number, quantidade: number }} item
 */
export const adicionarAoCarrinho = async ({ produtoId, quantidade }) => {
  return await request('/carrinho', {
    method: 'POST',
    data: { produtoId, quantidade },
  });
};

export const listarCarrinho = async () => {
  return await request('/carrinho');
};

export const listarCategorias = async () => {
  return await request('/categorias');
};

export const criarProduto = (formData) =>
  api.post("/admin/produtos", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const atualizarProduto = (id, formData) =>
  api.put(`/admin/produtos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const alternarStatusProduto = (id, ativo) =>
  api.patch(`/admin/produtos/${id}/status`, { ativo });

export const listarProdutosAdmin = () => api.get("/admin/produtos");

/**
 * Atualiza a quantidade de um item do carrinho.
 * @param {string|number} id - ID do item no carrinho
 * @param {number} quantidade
 */
export const atualizarQuantidadeCarrinho = async (id, quantidade) => {
  return await request(`/carrinho/${id}`, {
    method: 'PATCH',
    data: { quantidade },
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

export const listarPedidos = async () => {
  return await request('/pedidos');
};

export const fazerLoginAdmin = async (dadosLogin) => {
  try {
    const response = await api.post('/admin/login', dadosLogin, { withCredentials: true });
    localStorage.setItem('admin_payload', JSON.stringify(response.data.payload));
    return response.data;
  } catch (error) {
    console.error('Erro no serviço de login admin:', error);
    throw new Error(getErrorMessage(error, 'Erro ao realizar login administrativo.'));
  }
};

export const logoutAdmin = async () => {
  try {
    const response = await api.post('/admin/logout');
    localStorage.removeItem('admin_payload');
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer logout admin:', error);
    throw new Error(getErrorMessage(error, 'Erro ao sair.'));
  }
};