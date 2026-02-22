/**
 * SISTEMA DE DESIGNAÇÃO E CONTROLE - CAS/DF
 * Arquivo: ConfigDesignacao.gs
 * Descrição: Configurações do sistema de designação
 * Versão: 1.0
 */

// ========================================
// IDs DOS RECURSOS - DESIGNAÇÃO
// ========================================

// Formulário de Designação (Secretaria Executiva)
const FORM_DESIGNACAO_ID = ""; // Será preenchido após criar o formulário

// Planilha de Controle
const SHEET_CONTROLE_ID = "1WSw7yXTT2jhW7IguLeuKqiytAZLzNLe_KP9al7NQkbk";

// Link do Formulário de Fiscalização (para enviar ao conselheiro)
const LINK_FORMULARIO_FISCALIZACAO = "https://docs.google.com/forms/d/" + FORM_ID + "/viewform";

// ========================================
// CONFIGURAÇÕES DE PRAZO
// ========================================

const PRAZO_PADRAO_DIAS = 60; // Prazo padrão para entrega do relatório
const ALERTA_DIAS_ANTES = 7;  // Enviar alerta X dias antes do vencimento

// ========================================
// NOMES DAS ABAS DA PLANILHA
// ========================================

const ABA_CONTROLE = "Controle de Fiscalizações";
const ABA_CONSELHEIROS = "Conselheiros";
const ABA_CONFIGURACOES = "Configurações";

// ========================================
// STATUS DO PROCESSO
// ========================================

const STATUS = {
  DESIGNADO: "📋 Designado",
  AGUARDANDO: "⏳ Aguardando Relatório",
  RECEBIDO: "📥 Relatório Recebido",
  CONCLUIDO: "✅ Concluído",
  CANCELADO: "❌ Cancelado"
};

// ========================================
// SITUAÇÃO DO PRAZO
// ========================================

const SITUACAO_PRAZO = {
  NO_PRAZO: "🟢 No prazo",
  VENCE_BREVE: "🟡 Vence em breve",
  ATRASADO: "🔴 Atrasado",
  CONCLUIDO: "✅ Concluído"
};

// ========================================
// TEMPLATE DO E-MAIL DE DESIGNAÇÃO
// ========================================

const EMAIL_DESIGNACAO_ASSUNTO = "Designação de Fiscalização - {{ENTIDADE}} - Processo {{PROCESSO}}";

const EMAIL_DESIGNACAO_CORPO = `Prezado(a) Conselheiro(a) {{CONSELHEIRO}},

Conforme distribuição na {{REUNIAO_PLENARIA}}ª Reunião Plenária ocorrida em {{DATA_REUNIAO}}, encaminho o processo de acompanhamento e fiscalização.

📋 DADOS DA DESIGNAÇÃO:
• Entidade: {{ENTIDADE}}
• Nº do Processo: {{PROCESSO}}
• Prazo para relatório: {{PRAZO}}

📎 Os documentos estão anexados no link abaixo:
{{LINK_DOCUMENTOS}}

📝 Após realizar a fiscalização, preencha o relatório no link:
{{LINK_FORMULARIO}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 DICAS IMPORTANTES PARA A FISCALIZAÇÃO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. USE O CELULAR para preencher o formulário DURANTE a visita
2. O formulário vai te guiar passo a passo
3. Tire as fotos quando o formulário pedir

📸 SOBRE AS FOTOS:
• Use a câmera no modo NORMAL (não use HD, 4K ou modo profissional)
• Fotos simples são suficientes - não precisa alta qualidade
• Isso faz o envio ser mais rápido e evita problemas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Atenciosamente,
Secretaria Executiva
Conselho de Assistência Social do Distrito Federal - CAS/DF`;

// ========================================
// TEMPLATE DO E-MAIL DE ALERTA
// ========================================

const EMAIL_ALERTA_ASSUNTO = "⚠️ Alerta de Prazo - Fiscalização {{ENTIDADE}}";

const EMAIL_ALERTA_CORPO = `Prezado(a) Conselheiro(a) {{CONSELHEIRO}},

Este é um lembrete de que o prazo para entrega do relatório de fiscalização está próximo.

📋 DADOS DO PROCESSO:
• Entidade: {{ENTIDADE}}
• Nº do Processo: {{PROCESSO}}
• Prazo: {{PRAZO}}
• Dias restantes: {{DIAS_RESTANTES}}

📝 Preencha o relatório no link:
{{LINK_FORMULARIO}}

Atenciosamente,
Secretaria Executiva
CAS/DF`;

// ========================================
// TEMPLATE DO E-MAIL DE ATRASO (SECRETARIA)
// ========================================

const EMAIL_ATRASO_ASSUNTO = "📊 Relatório de Processos Atrasados - CAS/DF";

const EMAIL_ATRASO_CORPO = `Prezada Secretaria Executiva,

Segue a lista de processos de fiscalização com prazo vencido:

{{LISTA_ATRASADOS}}

Total de processos atrasados: {{TOTAL_ATRASADOS}}

---
Sistema de Controle de Fiscalizações - CAS/DF`;
