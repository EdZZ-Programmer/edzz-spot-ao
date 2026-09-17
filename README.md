# 🎮 EdZZ-Spot AO

> **Site oficial da EdZZ-Spot AO** — Gaming, tecnologia e assistência técnica em Luanda, Angola.

[![GitHub](https://img.shields.io/badge/GitHub-EdZZ--Programmer-blue?logo=github)](https://github.com/EdZZ-Programmer)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-Private-red)]()

---

## 📖 Sobre o projeto

A **EdZZ-Spot AO** é um projeto angolano criado em **Setembro de 2026**, dedicado a tornar a tecnologia, o gaming e a assistência técnica mais acessíveis para os clientes em Angola.

Este site é uma **loja online completa** com:
- Catálogo de computadores gaming, notebooks e equipamentos de escritório
- Venda de jogos e programas (software)
- Serviços de assistência técnica (reparação, otimização, manutenção, upgrade)
- Agendamento de serviços ao domicílio
- Sistema de contas de utilizador
- Painel de administração completo

---

## ✨ Funcionalidades

### 🛒 Loja
- **Catálogo** com filtros (Gaming, Notebooks, Office) e pesquisa
- **Carrinho de compras** com persistência
- **Checkout** com geração de comprovativo de pedido
- **Favoritos** por utilizador
- **Impressão de faturas** (via browser)

### 👤 Contas de Utilizador
- Registo com **email único**
- Login seguro com **bcrypt** (encriptação de password)
- Sessão com **JWT** (30 dias)
- **Recuperação de senha** via pergunta de segurança
- Perfil de utilizador

### 🛠️ Painel de Administração
- Dashboard com estatísticas (produtos, pedidos, vendas, clientes)
- **Gestão de produtos** (adicionar, editar, eliminar)
- **Gestão de serviços** com preços
- **Gestão de jogos e programas**
- **Carrossel de destaques** editável
- **Gestão de pedidos** com marcação "lido/não lido"
- **Histórico de faturas** de todos os clientes
- **Registo de logins** (quem entrou, quando e de onde)
- **Gestão de clientes** (redefinir senhas)
- Upload de imagens (hero + foto do proprietário)

### 🔔 Notificações (Admin)
- **Alertas em tempo real** quando um cliente faz um pedido
- Som de alerta + notificação toast
- Notificações do sistema (opcional)
- Badge com contador de pedidos novos no header

### 🎨 Interface
- Design **moderno e responsivo** (mobile, tablet, desktop)
- **Tema claro/escuro** com persistência
- Animações suaves e transições
- **Carrossel automático** de destaques
- **Avaliações** com estrelas (comentários partilhados)

---

## 🚀 Tecnologias utilizadas

### Frontend
- **HTML5** — estrutura semântica
- **CSS3** — design responsivo com variáveis CSS
- **JavaScript (Vanilla)** — sem frameworks (leve e rápido)
- **Google Fonts** — Inter + Orbitron

### Backend
- **Node.js** — runtime JavaScript
- **Express** — servidor HTTP
- **bcryptjs** — encriptação de passwords
- **jsonwebtoken (JWT)** — autenticação de sessões

### Armazenamento
- **Ficheiros JSON** (`server/data/`) — para simplicidade
- **LocalStorage** do browser — para carrinho e tema

---

## 📁 Estrutura do projeto
