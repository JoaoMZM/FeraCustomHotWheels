import React from 'react';
import { IconeOlhoAberto, IconeOlhoFechado } from '../icons/Icones';

export default function CampoTexto({ id, label, tipo = 'text', name, value, onChange, hasError, placeholder, autoComplete, visivel, onToggleVisivel, icone }) {
  const temToggle = tipo === 'password' || visivel !== undefined;
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        {icone}
        <input
          id={id}
          type={temToggle ? (visivel ? 'text' : 'password') : tipo}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={['input-com-icone', temToggle && 'input-com-toggle', hasError && 'input-erro'].filter(Boolean).join(' ')}
        />
        {temToggle && (
          <button type="button" className="btn-toggle-senha" onClick={onToggleVisivel} aria-label={visivel ? 'Ocultar' : 'Mostrar'}>
            {visivel ? <IconeOlhoFechado /> : <IconeOlhoAberto />}
          </button>
        )}
      </div>
    </div>
  );
}