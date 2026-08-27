import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './pages/usuarios/login.page.jsx';
import CadastroPage from './pages/usuarios/cadastro.page.jsx';
import RecuperarSenhaPage from './pages/usuarios/recuperacao.page.jsx';
import ProdutosPage from './pages/produtos/produtos.Page.jsx';
import CarrinhoPage from './pages/carrinho/carrinho.page.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
      <Route path="/produtos" element={<ProdutosPage />} />
      <Route path="/carrinho" element={<CarrinhoPage />} />
    </Routes>
  );
}