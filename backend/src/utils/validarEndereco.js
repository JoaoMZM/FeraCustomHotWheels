const UFS_VALIDAS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const texto = (valor) => (typeof valor === 'string' ? valor.trim() : '');

/**
 * Valida e normaliza os dados de endereço vindos do corpo da requisição.
 * Retorna { erro } quando algo é inválido ou { endereco } já limpo para salvar.
 */
export function validarEndereco(dados = {}) {
    const rua = texto(dados.rua);
    const numero = texto(dados.numero);
    const bairro = texto(dados.bairro);
    const cidade = texto(dados.cidade);
    const uf = texto(dados.uf).toUpperCase();
    const cep = texto(dados.cep).replace(/\D/g, '');
    const complemento = texto(dados.complemento);

    if (rua.length < 2 || rua.length > 100) {
        return { erro: 'Informe a rua (entre 2 e 100 caracteres).' };
    }

    if (numero.length < 1 || numero.length > 20) {
        return { erro: 'Informe o número (use "S/N" se não houver).' };
    }

    if (bairro.length < 2 || bairro.length > 100) {
        return { erro: 'Informe o bairro (entre 2 e 100 caracteres).' };
    }

    if (cidade.length < 2 || cidade.length > 100) {
        return { erro: 'Informe a cidade (entre 2 e 100 caracteres).' };
    }

    if (!UFS_VALIDAS.includes(uf)) {
        return { erro: 'Informe uma UF válida (ex.: SP).' };
    }

    if (cep.length !== 8 || /^(\d)\1+$/.test(cep)) {
        return { erro: 'Informe um CEP válido com 8 dígitos.' };
    }

    if (complemento.length > 255) {
        return { erro: 'O complemento deve ter no máximo 255 caracteres.' };
    }

    return {
        endereco: {
            rua,
            numero,
            bairro,
            cidade,
            uf,
            cep,
            complemento: complemento || null
        }
    };
}
