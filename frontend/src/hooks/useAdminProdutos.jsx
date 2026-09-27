import { useState, useEffect, useCallback, useMemo } from "react";
import {
  listarProdutosAdmin,
  criarProduto,
  atualizarProduto,
  alternarStatusProduto,
  listarCategorias,
} from "../services/api.js";

const API_URL = 'https://localhost:443';

const formInicial = {
  id: null,
  nome: "",
  sku: "",
  id_categoria: "",
  preco: "",
  precoOriginal: "",
  estoque: "",
  imagemArquivo: null,
  descricao: "",
};

const paraBooleano = (valor) => {
  if (valor === undefined || valor === null) return true;
  if (typeof valor === "boolean") return valor;
  if (typeof valor === "number") return valor !== 0;
  if (typeof valor === "string") {
    const normalizado = valor.trim().toLowerCase();
    return normalizado !== "0" && normalizado !== "false" && normalizado !== "";
  }
  
  if (valor?.type === "Buffer" && Array.isArray(valor?.data)) {
    return valor.data[0] !== 0;
  }
  return Boolean(valor);
};

export function useAdminProdutos() {
  const [produtosRaw, setProdutosRaw] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [formData, setFormData] = useState(formInicial);
  const [busca, setBusca] = useState("");

  const carregarProdutos = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await listarProdutosAdmin();
      const lista = resposta.data?.data || [];
      setProdutosRaw(lista);
    } catch (err) {
      setErro(err.response?.data?.message || err.message || "Erro ao carregar a lista de produtos.");
    } finally {
      setCarregando(false);
    }
  }, []);

  const carregarCategorias = useCallback(async () => {
    try {
      const resultado = await listarCategorias();
      const lista = Array.isArray(resultado) ? resultado : (resultado?.data || []);
      setCategorias(lista);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  }, []);

  useEffect(() => {
    carregarProdutos();
    carregarCategorias();
  }, [carregarProdutos, carregarCategorias]);

  useEffect(() => {
    if (!sucesso) return;
    const timer = setTimeout(() => setSucesso(""), 3000);
    return () => clearTimeout(timer);
  }, [sucesso]);

  const produtos = useMemo(() => {
    return produtosRaw.map((p) => ({
      id: p.id_produto,
      nome: p.nome,
      sku: p.sku,
      descricao: p.descricao,
      preco: p.preco,
      precoOriginal: p.preco_original,
      estoque: p.estoque,
      id_categoria: p.id_categoria,
      categoria: categorias.find((c) => c.id_categoria === p.id_categoria)?.nome || "-",
      ativo: paraBooleano(p.ativo),
      imagemUrl: p.imagem_produto ? `${API_URL}/${p.imagem_produto}` : null,
    }));
  }, [produtosRaw, categorias]);

  const produtosFiltrados = useMemo(() => {
    if (!busca.trim()) return produtos;
    const termo = busca.trim().toLowerCase();
    return produtos.filter(
      (p) =>
        p.nome?.toLowerCase().includes(termo) ||
        p.sku?.toLowerCase().includes(termo) ||
        p.categoria?.toLowerCase().includes(termo)
    );
  }, [produtos, busca]);

  const handleAbrirCriar = () => {
    setFormData(formInicial);
    setModalAberto(true);
    setErro("");
  };

  const handleAbrirEditar = (produto) => {
    setFormData({
      id: produto.id,
      nome: produto.nome || "",
      sku: produto.sku || "",
      id_categoria: produto.id_categoria || "",
      preco: produto.preco || "",
      precoOriginal: produto.precoOriginal || "",
      estoque: produto.estoque ?? "",
      imagemArquivo: null,
      descricao: produto.descricao || "",
    });
    setModalAberto(true);
    setErro("");
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setFormData(formInicial);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, imagemArquivo: files[0] || null }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    setSucesso("");

    const fd = new FormData();
    fd.append("nome", formData.nome);
    fd.append("sku", formData.sku);
    fd.append("descricao", formData.descricao);
    fd.append("preco", formData.preco);
    fd.append("precoOriginal", formData.precoOriginal || "");
    fd.append("estoque", formData.estoque);
    fd.append("id_categoria", formData.id_categoria);

    if (formData.imagemArquivo) {
      fd.append("imagem_produto", formData.imagemArquivo);
    }

    try {
      if (formData.id) {
        await atualizarProduto(formData.id, fd);
        setSucesso("Produto atualizado com sucesso!");
      } else {
        await criarProduto(fd);
        setSucesso("Produto cadastrado com sucesso!");
      }

      handleFecharModal();
      await carregarProdutos();
    } catch (err) {
      setErro(err.response?.data?.message || err.message || "Erro ao salvar produto.");
    } finally {
      setSalvando(false);
    }
  };

  const handleAlternarStatus = async (id, statusAtual) => {
    const acao = statusAtual ? "inativar" : "ativar";
    if (!window.confirm(`Tem certeza que deseja ${acao} este produto?`)) return;

    try {
      await alternarStatusProduto(id, !statusAtual);
      setSucesso(`Produto ${statusAtual ? "inativado" : "ativado"} com sucesso!`);
      await carregarProdutos();
    } catch (err) {
      setErro(err.response?.data?.message || err.message || `Erro ao ${acao} produto.`);
    }
  };

  return {
    produtos: produtosFiltrados,
    categorias,
    carregando,
    salvando,
    erro,
    sucesso,
    modalAberto,
    formData,
    busca,
    setBusca,
    handleAbrirCriar,
    handleAbrirEditar,
    handleFecharModal,
    handleChange,
    handleSalvar,
    handleAlternarStatus,
    carregarProdutos,
  };
}

export default useAdminProdutos;