import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconesProdutos } from '../../components/icons/IconesProdutos.jsx';
import Alert from '../../components/common/Alert.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { buscarCliente, atualizarCliente, logoutCliente } from '../../services/api.js';
import './minhaConta.page.css';

function lerPayload() {
  try {
    return JSON.parse(localStorage.getItem('payload')) || null;
  } catch {
    return null;
  }
}

function formatarCpf(cpf) {
  const numeros = String(cpf || '').replace(/\D/g, '');
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarTelefone(telefone) {
  const numeros = String(telefone || '').replace(/\D/g, '');
  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return telefone || '';
}

export default function MinhaContaPage() {
  const navigate = useNavigate();
  const { logado, setLogado } = useAuth();

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const [falhou, setFalhou] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [camposComErro, setCamposComErro] = useState({});

  const payload = lerPayload();
  const idCliente = payload?.sub;

  useEffect(() => {
    if (logado === false) {
      navigate('/login');
    }
  }, [logado]);

  useEffect(() => {
    if (logado) {
      carregarDados();
    }
  }, [logado]);

  async function carregarDados() {
    if (!idCliente) {
      setErro('Não foi possível identificar sua conta. Faça login novamente.');
      setFalhou(true);
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setFalhou(false);
      setErro('');

      const cliente = await buscarCliente(idCliente);

      setFormData({
        nome: cliente.nome || '',
        cpf: formatarCpf(cliente.cpf),
        email: cliente.email || '',
        telefone: formatarTelefone(cliente.telefone),
        senha: '',
        confirmarSenha: '',
      });
    } catch (error) {
      setErro(error.message || 'Não foi possível carregar seus dados.');
      setFalhou(true);
    } finally {
      setCarregando(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (erro) setErro('');
    if (mensagem) setMensagem('');
    if (camposComErro[name]) setCamposComErro((prev) => ({ ...prev, [name]: false }));
  }

  function validar() {
    if (!formData.nome.trim() || formData.nome.trim().length < 3) {
      setCamposComErro({ nome: true });
      setErro('Digite seu nome completo.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setCamposComErro({ email: true });
      setErro('Digite um e-mail válido.');
      return false;
    }
    const telefoneNumeros = formData.telefone.replace(/\D/g, '');
    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
      setCamposComErro({ telefone: true });
      setErro('Digite um telefone válido com DDD.');
      return false;
    }

    if (formData.senha) {
      if (formData.senha.length < 6) {
        setCamposComErro({ senha: true });
        setErro('A nova senha deve ter pelo menos 6 caracteres.');
        return false;
      }
      if (formData.senha !== formData.confirmarSenha) {
        setCamposComErro({ senha: true, confirmarSenha: true });
        setErro('As senhas não coincidem.');
        return false;
      }
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setMensagem('');
    setCamposComErro({});

    if (!validar()) return;

    const dados = {
      nome: formData.nome.trim(),
      email: formData.email.trim(),
      telefone: formData.telefone,
    };
    if (formData.senha) {
      dados.senha = formData.senha;
    }

    try {
      setSalvando(true);
      await atualizarCliente(idCliente, dados);

      const novoPayload = { ...payload, name: dados.nome, email: dados.email, tel: dados.telefone };
      localStorage.setItem('payload', JSON.stringify(novoPayload));

      setFormData((prev) => ({ ...prev, senha: '', confirmarSenha: '' }));
      setMensagem('Dados atualizados com sucesso!');
    } catch (error) {
      setErro(error.message || 'Não foi possível salvar as alterações.');
    } finally {
      setSalvando(false);
    }
  }

  async function handleLogout() {
    try {
      setSaindo(true);
      await logoutCliente();
    } catch (error) {
      console.error(error);
    } finally {
      setLogado(false);
      navigate('/');
    }
  }

  const inicial = formData.nome ? formData.nome.trim().charAt(0).toUpperCase() : '?';

  return (
    <div className="produtos-page">
      <header className="produtos-header">
        <div className="produtos-header-main">
          <button
            type="button"
            className="produtos-logo"
            onClick={() => navigate('/')}
            aria-label="Ir para produtos"
          >
            <img src="/FeraCustomLogo.jpg" alt="Fera Custom" />
            <strong>FERA CUSTOM</strong>
          </button>

          <div className="produtos-header-actions">
            <button type="button" className="produtos-back" onClick={() => navigate('/')}>
              Voltar para a loja
            </button>
            <button
              type="button"
              className="produtos-icon-button"
              aria-label="Carrinho"
              onClick={() => navigate('/carrinho')}
            >
              <IconesProdutos name="cart" size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="conta-content">
        <h1 className="conta-titulo">Minha Conta</h1>

        {(logado === null || carregando) && !erro && (
          <p className="conta-mensagem">Carregando seus dados...</p>
        )}

        {!carregando && logado && !falhou && (
          <>
            <div className="conta-card conta-resumo">
              <div className="conta-avatar">{inicial}</div>
              <div className="conta-resumo-info">
                <strong>{formData.nome || 'Cliente'}</strong>
                <span>{formData.email}</span>
              </div>
            </div>

            <form className="conta-card" onSubmit={handleSubmit} noValidate>
              <h2 className="conta-card-titulo">Dados pessoais</h2>

              <Alert tipo="success" mensagem={mensagem} />
              <Alert tipo="error" mensagem={erro} />

              <div className="conta-campo">
                <label htmlFor="conta-nome">Nome completo</label>
                <input
                  id="conta-nome"
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={camposComErro.nome ? 'conta-input conta-input--erro' : 'conta-input'}
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div className="conta-campo">
                <label htmlFor="conta-cpf">CPF</label>
                <input
                  id="conta-cpf"
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  className="conta-input"
                  disabled
                />
                <small>O CPF não pode ser alterado.</small>
              </div>

              <div className="conta-campo">
                <label htmlFor="conta-email">E-mail</label>
                <input
                  id="conta-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={camposComErro.email ? 'conta-input conta-input--erro' : 'conta-input'}
                  placeholder="seuemail@exemplo.com"
                />
              </div>

              <div className="conta-campo">
                <label htmlFor="conta-telefone">Telefone / WhatsApp</label>
                <input
                  id="conta-telefone"
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className={camposComErro.telefone ? 'conta-input conta-input--erro' : 'conta-input'}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <h2 className="conta-card-titulo conta-card-titulo--secao">Alterar senha</h2>
              <p className="conta-ajuda">Preencha somente se quiser trocar a senha.</p>

              <div className="conta-campo">
                <label htmlFor="conta-senha">Nova senha</label>
                <input
                  id="conta-senha"
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className={camposComErro.senha ? 'conta-input conta-input--erro' : 'conta-input'}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                />
              </div>

              <div className="conta-campo">
                <label htmlFor="conta-confirmar-senha">Confirmar nova senha</label>
                <input
                  id="conta-confirmar-senha"
                  type="password"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className={camposComErro.confirmarSenha ? 'conta-input conta-input--erro' : 'conta-input'}
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="conta-botao" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </form>

            <div className="conta-card conta-sair">
              <div>
                <h2 className="conta-card-titulo">Sair da conta</h2>
                <p className="conta-ajuda">Você precisará entrar novamente para fazer pedidos.</p>
              </div>
              <button
                type="button"
                className="pedidos-botao"
                onClick={handleLogout}
                disabled={saindo}
              >
                {saindo ? 'Saindo...' : 'Sair'}
              </button>
            </div>
          </>
        )}

        {!carregando && logado && falhou && (
          <div className="conta-mensagem">
            <p>{erro}</p>
            <button className="pedidos-botao" onClick={carregarDados}>
              Tentar novamente
            </button>
          </div>
        )}
      </main>
    </div>
  );
}