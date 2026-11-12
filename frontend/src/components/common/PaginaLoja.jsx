import { ProdutosHeader } from '../produtos/ProdutosHeader.jsx';
import { Footer } from './Footer.jsx';

export function PaginaLoja({
  children,
  largura = 'padrao',
  titulo,
  subtitulo,
  acoes,
  classe = '',
  semMain = false,
  header = {},
}) {
  return (
    <div className={`pagina ${classe}`.trim()}>
      <ProdutosHeader {...header} />

      {semMain ? (
        children
      ) : (
        <main className={`pagina-conteudo pagina-conteudo--${largura}`}>
          {(titulo || acoes) && (
            <div className="pagina-cabecalho" style={acoes ? { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' } : undefined}>
              <div>
                {titulo && <h1 className="pagina-titulo">{titulo}</h1>}
                {subtitulo && <p className="pagina-subtitulo">{subtitulo}</p>}
              </div>
              {acoes}
            </div>
          )}
          {children}
        </main>
      )}

      <Footer />
    </div>
  );
}
