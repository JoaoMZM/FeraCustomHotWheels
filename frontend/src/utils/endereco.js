
export const enderecoVazio = () => ({
  cep: '',
  rua: '',
  numero: '',
  bairro: '',
  cidade: '',
  uf: '',
  complemento: '',
});

export function formatarCep(valor) {
  const numeros = String(valor || '').replace(/\D/g, '').slice(0, 8);
  return numeros.length > 5 ? numeros.replace(/(\d{5})(\d{1,3})/, '$1-$2') : numeros;
}

export function validarEnderecoForm(dados) {
  if (String(dados.cep || '').replace(/\D/g, '').length !== 8) {
    return 'Digite um CEP válido com 8 dígitos.';
  }
  if (String(dados.rua || '').trim().length < 2) {
    return 'Digite o nome da rua.';
  }
  if (!String(dados.numero || '').trim()) {
    return 'Digite o número (use "S/N" se não houver).';
  }
  if (String(dados.bairro || '').trim().length < 2) {
    return 'Digite o bairro.';
  }
  if (String(dados.cidade || '').trim().length < 2) {
    return 'Digite a cidade.';
  }
  if (String(dados.uf || '').length !== 2) {
    return 'Digite a UF com 2 letras (ex.: SP).';
  }
  return null;
}

export function normalizarEnderecoForm(dados) {
  return {
    cep: String(dados.cep || '').replace(/\D/g, ''),
    rua: String(dados.rua || '').trim(),
    numero: String(dados.numero || '').trim(),
    bairro: String(dados.bairro || '').trim(),
    cidade: String(dados.cidade || '').trim(),
    uf: String(dados.uf || '').trim().toUpperCase(),
    complemento: String(dados.complemento || '').trim(),
  };
}

export async function consultarCep(cepNumeros) {
  const resposta = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
  const dados = await resposta.json();

  if (dados.erro) return null;

  return {
    rua: dados.logradouro || '',
    bairro: dados.bairro || '',
    cidade: dados.localidade || '',
    uf: (dados.uf || '').toUpperCase(),
  };
}

export function linhasEndereco(endereco) {
  const rua = [endereco.rua, endereco.numero].filter(Boolean).join(', ');
  const complemento = endereco.complemento || '';
  const local = [
    endereco.bairro,
    [endereco.cidade, endereco.uf].filter(Boolean).join('/'),
  ].filter(Boolean).join(' - ');

  return { rua, complemento, local, cep: formatarCep(endereco.cep) };
}
