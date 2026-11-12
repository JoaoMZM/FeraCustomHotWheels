import { Fragment } from "react";
import { IconesProdutos } from "../../components/icons/IconesProdutos.jsx";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import { useAdminPedidos, STATUS_PEDIDO } from "../../hooks/useAdminPedidos.jsx";
import { formatarPreco } from "../../utils/formatters.js";
import "./admin-produtos.page.css";
import "./admin-pedidos.page.css";

const CLASSE_STATUS = {
  Pendente: "pendente",
  "Em Processamento": "processando",
  Enviado: "enviado",
  Entregue: "entregue",
  Cancelado: "cancelado",
};

function formatarDataHora(data) {
  if (!data) return "-";
  const d = new Date(data);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatarCep(cep) {
  const numeros = String(cep || "").replace(/\D/g, "");
  return numeros.length === 8
    ? numeros.replace(/(\d{5})(\d{3})/, "$1-$2")
    : cep || "";
}

function formatarCpf(cpf) {
  const numeros = String(cpf || "").replace(/\D/g, "");
  return numeros.length === 11
    ? numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    : cpf || "";
}

function formatarTelefone(telefone) {
  const numeros = String(telefone || "").replace(/\D/g, "");
  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return telefone || "";
}

function linhaEndereco(endereco) {
  const rua = [endereco.rua, endereco.numero].filter(Boolean).join(", ");
  const local = [endereco.bairro, [endereco.cidade, endereco.uf].filter(Boolean).join("/")]
    .filter(Boolean)
    .join(" - ");
  return { rua, local };
}

export default function AdminPedidosPage() {
  const {
    pedidos,
    contagemPorStatus,
    carregando,
    erro,
    busca,
    setBusca,
    statusFiltro,
    setStatusFiltro,
    pedidoAberto,
    alternarDetalhes,
    atualizarStatus,
    atualizandoId,
    recarregar,
  } = useAdminPedidos();

  return (
    <div className="admin-produtos-page">
      <AdminHeader />

      <main className="admin-content">
        <div className="admin-toolbar">
          <div>
            <h1>Pedidos</h1>
            <p>Acompanhe todos os pedidos realizados e o endereço de entrega de cada cliente</p>
          </div>

          <button type="button" className="btn-acao btn-editar" onClick={recarregar}>
            Atualizar
          </button>
        </div>

        {erro && <div className="alerta-erro">{erro}</div>}

        <div className="admin-pedidos-status-abas">
          <button
            type="button"
            className={statusFiltro === "todos" ? "status-aba ativo" : "status-aba"}
            onClick={() => setStatusFiltro("todos")}
          >
            Todos ({contagemPorStatus.todos})
          </button>
          {STATUS_PEDIDO.map((status) => (
            <button
              key={status}
              type="button"
              className={statusFiltro === status ? "status-aba ativo" : "status-aba"}
              onClick={() => setStatusFiltro(status)}
            >
              {status} ({contagemPorStatus[status]})
            </button>
          ))}
        </div>

        <div className="admin-filtros">
          <div className="admin-search-input">
            <IconesProdutos name="search" size={16} />
            <input
              type="text"
              placeholder="Buscar por nº do pedido, nome ou e-mail do cliente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {carregando ? (
          <div className="admin-loading">Carregando pedidos...</div>
        ) : (
          <div className="admin-tabela-container">
            <table className="admin-tabela">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Data</th>
                  <th>Cliente</th>
                  <th>Itens</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="tabela-vazia">
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                ) : (
                  pedidos.map((pedido) => {
                    const aberto = pedidoAberto === pedido.id;
                    const totalItens = pedido.itens.reduce(
                      (soma, item) => soma + item.quantidade,
                      0
                    );

                    return (
                      <Fragment key={pedido.id}>
                        <tr>
                          <td>
                            <strong>#{pedido.id}</strong>
                          </td>
                          <td>{formatarDataHora(pedido.data)}</td>
                          <td>
                            <div className="pedido-cliente-celula">
                              <strong>{pedido.cliente.nome}</strong>
                              <small>{pedido.cliente.email}</small>
                            </div>
                          </td>
                          <td>
                            {totalItens} {totalItens === 1 ? "item" : "itens"}
                          </td>
                          <td>
                            <strong>{formatarPreco(pedido.total)}</strong>
                          </td>
                          <td>
                            <select
                              className={`select-status-pedido ${CLASSE_STATUS[pedido.status] || "pendente"}`}
                              value={pedido.status}
                              disabled={atualizandoId === pedido.id}
                              onChange={(e) => atualizarStatus(pedido.id, e.target.value)}
                              aria-label={`Status do pedido ${pedido.id}`}
                            >
                              {STATUS_PEDIDO.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div className="acoes-botoes">
                              <button
                                type="button"
                                className="btn-acao btn-editar"
                                onClick={() => alternarDetalhes(pedido.id)}
                              >
                                {aberto ? "Ocultar" : "Ver detalhes"}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {aberto && (
                          <tr className="pedido-detalhes-linha">
                            <td colSpan="7">
                              <div className="pedido-detalhes">
                                <section className="pedido-bloco">
                                  <h3>Cliente</h3>
                                  <p>
                                    <strong>{pedido.cliente.nome}</strong>
                                  </p>
                                  <p>{pedido.cliente.email}</p>
                                  {pedido.cliente.cpf && (
                                    <p>CPF: {formatarCpf(pedido.cliente.cpf)}</p>
                                  )}
                                  {pedido.cliente.telefone && (
                                    <p>Telefone: {formatarTelefone(pedido.cliente.telefone)}</p>
                                  )}
                                </section>

                                <section className="pedido-bloco">
                                  <h3>Endereço de entrega</h3>
                                  {pedido.enderecoOrigem === "cadastro" && (
                                    <p className="pedido-sem-endereco">
                                      Pedido sem endereço próprio: mostrando o endereço atual do cadastro do cliente.
                                    </p>
                                  )}
                                  {pedido.enderecos.length === 0 ? (
                                    <p className="pedido-sem-endereco">
                                      Este pedido não tem endereço de entrega.
                                    </p>
                                  ) : (
                                    pedido.enderecos.map((endereco) => {
                                      const { rua, local } = linhaEndereco(endereco);
                                      return (
                                        <address key={endereco.id} className="pedido-endereco">
                                          <p>
                                            <strong>{rua}</strong>
                                          </p>
                                          {endereco.complemento && <p>{endereco.complemento}</p>}
                                          <p>{local}</p>
                                          <p>CEP: {formatarCep(endereco.cep)}</p>
                                        </address>
                                      );
                                    })
                                  )}
                                </section>

                                <section className="pedido-bloco pedido-bloco-itens">
                                  <h3>Itens do pedido</h3>
                                  {pedido.itens.length === 0 ? (
                                    <p className="pedido-sem-endereco">Nenhum item encontrado.</p>
                                  ) : (
                                    <ul className="pedido-itens-lista">
                                      {pedido.itens.map((item) => (
                                        <li key={item.id}>
                                          <div>
                                            <strong>{item.nome}</strong>
                                            <small>
                                              {item.quantidade} x {formatarPreco(item.precoUnitario)}
                                              {item.sku ? ` · SKU ${item.sku}` : ""}
                                            </small>
                                          </div>
                                          <strong>{formatarPreco(item.subtotal)}</strong>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                  <div className="pedido-total-linha">
                                    <span>Total do pedido</span>
                                    <strong>{formatarPreco(pedido.total)}</strong>
                                  </div>
                                </section>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
