import React from 'react';

function App() {
  return (
    <div className="container">
      <nav className="navbar">
        <div className="logo">
          <a href="/">Rent a Friend</a>
        </div>
        <div className="menu">
          <a href="/">Home</a>
          <a href="/about">Sobre</a>
          <a href="/friends">Amigos</a>
          <a href="/contact">Contato</a>
        </div>
        <button className="menu-toggle">
          <span>Menu</span>
        </button>
      </nav>

      <main>
        <section className="dashboard-header">
          <h1>Bem-vindo ao Rent a Friend</h1>
          <p>Encontre amigos para compartilhar momentos especiais</p>
        </section>

        <section className="featured-activities">
          <div className="featured-activity">
            <img src="https://source.unsplash.com/random/400x300?friends" alt="Atividade em grupo" />
            <h3>Passeio no Parque</h3>
            <p>Junte-se a um grupo para um dia divertido ao ar livre</p>
            <span className="date">Sábado, 10:00</span>
            <a href="/activity/1" className="details-btn">Saiba mais</a>
          </div>

          <div className="featured-activity">
            <img src="https://source.unsplash.com/random/400x300?coffee" alt="Café com amigos" />
            <h3>Café e Conversa</h3>
            <p>Encontre alguém para tomar um café e conversar</p>
            <span className="date">Hoje, 15:00</span>
            <a href="/activity/2" className="details-btn">Saiba mais</a>
          </div>

          <div className="featured-activity">
            <img src="https://source.unsplash.com/random/400x300?movie" alt="Sessão de cinema" />
            <h3>Cinema em Grupo</h3>
            <p>Assista aos últimos lançamentos com nova companhia</p>
            <span className="date">Sexta, 19:00</span>
            <a href="/activity/3" className="details-btn">Saiba mais</a>
          </div>
        </section>

        <section className="register-section">
          <h2>Cadastre-se Agora</h2>
          <form>
            <input type="text" placeholder="Seu nome" />
            <input type="email" placeholder="Seu email" />
            <button type="submit">Começar</button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
