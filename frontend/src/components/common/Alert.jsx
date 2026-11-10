import React from 'react';
import { IconeErro, IconeSucesso } from '../icons/Icones';

export default function Alert({ tipo, mensagem }) {
  if (!mensagem) return null;
  const isError = tipo === 'error';

  return (
    <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`} role={isError ? 'alert' : 'status'}>
      {isError ? <IconeErro /> : <IconeSucesso />}
      <span>{mensagem}</span>
    </div>
  );
}