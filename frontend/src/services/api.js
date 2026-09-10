const API_URL = 'https://localhost:443';

const getHeaders = (requerAutenticacao = true) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (requerAutenticacao) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Auxiliar para tratar respostas da API
const tratarResposta = async (resposta) => {
  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    const mensagemErro =
      dados.mensagem || dados.message || "Ocorreu um erro ao processar a requisição.";
    throw new Error(mensagemErro);
  }

  return dados;
};

export const listarCategorias = async () => {
  const res = await fetch(`${API_URL}/categorias`, {
    headers: getHeaders(false),
  });
  return tratarResposta(res);
};

export const listarProdutos = async (filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  const res = await fetch(`${API_URL}/produtos?${params}`, {
    headers: getHeaders(false),
  });
  return tratarResposta(res);
};

export const listarCarrinho = async () => {
  const res = await fetch(`${API_URL}/carrinho`, {
    headers: getHeaders(true),
  });
  return tratarResposta(res);
};

export const atualizarQuantidadeCarrinho = async (itemId, quantidade) => {
  const res = await fetch(`${API_URL}/carrinho/${itemId}`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify({ quantidade }),
  });
  return tratarResposta(res);
};

export const removerDoCarrinho = async (itemId) => {
  const res = await fetch(`${API_URL}/carrinho/${itemId}`, {
    method: "DELETE",
    headers: getHeaders(true),
  });
  return tratarResposta(res);
};

export const listarProdutosAdmin = async () => {
  const res = await fetch(`${API_URL}/admin/produtos`, {
    headers: getHeaders(true),
  });
  return tratarResposta(res);
};

export const criarProduto = async (dadosProduto) => {
  const res = await fetch(`${API_URL}/admin/produtos`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(dadosProduto),
  });
  return tratarResposta(res);
};

export const atualizarProduto = async (id, dadosProduto) => {
  const res = await fetch(`${API_URL}/admin/produtos/${id}`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(dadosProduto),
  });
  return tratarResposta(res);
};

export const alternarStatusProduto = async (id, ativo) => {
  const res = await fetch(`${API_URL}/admin/produtos/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(true),
    body: JSON.stringify({ ativo }),
  });
  return tratarResposta(res);
};

export const loginUsuario = async (credenciais) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify(credenciais),
  });
  return tratarResposta(res);
};