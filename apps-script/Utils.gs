/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: Utils.gs
 * Descrição: Funções utilitárias
 * Versão: 1.0
 */

/**
 * Formata data para exibição (DD/MM/AAAA)
 * @param {string|Date} data - Data a ser formatada
 * @returns {string} Data formatada
 */
function formatarData(data) {
  if (!data) return '(não informado)';

  try {
    // Se for string no formato YYYY-MM-DD
    if (typeof data === 'string') {
      if (data.includes('-')) {
        const partes = data.split('-');
        if (partes.length === 3) {
          return partes[2] + '/' + partes[1] + '/' + partes[0];
        }
      }
      // Se já está no formato DD/MM/YYYY
      if (data.includes('/')) {
        return data;
      }
    }

    // Se for objeto Date
    if (data instanceof Date) {
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      return dia + '/' + mes + '/' + ano;
    }

    return data.toString();
  } catch (error) {
    Logger.log('Erro ao formatar data: ' + error.message);
    return data.toString();
  }
}

/**
 * Formata data para nome de arquivo (AAAA-MM-DD)
 * @param {string|Date} data - Data a ser formatada
 * @returns {string} Data formatada para arquivo
 */
function formatarDataArquivo(data) {
  if (!data) {
    const hoje = new Date();
    return Utilities.formatDate(hoje, 'America/Sao_Paulo', 'yyyy-MM-dd');
  }

  try {
    // Se já está no formato YYYY-MM-DD
    if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return data;
    }

    // Se está no formato DD/MM/YYYY
    if (typeof data === 'string' && data.includes('/')) {
      const partes = data.split('/');
      if (partes.length === 3) {
        return partes[2] + '-' + partes[1] + '-' + partes[0];
      }
    }

    // Se for objeto Date
    if (data instanceof Date) {
      return Utilities.formatDate(data, 'America/Sao_Paulo', 'yyyy-MM-dd');
    }

    // Tenta converter para Date
    const dataObj = new Date(data);
    if (!isNaN(dataObj.getTime())) {
      return Utilities.formatDate(dataObj, 'America/Sao_Paulo', 'yyyy-MM-dd');
    }

    return 'sem-data';
  } catch (error) {
    Logger.log('Erro ao formatar data para arquivo: ' + error.message);
    return 'sem-data';
  }
}

/**
 * Valida email
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se válido
 */
function validarEmail(email) {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Limpa texto removendo caracteres especiais
 * @param {string} texto - Texto a ser limpo
 * @returns {string} Texto limpo
 */
function limparTexto(texto) {
  if (!texto) return '';

  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove acentos
    .replace(/[^\w\s.-]/g, '')         // Remove caracteres especiais
    .trim();
}

/**
 * Trunca texto em tamanho máximo
 * @param {string} texto - Texto a ser truncado
 * @param {number} tamanhoMax - Tamanho máximo
 * @returns {string} Texto truncado
 */
function truncarTexto(texto, tamanhoMax) {
  if (!texto) return '';
  if (texto.length <= tamanhoMax) return texto;
  return texto.substring(0, tamanhoMax - 3) + '...';
}

/**
 * Gera timestamp para log
 * @returns {string} Timestamp formatado
 */
function timestamp() {
  return Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd HH:mm:ss');
}

/**
 * Log com timestamp
 * @param {string} mensagem - Mensagem a ser logada
 */
function log(mensagem) {
  Logger.log('[' + timestamp() + '] ' + mensagem);
}

/**
 * Verifica se está em horário comercial
 * @returns {boolean} True se em horário comercial
 */
function emHorarioComercial() {
  const agora = new Date();
  const hora = agora.getHours();
  const diaSemana = agora.getDay();

  // Segunda a Sexta (1-5), das 8h às 18h
  return diaSemana >= 1 && diaSemana <= 5 && hora >= 8 && hora < 18;
}

/**
 * Obtém versão do sistema
 * @returns {Object} Informações da versão
 */
function obterVersao() {
  return {
    sistema: 'Sistema de Fiscalização CAS/DF',
    versao: '1.0.0',
    dataAtualizacao: '2026-01-28',
    autor: 'Adacto Artur'
  };
}

/**
 * Exibe informações do sistema no log
 */
function exibirInfoSistema() {
  const versao = obterVersao();

  Logger.log('========================================');
  Logger.log(versao.sistema);
  Logger.log('Versão: ' + versao.versao);
  Logger.log('Atualizado em: ' + versao.dataAtualizacao);
  Logger.log('========================================');
}
