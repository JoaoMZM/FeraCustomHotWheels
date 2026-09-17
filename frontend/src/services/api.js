import axios from "axios";

const API_URL = "https://localhost:443";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const mensagemErro =
      error.response?.data?.mensagem ||
      error.response?.data?.message ||
      "Ocorreu um erro ao processar a requisição.";
    return Promise.reject(new Error(mensagemErro));
  }
);

export const listarCategorias = () => api.get("/categorias");

export const listarProdutos = (filtros = {}) =>
  api.get("/produtos", { params: filtros });

export const listarCarrinho = () => api.get("/carrinho");

export const atualizarQuantidadeCarrinho = (itemId, quantidade) =>
  api.put(`/carrinho/${itemId}`, { quantidade });

export const removerDoCarrinho = (itemId) =>
  api.delete(`/carrinho/${itemId}`);

export const listarProdutosAdmin = () => api.get("/admin/produtos");

export const criarProduto = (dadosProduto) =>
  api.post("/admin/produtos", dadosProduto);

export const atualizarProduto = (id, dadosProduto) =>
  api.put(`/admin/produtos/${id}`, dadosProduto);

export const alternarStatusProduto = (id, ativo) =>
  api.patch(`/admin/produtos/${id}/status`, { ativo });

export const loginUsuario = (credenciais) =>
  api.post("/auth/login", credenciais);