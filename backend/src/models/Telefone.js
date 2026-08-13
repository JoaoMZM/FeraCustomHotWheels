export class Telefone {
    #id_telefone;
    #id_cliente;
    #numero;

    constructor(numero, id_cliente, id_telefone) {
        this.numero = numero;
        this.id_cliente = id_cliente;
        this.id_telefone = id_telefone;
    }

    get numero() {
        return this.#numero;
    }

    set numero(value) {
        this.#validarNumero(value);
        this.#numero = value;
    }

    get id_cliente() {
        return this.#id_cliente;
    }

    set id_cliente(value) {
        this.#validarIdCliente(value);
        this.#id_cliente = value;
    }

    get id_telefone() {
        return this.#id_telefone;
    }

    set id_telefone(value) {
        this.#validarIdTelefone(value);
        this.#id_telefone = value;
    }


    #validarNumero(value) {
        if (!value || value.length < 8 ) {
            throw new Error("O campo telefone não pode ter menos de 8 dígitos");
        }
    }

    #validarIdCliente(value) {
        if (value && value <= 0) {
            throw new Error("O campo id_cliente deve ser maior que zero"); // Ajustei o texto do erro
        }
    }

    #validarIdTelefone(value) {
        if (value && value <= 0) {
            throw new Error("O campo id_telefone deve ser maior que zero"); // Ajustei o texto do erro
        }
    }


    static criar(dados) {
        // Corrigido: Estava retornando "new Categoria"
        return new Telefone(dados.numero, dados.id_cliente, dados.id_telefone);
    }

    static editar(dados, telefoneAtual) {
        return new Telefone(
            dados.numero ?? telefoneAtual.numero,
            dados.id_cliente ?? telefoneAtual.id_cliente,
            telefoneAtual.id_telefone 
        );
    }
}