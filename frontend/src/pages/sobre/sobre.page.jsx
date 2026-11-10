import { useNavigate } from "react-router-dom";
import { ProdutosHeader } from "../../components/produtos/ProdutosHeader.jsx";
import { Footer } from "../../components/common/Footer.jsx";
import "../produtos/produtos.page.css"; // classes do header
import "./sobre.page.css";

export default function SobrePage() {
  const navigate = useNavigate();

  return (
    <div className="sobre-page">
      <ProdutosHeader />

      <main className="sobre-content">
        <section className="sobre-hero">
          <h1>Sobre a Fera Custom</h1>
          <p>
            Somos uma loja especializada em miniaturas Hot Wheels, com peças
            originais e customizadas para colecionadores e apaixonados por
            carros.
          </p>
        </section>

        <section className="sobre-cards">
          <article>
            <h2>Nossa história</h2>
            <p>
              Edite este texto com a história da Fera Custom: como a loja
              nasceu, quem está por trás dela e o que move o negócio.
            </p>
          </article>
          <article>
            <h2>O que fazemos</h2>
            <p>
              Venda de miniaturas, customização de peças e atendimento
              dedicado a quem coleciona.
            </p>
          </article>
          <article>
            <h2>Nossos valores</h2>
            <p>
              Paixão por carros, cuidado em cada detalhe e compromisso com
              quem compra de nós.
            </p>
          </article>
        </section>

        <div className="sobre-acoes">
          <button type="button" onClick={() => navigate("/")}>
            Ver catálogo
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
