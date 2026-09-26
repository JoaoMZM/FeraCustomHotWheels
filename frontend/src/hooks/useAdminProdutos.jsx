import { useState, useEffect, useCallback } from "react";
import {
  listarProdutosAdmin,
  criarProduto,
  atualizarProduto,
  alternarStatusProduto,
} from "../services/api.js"; // ajuste o caminho conforme a localização real de services/api.js

const formInicial = {
  id: null,
  nome: "",
  sku: "",
  categoria: "",
  preco: "",
  precoOriginal: "",
  estoque: "",
  imagemUrl: "",
  descricao: "",
};

export function useAdminProdutos() {
  const [produtos, setProdutos] = useState([]);
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
      const dados = await listarProdutosAdmin();
      setProdutos(Array.isArray(dados) ? dados : dados.produtos || []);
    } catch (err) {
      setErro(err.message || "Erro ao carregar a lista de produtos.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

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
      categoria: produto.categoria || "",
      preco: produto.preco || "",
      precoOriginal: produto.precoOriginal || "",
      estoque: produto.estoque ?? "",
      imagemUrl: produto.imagemUrl || "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    setSucesso("");

    const payload = {
      ...formData,
      preco: Number(formData.preco),
      precoOriginal: formData.precoOriginal ? Number(formData.precoOriginal) : null,
      estoque: Number(formData.estoque),
    };

    try {
      if (formData.id) {
        await atualizarProduto(formData.id, payload);
        setSucesso("Produto atualizado com sucesso!");
      } else {
        await criarProduto(payload);
        setSucesso("Produto cadastrado com sucesso!");
      }

      handleFecharModal();
      await carregarProdutos();
    } catch (err) {
      setErro(err.message || "Erro ao salvar produto.");
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
      setErro(err.message || `Erro ao ${acao} produto.`);
    }
  };

  const produtosFiltrados = produtos.filter(
    (p) =>
      p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      p.sku?.toLowerCase().includes(busca.toLowerCase()) ||
      p.categoria?.toLowerCase().includes(busca.toLowerCase())
  );

  return {
    // estado
    produtos: produtosFiltrados,
    carregando,
    salvando,
    erro,
    sucesso,
    modalAberto,
    formData,
    busca,
    // setters
    setBusca,
    // ações
    handleAbrirCriar,
    handleAbrirEditar,
    handleFecharModal,
    handleChange,
    handleSalvar,
    handleAlternarStatus,
    // reload manual, se precisar em algum outro lugar
    carregarProdutos,
  };
}

export default useAdminProdutos;
