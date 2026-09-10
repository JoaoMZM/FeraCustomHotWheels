import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ProdutosPage from './pages/produtos/produtos.Page.jsx';
import CarrinhoPage from './pages/carrinho/carrinho.page.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProdutosPage />} />
      <Route path="/carrinho" element={<CarrinhoPage />} />
    </Routes>
  );
}