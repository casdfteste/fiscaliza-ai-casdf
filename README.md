# Sistema de Automação de Fiscalização - CAS/DF

Sistema de automação para processamento de relatórios de fiscalização do Conselho de Assistência Social do Distrito Federal (CAS/DF).

## Visão Geral

O sistema automatiza o fluxo de trabalho desde o preenchimento do formulário até a entrega do relatório final em PDF:

```
Google Forms → Google Apps Script → Google Docs → PDF → Email
```

### Benefícios

- ✅ **Custo ZERO** (sem dependência de ferramentas pagas)
- ✅ **Execução instantânea** (vs. 15 min delay do Zapier)
- ✅ **Ilimitado e escalável**
- ✅ **Controle total do código**
- ✅ **Sustentável institucionalmente**

## Estrutura do Projeto

```
fiscaliza-ai-casdf/
├── apps-script/           # Código Google Apps Script
│   ├── Config.gs          # Constantes e configurações
│   ├── Main.gs            # Função principal e triggers
│   ├── Mapeamento.gs      # Mapeamento de campos do Forms
│   ├── Imagens.gs         # Processamento de fotos
│   ├── Documento.gs       # Criação de documentos
│   ├── Email.gs           # Envio de emails
│   ├── Drive.gs           # Gerenciamento de arquivos
│   └── Utils.gs           # Funções utilitárias
├── schema/                # Schemas de dados
└── README.md
```

## Instalação

### Passo 1: Preparar o Template

1. Faça upload do template DOCX para o Google Drive
2. Converta para Google Docs (Arquivo > Salvar como Google Docs)
3. Copie o ID do documento (da URL: `docs.google.com/document/d/ID_AQUI/edit`)

### Passo 2: Criar Projeto no Apps Script

1. Acesse [script.google.com](https://script.google.com)
2. Crie um novo projeto: `Arquivo > Novo projeto`
3. Nomeie como: **"Sistema Fiscalização CAS-DF"**

### Passo 3: Adicionar os Arquivos

Para cada arquivo na pasta `apps-script/`:

1. Clique em `+` ao lado de Arquivos
2. Selecione "Script"
3. Renomeie para o nome do arquivo (sem .gs)
4. Cole o conteúdo do arquivo

### Passo 4: Configurar IDs

No arquivo `Config.gs`, atualize:

```javascript
const TEMPLATE_ID = "SEU_ID_DO_TEMPLATE_AQUI";
```

### Passo 5: Instalar Trigger

1. No editor do Apps Script
2. Execute a função `instalarTrigger()`
3. Autorize as permissões solicitadas

### Passo 6: Testar

1. Preencha um formulário de teste
2. Aguarde 15-30 segundos
3. Verifique:
   - Email recebido em `cas_df@sedes.df.gov.br`
   - Pasta "Relatórios CAS-DF 2026" no Drive
   - Logs em Executions

## Configuração

### IDs dos Recursos

| Recurso | ID |
|---------|-----|
| Google Forms | `1qwMKiEYcp9nUGJQZGqBInmXZwbUc4djDC4N2HW37GLg` |
| Planilha | `1LuF54HNB_VbRlZMEq3-nmx4HfUXosG_ZcGUW1MxPffI` |
| Template | (configurar após upload) |

### Emails

| Destino | Email |
|---------|-------|
| CAS/DF | `cas_df@sedes.df.gov.br` |
| Admin | `adactoartur.gestor@gmail.com` |

## Uso

### Fluxo Normal

1. Conselheiro preenche o formulário de fiscalização
2. Sistema captura automaticamente a submissão
3. Processa dados e fotos
4. Gera documento PDF
5. Envia email para CAS/DF com cópia para o conselheiro
6. Salva arquivos na pasta organizada

### Funções Administrativas

```javascript
// Instalar/reinstalar trigger
instalarTrigger();

// Testar com última resposta
testeManual();

// Listar relatórios gerados
listarRelatorios();

// Verificar espaço no Drive
verificarEspaco();

// Limpar arquivos antigos (ex: 365 dias)
limparArquivosAntigos(365);
```

## Troubleshooting

### Trigger não executa

1. Verifique se o trigger está instalado (Triggers no menu lateral)
2. Execute `instalarTrigger()` novamente
3. Verifique permissões do script

### Erro ao processar fotos

1. Verifique se as fotos foram enviadas corretamente
2. Confira permissões de acesso ao Drive
3. Verifique logs em Executions

### PDF muito grande

1. Reduza número de fotos
2. Comprima imagens antes de enviar
3. Configure qualidade no template

### Email não chega

1. Verifique caixa de spam
2. Confirme quota diária do Gmail (500/dia)
3. Verifique logs de erro

## Desenvolvimento

### Executar testes locais

```javascript
// No editor do Apps Script
function testeManual() { ... }
```

### Ver logs

1. No Apps Script, vá em `Executions`
2. Clique na execução desejada
3. Expanda para ver Logger.log()

## Versão

- **Versão:** 1.0.0
- **Data:** Janeiro 2026
- **Autor:** Adacto Artur

## Licença

MIT License - Conselho de Assistência Social do DF
