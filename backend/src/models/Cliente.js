export class Cliente {
    #id_cliente;
    #nome;
    #cpf;
    #email;
    #senha;
    #telefone;
    #dataCad;

    constructor(pNome, pCpf, pEmail, pSenha, pTelefone, pId) {
        this.nome = pNome;
        this.cpf = pCpf;
        this.email = pEmail;
        this.senha = pSenha;
        this.telefone = pTelefone;
        this.id_cliente = pId;
    }

    get nome() {
        return this.#nome;
    }

    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    get cpf() {
        return this.#cpf;
    }

    set cpf(value) {
        this.#validarCpf(value);
        this.#cpf = value;
    }

    get email() {
        return this.#email;
    }

    set email(value) {
        this.#validarEmail(value);
        this.#email = value;
    }

    get senha() {
        return this.#senha;
    }

    set senha(value) {
        this.#validarSenha(value);
        this.#senha = value;
    }

    get telefone() {
        return this.#telefone;
    }

    set telefone(value) {
        this.#validarTelefone(value);
        this.#telefone = value;
    }

    get id_cliente() {
        return this.#id_cliente;
    }

    set id_cliente(value) {
        this.#validarId(value);
        this.#id_cliente = value;
    }


    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 100) {
            throw new Error("O campo nome é obrigatório e deve ter entre 3 e 100 caracteres");
        }
    }

    #validarCpf(value) {
        if (!value) {
            throw new Error("O campo cpf deve existir");
        }
    }

    #validarEmail(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 255) {
            throw new Error("O campo email é obrigatório, digite corretamente");
        }
    }

    #validarSenha(value) {
        if (!value || value.trim().length < 5 || value.trim().length > 255) {
            throw new Error("A senha é obrigatória e deve ter entre 5 e 255 caracteres");
        }
    }

    #validarTelefone(value) {
        if (!value) {
            throw new Error("O campo telefone deve existir");
        }
    }

    #validarId(value) {
        if (value && value <= 0) {
            throw new Error("O campo id deve ser maior que zero");
        }
    }


    static criar(dados) {
        return new Cliente(dados.nome, dados.cpf, dados.email, dados.senha, dados.telefone, dados.id_cliente);
    }


    static editar(dados, clienteAtual) {
        return new Cliente(
            dados.nome ?? clienteAtual.nome,
            dados.cpf ?? clienteAtual.cpf,
            dados.email ?? clienteAtual.email,
            dados.senha ?? clienteAtual.senha,
            dados.telefone ?? clienteAtual.telefone,
            clienteAtual.id_cliente
        );
    }
}