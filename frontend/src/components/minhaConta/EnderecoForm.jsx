import { useEffect, useState } from 'react';
import Alert from '../common/Alert.jsx';
import { buscarEndereco, salvarEndereco } from '../../services/api.js';
import './EnderecoForm.css';

const formInicial = {
  cep: '',
  rua: '',
  numero: '',
  bairro: '',
  cidade: '',
  uf: '',
  complemento: '',
};

function formatarCep(valor) {
  const numeros = String(valor || '').replace(/\D/g, '').slice(0, 8);
  return numeros.length > 5 ? numeros.replace(/(\d{5})(\d{1,3})/, '$1-$2') : numeros;
}

export default function EnderecoForm({ onSalvo }) {
  const [formData, setFormData] = useState(formInicial);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [temEndereco, setTemEndereco] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [camposComErro, setCamposComErro] = useState({});

  useEffect(() => {
    carregarEndereco();
  }, []);

  async function carregarEndereco() {
    try {
      setCarregando(true);
      const resposta = await buscarEndereco();
      const endereco = resposta?.endereco;

      if (endereco) {
        setTemEndereco(true);
        setFormData({
          cep: formatarCep(endereco.cep),
          rua: endereco.rua || '',
          numero: endereco.numero || '',
          bairro: endereco.bairro || '',
          cidade: endereco.cidade || '',
          uf: endereco.uf || '',
          complemento: endereco.complemento || '',
        });
      }
    } catch (error) {
      setErro(error.message || 'Não foi possível carregar seu endereço.');
    } finally {
      setCarregando(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    let novoValor = value;
    if (name === 'cep') novoValor = formatarCep(value);
    if (name === 'uf') novoValor = value.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase();

    setFormData((prev) => ({ ...prev, [name]: novoValor }));
    if (erro) setErro('');
    if (mensagem) setMensagem('');
    if (camposComErro[name]) setCamposComErro((prev) => ({ ...prev, [name]: false }));
  }

  async function handleCepBlur() {
    const cep = formData.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
      setBuscandoCep(true);
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = await resposta.json();

      if (dados.erro) {
        setErro('CEP não encontrado. Confira o número ou preencha o endereço manualmente.');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        rua: dados.logradouro || prev.rua,
        bairro: dados.bairro || prev.bairro,
        cidade: dados.localidade || prev.cidade,
        uf: (dados.uf || prev.uf || '').toUpperCase(),
      }));
    } catch {
    } finally {
      setBuscandoCep(false);
    }
  }

  function validar() {
    const cepNumeros = formData.cep.replace(/\D/g, '');

    if (cepNumeros.length !== 8) {
      setCamposComErro({ cep: true });
      setErro('Digite um CEP válido com 8 dígitos.');
      return false;
    }
    if (formData.rua.trim().length < 2) {
      setCamposComErro({ rua: true });
      setErro('Digite o nome da rua.');
      return false;
    }
    if (!formData.numero.trim()) {
      setCamposComErro({ numero: true });
      setErro('Digite o número (use "S/N" se não houver).');
      return false;
    }
    if (formData.bairro.trim().length < 2) {
      setCamposComErro({ bairro: true });
      setErro('Digite o bairro.');
      return false;
    }
    if (formData.cidade.trim().length < 2) {
      setCamposComErro({ cidade: true });
      setErro('Digite a cidade.');
      return false;
    }
    if (formData.uf.length !== 2) {
      setCamposComErro({ uf: true });
      setErro('Digite a UF com 2 letras (ex.: SP).');
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setMensagem('');
    setCamposComErro({});

    if (!validar()) return;

    try {
      setSalvando(true);
      await salvarEndereco({
        cep: formData.cep.replace(/\D/g, ''),
        rua: formData.rua.trim(),
        numero: formData.numero.trim(),
        bairro: formData.bairro.trim(),
        cidade: formData.cidade.trim(),
        uf: formData.uf,
        complemento: formData.complemento.trim(),
      });

      setTemEndereco(true);
      setMensagem('Endereço salvo com sucesso!');
      if (onSalvo) onSalvo();
    } catch (error) {
      setErro(error.message || 'Não foi possível salvar o endereço.');
    } finally {
      setSalvando(false);
    }
  }

  const classeInput = (campo) =>
    camposComErro[campo] ? 'conta-input conta-input--erro' : 'conta-input';

  return (
    <form className="conta-card" id="endereco-entrega" onSubmit={handleSubmit} noValidate>
      <h2 className="conta-card-titulo">Endereço de entrega</h2>
      <p className="conta-ajuda">
        {temEndereco
          ? 'Seus pedidos serão entregues neste endereço.'
          : 'Cadastre um endereço para poder finalizar seus pedidos.'}
      </p>

      <Alert tipo="success" mensagem={mensagem} />
      <Alert tipo="error" mensagem={erro} />

      {carregando ? (
        <p className="conta-ajuda">Carregando endereço...</p>
      ) : (
        <>
          <div className="endereco-grid">
            <div className="conta-campo endereco-cep">
              <label htmlFor="endereco-cep">CEP</label>
              <input
                id="endereco-cep"
                type="text"
                name="cep"
                inputMode="numeric"
                value={formData.cep}
                onChange={handleChange}
                onBlur={handleCepBlur}
                className={classeInput('cep')}
                placeholder="00000-000"
                autoComplete="postal-code"
              />
              {buscandoCep && <small>Buscando endereço...</small>}
            </div>

            <div className="conta-campo endereco-rua">
              <label htmlFor="endereco-rua">Rua</label>
              <input
                id="endereco-rua"
                type="text"
                name="rua"
                value={formData.rua}
                onChange={handleChange}
                className={classeInput('rua')}
                placeholder="Nome da rua"
                autoComplete="address-line1"
              />
            </div>

            <div className="conta-campo endereco-numero">
              <label htmlFor="endereco-numero">Número</label>
              <input
                id="endereco-numero"
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className={classeInput('numero')}
                placeholder="123"
              />
            </div>

            <div className="conta-campo endereco-complemento">
              <label htmlFor="endereco-complemento">Complemento (opcional)</label>
              <input
                id="endereco-complemento"
                type="text"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                className={classeInput('complemento')}
                placeholder="Apto, bloco, referência..."
                autoComplete="address-line2"
              />
            </div>

            <div className="conta-campo endereco-bairro">
              <label htmlFor="endereco-bairro">Bairro</label>
              <input
                id="endereco-bairro"
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                className={classeInput('bairro')}
                placeholder="Bairro"
              />
            </div>

            <div className="conta-campo endereco-cidade">
              <label htmlFor="endereco-cidade">Cidade</label>
              <input
                id="endereco-cidade"
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className={classeInput('cidade')}
                placeholder="Cidade"
                autoComplete="address-level2"
              />
            </div>

            <div className="conta-campo endereco-uf">
              <label htmlFor="endereco-uf">UF</label>
              <input
                id="endereco-uf"
                type="text"
                name="uf"
                value={formData.uf}
                onChange={handleChange}
                className={classeInput('uf')}
                placeholder="SP"
                maxLength={2}
              />
            </div>
          </div>

          <button type="submit" className="conta-botao" disabled={salvando}>
            {salvando ? 'Salvando...' : temEndereco ? 'Atualizar endereço' : 'Salvar endereço'}
          </button>
        </>
      )}
    </form>
  );
}
