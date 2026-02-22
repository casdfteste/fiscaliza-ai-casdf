# Sistema de Automação de Fiscalização - CAS/DF

Sistema de automação para processamento de relatórios de fiscalização do Conselho de Assistência Social do Distrito Federal (CAS/DF), rodando 100% no Google Workspace — sem custos adicionais.

## Visão Geral

O sistema automatiza o ciclo completo de fiscalização, do formulário ao relatório final:

```
Reunião Plenária
  → Secretaria preenche Formulário de Designação
    → Conselheiro recebe e-mail com link e prazo
      → Conselheiro preenche Formulário de Fiscalização (durante a visita)
        → Sistema gera PDF do relatório + comprovante com protocolo
          → E-mails enviados para CAS/DF e conselheiro
            → Planilha de controle atualizada automaticamente
```

### Benefícios

- ✅ **Custo ZERO** — tudo no Google Workspace já contratado
- ✅ **Execução instantânea** via trigger do Google Forms
- ✅ **Protocolo único** por relatório (`FISC-AAAA-NNNN`)
- ✅ **Controle de prazos** com alertas automáticos
- ✅ **Endereço automático** via consulta de CEP (BrasilAPI)
- ✅ **Sustentável institucionalmente**

---

## Estrutura do Projeto

```
fiscaliza-ai-casdf/
├── apps-script/                        # Código modular (Google Apps Script)
│   ├── Config.gs                       # IDs dos recursos, modo teste, constantes
│   ├── ConfigDesignacao.gs             # Constantes do módulo de designação e templates de e-mail
│   ├── Main.gs                         # Orquestrador principal (onFormSubmit)
│   ├── Mapeamento.gs                   # Mapeamento dos campos do formulário → objeto de dados
│   ├── Imagens.gs                      # Processamento e compressão de fotos
│   ├── Documento.gs                    # Criação do relatório via template Google Docs
│   ├── Recibo.gs                       # Geração do comprovante PDF com protocolo
│   ├── Email.gs                        # Envio de e-mails HTML com anexos
│   ├── Drive.gs                        # Gerenciamento de pastas e arquivos
│   ├── Utils.gs                        # Utilitários: datas, protocolo, CEP, template
│   ├── Designacao.gs                   # Módulo de designação (trigger + e-mail + planilha)
│   ├── ControlePrazos.gs               # Verificação diária de prazos e alertas
│   ├── SetupPlanilha.gs                # Criação automática da planilha de controle (5 abas)
│   ├── SetupFormularioDesignacao.gs    # Criação automática do formulário de designação
│   └── SetupFormularioFiscalizacaoV2.gs# Criação automática do formulário de fiscalização (11 etapas)
├── assets/
│   └── logo_casdf.jpeg                 # Logo oficial (usada no cabeçalho dos documentos)
├── schema/
│   └── fiscalizacao_schema.json        # Estrutura de dados do relatório
├── CODIGO_COMPLETO.js                  # Monólito legado (mantido para referência)
├── CODIGO_COMPLETO_v2.js               # Monólito v2 atualizado (alternativa à versão modular)
└── README.md
```

---

## Recursos Configurados

### IDs dos Recursos

| Recurso | Constante | ID |
|---|---|---|
| Formulário de Fiscalização | `FORM_ID` | `1YvIKUk4J6eyL5btvX6l9VrhlvyOJbhjoKd8CHF-eB6Q` |
| Planilha de Respostas | `SHEET_ID` | `1WSw7yXTT2jhW7IguLeuKqiytAZLzNLe_KP9al7NQkbk` |
| Planilha de Controle | `SHEET_CONTROLE_ID` | `1WSw7yXTT2jhW7IguLeuKqiytAZLzNLe_KP9al7NQkbk` |
| Template do Relatório | `TEMPLATE_ID` | `1gmdFgJt7KTfDfnh5gXBrv_mKbn8kjETaei_KcBGgYJ4` |

### E-mails

| Destino | Constante | E-mail |
|---|---|---|
| CAS/DF (produção) | `EMAIL_CASDF_PRODUCAO` | `cas_df@sedes.df.gov.br` |
| Administrador / teste | `EMAIL_ADMIN` | `adactoartur.gestor@gmail.com` |

> **Modo de teste:** `MODO_TESTE = true` em `Config.gs` redireciona todos os e-mails para `EMAIL_ADMIN`. Altere para `false` antes de colocar em produção.

---

## Instalação

### Passo 1: Criar a Planilha de Controle

1. Crie uma planilha em branco no Google Sheets
2. Copie o ID da URL e cole em `SHEET_CONTROLE_ID` em `ConfigDesignacao.gs`
3. No editor do Apps Script, execute `configurarPlanilhaControle()` para criar as 5 abas automaticamente

### Passo 2: Criar o Template do Relatório

**Opção A — usar o template existente:**
- Copie o ID do documento e atualize `TEMPLATE_ID` em `Config.gs`

**Opção B — gerar automaticamente:**
- Execute `criarTemplateFormatado()` em `Utils.gs`
- O log exibirá o novo ID — copie-o para `TEMPLATE_ID`

O template usa os seguintes placeholders:

| Placeholder | Conteúdo |
|---|---|
| `{{conselheiro}}` | Nome do(a) conselheiro(a) |
| `{{instituicao}}` | Nome da instituição |
| `{{assunto_tipo}}` | Tipo de processo |
| `{{modalidade}}` | Modalidade da inscrição |
| `{{oferta}}` | Nome do serviço/oferta |
| `{{endereco}}` | Endereço completo (montado via CEP) |
| `{{data_visita}}` | Data da visita |
| `{{horario}}` | Horário da visita |
| `{{quem_recebeu}}` | Nome e função de quem recebeu |
| `{{licenca}}` | Licença de funcionamento |
| `{{unidade_publica}}` | Se executada em unidade pública |
| `{{registro_cdi}}` | Registro no CDI/DF |
| `{{registro_cdca}}` | Registro no CDCA/DF |
| `{{formas_acesso}}` | Formas de acesso dos usuários |
| `{{num_voluntarios}}` | Número de voluntários |
| `{{num_contratados}}` | Número de contratados |
| `{{especialidades}}` | Especialidades da equipe |
| `{{tipo_espaco}}` | Tipo do espaço físico |
| `{{acessibilidade}}` | Itens de acessibilidade |
| `{{compartilha_espaco}}` | Compartilha espaço? |
| `{{espaco_satisfatorio}}` | Adequação do espaço |
| `{{dezembro_dezembro}}` | Funciona o ano todo? |
| `{{recesso}}` | Período de recesso |
| `{{gratuidade}}` | Serviço gratuito? |
| `{{bpc}}` | Retenção de BPC |
| `{{articulacao}}` | Articulações com a rede |
| `{{acoes_plano}}` | Ações conforme plano |
| `{{metodologia}}` | Metodologia adequada? |
| `{{observacoes}}` | Observações adicionais |
| `{{analise_tecnica}}` | Quanto às análises da SE |
| `{{fundamentos_discordancia}}` | Fundamentos da discordância |
| `{{voto}}` | Voto do(a) conselheiro(a) |
| `{{data_voto}}` | Data do voto |
| `{{assinatura_relator}}` | Nome do(a) conselheiro(a) relator(a) |

### Passo 3: Criar o Projeto no Apps Script

1. Acesse [script.google.com](https://script.google.com)
2. Crie um novo projeto: `Arquivo > Novo projeto`
3. Nomeie como **"Sistema Fiscalização CAS-DF"**
4. Para cada arquivo em `apps-script/`, clique em `+` > Script, renomeie e cole o conteúdo

> **Alternativa:** use o `CODIGO_COMPLETO_v2.js` colando todo o conteúdo em um único arquivo `.gs`.

### Passo 4: Criar os Formulários

**Formulário de Fiscalização:**
- Execute `criarFormularioFiscalizacaoV2()` em `SetupFormularioFiscalizacaoV2.gs`
- Após criar, adicione manualmente os **6 campos de foto** (upload de arquivo) nas posições indicadas nos logs:
  1. `📸 Foto da Fachada/Entrada` — obrigatório
  2. `📸 Foto da Licença/Laudo (se houver)` — opcional
  3. `📸 Fotos de Acessibilidade` — opcional
  4. `📸 Fotos dos Espaços` — obrigatório
  5. `📸 Fotos de Atividades` — opcional
  6. `📸 Fotos Adicionais` — opcional
- Vincule o formulário à planilha de respostas (`SHEET_ID`)
- Copie o ID do formulário e atualize `FORM_ID` em `Config.gs`

> ⚠️ Os campos de upload de foto **não podem ser criados por código** — devem ser adicionados manualmente no editor do Google Forms.

**Formulário de Designação:**
- Execute `criarFormularioDesignacao()` em `SetupFormularioDesignacao.gs`
- Copie o ID gerado e atualize `FORM_DESIGNACAO_ID` em `ConfigDesignacao.gs`

### Passo 5: Instalar os Triggers

```javascript
// Trigger do formulário de fiscalização (onFormSubmit)
instalarTrigger();

// Trigger do formulário de designação (onDesignacaoSubmit)
instalarTriggerDesignacao();

// Trigger diário de controle de prazos (8h)
instalarTriggerPrazos();
```

### Passo 6: Testar

1. Preencha um formulário de teste
2. Aguarde 15–30 segundos
3. Verifique:
   - E-mail recebido em `EMAIL_ADMIN` (modo teste)
   - Pasta "Relatórios CAS-DF 2026" no Drive
   - Logs em `Executions` no Apps Script
   - Planilha de controle atualizada

---

## Funções Administrativas

```javascript
// Instalar/reinstalar triggers
instalarTrigger();
instalarTriggerPrazos();

// Testar com última resposta da planilha
testeManual();

// Verificar prazos manualmente
verificarPrazos();

// Ver estatísticas dos processos
gerarEstatisticas();

// Listar relatórios gerados no Drive
listarRelatorios();

// Verificar espaço no Drive
verificarEspaco();

// Limpar arquivos antigos (ex: 365 dias)
limparArquivosAntigos(365);
```

---

## Troubleshooting

### Trigger não executa
1. Verifique se o trigger está instalado (menu `Triggers` no Apps Script)
2. Execute `instalarTrigger()` novamente
3. Confirme que o `FORM_ID` em `Config.gs` está correto

### Endereço aparece vazio no relatório
- Verifique se o formulário possui os campos `CEP da Entidade`, `Número` e `Complemento (sala, bloco, andar)`
- O sistema monta o endereço automaticamente via BrasilAPI

### Fotos não aparecem no relatório
- Confirme que os títulos dos campos de upload no Forms são exatamente os listados em `CAMPOS_FOTO` (em `Config.gs`), incluindo os emojis
- Verifique permissões de acesso ao Drive

### PDF muito grande (> 10 MB)
- Use fotos no modo câmera normal (sem HD/4K)
- O sistema tenta compressão automática para fotos acima de 2 MB

### Planilha de controle não atualiza
- Confirme que `SHEET_CONTROLE_ID` em `ConfigDesignacao.gs` está preenchido corretamente
- Verifique se a aba se chama exatamente `"Controle de Fiscalizações"` (constante `ABA_CONTROLE`)

### E-mails não chegam ao conselheiro
- Verifique se `MODO_TESTE` está `false` em `Config.gs` para produção
- Confirme a quota diária do Gmail (500 e-mails/dia)
- Veja os logs em `Executions`

---

## Versão

- **Versão:** 2.0
- **Data:** Fevereiro 2026
- **Autor:** Adacto Artur

### Histórico de Mudanças

**v2.0 (fev/2026)**
- Módulo de designação de conselheiros com e-mail automático
- Controle de prazos com alertas diários (60 dias, alerta em 7)
- Comprovante PDF com protocolo único `FISC-AAAA-NNNN`
- Endereço montado automaticamente via CEP (BrasilAPI)
- `{{assinatura_relator}}` adicionado ao mapa de substituições do template v9.0
- `MAX_FOTO_BYTES` definido (2 MB) — corrige compressão de fotos grandes
- `SHEET_CONTROLE_ID` configurado — integração entre módulos de fiscalização e controle
- Função duplicada `atualizarStatusRelatorioRecebido` removida de `ControlePrazos.gs`
- Planilha de controle com 5 abas: Dashboard, Controle, Conselheiros, Entidades, Configurações
- Formulário de fiscalização com 11 etapas em linguagem acessível

**v1.0 (jan/2026)**
- Versão inicial: formulário → PDF → e-mail

---

## Licença

MIT License — Conselho de Assistência Social do Distrito Federal
