import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminProdutosPage from './pages/admin/admin.produtos.page.jsx';
import { RotaAdmin } from './components/RotaAdmin.jsx';

export default function App() {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || null;

  return (
    <Routes>
      {/* Rotas Protegidas do Administrador */}
      <Route element={<RotaAdmin usuario={usuario} />}>
        <Route path="/admin/produtos" element={<AdminProdutosPage />} />
      </Route>
    </Routes>
  );
}