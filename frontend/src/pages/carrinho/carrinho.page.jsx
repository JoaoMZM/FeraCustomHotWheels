import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarCarrinho,
  removerDoCarrinho,
  atualizarQuantidadeCarrinho,
  finalizarCompra,
} from "../../services/api.js";
import { IconesCarrinho } from "../../components/icons/IconesCarrinho.jsx";
import { CarrinhoItem } from "../../components/carrinho/CarrinhoItem.jsx";
import { CarrinhoResumo } from "../../components/carrinho/CarrinhoResumo";
import "./carrinho.page.css";

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

  const total = itens.reduce(
    (soma, item) => soma + (item.preco || 0) * (item.quantidade || 1),
    0
  );

  const totalItens = itens.reduce(
    (soma, item) => soma + (item.quantidade || 1),
    0
  );

  return (
    <div className="carrinho-page">
      <div className="carrinho-header">
        <div className="carrinho-breadcrumb">
          <button type="button" onClick={() => navigate("/")}>
            Início
          </button>
          <IconesCarrinho name="chevron" size={12} />
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
              <IconesCarrinho name="check" size={26} />
            </div>
            <strong>Pedido realizado com sucesso!</strong>
            <p>Obrigado pela compra. Você pode continuar navegando pelo catálogo.</p>
            <button type="button" onClick={() => navigate("/")}>
              Voltar aos produtos
            </button>
          </div>
        </div>
      ) : carregando ? (
        <div className="carrinho-feedback">
          <div className="carrinho-feedback-inner">
            <div className="carrinho-feedback-icon">
              <span
                className="spinner"
                style={{
                  borderTopColor: "#0f172a",
                  borderColor: "rgba(15,23,42,0.15)",
                }}
              />
            </div>
            <strong>Carregando carrinho...</strong>
          </div>
        </div>
      ) : itens.length === 0 ? (
        <div className="carrinho-feedback">
          <div className="carrinho-feedback-inner">
            <div className="carrinho-feedback-icon">
              <IconesCarrinho name="cart" size={26} />
            </div>
            <strong>Seu carrinho está vazio</strong>
            <p>Adicione produtos ao carrinho para vê-los aqui.</p>
            <button type="button" onClick={() => navigate("/")}>
              Ver produtos
            </button>
          </div>
        </div>
      ) : (
        <div className="carrinho-content">
          <div className="carrinho-lista">
            {itens.map((item) => (
              <CarrinhoItem
                key={item.id}
                item={item}
                onAlterarQuantidade={handleAlterarQuantidade}
                onRemover={handleRemover}
                atualizandoId={atualizandoId}
                removendoId={removendoId}
              />
            ))}
          </div>

          <CarrinhoResumo
            totalItens={totalItens}
            total={total}
            onFinalizar={handleFinalizarCompra}
            finalizando={finalizando}
            desabilitado={itens.length === 0}
          />
        </div>
      )}
    </div>
  );
}