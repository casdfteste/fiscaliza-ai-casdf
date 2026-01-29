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

/**
 * Cria template formatado automaticamente
 * Execute esta função uma vez para gerar o template
 */
function criarTemplateFormatado() {
  // Criar documento
  const doc = DocumentApp.create('Template Relatório Fiscalização CAS-DF');
  const body = doc.getBody();

  // Configurar margens
  body.setMarginTop(72);
  body.setMarginBottom(57);
  body.setMarginLeft(57);
  body.setMarginRight(57);

  // ===== CABEÇALHO =====
  const header = doc.addHeader();

  const cabecalho1 = header.appendParagraph('CONSELHO DE ASSISTÊNCIA SOCIAL DO DISTRITO FEDERAL');
  cabecalho1.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  cabecalho1.setBold(true);
  cabecalho1.setFontSize(12);
  cabecalho1.setForegroundColor('#1a237e');

  const cabecalho2 = header.appendParagraph('SEPN Quadra 515 Lote 02 Bloco B, 4º andar - Asa Norte/DF - CEP 70.770-502');
  cabecalho2.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  cabecalho2.setFontSize(9);

  const cabecalho3 = header.appendParagraph('E-mail: cas_df@sedes.df.gov.br');
  cabecalho3.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  cabecalho3.setFontSize(9);

  // ===== TÍTULO =====
  body.appendParagraph('');
  const titulo = body.appendParagraph('RELATORIA - PROCESSO DE INSCRIÇÃO');
  titulo.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  titulo.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  titulo.setBold(true);
  titulo.setForegroundColor('#1a237e');

  const obs = body.appendParagraph('OBS: se tiver mais de uma oferta ou mais de um endereço, deve preencher um formulário para cada');
  obs.setItalic(true);
  obs.setFontSize(9);
  obs.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

  body.appendHorizontalRule();
  body.appendParagraph('');

  // ===== IDENTIFICAÇÃO =====
  addCampo(body, 'CONSELHEIRO(A):', '{{conselheiro}}', true);
  addCampo(body, 'INSTITUIÇÃO:', '{{instituicao}}', true);
  addCampo(body, 'ASSUNTO:', '{{assunto_tipo}}', true);
  addCampo(body, 'MODALIDADE:', '{{modalidade}}', true);

  body.appendHorizontalRule();

  // ===== DADOS DA VISITA =====
  const secao1 = body.appendParagraph('DADOS DA VISITA');
  secao1.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  secao1.setBold(true);
  secao1.setForegroundColor('#283593');

  addCampoNumerado(body, '1', 'Oferta fiscalizada:', '{{oferta}}');
  addCampoNumerado(body, '2', 'Endereço:', '{{endereco}}');
  addCampoNumerado(body, '3', 'Data da visita:', '{{data_visita}}');
  addCampoNumerado(body, '4', 'Horário:', '{{horario}}');
  addCampoNumerado(body, '5', 'Quem recebeu o conselheiro:', '{{quem_recebeu}}');
  addCampoNumerado(body, '6', 'Licença/Laudo:', '{{licenca}}');
  addCampo(body, 'Unidade pública:', '{{unidade_publica}}', false);

  body.appendHorizontalRule();

  // ===== PÚBLICO-ALVO =====
  const secao2 = body.appendParagraph('PÚBLICO-ALVO');
  secao2.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  secao2.setBold(true);
  secao2.setForegroundColor('#283593');

  addCampoNumerado(body, '7', 'Registro CDI/DF (idosos):', '{{registro_cdi}}');
  addCampo(body, 'Registro CDCA/DF (crianças):', '{{registro_cdca}}', false);

  body.appendHorizontalRule();

  // ===== EQUIPE =====
  const secao3 = body.appendParagraph('EQUIPE E ACESSO');
  secao3.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  secao3.setBold(true);
  secao3.setForegroundColor('#283593');

  addCampoNumerado(body, '8', 'Formas de acesso:', '{{formas_acesso}}');
  addCampoNumerado(body, '9', 'Nº de voluntários:', '{{num_voluntarios}}');
  addCampo(body, 'Nº de contratados:', '{{num_contratados}}', false);
  addCampoNumerado(body, '10', 'Especialidades:', '{{especialidades}}');

  body.appendHorizontalRule();

  // ===== INFRAESTRUTURA =====
  const secao4 = body.appendParagraph('INFRAESTRUTURA');
  secao4.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  secao4.setBold(true);
  secao4.setForegroundColor('#283593');

  addCampoNumerado(body, '11', 'Tipo de espaço:', '{{tipo_espaco}}');
  addCampo(body, 'Acessibilidade:', '{{acessibilidade}}', false);
  addCampo(body, 'Compartilha espaço:', '{{compartilha_espaco}}', false);
  addCampo(body, 'Espaço satisfatório:', '{{espaco_satisfatorio}}', false);

  body.appendHorizontalRule();

  // ===== FUNCIONAMENTO =====
  const secao5 = body.appendParagraph('FUNCIONAMENTO');
  secao5.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  secao5.setBold(true);
  secao5.setForegroundColor('#283593');

  addCampoNumerado(body, '12', 'Dezembro a dezembro:', '{{dezembro_dezembro}}');
  addCampo(body, 'Recesso/férias:', '{{recesso}}', false);
  addCampoNumerado(body, '13', 'Gratuidade:', '{{gratuidade}}');
  addCampo(body, 'BPC:', '{{bpc}}', false);

  body.appendHorizontalRule();

  // ===== ARTICULAÇÃO =====
  const secao6 = body.appendParagraph('ARTICULAÇÃO E AVALIAÇÃO');
  secao6.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  secao6.setBold(true);
  secao6.setForegroundColor('#283593');

  addCampoNumerado(body, '14', 'Articulação com a rede:', '{{articulacao}}');
  addCampoNumerado(body, '15', 'Ações conforme plano:', '{{acoes_plano}}');
  addCampoNumerado(body, '16', 'Metodologia adequada:', '{{metodologia}}');
  addCampoNumerado(body, '17', 'Observações:', '{{observacoes}}');

  body.appendHorizontalRule();
  body.appendParagraph('');

  // ===== VOTO =====
  const secaoVoto = body.appendParagraph('DO VOTO');
  secaoVoto.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  secaoVoto.setBold(true);
  secaoVoto.setForegroundColor('#1a237e');
  secaoVoto.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

  body.appendParagraph('');
  addCampo(body, '1. Quanto às análises técnicas da Secretaria Executiva:', '', true);
  body.appendParagraph('{{analise_tecnica}}');
  body.appendParagraph('{{fundamentos_discordancia}}');
  body.appendParagraph('');

  addCampo(body, '2. O(A) Conselheiro(a) vota pelo(a):', '', true);
  const voto = body.appendParagraph('{{voto}}');
  voto.setBold(true);
  body.appendParagraph('');

  const deliberacao = body.appendParagraph('Seja o presente voto submetido à deliberação da plenária.');
  deliberacao.setItalic(true);
  body.appendParagraph('');

  body.appendParagraph('{{data_voto}}');
  body.appendParagraph('');
  body.appendParagraph('');

  const linha = body.appendParagraph('_____________________________________________________________');
  linha.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

  const assinatura = body.appendParagraph('Conselheiro(a) Relator(a): {{conselheiro}}');
  assinatura.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  assinatura.setBold(true);

  // Salvar
  doc.saveAndClose();

  // Retornar informações
  const docId = doc.getId();
  const docUrl = doc.getUrl();

  Logger.log('========================================');
  Logger.log('TEMPLATE CRIADO COM SUCESSO!');
  Logger.log('========================================');
  Logger.log('ID do documento: ' + docId);
  Logger.log('URL: ' + docUrl);
  Logger.log('');
  Logger.log('PRÓXIMO PASSO:');
  Logger.log('Atualize o TEMPLATE_ID no Config.gs para:');
  Logger.log(docId);
  Logger.log('========================================');

  return docId;
}

/**
 * Adiciona campo formatado ao documento
 */
function addCampo(body, label, placeholder, negrito) {
  const p = body.appendParagraph(label + ' ' + placeholder);
  if (negrito) {
    // Aplicar negrito apenas no label
    const texto = p.editAsText();
    texto.setBold(0, label.length - 1, true);
    texto.setBold(label.length, p.getText().length - 1, false);
  }
}

/**
 * Adiciona campo numerado ao documento
 */
function addCampoNumerado(body, numero, label, placeholder) {
  const p = body.appendParagraph(numero + '. ' + label + ' ' + placeholder);
  const texto = p.editAsText();
  const labelEnd = numero.length + 2 + label.length;
  texto.setBold(0, labelEnd - 1, true);
  texto.setBold(labelEnd, p.getText().length - 1, false);
}
