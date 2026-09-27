import React from 'react';

export function GaleriaProduto({ imagens, imagemAtiva, setImagemAtiva, nomeProduto }) {
  return (
    <div className="detalhes-galeria">
      <div className="foto-principal">
        <img src={imagens[imagemAtiva]} alt={nomeProduto} />
      </div>
      {imagens.length > 1 && (
        <div className="miniaturas">
          {imagens.map((img, idx) => (
            <button
              key={idx}
              className={imagemAtiva === idx ? 'ativa' : ''}
              onClick={() => setImagemAtiva(idx)}
            >
              <img src={img} alt={`Miniatura ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}