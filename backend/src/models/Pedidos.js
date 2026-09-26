import { Status } from "../enum/statusPedido.js";

export class Pedido {
    #id;
    #status;
    #dataPedido;
    #idCliente;
    #valorTotal;

    constructor({ status = Status.PENDENTE, idCliente = null, dataPedido = new Date(), valorTotal = 0, id = null }) {
        this.#validarStatusPedido(status);
        if (idCliente !== null) this.#validarIdCliente(idCliente);
        if (id !== null) this.#validarId(id);
        if (valorTotal > 0) this.#validarValorTotal(valorTotal);

        this.#status = status;
        this.#idCliente = idCliente;
        this.#dataPedido = dataPedido;
        this.#valorTotal = valorTotal;
        this.#id = id;
    }

    get id() {
        return this.#id;
    }

    get status() {
        return this.#status;
    }

    get statusPedido() {
        return this.#status;
    }

    get dataPedido() {
        return this.#dataPedido;
    }

    get idCliente() {
        return this.#idCliente;
    }

    get valorTotal() {
        return this.#valorTotal;
    }

    set status(value) {
        this.#validarStatusPedido(value);
        this.#status = value;
    }

    set valorTotal(value) {
        this.#validarValorTotal(value);
        this.#valorTotal = value;
    }

    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    #validarStatusPedido(value) {
        if (!Object.values(Status).includes(value)) {
            throw new Error(`O Status precisa de ser um dos seguintes: ${Object.values(Status).join(', ')}`);
        }
    }

    #validarValorTotal(value) {
        if (typeof value !== 'number' || isNaN(value) || value <= 0) {
            throw new Error(`O valor total precisa de ser um número positivo.`);
        }
    }

    #validarId(value) {
        if (typeof value !== 'number' || isNaN(value) || value <= 0) {
            throw new Error(`O ID inserido não é válido.`);
        }
    }

    #validarIdCliente(value) {
        if (value === null || value === undefined) return;

        if (typeof value !== 'string' || value.trim() === '') {
            throw new Error(`O ID do cliente não é válido.`);
        }
    }

    static criar(dados) {
        return new Pedido({
            status: dados.status || dados.statusPedido || Status.PENDENTE,
            idCliente: dados.idCliente || null,
            dataPedido: dados.dataPedido || new Date(),
            valorTotal: dados.valorTotal
        });
    }

    static editar(dados) {
        return new Pedido({
            id: dados.id,
            status: dados.status || dados.statusPedido || Status.PENDENTE,
            idCliente: dados.idCliente || null,
            dataPedido: dados.dataPedido,
            valorTotal: dados.valorTotal
        });
    }

    static mapearDaBD(dados) {
        return new Pedido({
            id: dados.id_pedido,
            status: dados.status_pedido || dados.status || Status.PENDENTE,
            dataPedido: dados.data_pedido,
            idCliente: dados.id_cliente,
            valorTotal: dados.valor_total ? Number(dados.valor_total) : 0
        });
    }
}