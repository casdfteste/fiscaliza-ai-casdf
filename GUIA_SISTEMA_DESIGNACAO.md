# Sistema de Designação e Controle de Fiscalizações - CAS/DF

## Visão Geral

O módulo de designação complementa o formulário de fiscalização, adicionando:

1. **Formulário de Designação** — Secretaria Executiva designa conselheiros formalmente
2. **Planilha de Controle** — Monitoramento completo de todos os processos (5 abas)
3. **Controle de Prazos** — Alertas automáticos 7 dias antes do vencimento
4. **Comprovante com Protocolo** — PDF gerado com número `FISC-AAAA-NNNN`
5. **Integração Automática** — Status atualizado quando o relatório é enviado

---

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
│     • Link dos documentos no Drive                                      │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  3. SISTEMA AUTOMÁTICO                                                  │
│     • Registra na Planilha de Controle (Status: 📋 Designado)           │
│     • Calcula prazo (data designação + 60 dias)                         │
│     • Envia e-mail ao conselheiro com dados + link do formulário        │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  4. CONSELHEIRO                                                         │
│     • Recebe e-mail com a designação e dicas para a visita              │
│     • Agenda e realiza a visita de fiscalização                         │
│     • Preenche o Formulário de Fiscalização no celular (11 etapas)      │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  5. SISTEMA AUTOMÁTICO                                                  │
│     • Monta endereço automaticamente via CEP (BrasilAPI)                │
│     • Gera relatório PDF com fotos incorporadas                         │
│     • Gera comprovante PDF com protocolo FISC-AAAA-NNNN                 │
│     • Envia e-mails para CAS/DF e conselheiro                           │
│     • Atualiza Planilha de Controle (Status: 📥 Relatório Recebido)     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Estrutura da Planilha de Controle

### Aba: Controle de Fiscalizações

| Col | Campo | Descrição |
|---|---|---|
| A | ID | Identificador único (gerado automaticamente) |
| B | Nº Processo | Número do processo administrativo |
| C | Entidade | Nome da entidade fiscalizada |
| D | Conselheiro | Nome do conselheiro designado |
| E | Reunião Plenária | Número da reunião |
| F | Data Reunião | Data da reunião plenária |
| G | Data Designação | Quando foi enviada a designação |
| H | Prazo | Data limite para o relatório (G + 60 dias) |
| I | Dias Restantes | Cálculo automático (fórmula) |
| J | Situação Prazo | 🟢 No prazo / 🟡 Vence em breve / 🔴 Atrasado / ✅ Concluído |
| K | Status | 📋 Designado → ⏳ Aguardando → 📥 Recebido → ✅ Concluído |
| L | Data Relatório | Quando o relatório foi recebido (preenchido automaticamente) |
| M | Link Documentos | Link do Drive com documentos do processo |
| N | Link Relatório | Link do PDF gerado (preenchido automaticamente) |
| O | Observações | Notas adicionais |

### Aba: Conselheiros

| Col | Campo | Descrição |
|---|---|---|
| A | Nome Completo | Nome completo do conselheiro |
| B | CPF | CPF (apenas para controle interno) |
| C | E-mail | **E-mail para envio das designações e alertas** |
| D | Telefone | Telefone de contato |
| E | Segmento | `Governo` ou `Sociedade Civil` (lista suspensa) |
| F | Órgão/Entidade que Representa | Secretaria ou organização |
| G | Titular/Suplente | `Titular` ou `Suplente` (lista suspensa) |
| H | Início Mandato | Data de início do mandato |
| I | Fim Mandato | Data de fim do mandato |
| J | Status | `Ativo` ou `Inativo` (lista suspensa) |

> ⚠️ O campo **E-mail** (coluna C) é crítico — é ele que o sistema usa para enviar designações e alertas de prazo.

### Aba: Cadastro de Entidades

Registro das entidades inscritas no CAS/DF com 28 campos, incluindo dados de parceria SEDES e emendas parlamentares.

### Aba: Dashboard

Métricas automáticas (via fórmulas):
- Total de fiscalizações por status
- Contagem de votos por tipo
- Composição do conselho (Governo / Sociedade Civil, Titulares / Suplentes)
- Total de entidades cadastradas

### Aba: Configurações

Parâmetros do sistema e instruções de uso para a equipe.

---

## Instalação

### Passo 1: Criar os Arquivos no Apps Script

No projeto do Apps Script (mesmo projeto do formulário de fiscalização), adicione:

- `ConfigDesignacao.gs`
- `Designacao.gs`
- `ControlePrazos.gs`
- `SetupPlanilha.gs`
- `SetupFormularioDesignacao.gs`

### Passo 2: Configurar a Planilha de Controle

A planilha de controle já está configurada:

```javascript
const SHEET_CONTROLE_ID = "1WSw7yXTT2jhW7IguLeuKqiytAZLzNLe_KP9al7NQkbk";
```

Para recriar a estrutura (abas, fórmulas, formatação):
```javascript
configurarPlanilhaControle();
```

### Passo 3: Criar o Formulário de Designação

Execute no Apps Script:
```javascript
criarFormularioDesignacao();
```

O log exibirá o ID gerado. Copie-o e cole em `ConfigDesignacao.gs`:
```javascript
const FORM_DESIGNACAO_ID = "seu_id_aqui";
```

### Passo 4: Cadastrar Conselheiros

1. Abra a Planilha de Controle
2. Vá para a aba **Conselheiros**
3. Preencha os dados de cada conselheiro (especialmente nome e e-mail)
4. Para atualizar a lista no formulário de designação:
   ```javascript
   atualizarConselheirosFormulario();
   ```

### Passo 5: Instalar Triggers

```javascript
// Processa novas designações (onFormSubmit do formulário de designação)
instalarTriggerDesignacao();

// Verifica prazos diariamente às 8h
instalarTriggerPrazos();
```

---

## Alertas Automáticos

### Para Conselheiros
- **7 dias antes do vencimento** — e-mail automático com lembrete e link do formulário

### Para a Secretaria Executiva
- **Diariamente às 8h** — relatório de processos atrasados (se houver)

O parâmetro de alerta pode ser ajustado em `ConfigDesignacao.gs`:
```javascript
const PRAZO_PADRAO_DIAS = 60; // Prazo padrão após designação
const ALERTA_DIAS_ANTES = 7;  // Dias antes do vencimento para alertar
```

---

## Modelo de E-mail de Designação

```
Assunto: Designação de Fiscalização - [Entidade] - Processo [Nº]

Prezado(a) Conselheiro(a) [Nome],

Conforme distribuição na [Nº]ª Reunião Plenária ocorrida em [Data],
encaminho o processo de acompanhamento e fiscalização.

📋 DADOS DA DESIGNAÇÃO:
• Entidade: [Nome da Entidade]
• Nº do Processo: [Número]
• Prazo para relatório: [Data + 60 dias]

📎 Os documentos estão no link abaixo:
[Link do Google Drive]

📝 Após realizar a fiscalização, preencha o relatório no link:
[Link do Formulário de Fiscalização]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 DICAS PARA A FISCALIZAÇÃO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. USE O CELULAR para preencher durante a visita
2. O formulário vai te guiar passo a passo
3. Tire as fotos quando o formulário pedir

📸 SOBRE AS FOTOS:
• Use câmera no modo NORMAL (não HD/4K)
• Fotos simples são suficientes

Atenciosamente,
Secretaria Executiva
Conselho de Assistência Social do Distrito Federal - CAS/DF
```

---

## Comprovante de Recebimento

Ao receber o relatório, o sistema gera automaticamente um **comprovante PDF** com:

- Número de protocolo único no formato `FISC-AAAA-NNNN`
- Data e hora de recebimento
- Dados da instituição e conselheiro
- Voto registrado

O comprovante é enviado tanto para o CAS/DF quanto para o conselheiro como confirmação de entrega.

---

## Transferência para o CAS/DF

Quando o sistema for aprovado para uso institucional:

1. **Copiar a Planilha de Controle**
   - Arquivo → Fazer uma cópia → salvar na conta do CAS/DF

2. **Copiar o projeto Apps Script**
   - Abra a cópia da planilha → Extensões → Apps Script
   - Cole todos os arquivos `.gs`

3. **Atualizar os IDs em `Config.gs` e `ConfigDesignacao.gs`**
   - `FORM_ID`, `SHEET_ID`, `SHEET_CONTROLE_ID`, `TEMPLATE_ID`, `FORM_DESIGNACAO_ID`

4. **Recriar o Formulário de Designação na nova conta**
   ```javascript
   criarFormularioDesignacao();
   ```

5. **Reinstalar os três triggers**
   ```javascript
   instalarTrigger();
   instalarTriggerDesignacao();
   instalarTriggerPrazos();
   ```

6. **Definir `MODO_TESTE = false`** em `Config.gs` para produção

---

## Arquivos do Módulo

| Arquivo | Responsabilidade |
|---|---|
| `ConfigDesignacao.gs` | IDs, constantes de prazo, templates de e-mail |
| `Designacao.gs` | Trigger e processamento do formulário de designação |
| `ControlePrazos.gs` | Verificação diária de prazos e envio de alertas |
| `SetupPlanilha.gs` | Criação e formatação da planilha de controle (5 abas) |
| `SetupFormularioDesignacao.gs` | Criação automática do formulário de designação |

---

## Versão

- **Versão:** 2.0
- **Data:** Fevereiro 2026
- **Autor:** Adacto Artur
