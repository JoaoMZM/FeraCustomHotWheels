import { ProdutosHeader } from '../produtos/ProdutosHeader.jsx';
import { Footer } from './Footer.jsx';

/**
 * Estrutura padrão de TODAS as páginas da loja:
 *   Cabeçalho (com busca) → conteúdo → Rodapé.
 *
 * @param {'padrao'|'medio'|'estreito'} largura  largura máxima do conteúdo
 * @param {string}   titulo     título (h1) opcional, com a barra vermelha padrão
 * @param {string}   subtitulo  texto abaixo do título
 * @param {ReactNode} acoes     botões à direita do título
 * @param {string}   classe     classe extra no wrapper (para o CSS da página)
 * @param {boolean}  semMain    não cria o <main> (a página monta o próprio conteúdo)
 * @param {object}   header     props repassadas ao ProdutosHeader (ex.: busca controlada)
 */
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
