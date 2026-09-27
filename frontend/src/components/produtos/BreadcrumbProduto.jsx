import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconesProdutos } from '../icons/IconesProdutos.jsx';

export function BreadcrumbProduto({ nomeProduto }) {
  const navigate = useNavigate();

  return (
    <div className="produtos-breadcrumb">
      <button type="button" onClick={() => navigate('/')}>Início</button>
      <IconesProdutos name="chevron" size={12} />
      <button type="button" onClick={() => navigate('/produtos')}>Catálogo</button>
      <IconesProdutos name="chevron" size={12} />
      <span>{nomeProduto}</span>
    </div>
  );
}