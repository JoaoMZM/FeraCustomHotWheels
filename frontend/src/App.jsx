import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProdutosPage from './pages/produtos/produtos.Page.jsx';
import CarrinhoPage from './pages/carrinho/carrinho.page.jsx';
import LoginPage from './pages/usuarios/login.page.jsx';
import CadastroPage from './pages/usuarios/cadastro.page.jsx';
import RecuperarSenhaPage from './pages/usuarios/recuperacao.page.jsx';
import './style.css'
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProdutosPage />} />
      <Route path="/carrinho" element={<CarrinhoPage />} />

<<<<<<< HEAD
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
    </Routes>
  );
}
=======
    const [pagina, setPagina] = useState('login');

    return (
        <div>

            {pagina === 'login' && (
                <LoginPage
                    onNavigateToCadastro={() => setPagina('cadastro')}
                    onNavigateToRecuperarSenha={() => setPagina('recuperar')}
                />
            )}

            {pagina === 'cadastro' && (
                <CadastroPage />
            )}

            {pagina === 'recuperar' && (
                <RecuperarSenhaPage
                    onVoltarLogin={() => setPagina('login')}
                />
            )}

        </div>
    );
}
>>>>>>> a6916f08ff89575d8c88574eddd8604f8854b1b4
