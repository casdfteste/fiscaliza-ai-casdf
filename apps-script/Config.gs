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

// Email Institucional CAS/DF
const EMAIL_CASDF = "cas_df@sedes.df.gov.br";

// Email do Administrador (para notificações de erro)
const EMAIL_ADMIN = "adactoartur.gestor@gmail.com";

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
// CAMPOS DE FOTO NO FORMULÁRIO
// ========================================

const CAMPOS_FOTO = [
  '📸 Foto da Licença/Laudo (se houver)',
  '📸 Foto da Fachada/Identificação',
  '📸 Fotos de Acessibilidade',
  '📸 Fotos dos Espaços',
  '📸 Fotos de Atividades',
  '📸 Fotos Adicionais'
];
