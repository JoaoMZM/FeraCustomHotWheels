export class Produto {
    #id
    #idCategoria
    #nome
    #descricao
    #valor
    #cor
    #limitado 
    #modelo
    #caminhoImagem

    constructor(pNome, pValor, pCaminhoImagem, pIdCategoria, pId) {
        this.nome = pNome;
        this.valor = pValor;
        this.caminhoImagem = pCaminhoImagem;
        this.idCategoria = pIdCategoria;
        this.descricao = pDescricao;
        
        this.id = pId;
    }

    get nome() {
        return this.#nome;
    }

    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    get valor() {
        return this.#valor;
    }

    set valor(value) {
        this.#validarValor(value);
        this.#valor = Number(value);
    }

    get caminhoImagem() {
        return this.#caminhoImagem;
    }

    set caminhoImagem(value) {
        this.#validarCaminhoImagem(value);
        this.#caminhoImagem = value;
    }

    get idCategoria() {
        return this.#idCategoria;
    }

    set idCategoria(value) {
        this.#validarIdCategoria(value);
        this.#idCategoria = value;
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 45) {
            throw new Error("Nome deve ter entre 3 e 45 caracteres");
        }
    }

    #validarValor(value) {
        if (value === undefined || value === null || isNaN(value) || Number(value) <= 0) {
            throw new Error("Valor deve ser numérico e maior que zero");
        }
    }

    #validarCaminhoImagem(value) {
        if (value && value.length < 3) {
            throw new Error("Caminho da imagem inválido");
        }
    }

    #validarIdCategoria(value) {
        if (!value || value <= 0) {
            throw new Error("idCategoria é obrigatório");
        }
    }

    #validarId(value) {
        if (value && value <= 0) {
            throw new Error("ID inválido");
        }
    }

    static criar(dados) {
        return new Produto(
            dados.nome,
            dados.valor,
            dados.caminhoImagem,
            dados.idCategoria
        );
    }

    static editar(dados, produtoAtual) {
        return new Produto(
            dados.nome ?? produtoAtual.nome,
            dados.valor ?? produtoAtual.valor,
            dados.caminhoImagem ?? produtoAtual.caminhoImagem,
            dados.idCategoria ?? produtoAtual.idCategoria,
            produtoAtual.id
        );
    }
}