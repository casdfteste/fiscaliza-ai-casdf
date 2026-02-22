/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: SetupTemplate.gs
 * Descrição: Criação automática do template do relatório de fiscalização
 * Versão: 2.0
 *
 * COMO USAR:
 * 1. No Apps Script, selecione a função criarTemplateFormatado
 * 2. Clique em Executar (▶)
 * 3. Abra Execuções e copie o ID exibido no log
 * 4. Cole o ID em TEMPLATE_ID no arquivo Config.gs
 */

/**
 * Cria o template do relatório de fiscalização com todos os placeholders.
 * Execute uma vez para gerar o documento no Drive.
 * @returns {string} ID do documento criado
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
  addCampo(body, 'Ano do acompanhamento:', '{{ano_acompanhamento}}', false);

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
  addCampo(body, 'Instrumento jurídico da cessão:', '{{instrumento_cessao}}', false);

  body.appendHorizontalRule();

  // ===== PÚBLICO-ALVO =====
  const secao2 = body.appendParagraph('PÚBLICO-ALVO');
  secao2.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  secao2.setBold(true);
  secao2.setForegroundColor('#283593');

  addCampoNumerado(body, '7', 'Públicos atendidos:', '{{publicos_atendidos}}');
  addCampo(body, 'Registro CDI/DF (idosos):', '{{registro_cdi}}', false);
  addCampo(body, 'Registro CDCA/DF (crianças/adolescentes):', '{{registro_cdca}}', false);
  addCampo(body, 'Registros (famílias):', '{{registros_familias}}', false);

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
  addCampo(body, 'Serviços que compartilham:', '{{servicos_compartilhados}}', false);
  addCampo(body, 'Espaço satisfatório:', '{{espaco_satisfatorio}}', false);
  addCampo(body, 'Inadequações do espaço:', '{{inadequacoes_espaco}}', false);

  body.appendHorizontalRule();

  // ===== FUNCIONAMENTO =====
  const secao5 = body.appendParagraph('FUNCIONAMENTO');
  secao5.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  secao5.setBold(true);
  secao5.setForegroundColor('#283593');

  addCampoNumerado(body, '12', 'Dezembro a dezembro:', '{{dezembro_dezembro}}');
  addCampo(body, 'Recesso/férias:', '{{recesso}}', false);
  addCampo(body, 'Período de recesso:', '{{periodo_recesso}}', false);
  addCampoNumerado(body, '13', 'Gratuidade:', '{{gratuidade}}');
  addCampo(body, 'Justificativa (não gratuito):', '{{justificativa_nao_gratuito}}', false);
  addCampo(body, 'BPC:', '{{bpc}}', false);
  addCampo(body, 'Percentual de BPC retido:', '{{percentual_bpc}}', false);

  body.appendHorizontalRule();

  // ===== ARTICULAÇÃO E AVALIAÇÃO =====
  const secao6 = body.appendParagraph('ARTICULAÇÃO E AVALIAÇÃO');
  secao6.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  secao6.setBold(true);
  secao6.setForegroundColor('#283593');

  addCampoNumerado(body, '14', 'Articulação com a rede:', '');
  addCampo(body, '  • CRAS:', '{{articulacao_cras}}', false);
  addCampo(body, '  • CREAS:', '{{articulacao_creas}}', false);
  addCampo(body, '  • Unidade de Acolhimento:', '{{articulacao_acolhimento}}', false);
  addCampo(body, '  • Abordagem Social:', '{{articulacao_abordagem}}', false);
  addCampo(body, '  • Centro POP:', '{{articulacao_pop}}', false);
  addCampo(body, '  • Saúde:', '{{articulacao_saude}}', false);
  addCampo(body, '  • Educação:', '{{articulacao_educacao}}', false);
  addCampo(body, '  • Sistema de Justiça:', '{{articulacao_justica}}', false);
  addCampo(body, '  • Conselhos de Políticas Públicas:', '{{articulacao_conselhos}}', false);
  addCampo(body, '  • Outras articulações:', '{{articulacao}}', false);
  addCampoNumerado(body, '15', 'Ações conforme plano:', '{{acoes_plano}}');
  addCampo(body, 'Divergências em relação ao plano:', '{{divergencias_plano}}', false);
  addCampoNumerado(body, '16', 'Metodologia adequada:', '{{metodologia}}');
  addCampo(body, 'Inadequações metodológicas:', '{{inadequacoes_metodologia}}', false);
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
  addCampo(body, 'Justificativa do voto:', '{{justificativa_voto}}', false);
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
 * @param {Body} body - Corpo do documento
 * @param {string} label - Rótulo do campo
 * @param {string} placeholder - Placeholder de substituição
 * @param {boolean} negrito - Aplicar negrito no label
 */
function addCampo(body, label, placeholder, negrito) {
  const p = body.appendParagraph(label + ' ' + placeholder);
  if (negrito) {
    const texto = p.editAsText();
    texto.setBold(0, label.length - 1, true);
    texto.setBold(label.length, p.getText().length - 1, false);
  }
}

/**
 * Adiciona campo numerado ao documento
 * @param {Body} body - Corpo do documento
 * @param {string} numero - Número do item
 * @param {string} label - Rótulo do campo
 * @param {string} placeholder - Placeholder de substituição
 */
function addCampoNumerado(body, numero, label, placeholder) {
  const p = body.appendParagraph(numero + '. ' + label + ' ' + placeholder);
  const texto = p.editAsText();
  const labelEnd = numero.length + 2 + label.length;
  texto.setBold(0, labelEnd - 1, true);
  texto.setBold(labelEnd, p.getText().length - 1, false);
}
