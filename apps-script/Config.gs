/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: Config.gs
 * Descrição: Constantes e configurações globais
 * Versão: 1.0
 */

// ========================================
// IDs DOS RECURSOS GOOGLE
// ========================================

// Google Forms - Formulário de Fiscalização v9.0
const FORM_ID = "1qwMKiEYcp9nUGJQZGqBInmXZwbUc4djDC4N2HW37GLg";

// Planilha de Respostas
const SHEET_ID = "1LuF54HNB_VbRlZMEq3-nmx4HfUXosG_ZcGUW1MxPffI";

// Template do Documento
const TEMPLATE_ID = "1gmdFgJt7KTfDfnh5gXBrv_mKbn8kjETaei_KcBGgYJ4";

// ========================================
// MODO DE TESTE
// ========================================
// ATENÇÃO: Em modo teste, TODOS os emails vão para EMAIL_ADMIN
// Para produção: trocar MODO_TESTE para false
const MODO_TESTE = true;

// Email Institucional CAS/DF (SÓ USADO QUANDO MODO_TESTE = false)
const EMAIL_CASDF_PRODUCAO = "cas_df@sedes.df.gov.br";

// Email do Administrador (para testes e notificações de erro)
const EMAIL_ADMIN = "adactoartur.gestor@gmail.com";

// Email efetivo: em teste vai tudo para o admin
const EMAIL_CASDF = MODO_TESTE ? EMAIL_ADMIN : EMAIL_CASDF_PRODUCAO;

// Pasta de Destino no Drive
const FOLDER_NAME = "Relatórios CAS-DF 2026";

// ========================================
// CONFIGURAÇÕES DE IMAGEM
// ========================================

const IMAGE_MAX_WIDTH = 450;   // pixels (~15cm)
const IMAGE_MAX_HEIGHT = 300;  // pixels (~10cm)

// ========================================
// CONFIGURAÇÕES DE PDF
// ========================================

const PDF_MAX_SIZE = 10485760; // 10MB em bytes

// ========================================
// CORES INSTITUCIONAIS
// ========================================

const COLOR_TITLE = "#1a237e";      // Azul escuro
const COLOR_SUBTITLE = "#283593";   // Azul médio
const COLOR_TEXT = "#000000";       // Preto
const COLOR_CAPTION = "#666666";    // Cinza

// ========================================
// CONFIGURAÇÕES DE RECIBO
// ========================================

const RECIBO_PREFIXO = 'FISC';
const RECIBO_PROPERTY_KEY = 'recibo_contador';

// ========================================
// CAMPOS DE FOTO NO FORMULÁRIO
// ========================================

const CAMPOS_FOTO = [
  '📸 Foto da Fachada/Entrada',
  '📸 Foto da Licença/Laudo (se houver)',
  '📸 Fotos de Acessibilidade',
  '📸 Fotos dos Espaços',
  '📸 Fotos de Atividades',
  '📸 Fotos Adicionais'
];
