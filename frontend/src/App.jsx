import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProdutosPage from './pages/produtos/produtos.page.jsx';
import CarrinhoPage from './pages/carrinho/carrinho.page.jsx';
import LoginPage from './pages/usuarios/login.page.jsx';
import CadastroPage from './pages/usuarios/cadastro.page.jsx';
import RecuperarSenhaPage from './pages/usuarios/recuperacao.page.jsx';
import PedidosPage from './pages/pedidos/pedidos.page.jsx';
import './style.css'
import AdminProdutosPage from './pages/admin/admin.produtos.page.jsx';
import { RotaAdmin } from './components/RotaAdmin.jsx';

export default function App() {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || null;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProdutosPage />} />
      <Route path="/carrinho" element={<CarrinhoPage />} />
      <Route path="/pedidosProdutos" element={<PedidosPage />}/>

      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
      {/* Rotas Protegidas do Administrador */}
      <Route element={<RotaAdmin usuario={usuario} />}>
        <Route path="/admin/produtos" element={<AdminProdutosPage />} />
      </Route>
    </Routes>
  );
}
