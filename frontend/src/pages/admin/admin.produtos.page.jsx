import { useEffect, useMemo, useState } from "react";
import { IconesProdutos } from "../../components/icons/IconesProdutos.jsx";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import { useAdminProdutos } from "../../hooks/useAdminProdutos.jsx";
import "./admin-produtos.page.css";

export default function AdminProdutosPage() {
  const {
    produtos,
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
    handleRemoverImagem,
    handleCriarCategoria,
    handleAlternarStatus,
  } = useAdminProdutos();

  const [novaCategoriaAberta, setNovaCategoriaAberta] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState({ nome: "", descricao: "" });
  const [criandoCategoria, setCriandoCategoria] = useState(false);
  const [erroCategoria, setErroCategoria] = useState("");

  const fecharNovaCategoria = () => {
    setNovaCategoriaAberta(false);
    setNovaCategoria({ nome: "", descricao: "" });
    setErroCategoria("");
  };

  const criarCategoriaAgora = async () => {
    if (novaCategoria.nome.trim().length < 3) {
      setErroCategoria("O nome deve ter pelo menos 3 caracteres.");
      return;
    }
    setCriandoCategoria(true);
    setErroCategoria("");
    try {
      await handleCriarCategoria(novaCategoria.nome, novaCategoria.descricao);
      fecharNovaCategoria();
    } catch (err) {
      setErroCategoria(err.message || "Não foi possível criar a categoria.");
    } finally {
      setCriandoCategoria(false);
    }
  };

  const previewNovaImagem = useMemo(
    () => (formData.imagemArquivo ? URL.createObjectURL(formData.imagemArquivo) : null),
    [formData.imagemArquivo]
  );
  useEffect(() => () => previewNovaImagem && URL.revokeObjectURL(previewNovaImagem), [previewNovaImagem]);
  const imagemExibida = previewNovaImagem || formData.imagemUrlAtual;

  useEffect(() => {
    if (!modalAberto) {
      fecharNovaCategoria();
      return;
    }
    const aoTeclar = (e) => e.key === "Escape" && handleFecharModal();
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [modalAberto]); 

  const precoNum = Number(formData.preco);
  const precoOrigNum = Number(formData.precoOriginal);
  const desconto =
    precoOrigNum > 0 && precoNum > 0 && precoOrigNum > precoNum
      ? Math.round((1 - precoNum / precoOrigNum) * 100)
      : null;
  const precoOriginalInvalido = precoOrigNum > 0 && precoNum > 0 && precoOrigNum <= precoNum;

  return (
    <div className="admin-produtos-page">
      <AdminHeader />

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
                {produtos.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="tabela-vazia">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  produtos.map((item) => (
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

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-card modal-produto" role="dialog" aria-modal="true">
            <div className="modal-header">
              <div>
                <h2>{formData.id ? "Editar Produto" : "Cadastrar Produto"}</h2>
                <p className="modal-subtitulo">
                  {formData.id
                    ? "Atualize as informações do produto."
                    : "Preencha os dados para adicionar ao catálogo."}
                </p>
              </div>
              <button
                type="button"
                className="btn-fechar"
                onClick={handleFecharModal}
                aria-label="Fechar"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSalvar} className="modal-form">
              <fieldset className="form-secao">
                <legend>Informações básicas</legend>
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label htmlFor="prod-nome">Nome do produto *</label>
                    <input
                      id="prod-nome"
                      type="text"
                      name="nome"
                      required
                      placeholder="Ex.: Nissan Skyline GT-R R34"
                      value={formData.nome}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prod-sku">SKU *</label>
                    <input
                      id="prod-sku"
                      type="text"
                      name="sku"
                      required
                      placeholder="Ex.: HW-001"
                      value={formData.sku}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prod-categoria">Categoria *</label>
                    <div className="categoria-linha">
                      <select
                        id="prod-categoria"
                        name="id_categoria"
                        required
                        value={formData.id_categoria}
                        onChange={handleChange}
                      >
                        <option value="">Selecione...</option>
                        {categorias.map((cat) => (
                          <option key={cat.id_categoria} value={cat.id_categoria}>
                            {cat.nome}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className={`btn-nova-categoria${novaCategoriaAberta ? " ativo" : ""}`}
                        onClick={() =>
                          novaCategoriaAberta ? fecharNovaCategoria() : setNovaCategoriaAberta(true)
                        }
                        title="Criar nova categoria"
                        aria-expanded={novaCategoriaAberta}
                      >
                        <IconesProdutos name="plus" size={14} />
                        Nova
                      </button>
                    </div>
                  </div>

                  {novaCategoriaAberta && (
                    <div className="nova-categoria span-2">
                      <strong>Nova categoria</strong>
                      <div className="nova-categoria-campos">
                        <input
                          type="text"
                          placeholder="Nome da categoria *"
                          value={novaCategoria.nome}
                          maxLength={100}
                          autoFocus
                          onChange={(e) =>
                            setNovaCategoria((prev) => ({ ...prev, nome: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              criarCategoriaAgora();
                            }
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Descrição (opcional)"
                          value={novaCategoria.descricao}
                          maxLength={255}
                          onChange={(e) =>
                            setNovaCategoria((prev) => ({ ...prev, descricao: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              criarCategoriaAgora();
                            }
                          }}
                        />
                      </div>
                      {erroCategoria && <small className="campo-erro">{erroCategoria}</small>}
                      <div className="nova-categoria-acoes">
                        <button type="button" className="btn-cancelar" onClick={fecharNovaCategoria}>
                          Cancelar
                        </button>
                        <button
                          type="button"
                          className="btn-criar-categoria"
                          onClick={criarCategoriaAgora}
                          disabled={criandoCategoria}
                        >
                          {criandoCategoria ? "Criando..." : "Criar categoria"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </fieldset>

              <fieldset className="form-secao">
                <legend>Preço e estoque</legend>
                <div className="form-grid form-grid-3">
                  <div className="form-group">
                    <label htmlFor="prod-preco">Preço *</label>
                    <div className="input-prefixo">
                      <span>R$</span>
                      <input
                        id="prod-preco"
                        type="number"
                        step="0.01"
                        min="0"
                        name="preco"
                        required
                        placeholder="0,00"
                        value={formData.preco}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="prod-preco-original">Preço original</label>
                    <div className="input-prefixo">
                      <span>R$</span>
                      <input
                        id="prod-preco-original"
                        type="number"
                        step="0.01"
                        min="0"
                        name="precoOriginal"
                        placeholder="0,00"
                        value={formData.precoOriginal}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="prod-estoque">Estoque *</label>
                    <div className="input-prefixo input-sufixo">
                      <input
                        id="prod-estoque"
                        type="number"
                        min="0"
                        step="1"
                        name="estoque"
                        required
                        placeholder="0"
                        value={formData.estoque}
                        onChange={handleChange}
                      />
                      <span>un.</span>
                    </div>
                  </div>
                </div>

                {desconto !== null && (
                  <p className="dica-desconto">
                    Produto aparecerá com <strong>{desconto}% de desconto</strong> na loja.
                  </p>
                )}
                {precoOriginalInvalido && (
                  <p className="campo-erro">
                    O preço original precisa ser maior que o preço para mostrar desconto.
                  </p>
                )}
              </fieldset>

              <fieldset className="form-secao">
                <legend>Imagem e descrição</legend>
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label>Imagem do produto</label>
                    <div className="upload-imagem">
                      <div className="upload-preview">
                        {imagemExibida ? (
                          <img src={imagemExibida} alt="Pré-visualização" />
                        ) : (
                          <IconesProdutos name="box" size={28} />
                        )}
                      </div>

                      <div className="upload-info">
                        <label htmlFor="prod-imagem" className="btn-upload">
                          {imagemExibida ? "Trocar imagem" : "Escolher imagem"}
                        </label>
                        <input
                          id="prod-imagem"
                          className="upload-input"
                          type="file"
                          name="imagem_produto"
                          accept="image/jpeg,image/png"
                          onChange={handleChange}
                        />
                        <small>
                          {formData.imagemArquivo
                            ? formData.imagemArquivo.name
                            : formData.id && formData.imagemUrlAtual
                              ? "Imagem atual mantida se você não escolher outra."
                              : "JPG ou PNG. Quadrada fica melhor no card."}
                        </small>
                        {formData.imagemArquivo && (
                          <button type="button" className="btn-link" onClick={handleRemoverImagem}>
                            Remover seleção
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group span-2">
                    <label htmlFor="prod-descricao">Descrição</label>
                    <textarea
                      id="prod-descricao"
                      name="descricao"
                      rows="3"
                      placeholder="Detalhes do produto, estado, escala, edição..."
                      value={formData.descricao}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </fieldset>

              <div className="modal-acoes">
                <button type="button" className="btn-cancelar" onClick={handleFecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar" disabled={salvando}>
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
