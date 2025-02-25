# Rent a Friend

Este projeto é uma aplicação web para criar e participar de atividades sociais, utilizando React, Vite, Tailwind CSS e Firebase.

## Funcionalidades

- Registro e login de usuários
- Criação de atividades
- Visualização de atividades em destaque
- Mapa interativo para localizar atividades
- Chat em tempo real para cada atividade

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces de usuário
- **Vite**: Ferramenta de build rápida para desenvolvimento web
- **Tailwind CSS**: Framework CSS utilitário para estilização
- **Firebase**: Plataforma para desenvolvimento de aplicativos móveis e web
- **Leaflet**: Biblioteca JavaScript para mapas interativos
- **Socket.io**: Biblioteca para comunicação em tempo real

## Estrutura do Projeto

```
rent_a_friend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Chat.jsx
│   │   ├── MapView.jsx
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── CreateActivity.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   └── Register.jsx
│   ├── services/
│   │   └── firebase.jsx
│   ├── styles/
│   │   ├── global.css
│   │   ├── index.css
│   │   └── main.css
│   ├── App.jsx
│   ├── main.jsx
│   └── vite.config.js
├── .env
├── .gitignore
├── package.json
├── postcss.config.cjs
├── tailwind.config.jsx
└── README.md
```

## Configuração do Ambiente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/rent_a_friend.git
   cd rent_a_friend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`:
   ```properties
   VITE_API_KEY=AIzaSyAvupoVf90NYV2h8GWng7W8ZAS6GMMync8
   VITE_PROJECT_ID=rent-a-friend-b4d44
   VITE_APP_ID=1:439840064142:web:c7fb57d18ae8b1e0e07fdf
   VITE_AUTH_DOMAIN=oender-6df25.firebaseapp.com
   VITE_STORAGE_BUCKET=oender-6df25.appspot.com
   VITE_MESSAGING_SENDER_ID=926010024849
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse a aplicação em `http://localhost:5173`.

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Cria a build de produção
- `npm run preview`: Visualiza a build de produção
- `npm run lint`: Executa o linter

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça o push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
