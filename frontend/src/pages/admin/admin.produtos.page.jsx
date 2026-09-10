import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { listarProdutosAdmin, criarProduto, atualizarProduto, alternarStatusProduto } from "../../services/api.js";
import { IconesProdutos } from "../../components/icons/IconesProdutos.jsx";
import "./admin-produtos.page.css";

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

export default function AdminProdutosPage() {
  const navigate = useNavigate();

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

  return (
    <div className="admin-produtos-page">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-logo" onClick={() => navigate("/produtos")}>
            <strong>FERA CUSTOM</strong>
            <span className="badge-admin">Painel Admin</span>
          </div>

          <button
            type="button"
            className="btn-voltar-loja"
            onClick={() => navigate("/produtos")}
          >
            Ir para a Loja
          </button>
        </div>
      </header>

      <main className="admin-content">
        <div className="admin-toolbar">
          <div>
            <h1>Gerenciamento de Produtos</h1>
            <p>Cadastre, edite ou inative itens do seu catálogo</p>
          </div>

          <button
            type="button"
            className="btn-novo-produto"
            onClick={handleAbrirCriar}
          >
            <IconesProdutos name="plus" size={16} />
            Novo Produto
          </button>
        </div>

        {sucesso && <div className="alerta-sucesso">{sucesso}</div>}
        {erro && <div className="alerta-erro">{erro}</div>}

        <div className="admin-filtros">
          <div className="admin-search-input">
            <IconesProdutos name="search" size={16} />
            <input
              type="text"
              placeholder="Buscar por nome, SKU ou categoria..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {carregando ? (
          <div className="admin-loading">Carregando catálogo...</div>
        ) : (
          <div className="admin-tabela-container">
            <table className="admin-tabela">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>SKU</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="tabela-vazia">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  produtosFiltrados.map((item) => (
                    <tr
                      key={item.id}
                      className={!item.ativo ? "linha-inativa" : ""}
                    >
                      <td>
                        <div className="td-produto-info">
                          <img
                            src={item.imagemUrl || "/placeholder.jpg"}
                            alt={item.nome}
                          />
                          <strong>{item.nome}</strong>
                        </div>
                      </td>
                      <td>{item.sku || "-"}</td>
                      <td>{item.categoria || "-"}</td>
                      <td>
                        R${" "}
                        {Number(item.preco).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td>{item.estoque} un.</td>
                      <td>
                        <span
                          className={`badge-status ${item.ativo ? "ativo" : "inativo"
                            }`}
                        >
                          {item.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="acoes-botoes">
                          <button
                            type="button"
                            className="btn-acao btn-editar"
                            onClick={() => handleAbrirEditar(item)}
                            title="Editar produto"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className={`btn-acao ${item.ativo ? "btn-inativar" : "btn-ativar"
                              }`}
                            onClick={() =>
                              handleAlternarStatus(item.id, item.ativo)
                            }
                          >
                            {item.ativo ? "Inativar" : "Ativar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal de Cadastro/Edição */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{formData.id ? "Editar Produto" : "Cadastrar Produto"}</h2>
              <button
                type="button"
                className="btn-fechar"
                onClick={handleFecharModal}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSalvar} className="modal-form">
              <div className="form-grid">
                <div className="form-group span-2">
                  <label>Nome do Produto *</label>
                  <input
                    type="text"
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>SKU *</label>
                  <input
                    type="text"
                    name="sku"
                    required
                    value={formData.sku}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Categoria *</label>
                  <input
                    type="text"
                    name="categoria"
                    required
                    value={formData.categoria}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="preco"
                    required
                    value={formData.preco}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Preço Original (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="precoOriginal"
                    value={formData.precoOriginal}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Estoque (Qtd) *</label>
                  <input
                    type="number"
                    name="estoque"
                    required
                    value={formData.estoque}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group span-2">
                  <label>URL da Imagem</label>
                  <input
                    type="url"
                    name="imagemUrl"
                    placeholder="https://..."
                    value={formData.imagemUrl}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group span-2">
                  <label>Descrição</label>
                  <textarea
                    name="descricao"
                    rows="3"
                    value={formData.descricao}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="modal-acoes">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={handleFecharModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-salvar"
                  disabled={salvando}
                >
                  {salvando ? "Salvando..." : "Salvar Produto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}