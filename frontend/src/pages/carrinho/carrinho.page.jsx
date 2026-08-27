import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { listarCarrinho, removerDoCarrinho, atualizarQuantidadeCarrinho, finalizarCompra } from "../../services/api.js";

const Icon = ({ name, size = 20 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const paths = {
    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M9 7V4h6v3" />
        <path d="M6 7l1 13h10l1-13" />
      </>
    ),
    box: (
      <>
        <path d="m3 7 9-4 9 4-9 4-9-4Z" />
        <path d="M3 7v10l9 4 9-4V7" />
        <path d="M12 11v10" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    cart: (
      <>
        <path d="M3 4h2l1.7 10.1a2 2 0 0 0 2 1.7h8.7a2 2 0 0 0 1.9-1.4L21 8H6" />
        <circle cx="9" cy="20" r="1.2" />
        <circle cx="18" cy="20" r="1.2" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 11a8 8 0 0 0-14.9-4" />
        <path d="M4 4v5h5" />
        <path d="M4 13a8 8 0 0 0 14.9 4" />
        <path d="M20 20v-5h-5" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    minus: <path d="M5 12h14" />,
    lock: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </>
    ),
    sparkles: (
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
};

export default function CarrinhoPage() {
  const navigate = useNavigate();

  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [removendoId, setRemovendoId] = useState(null);
  const [atualizandoId, setAtualizandoId] = useState(null);
  const [finalizando, setFinalizando] = useState(false);
  const [pedidoConcluido, setPedidoConcluido] = useState(null);

  const carregarCarrinho = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const dados = await listarCarrinho();
      setItens(Array.isArray(dados) ? dados : dados.itens || []);
    } catch (err) {
      setErro(err.message || "Não foi possível carregar o carrinho.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarCarrinho();
  }, [carregarCarrinho]);

  const handleRemover = async (item) => {
    setErro("");
    setRemovendoId(item.id);

    try {
      await removerDoCarrinho(item.id);
      setItens((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      setErro(err.message || "Erro ao remover o item do carrinho.");
    } finally {
      setRemovendoId(null);
    }
  };

  const handleAlterarQuantidade = async (item, delta) => {
    const novaQtd = item.quantidade + delta;

    if (novaQtd < 1) return;
    if (item.estoque && novaQtd > item.estoque) return;

    setErro("");
    setAtualizandoId(item.id);

    const anteriores = itens;
    setItens((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, quantidade: novaQtd } : i))
    );

    try {
      await atualizarQuantidadeCarrinho(item.id, novaQtd);
    } catch (err) {
      setItens(anteriores);
      setErro(err.message || "Erro ao atualizar a quantidade.");
    } finally {
      setAtualizandoId(null);
    }
  };

  const handleFinalizarCompra = async () => {
    if (itens.length === 0) return;

    setErro("");
    setFinalizando(true);

    try {
      const pedido = await finalizarCompra();
      setPedidoConcluido(pedido);
      setItens([]);
    } catch (err) {
      setErro(err.message || "Erro ao finalizar a compra.");
    } finally {
      setFinalizando(false);
    }
  };

  const formatarPreco = (valor) =>
    Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const total = itens.reduce(
    (soma, item) => soma + (item.preco || 0) * (item.quantidade || 1),
    0
  );

  const totalItens = itens.reduce((soma, item) => soma + (item.quantidade || 1), 0);

  return (
    <div className="carrinho-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        html, body {
          margin: 0;
          min-height: 100%;
          background: #eef1f6;
          overscroll-behavior: none;
        }

        .carrinho-page {
          --pc-text: #0f172a;
          --pc-muted: #64748b;
          --pc-border: #e6e9ef;
          --pc-surface: #ffffff;
          --pc-primary: #e30613;
          --pc-primary-gradient: linear-gradient(135deg, #ff2a34 0%, #b80510 100%);
          --pc-success: #108a48;
          --pc-shadow-sm: 0 2px 10px rgba(15, 23, 42, 0.05);
          --pc-shadow-md: 0 20px 40px -12px rgba(15, 23, 42, 0.14);

          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(1100px 500px at 15% -10%, rgba(227, 6, 19, 0.06), transparent 60%),
            linear-gradient(180deg, #eef1f6 0%, #f5f6f9 40%, #f5f6f9 100%);
          color: var(--pc-text);
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
          min-width: 100vw;
        }

        .carrinho-page *,
        .carrinho-page *::before,
        .carrinho-page *::after {
          box-sizing: border-box;
        }

        .carrinho-header {
          width: min(1120px, calc(100% - 48px));
          margin: 0 auto;
          padding: 44px 0 4px;
        }

        .carrinho-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #9aa4b2;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 22px;
        }

        .carrinho-breadcrumb button {
          border: 0;
          background: transparent;
          padding: 0;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .carrinho-breadcrumb button:hover {
          color: var(--pc-primary);
        }

        .carrinho-titulo-linha {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 32px;
        }

        .carrinho-titulo {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0;
        }

        .carrinho-titulo-badge {
          background: #0f172a;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 99px;
          letter-spacing: 0.01em;
        }

        .carrinho-content {
          width: min(1120px, calc(100% - 48px));
          margin: 0 auto;
          flex: 1;
          padding-bottom: 70px;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 28px;
          align-items: start;
        }

        .carrinho-lista {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .carrinho-item {
          background: var(--pc-surface);
          border: 1px solid var(--pc-border);
          border-radius: 22px;
          padding: 18px;
          display: grid;
          grid-template-columns: 96px 1fr auto;
          gap: 18px;
          align-items: center;
          box-shadow: var(--pc-shadow-sm);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease;
          animation: fadeInUp 0.35s ease both;
        }

        .carrinho-item:hover {
          transform: translateY(-3px);
          box-shadow: var(--pc-shadow-md);
          border-color: #d8dde5;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .carrinho-item-imagem {
          width: 96px;
          height: 96px;
          border-radius: 16px;
          background: radial-gradient(circle at 50% 40%, #ffffff 0%, #f4f6f9 100%);
          border: 1px solid #f1f5f9;
          display: grid;
          place-items: center;
          overflow: hidden;
        }

        .carrinho-item-imagem img {
          width: 88%;
          height: 88%;
          object-fit: contain;
          filter: drop-shadow(0 6px 10px rgba(0,0,0,0.08));
        }

        .carrinho-item-imagem-placeholder {
          color: #cbd5e1;
        }

        .carrinho-item-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }

        .carrinho-item-nome {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.35;
        }

        .carrinho-item-unitario {
          font-size: 12.5px;
          color: var(--pc-muted);
          font-weight: 600;
        }

        .carrinho-item-acoes {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .carrinho-item-topo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .carrinho-item-qtd-stepper {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #f4f6f9;
          border: 1px solid #e6e9ef;
          border-radius: 99px;
          padding: 3px;
        }

        .carrinho-item-qtd-stepper button {
          width: 28px;
          height: 28px;
          border: 0;
          border-radius: 99px;
          background: #fff;
          color: #334155;
          display: grid;
          place-items: center;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          transition: all 0.2s ease;
        }

        .carrinho-item-qtd-stepper button:hover:not(:disabled) {
          background: #0f172a;
          color: #fff;
        }

        .carrinho-item-qtd-stepper button:disabled {
          opacity: .3;
          cursor: not-allowed;
          box-shadow: none;
        }

        .carrinho-item-qtd-stepper span {
          min-width: 20px;
          text-align: center;
          font-size: 13px;
          font-weight: 700;
        }

        .carrinho-item-remover {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid var(--pc-border);
          background: #fff;
          color: #b0b8c4;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .carrinho-item-remover:hover:not(:disabled) {
          color: var(--pc-primary);
          border-color: rgba(227, 6, 19, 0.3);
          background: rgba(227, 6, 19, 0.06);
        }

        .carrinho-item-remover:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .carrinho-item-preco {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
        }

        .carrinho-resumo {
          background: var(--pc-surface);
          border: 1px solid var(--pc-border);
          border-radius: 24px;
          padding: 28px;
          box-shadow: var(--pc-shadow-md);
          position: sticky;
          top: 24px;
          overflow: hidden;
        }

        .carrinho-resumo::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: var(--pc-primary-gradient);
        }

        .carrinho-resumo strong.carrinho-resumo-titulo {
          font-size: 17px;
          font-weight: 800;
          display: block;
          margin-bottom: 20px;
        }

        .carrinho-resumo-linha {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: var(--pc-muted);
          margin-bottom: 12px;
        }

        .carrinho-resumo-linha span:last-child {
          color: #334155;
          font-weight: 600;
        }

        .carrinho-resumo-total {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          padding-top: 18px;
          margin-top: 8px;
          border-top: 1px dashed var(--pc-border);
        }

        .btn-finalizar {
          width: 100%;
          height: 54px;
          margin-top: 24px;
          border: 0;
          border-radius: 16px;
          background: var(--pc-primary-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14.5px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(227, 6, 19, 0.3);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-finalizar:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(227, 6, 19, 0.4);
        }

        .btn-finalizar:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-finalizar:disabled {
          background: #e2e8f0;
          color: #94a3b8;
          box-shadow: none;
          cursor: not-allowed;
        }

        .carrinho-resumo-seguro {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 16px;
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .carrinho-erro {
          width: min(1120px, calc(100% - 48px));
          margin: 0 auto 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 600;
        }

        .carrinho-feedback {
          width: min(1120px, calc(100% - 48px));
          margin: 0 auto;
          flex: 1;
          padding: 70px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #ffffff;
          border-radius: 28px;
          border: 1px dashed #d8dde5;
        }

        .carrinho-feedback-inner {
          max-width: 380px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .carrinho-feedback-icon {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #64748b;
          display: grid;
          place-items: center;
        }

        .carrinho-feedback strong {
          font-size: 19px;
          color: #0f172a;
        }

        .carrinho-feedback p {
          margin: 0;
          font-size: 14px;
          color: var(--pc-muted);
        }

        .carrinho-feedback button {
          margin-top: 10px;
          padding: 11px 22px;
          border-radius: 99px;
          border: 0;
          background: #0f172a;
          color: #fff;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .carrinho-feedback button:hover {
          background: var(--pc-primary);
          transform: translateY(-2px);
        }

        .carrinho-feedback-icon--sucesso {
          background: rgba(16, 138, 72, 0.12);
          color: var(--pc-success);
        }

        @media (max-width: 780px) {
          .carrinho-content {
            grid-template-columns: 1fr;
          }

          .carrinho-resumo {
            position: static;
          }

          .carrinho-item {
            grid-template-columns: 72px 1fr;
          }

          .carrinho-item-acoes {
            grid-column: 1 / -1;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }

          .carrinho-item-topo {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>

      <div className="carrinho-header">
        <div className="carrinho-breadcrumb">
          <button type="button" onClick={() => navigate("/produtos")}>
            Início
          </button>
          <Icon name="chevron" size={12} />
          <span style={{ color: "#0f172a" }}>Carrinho</span>
        </div>

        <div className="carrinho-titulo-linha">
          <h1 className="carrinho-titulo">Meu Carrinho</h1>
          {!carregando && itens.length > 0 && (
            <span className="carrinho-titulo-badge">
              {totalItens} {totalItens === 1 ? "item" : "itens"}
            </span>
          )}
        </div>
      </div>

      {erro && <div className="carrinho-erro">{erro}</div>}

      {pedidoConcluido ? (
        <div className="carrinho-feedback">
          <div className="carrinho-feedback-inner">
            <div className="carrinho-feedback-icon carrinho-feedback-icon--sucesso">
              <Icon name="check" size={26} />
            </div>
            <strong>Pedido realizado com sucesso!</strong>
            <p>Obrigado pela compra. Você pode continuar navegando pelo catálogo.</p>
            <button type="button" onClick={() => navigate("/produtos")}>
              Voltar aos produtos
            </button>
          </div>
        </div>
      ) : carregando ? (
        <div className="carrinho-feedback">
          <div className="carrinho-feedback-inner">
            <div className="carrinho-feedback-icon">
              <span className="spinner" style={{ borderTopColor: "#0f172a", borderColor: "rgba(15,23,42,0.15)" }} />
            </div>
            <strong>Carregando carrinho...</strong>
          </div>
        </div>
      ) : itens.length === 0 ? (
        <div className="carrinho-feedback">
          <div className="carrinho-feedback-inner">
            <div className="carrinho-feedback-icon">
              <Icon name="cart" size={26} />
            </div>
            <strong>Seu carrinho está vazio</strong>
            <p>Adicione produtos ao carrinho para vê-los aqui.</p>
            <button type="button" onClick={() => navigate("/produtos")}>
              Ver produtos
            </button>
          </div>
        </div>
      ) : (
        <div className="carrinho-content">
          <div className="carrinho-lista">
            {itens.map((item) => (
              <div className="carrinho-item" key={item.id}>
                <div className="carrinho-item-imagem">
                  {item.imagemUrl ? (
                    <img src={item.imagemUrl} alt={item.nome} />
                  ) : (
                    <div className="carrinho-item-imagem-placeholder">
                      <Icon name="box" size={30} />
                    </div>
                  )}
                </div>

                <div className="carrinho-item-info">
                  <span className="carrinho-item-nome">{item.nome}</span>
                  <span className="carrinho-item-unitario">
                    {formatarPreco(item.preco)} / un.
                  </span>
                </div>

                <div className="carrinho-item-acoes">
                  <div className="carrinho-item-topo">
                    <div className="carrinho-item-qtd-stepper">
                      <button
                        type="button"
                        onClick={() => handleAlterarQuantidade(item, -1)}
                        disabled={item.quantidade <= 1 || atualizandoId === item.id}
                        aria-label="Diminuir quantidade"
                      >
                        <Icon name="minus" size={14} />
                      </button>
                      <span>{item.quantidade}</span>
                      <button
                        type="button"
                        onClick={() => handleAlterarQuantidade(item, 1)}
                        disabled={
                          (item.estoque && item.quantidade >= item.estoque) ||
                          atualizandoId === item.id
                        }
                        aria-label="Aumentar quantidade"
                      >
                        <Icon name="plus" size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="carrinho-item-remover"
                      onClick={() => handleRemover(item)}
                      disabled={removendoId === item.id}
                      aria-label={`Remover ${item.nome} do carrinho`}
                    >
                      {removendoId === item.id ? (
                        <span className="spinner" aria-hidden="true" style={{ borderTopColor: "#e30613", borderColor: "rgba(227,6,19,0.2)" }} />
                      ) : (
                        <Icon name="trash" size={15} />
                      )}
                    </button>
                  </div>

                  <span className="carrinho-item-preco">
                    {formatarPreco((item.preco || 0) * (item.quantidade || 1))}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <aside className="carrinho-resumo">
            <strong className="carrinho-resumo-titulo">Resumo do pedido</strong>

            <div className="carrinho-resumo-linha">
              <span>Itens ({totalItens})</span>
              <span>{formatarPreco(total)}</span>
            </div>

            <div className="carrinho-resumo-linha">
              <span>Frete</span>
              <span>Calculado no checkout</span>
            </div>

            <div className="carrinho-resumo-total">
              <span>Total</span>
              <span>{formatarPreco(total)}</span>
            </div>

            <button
              type="button"
              className="btn-finalizar"
              onClick={handleFinalizarCompra}
              disabled={finalizando || itens.length === 0}
            >
              {finalizando ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Finalizando...
                </>
              ) : (
                <>
                  Finalizar Compra
                  <Icon name="chevron" size={16} />
                </>
              )}
            </button>

            <div className="carrinho-resumo-seguro">
              <Icon name="lock" size={13} />
              Ambiente de compra seguro
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}