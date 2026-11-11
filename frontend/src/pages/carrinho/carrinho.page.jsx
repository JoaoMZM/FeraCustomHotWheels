import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { finalizarCompra, criarCheckoutPagamento, buscarEndereco } from "../../services/api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useCarrinho } from "../../hooks/carrinho/useCarrinho.js";
import { IconesCarrinho } from "../../components/icons/IconesCarrinho.jsx";
import { CarrinhoItem } from "../../components/carrinho/CarrinhoItem.jsx";
import { CarrinhoResumo } from "../../components/carrinho/CarrinhoResumo.jsx";
import { PaginaLoja } from "../../components/common/PaginaLoja.jsx";
import "./carrinho.page.css";
import "./carrinho.extras.css";

// O id do cliente (UUID) fica no "payload" salvo no login
const lerIdCliente = () => {
  try {
    return JSON.parse(localStorage.getItem("payload"))?.sub || null;
  } catch {
    return null;
  }
};

export default function CarrinhoPage() {
  const navigate = useNavigate();
  const { logado } = useAuth();
  const {
    itens,
    totalItens,
    totalPreco,
    alterarQuantidade,
    removerItem,
    limparCarrinho,
    sincronizarCarrinho,
  } = useCarrinho();

  const [erro, setErro] = useState("");
  const [avisos, setAvisos] = useState([]);
  const [finalizando, setFinalizando] = useState(false);
  const [pedidoConcluido, setPedidoConcluido] = useState(null);
  const [semEndereco, setSemEndereco] = useState(false);
  const [erroPagamento, setErroPagamento] = useState("");

  // Estado da busca do header (mesmo padrão da página de Produtos)
  const [busca, setBusca] = useState("");

  // Ao abrir o carrinho, confere preço/estoque atuais com a API
  useEffect(() => {
    let ativo = true;

    sincronizarCarrinho()
      .then((novosAvisos) => {
        if (ativo) setAvisos(novosAvisos);
      })
      .catch(() => {
        // API fora do ar: mantém o carrinho como está
      });

    return () => {
      ativo = false;
    };
  }, [sincronizarCarrinho]);

  const handleRemover = (item) => {
    setErro("");
    removerItem(item.id);
  };

  const handleAlterarQuantidade = (item, delta) => {
    const novaQtd = item.quantidade + delta;

    if (novaQtd < 1) return;
    if (item.estoque && novaQtd > item.estoque) return;

    setErro("");
    alterarQuantidade(item.id, novaQtd);
  };

  const handleLimparCarrinho = () => {
    if (window.confirm("Remover todos os itens do carrinho?")) {
      limparCarrinho();
      setAvisos([]);
    }
  };

  const handleFinalizarCompra = async () => {
    if (itens.length === 0 || finalizando) return;
    if (logado === null) return; // ainda verificando a sessão

    if (!logado) {
      navigate("/login");
      return;
    }

    setErro("");
    setSemEndereco(false);
    setFinalizando(true);

    try {
      // O pedido precisa de um endereço de entrega cadastrado
      const { endereco } = await buscarEndereco();
      if (!endereco) {
        setSemEndereco(true);
        return;
      }

      const resposta = await finalizarCompra(itens, lerIdCliente());
      limparCarrinho();
      setAvisos([]);

      // Pedido criado: leva o cliente ao checkout do Mercado Pago.
      try {
        const { urlPagamento } = await criarCheckoutPagamento(resposta.result.idPedido);
        window.location.href = urlPagamento;
        return; // mantém "finalizando" enquanto o navegador troca de página
      } catch (errPagamento) {
        // O pedido existe; o cliente pode pagar depois em "Meus pedidos"
        setErroPagamento(errPagamento.message || "Não foi possível abrir o pagamento agora.");
        setPedidoConcluido(resposta);
      }
    } catch (err) {
      if (err.codigo === "ENDERECO_OBRIGATORIO") {
        setSemEndereco(true);
        return;
      }

      setErro(err.message || "Erro ao finalizar a compra.");

      // Provável causa: estoque/preço mudou. Atualiza o carrinho com o que a API tem agora.
      try {
        setAvisos(await sincronizarCarrinho());
      } catch {
        // ignora
      }
    } finally {
      setFinalizando(false);
    }
  };

  // Busca do header: no carrinho não filtramos itens, então enviar uma
  // busca leva o usuário de volta pro catálogo.
  const handleSubmitBusca = (e) => {
    if (e) e.preventDefault();
    navigate("/");
  };

  const idPedido = pedidoConcluido?.result?.idPedido;

  return (
    <PaginaLoja
      classe="carrinho-page"
      semMain
      header={{ busca, setBusca, onSubmitBusca: handleSubmitBusca }}
    >

      <div className="carrinho-header">
        <div className="carrinho-breadcrumb">
          <button type="button" onClick={() => navigate("/")}>
            Início
          </button>
          <IconesCarrinho name="chevron" size={12} />
          <span className="breadcrumb-atual">Carrinho</span>
        </div>

        <div className="carrinho-titulo-linha">
          <h1 className="carrinho-titulo">Meu Carrinho</h1>
          {itens.length > 0 && (
            <span className="carrinho-titulo-badge">
              {totalItens} {totalItens === 1 ? "item" : "itens"}
            </span>
          )}
          {itens.length > 0 && (
            <button type="button" className="carrinho-limpar" onClick={handleLimparCarrinho}>
              Limpar carrinho
            </button>
          )}
        </div>
      </div>

      {erro && <div className="carrinho-erro">{erro}</div>}

      {semEndereco && (
        <div className="carrinho-erro carrinho-erro--acao">
          <span>Cadastre um endereço de entrega para finalizar o seu pedido.</span>
          <button type="button" onClick={() => navigate("/minhaconta?voltar=carrinho")}>
            Cadastrar endereço
          </button>
        </div>
      )}

      {avisos.length > 0 && (
        <div className="carrinho-avisos">
          {avisos.map((aviso, indice) => (
            <div className="carrinho-aviso" key={`${indice}-${aviso}`}>
              <span>{aviso}</span>
              <button
                type="button"
                aria-label="Dispensar aviso"
                onClick={() => setAvisos((prev) => prev.filter((_, i) => i !== indice))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {pedidoConcluido ? (
        <div className="carrinho-feedback">
          <div className="carrinho-feedback-inner">
            <div className="carrinho-feedback-icon carrinho-feedback-icon--sucesso">
              <IconesCarrinho name="check" size={26} />
            </div>
            <strong>Pedido registrado!</strong>
            <p>
              {idPedido ? `Seu pedido #${idPedido} foi registrado, mas ainda não foi pago. ` : ""}
              {erroPagamento
                ? `${erroPagamento} Você pode concluir o pagamento em "Meus pedidos".`
                : "Conclua o pagamento em \"Meus pedidos\"."}
            </p>
            <button type="button" onClick={() => navigate("/pedidosProdutos")}>
              Ir para meus pedidos
            </button>
            <button type="button" onClick={() => navigate("/")}>
              Voltar aos produtos
            </button>
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
                atualizandoId={null}
                removendoId={null}
              />
            ))}
          </div>

          <CarrinhoResumo
            totalItens={totalItens}
            total={totalPreco}
            onFinalizar={handleFinalizarCompra}
            finalizando={finalizando}
            desabilitado={itens.length === 0 || logado === null}
            exigeLogin={logado === false}
          />
        </div>
      )}

    </PaginaLoja>
  );
}
