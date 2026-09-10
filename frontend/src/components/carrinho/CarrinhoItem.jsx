import { IconesCarrinho } from "../icons/IconesCarrinho";
import { formatarPreco } from "../../utils/formatters";

export function CarrinhoItem({
  item,
  onAlterarQuantidade,
  onRemover,
  atualizandoId,
  removendoId,
}) {
  return (
    <div className="carrinho-item">
      <div className="carrinho-item-imagem">
        {item.imagemUrl ? (
          <img src={item.imagemUrl} alt={item.nome} />
        ) : (
          <div className="carrinho-item-imagem-placeholder">
            <IconesCarrinho name="box" size={30} />
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
              onClick={() => onAlterarQuantidade(item, -1)}
              disabled={item.quantidade <= 1 || atualizandoId === item.id}
              aria-label="Diminuir quantidade"
            >
              <IconesCarrinho name="minus" size={14} />
            </button>
            <span>{item.quantidade}</span>
            <button
              type="button"
              onClick={() => onAlterarQuantidade(item, 1)}
              disabled={
                (item.estoque && item.quantidade >= item.estoque) ||
                atualizandoId === item.id
              }
              aria-label="Aumentar quantidade"
            >
              <IconesCarrinho name="plus" size={14} />
            </button>
          </div>

          <button
            type="button"
            className="carrinho-item-remover"
            onClick={() => onRemover(item)}
            disabled={removendoId === item.id}
            aria-label={`Remover ${item.nome} do carrinho`}
          >
            {removendoId === item.id ? (
              <span
                className="spinner"
                aria-hidden="true"
                style={{
                  borderTopColor: "#e30613",
                  borderColor: "rgba(227,6,19,0.2)",
                }}
              />
            ) : (
              <IconesCarrinho name="trash" size={15} />
            )}
          </button>
        </div>

        <span className="carrinho-item-preco">
          {formatarPreco((item.preco || 0) * (item.quantidade || 1))}
        </span>
      </div>
    </div>
  );
}