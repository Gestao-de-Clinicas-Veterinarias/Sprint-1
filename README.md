# Sistema de Gestão de Clínica Veterinária

Painel web da clínica veterinária **Amigo Fiel**, desenvolvido durante a Sprint 1.

## Funcionalidades atuais

- Visão geral da clínica com indicadores do dia.
- Lista de próximos atendimentos.
- Lista de pacientes recentes.
- Visão financeira com gráfico dos últimos meses.
- Ações rápidas para a rotina da clínica.
- Cadastro de novos atendimentos pela agenda.
- Cadastro de pacientes pelo atalho de ações rápidas.
- Persistência dos atendimentos no `localStorage` do navegador.
- Layout responsivo para desktop e dispositivos móveis.
- Página de login com sessão de demonstração.

## Como executar

O projeto não possui dependências externas obrigatórias. Para visualizar:

1. Clone o repositório.
2. Abra o arquivo `login.html` no navegador.
3. Entre com `admin@amigofiel.com` e a senha `123456`.
4. O painel será aberto após a autenticação.

Também é possível usar a extensão Live Server do VS Code para iniciar um servidor local.

O botão **Sair** encerra a sessão local. Sem uma sessão válida, o acesso direto ao painel redireciona para o login.

## Estrutura

```text
index.html   Estrutura da aplicação
styles.css   Estilos e responsividade
app.js       Dados, interações e cadastro de atendimentos
login.html   Tela de autenticação
login.css    Estilos da tela de autenticação
login.js     Validação da sessão de demonstração
```

## Git e Sprint

O desenvolvimento segue o fluxo de branches e pull requests.

- Branch atual: `enviado`
- Branch principal: `feat/dashboard-clinica`
- Commit inicial: `9bdb615`

Cada ticket deve ser desenvolvido em um branch separado, publicado no GitHub e revisado por outro integrante da equipe antes da integração.

### Ticket em desenvolvimento

- Ticket: cadastrar paciente pelo atalho de ações rápidas.
- Branch: `feat/cadastro-paciente`.
- Driver: integrante responsável por controlar o computador e escrever o código.
- Navigator: Scrum Master ou outro integrante responsável por revisar decisões, testes e próximos passos.
- Critério de aceite: abrir o formulário, validar os campos obrigatórios e exibir o paciente cadastrado na lista sem recarregar a página.

O Scrum Master deve alternar os pares ao longo da aula, acompanhando diferentes tickets e ajudando a remover impedimentos. Ao finalizar o ticket, o Driver publica o branch e abre um pull request para revisão do Navigator ou de outro membro do grupo.

## Equipe

Projeto acadêmico de gestão de clínica veterinária, desenvolvido com prática de Scrum, Pair Programming e revisão de código.
