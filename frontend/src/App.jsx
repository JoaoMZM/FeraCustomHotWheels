import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProdutosPage from './pages/produtos/produtos.page.jsx';
import CarrinhoPage from './pages/carrinho/carrinho.page.jsx';
import LoginPage from './pages/usuarios/login.page.jsx';
import CadastroPage from './pages/usuarios/cadastro.page.jsx';
import RecuperarSenhaPage from './pages/usuarios/recuperacao.page.jsx';
import RedefinirSenhaPage from './pages/usuarios/redefinirSenha.page.jsx';
import PedidosPage from './pages/pedidos/pedidos.page.jsx';
import './style.css'
import AdminProdutosPage from './pages/admin/admin.produtos.page.jsx';
import { RotaAdmin } from './components/RotaAdmin.jsx';
import ProdutosDetalhesPage from './pages/produtos/produtosDetalhes.page';

export default function App() {
  const [usuarioAdmin, setUsuarioAdmin] = useState(
    () => JSON.parse(localStorage.getItem('admin_payload')) || null
  );

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLoginAdmin={setUsuarioAdmin} />} />
      <Route path="/" element={<ProdutosPage />} />
      <Route path="/carrinho" element={<CarrinhoPage />} />
      <Route path="/pedidosProdutos" element={<PedidosPage />} />
      <Route path="/produtos/:id" element={<ProdutosDetalhesPage />} />

      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
      <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />

      <Route element={<RotaAdmin usuario={usuarioAdmin} />}>
        <Route path="/admin/produtos" element={<AdminProdutosPage />} />
      </Route>
    </Routes>
  );
}