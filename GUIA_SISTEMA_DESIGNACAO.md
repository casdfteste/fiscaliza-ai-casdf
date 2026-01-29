# Sistema de Designação e Controle de Fiscalizações - CAS/DF

## Visão Geral

Este sistema complementa o formulário de fiscalização existente, adicionando:

1. **Formulário de Designação** - Para a Secretaria Executiva designar conselheiros
2. **Planilha de Controle** - Monitoramento completo de todos os processos
3. **Controle de Prazos** - Alertas automáticos de vencimento
4. **Integração Automática** - Atualização de status quando relatório é enviado

## Fluxo do Sistema

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. REUNIÃO PLENÁRIA                                                    │
│     Define distribuição de processos para conselheiros                  │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  2. SECRETARIA EXECUTIVA                                                │
│     Preenche o Formulário de Designação com:                            │
│     • Conselheiro designado                                             │
│     • Entidade a fiscalizar                                             │
│     • Nº do processo                                                    │
│     • Dados da reunião plenária                                         │
│     • Link dos documentos                                               │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  3. SISTEMA AUTOMÁTICO                                                  │
│     • Registra na Planilha de Controle (Status: Designado)              │
│     • Calcula prazo (data + 60 dias)                                    │
│     • Envia e-mail ao conselheiro com dados + link do formulário        │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  4. CONSELHEIRO                                                         │
│     • Recebe e-mail com a designação                                    │
│     • Agenda e realiza a visita de fiscalização                         │
│     • Preenche o Formulário de Fiscalização                             │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  5. SISTEMA AUTOMÁTICO                                                  │
│     • Gera relatório em PDF                                             │
│     • Envia para e-mail do CAS/DF                                       │
│     • Atualiza Planilha de Controle (Status: Relatório Recebido)        │
└─────────────────────────────────────────────────────────────────────────┘
```

## Estrutura da Planilha de Controle

### Aba: Controle de Fiscalizações

| Coluna | Campo | Descrição |
|--------|-------|-----------|
| A | ID | Identificador único (FISC-2025-0001) |
| B | Nº Processo | Número do processo administrativo |
| C | Entidade | Nome da entidade fiscalizada |
| D | Conselheiro | Nome do conselheiro designado |
| E | Reunião Plenária | Número da reunião |
| F | Data Reunião | Data da reunião plenária |
| G | Data Designação | Quando foi enviada a designação |
| H | Prazo | Data limite para o relatório |
| I | Dias Restantes | Cálculo automático |
| J | Situação Prazo | 🟢 No prazo / 🟡 Vence em breve / 🔴 Atrasado |
| K | Status | Designado → Aguardando → Recebido → Concluído |
| L | Data Relatório | Quando o relatório foi recebido |
| M | Link Documentos | Link do Drive com documentos do processo |
| N | Link Relatório | Link do relatório gerado |
| O | Observações | Notas adicionais |

### Aba: Conselheiros

| Coluna | Campo | Descrição |
|--------|-------|-----------|
| A | Nome Completo | Nome do conselheiro |
| B | E-mail | E-mail para envio das designações |
| C | Telefone | Telefone de contato |
| D | Status | Ativo / Inativo |

### Aba: Configurações

Parâmetros do sistema e instruções de uso.

## Instalação

### Passo 1: Criar os Recursos

1. Acesse o Google Apps Script do projeto de fiscalização
2. Adicione os novos arquivos:
   - `ConfigDesignacao.gs`
   - `Designacao.gs`
   - `ControlePrazos.gs`
   - `SetupPlanilha.gs`
   - `SetupFormularioDesignacao.gs`

3. Execute a função `setupCompleto()` no arquivo `SetupFormularioDesignacao.gs`
   - Isso criará automaticamente a Planilha de Controle e o Formulário de Designação

### Passo 2: Configurar IDs

1. Após executar o setup, copie os IDs gerados
2. Abra o arquivo `ConfigDesignacao.gs`
3. Preencha as constantes:
   ```javascript
   const FORM_DESIGNACAO_ID = "seu_id_do_formulario";
   const SHEET_CONTROLE_ID = "seu_id_da_planilha";
   ```

### Passo 3: Configurar a Planilha

1. Execute a função `configurarPlanilhaControle()`
2. Isso criará todas as abas com formatação e fórmulas

### Passo 4: Cadastrar Conselheiros

1. Abra a Planilha de Controle
2. Vá para a aba "Conselheiros"
3. Cadastre todos os conselheiros (nome, e-mail, telefone, status)

### Passo 5: Atualizar Formulário

1. Execute a função `atualizarConselheirosFormulario()`
2. Isso atualizará a lista de conselheiros no formulário de designação

### Passo 6: Instalar Triggers

1. Execute `instalarTriggerDesignacao()` - Para processar novas designações
2. Execute `instalarTriggerPrazos()` - Para verificar prazos diariamente às 8h

## Alertas Automáticos

### Para Conselheiros
- **7 dias antes do vencimento**: E-mail lembrando do prazo

### Para Secretaria Executiva
- **Diariamente às 8h**: Relatório de processos atrasados (se houver)

## Modelo de E-mail de Designação

```
Assunto: Designação de Fiscalização - [Entidade] - Processo [Nº]

Prezado(a) Conselheiro(a) [Nome],

Conforme distribuição na [Nº]ª Reunião Plenária ocorrida em [Data],
encaminho o processo de acompanhamento e fiscalização.

📋 DADOS DA DESIGNAÇÃO:
• Entidade: [Nome da Entidade]
• Nº do Processo: [Número]
• Prazo para relatório: [Data - 60 dias]

📎 Os documentos estão anexados no link abaixo:
[Link do Google Drive]

📝 Após realizar a fiscalização, preencha o relatório no link:
[Link do Formulário de Fiscalização]

Atenciosamente,
Secretaria Executiva
Conselho de Assistência Social do Distrito Federal - CAS/DF
```

## Transferência para o CAS/DF

Quando o sistema for aprovado:

1. **Fazer cópia da Planilha de Controle**
   - Abra a planilha → Arquivo → Fazer uma cópia
   - Salve na conta/Drive do CAS/DF

2. **Copiar o código do Apps Script**
   - Na planilha copiada, vá em Extensões → Apps Script
   - Cole todos os arquivos .gs

3. **Atualizar os IDs**
   - Atualize os IDs dos recursos na nova conta

4. **Criar novo Formulário de Designação**
   - Execute `criarFormularioDesignacao()` na nova conta
   - Ou copie o formulário existente

5. **Reinstalar Triggers**
   - Execute as funções de instalação de triggers

## Arquivos do Sistema

| Arquivo | Descrição |
|---------|-----------|
| `ConfigDesignacao.gs` | Configurações e templates de e-mail |
| `Designacao.gs` | Processamento do formulário de designação |
| `ControlePrazos.gs` | Verificação de prazos e alertas |
| `SetupPlanilha.gs` | Configuração da planilha de controle |
| `SetupFormularioDesignacao.gs` | Criação do formulário de designação |

## Suporte

Para dúvidas ou problemas, entre em contato com o administrador do sistema.
