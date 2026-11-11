import { useState } from "react";
import { consultarCep, formatarCep, linhasEndereco } from "../../utils/endereco.js";
import "./EnderecoEntrega.css";

/**
 * Escolha do endereço de entrega no carrinho:
 *  - "cadastrado": usa o endereço salvo em Minha Conta;
 *  - "outro": o cliente informa um endereço só para este pedido.
 *
 * É um componente controlado: o estado (modo e campos) fica na página do carrinho.
 */
export function EnderecoEntrega({
  carregando,
  enderecoCadastrado,
  modo,
  onMudarModo,
  dados,
  onMudarDados,
  erro,
  onCadastrarEndereco,
}) {
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [avisoCep, setAvisoCep] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    let novoValor = value;
    if (name === "cep") novoValor = formatarCep(value);
    if (name === "uf") novoValor = value.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();

    if (avisoCep) setAvisoCep("");
    onMudarDados({ ...dados, [name]: novoValor });
  };

  // Ao sair do campo CEP, preenche rua/bairro/cidade/UF pelo ViaCEP.
  // Se a consulta falhar, o cliente preenche à mão.
  const handleCepBlur = async () => {
    const cep = dados.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;

    try {
      setBuscandoCep(true);
      const resultado = await consultarCep(cep);

      if (!resultado) {
        setAvisoCep("CEP não encontrado. Confira o número ou preencha manualmente.");
        return;
      }

      onMudarDados({
        ...dados,
        rua: resultado.rua || dados.rua,
        bairro: resultado.bairro || dados.bairro,
        cidade: resultado.cidade || dados.cidade,
        uf: resultado.uf || dados.uf,
      });
    } catch {
      // Sem internet ou ViaCEP fora do ar: segue com preenchimento manual
    } finally {
      setBuscandoCep(false);
    }
  };

  if (carregando) {
    return (
      <section className="entrega-card">
        <h2 className="entrega-titulo">Endereço de entrega</h2>
        <p className="entrega-ajuda">Carregando seu endereço...</p>
      </section>
    );
  }

  const temCadastrado = Boolean(enderecoCadastrado);
  const resumo = temCadastrado ? linhasEndereco(enderecoCadastrado) : null;

  return (
    <section className="entrega-card" id="endereco-entrega">
      <h2 className="entrega-titulo">Endereço de entrega</h2>

      {erro && <div className="entrega-erro" role="alert">{erro}</div>}

      <label className={`entrega-opcao ${modo === "cadastrado" ? "ativa" : ""} ${!temCadastrado ? "desabilitada" : ""}`}>
        <input
          type="radio"
          name="modo-entrega"
          value="cadastrado"
          checked={modo === "cadastrado"}
          disabled={!temCadastrado}
          onChange={() => onMudarModo("cadastrado")}
        />
        <div className="entrega-opcao-texto">
          <strong>Usar meu endereço cadastrado</strong>
          {temCadastrado ? (
            <address>
              <span>{resumo.rua}{resumo.complemento ? ` - ${resumo.complemento}` : ""}</span>
              <span>{resumo.local}</span>
              <span>CEP {resumo.cep}</span>
            </address>
          ) : (
            <span className="entrega-ajuda">
              Você ainda não tem endereço cadastrado.{" "}
              <button type="button" className="entrega-link" onClick={onCadastrarEndereco}>
                Cadastrar em Minha Conta
              </button>
            </span>
          )}
        </div>
      </label>

      <label className={`entrega-opcao ${modo === "outro" ? "ativa" : ""}`}>
        <input
          type="radio"
          name="modo-entrega"
          value="outro"
          checked={modo === "outro"}
          onChange={() => onMudarModo("outro")}
        />
        <div className="entrega-opcao-texto">
          <strong>Entregar em outro endereço</strong>
          <span className="entrega-ajuda">Vale somente para este pedido; seu cadastro não é alterado.</span>
        </div>
      </label>

      {modo === "outro" && (
        <div className="entrega-form">
          <div className="entrega-campo entrega-cep">
            <label htmlFor="entrega-cep">CEP</label>
            <input
              id="entrega-cep"
              type="text"
              name="cep"
              inputMode="numeric"
              value={dados.cep}
              onChange={handleChange}
              onBlur={handleCepBlur}
              placeholder="00000-000"
              autoComplete="postal-code"
            />
            {buscandoCep && <small>Buscando endereço...</small>}
            {avisoCep && <small className="entrega-aviso">{avisoCep}</small>}
          </div>

          <div className="entrega-campo entrega-rua">
            <label htmlFor="entrega-rua">Rua</label>
            <input
              id="entrega-rua"
              type="text"
              name="rua"
              value={dados.rua}
              onChange={handleChange}
              placeholder="Nome da rua"
              autoComplete="address-line1"
            />
          </div>

          <div className="entrega-campo entrega-numero">
            <label htmlFor="entrega-numero">Número</label>
            <input
              id="entrega-numero"
              type="text"
              name="numero"
              value={dados.numero}
              onChange={handleChange}
              placeholder="123"
            />
          </div>

          <div className="entrega-campo entrega-complemento">
            <label htmlFor="entrega-complemento">Complemento (opcional)</label>
            <input
              id="entrega-complemento"
              type="text"
              name="complemento"
              value={dados.complemento}
              onChange={handleChange}
              placeholder="Apto, bloco, referência..."
              autoComplete="address-line2"
            />
          </div>

          <div className="entrega-campo entrega-bairro">
            <label htmlFor="entrega-bairro">Bairro</label>
            <input
              id="entrega-bairro"
              type="text"
              name="bairro"
              value={dados.bairro}
              onChange={handleChange}
              placeholder="Bairro"
            />
          </div>

          <div className="entrega-campo entrega-cidade">
            <label htmlFor="entrega-cidade">Cidade</label>
            <input
              id="entrega-cidade"
              type="text"
              name="cidade"
              value={dados.cidade}
              onChange={handleChange}
              placeholder="Cidade"
              autoComplete="address-level2"
            />
          </div>

          <div className="entrega-campo entrega-uf">
            <label htmlFor="entrega-uf">UF</label>
            <input
              id="entrega-uf"
              type="text"
              name="uf"
              value={dados.uf}
              onChange={handleChange}
              placeholder="SP"
              maxLength={2}
            />
          </div>
        </div>
      )}
    </section>
  );
}
