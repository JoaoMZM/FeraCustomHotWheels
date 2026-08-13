export class Produto {
    #id
    #idCategoria
    #nome
    #descricao
    #valor
    #estoque
    #cor
    #limitado 
    #modelo
    #caminhoImagem

    constructor(pNome, pDescricao, pValor, pEstoque, pIdCategoria, pCor, pLimitado, pModelo, pCaminhoImagem, pId) {
        this.nome = pNome;
        this.descricao = pDescricao;
        this.valor = pValor;
        this.estoque = pEstoque;
        this.idCategoria = pIdCategoria;
        this.cor = pCor;
        this.limitado = pLimitado;
        this.modelo = pModelo;
        this.caminhoImagem = pCaminhoImagem;
        this.id = pId;
    }

    get nome() {
        return this.#nome;
    }

    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    get descricao() {
        return this.#descricao;
    }

    set descricao(value) {
        this.#validarDescricao(value);
        this.#descricao = value;
    }

    get valor() {
        return this.#valor;
    }

    set valor(value) {
        this.#validarValor(value);
        this.#valor = Number(value);
    }

    get estoque() {
        return this.#estoque;
    }

    set estoque(value) {
        this.#validarEstoque(value);
        this.#estoque = Number(value);
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

    get cor() {
        return this.#cor;
    }

    set cor(value) {
        this.#validarCor(value);
        this.#cor = value;
    }

    get limitado() {
        return this.#limitado;
    }

    set limitado(value) {
        this.#validarLimitado(value);
        this.#limitado = value;
    }

    get modelo() {
        return this.#modelo;
    }

    set modelo(value) {
        this.#validarModelo(value);
        this.#modelo = value;
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error("Nome deve ter entre 3 e 100 caracteres");
        }
    }

    #validarDescricao(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error("Descrição deve ter entre 3 e 100 caracteres");
        }
    }

    #validarValor(value) {
        if (value === undefined || value === null || isNaN(value) || Number(value) <= 0) {
            throw new Error("Valor deve ser numérico e maior que zero");
        }
    }

    #validarEstoque(value) {
        if (value === undefined || value === null || isNaN(value) || Number(value) < 0) {
            throw new Error("Estoque deve ser numérico e maior ou igual a zero");
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

    #validarCor(value) {
        if (value && value.trim().length > 30) {
            throw new Error("Cor deve ter no máximo 30 caracteres");
        }
    }

    #validarLimitado(value) {
        if (value !== undefined && value !== null && typeof value !== "boolean") {
            throw new Error("Campo limitado deve ser booleano (true/false)");
        }
    }

    #validarModelo(value) {
        if (value && value.trim().length > 50) {
            throw new Error("Modelo deve ter no máximo 50 caracteres");
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
            dados.descricao,
            dados.valor,
            dados.estoque,
            dados.idCategoria,
            dados.cor,
            dados.limitado,
            dados.modelo,
            dados.caminhoImagem
        );
    }

    static editar(dados, produtoAtual) {
        return new Produto(
            dados.nome ?? produtoAtual.nome,
            dados.descricao ?? produtoAtual.descricao,
            dados.valor ?? produtoAtual.valor,
            dados.estoque ?? produtoAtual.estoque,
            dados.idCategoria ?? produtoAtual.idCategoria,
            dados.cor ?? produtoAtual.cor,
            dados.limitado ?? produtoAtual.limitado,
            dados.modelo ?? produtoAtual.modelo,
            dados.caminhoImagem ?? produtoAtual.caminhoImagem,
            produtoAtual.id
        );
    }
}