# MailOps Web

> Plataforma web para análise inteligente de emails com machine learning

## Sobre o Projeto

MailOps Web é uma aplicação moderna que permite aos usuários analisar emails utilizando inteligência artificial. A aplicação oferece upload de PDFs, extração de informações e análise automatizada de conteúdo.

## Tecnologias

- **React 19** - Biblioteca UI
- **React Router DOM v7** - Navegação SPA
- **Vite 7** - Build tool e dev server
- **ESLint** - Linting de código

## Instalação

```bash
# Clonar o repositório
git clone <repository-url>

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_PUBLIC_API_KEY=sua-api-key-aqui
VITE_API_BASE_URL=http://localhost:8000
```

## Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## Funcionalidades

- **Autenticação** - Login, registro e recuperação de senha
- **Análise de Emails** - Upload e processamento de PDFs
- **Sessão Segura** - Sistema de timeout automático
- **Landing Page** - Página responsiva

## Estrutura do Projeto

Para informações detalhadas sobre a arquitetura, organização de pastas e padrões de código, consulte:

**[Documentação de Arquitetura](./docs/ARCHITECTURE.md)**

## Segurança

- Autenticação via JWT
- Headers de segurança (X-API-Key)
- Proteção de rotas privadas
- Timeout automático de sessão
- Limpeza automática de tokens expirados

## Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ usando React + Vite**
