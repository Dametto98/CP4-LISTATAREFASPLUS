# Checkpoint 4 - Projeto: Lista de Tarefas Plus

## Integrantes
- Caike Dametto (RM558614)
- Guilherme Janunzzi (RM558461)

---

### 📽️ Link para o video explicativo no Yotube

https://youtu.be/CuyI4iH0VKE


### ✨ Funcionalidades

- **Autenticação de Usuários**: Login completo com E-mail/Senha, utilizando Firebase Authentication. Inclui fluxos de redefinição de senha e exclusão de conta.

- **Gerenciamento de Tarefas (CRUD)**:
    - Criação de tarefas com título, descrição e data/hora de vencimento.
    - Listagem de tarefas filtradas por usuário logado.
    - Edição e exclusão de tarefas.

- **Notificações Push Locais**: Agendamento de notificações para alertar o usuário quando uma tarefa está para vencer, usando `expo-notifications`.

- **API Externa**: Tela extra que consome uma API pública para exibir versículos bíblicos aleatórios, com gerenciamento de estado de carregamento e erro via `TanStack Query`.

- **Suporte a Múltiplos Idiomas**: A tela de login possui botões para alternar entre Português e Inglês (`i18n`).

---

### 🛠️ Arquitetura e Tecnologias Utilizadas

Este projeto utiliza uma arquitetura moderna para desenvolvimento mobile, focada em componentes e separação de responsabilidades.

- **Framework**: **Expo (React Native)** - Para o desenvolvimento multiplataforma (Android, iOS, Web) a partir de uma única base de código.

- **Navegação**: **Expo Router** - Sistema de navegação baseado em arquivos, que define a estrutura de rotas e layouts (como o Drawer Navigator).

- **Backend & Banco de Dados**: **Firebase (BaaS)**
    - **Firestore**: Para armazenamento de dados NoSQL em tempo real (as tarefas).
    - **Firebase Authentication**: Para gerenciar o ciclo de vida dos usuários (cadastro, login, etc.).

- **Gerenciamento de Estado Assíncrono**: **TanStack Query (React Query)** - Utilizado na tela de versículos para gerenciar o *fetch* de dados da API, incluindo estados de *loading*, *error* e *cache*.

- **Armazenamento Local**: **AsyncStorage** - Para persistir informações no dispositivo do usuário, como a sessão de login.

---

### Passos para Instalação

Siga os passos abaixo para rodar o projeto em seu ambiente de desenvolvimento.

#### Pré-requisitos
- **Node.js** (versão LTS recomendada)
- **Git**
- Aplicativo **Expo Go** instalado no seu celular (Android ou iOS)

#### Passos para Instalação
1. **Clone o repositório:**
    ```bash
    git clone https://github.com/Dametto98/CP4-LISTATAREFASPLUS.git
    cd CP4-LISTATAREFASPLUS
    ```
2. **Instale as dependências:**
    ```bash
    npm install
    ```
3. **Execute o projeto:**
    ```bash
    npx expo start
    ```
4. **Abra no seu celular:**
    Escaneie o QR code que aparece no terminal com o aplicativo Expo Go.