export class ItensPedidos {
    #precoUnitario;
    #subTotal;
    #quantidade;
    #idProduto;
    #id;

    constructor(precoUnitario, subTotal, quantidade, idProduto, id = null) {
        this.#precoUnitario = precoUnitario;
        this.#subTotal = subTotal;
        this.#quantidade = quantidade;
        this.#idProduto = idProduto;
        this.#id = id;
    }

    get precoUnitario() {
        return this.#precoUnitario;
    }

    get subTotal() {
        return this.#subTotal;
    }

    get quantidade() {
        return this.#quantidade;
    }

    get idProduto() {
        return this.#idProduto;
    }

    get id() {
        return this.#id;
    }

    static calcularSubTotal(quantidade, precoUnitario) {
        return Number((quantidade * precoUnitario).toFixed(2));
    }

    static calcularValorTotal(itens) {
        return Number(
            itens.reduce((total, item) => total + item.subTotal, 0).toFixed(2)
        );
    }

    static criar(dados) {
        return new ItensPedidos(
            dados.precoUnitario,
            dados.subTotal,
            dados.quantidade,
            dados.idProduto
        );
    }

    static editar(dados) {
        return new ItensPedidos(
            dados.precoUnitario,
            dados.subTotal,
            dados.quantidade,
            dados.idProduto,
            dados.id
        );
    }
}