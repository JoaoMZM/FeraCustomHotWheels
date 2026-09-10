import { IconesCarrinho } from "../icons/IconesCarrinho";
import { formatarPreco } from "../../utils/formatters";

export function CarrinhoResumo({ totalItens, total, onFinalizar, finalizando, desabilitado }) {
  return (
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
        onClick={onFinalizar}
        disabled={finalizando || desabilitado}
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
  );
}