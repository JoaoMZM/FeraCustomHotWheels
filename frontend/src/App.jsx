import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ProdutosPage from './pages/produtos/produtos.Page.jsx';
import CarrinhoPage from './pages/carrinho/carrinho.page.jsx';
import Footer from './components/footer/Footer.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-conteudo">
        <Routes>
          <Route path="/" element={<ProdutosPage />} />
          <Route path="/carrinho" element={<CarrinhoPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}