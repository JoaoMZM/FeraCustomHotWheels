import { IconesCarrinho } from "../icons/IconesCarrinho";
import { formatarPreco } from "../../utils/formatters";

export function CarrinhoResumo({
  totalItens,
  total,
  onFinalizar,
  finalizando,
  desabilitado,
  exigeLogin = false,
}) {
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
            {exigeLogin ? "Entrar para finalizar" : "Finalizar Compra"}
            <IconesCarrinho name="chevron" size={16} />
          </>
        )}
      </button>

      {exigeLogin && (
        <p className="carrinho-resumo-nota">
          Seu carrinho fica salvo. Entre na sua conta para concluir o pedido.
        </p>
      )}

      <div className="carrinho-resumo-seguro">
        <IconesCarrinho name="lock" size={13} />
        Ambiente de compra seguro
      </div>
    </aside>
  );
}
