/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: Documento.gs
 * Descrição: Criação e formatação de documentos
 * Versão: 2.0
 */

/**
 * Cria documento a partir do template
 * @param {Object} dados - Dados mapeados do formulário
 * @returns {File} Arquivo do documento criado
 */
function criarDocumento(dados) {
  // 1. Obter template
  const templateFile = DriveApp.getFileById(TEMPLATE_ID);

  // 2. Criar nome do arquivo
  const nomeArquivo = criarNomeArquivo(dados);

  // 3. Fazer cópia do template
  const pasta = obterOuCriarPasta(FOLDER_NAME);
  const novaCopia = templateFile.makeCopy(nomeArquivo, pasta);

  Logger.log('Documento criado: ' + novaCopia.getName());

  // 4. Abrir documento para edição
  const doc = DocumentApp.openById(novaCopia.getId());
  const body = doc.getBody();

  // 5. Substituir placeholders de texto
  substituirTextos(body, dados);

  // 6. Inserir fotos
  if (dados.fotos && dados.fotos.length > 0) {
    inserirTodasFotos(body, dados.fotos);
  }

  // 7. Aplicar formatação final
  aplicarFormatacao(doc);

  // 8. Salvar e fechar
  doc.saveAndClose();

  return novaCopia;
}

/**
 * Substitui todos os placeholders de texto no documento
 * @param {Body} body - Corpo do documento
 * @param {Object} dados - Dados mapeados
 */
function substituirTextos(body, dados) {
  const substituicoes = gerarSubstituicoes(dados);

  for (const [placeholder, valor] of Object.entries(substituicoes)) {
    try {
      body.replaceText(escapeRegex(placeholder), valor);
    } catch (error) {
      Logger.log('Erro ao substituir ' + placeholder + ': ' + error.message);
    }
  }

  Logger.log('Substituições de texto concluídas');
}

/**
 * Aplica formatação final ao documento
 * @param {Document} doc - Documento Google Docs
 */
function aplicarFormatacao(doc) {
  const body = doc.getBody();

  // Configurar margens (em pontos: 72 pontos = 1 polegada ≈ 2.54cm)
  body.setMarginTop(72);      // ~2.5cm
  body.setMarginBottom(57);   // ~2cm
  body.setMarginLeft(57);     // ~2cm
  body.setMarginRight(57);    // ~2cm

  // Reconstruir cabeçalho no padrão do papel timbrado oficial CAS/DF
  var header = doc.getHeader();
  if (!header) {
    header = doc.addHeader();
  }

  // Contar elementos antigos ANTES de adicionar novos
  var numAntigos = header.getNumChildren();

  // 1. PRIMEIRO: Adicionar novo conteúdo (logo + texto institucional)
  //    Isso garante que o header nunca fique vazio

  // Inserir logo CAS/DF
  try {
    var logoBlob = obterLogoBlob();
    if (logoBlob) {
      var imgPar = header.appendParagraph('');
      imgPar.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      var img = imgPar.appendInlineImage(logoBlob);
      var larguraOriginal = img.getWidth();
      var alturaOriginal = img.getHeight();
      var novaLargura = 150;
      var novaAltura = Math.round(alturaOriginal * (novaLargura / larguraOriginal));
      img.setWidth(novaLargura);
      img.setHeight(novaAltura);
    }
  } catch (e) {
    Logger.log('Aviso: não foi possível inserir logo: ' + e.message);
  }

  var h1 = header.appendParagraph('Governo do Distrito Federal');
  h1.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  h1.setFontSize(10);
  h1.setForegroundColor('#333333');

  var h2 = header.appendParagraph('Secretaria de Estado de Desenvolvimento Social do Distrito Federal');
  h2.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  h2.setFontSize(10);
  h2.setForegroundColor('#333333');

  var h3 = header.appendParagraph('Gabinete');
  h3.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  h3.setFontSize(10);
  h3.setForegroundColor('#333333');

  var h4 = header.appendParagraph('Conselho de Assistência Social do Distrito Federal');
  h4.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  h4.setBold(true);
  h4.setFontSize(10);
  h4.setForegroundColor('#1a237e');

  // 2. DEPOIS: Remover conteúdo antigo do template (tabelas, imagens, parágrafos)
  //    Os elementos antigos estão nos índices 0 até numAntigos-1
  for (var i = numAntigos - 1; i >= 0; i--) {
    try {
      header.removeChild(header.getChild(i));
    } catch (e) {
      Logger.log('Aviso ao remover elemento ' + i + ' do header: ' + e.message);
    }
  }

  // Reconstruir rodapé no padrão do papel timbrado oficial
  try {
    const footer = doc.getFooter() || doc.addFooter();
    footer.clear();

    const sep = footer.appendParagraph('___________________________________________________________________________');
    sep.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    sep.setFontSize(8);
    sep.setForegroundColor('#999999');

    const f1 = footer.appendParagraph('"Brasília - Patrimônio Cultural da Humanidade"');
    f1.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    f1.setFontSize(8);

    const f2 = footer.appendParagraph('SEPN Quadra 515 Lote 02 Bloco B - Bairro Asa Norte - CEP 70.770-502 – DF');
    f2.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    f2.setFontSize(8);

    const f3 = footer.appendParagraph('Cas_df@sedes.df.gov.br');
    f3.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    f3.setFontSize(8);

    const f4 = footer.appendParagraph('3773-7213  3773-7214');
    f4.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    f4.setFontSize(8);
  } catch (e) {
    Logger.log('Aviso: não foi possível criar rodapé: ' + e.message);
  }

  Logger.log('Formatação aplicada');
}

/**
 * Obtém blob do logo CAS/DF do Google Drive (faz cache no Drive na primeira vez)
 * @returns {Blob} Blob da imagem do logo
 */
function obterLogoBlob() {
  const props = PropertiesService.getScriptProperties();
  const logoFileId = props.getProperty('LOGO_FILE_ID');

  // Tentar usar logo já salvo no Drive
  if (logoFileId) {
    try {
      return DriveApp.getFileById(logoFileId).getBlob();
    } catch (e) {
      Logger.log('Logo cache inválido, re-baixando...');
    }
  }

  // Baixar logo do GitHub
  const url = 'https://raw.githubusercontent.com/casdfteste/fiscaliza-ai-casdf/main/assets/logo_casdf.jpeg';
  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

  if (response.getResponseCode() !== 200) {
    Logger.log('Não foi possível baixar logo: HTTP ' + response.getResponseCode());
    return null;
  }

  const blob = response.getBlob().setName('logo_casdf.jpeg');

  // Salvar no Drive para cache
  const pasta = obterOuCriarPasta(FOLDER_NAME);
  const file = pasta.createFile(blob);
  props.setProperty('LOGO_FILE_ID', file.getId());

  Logger.log('Logo CAS/DF salvo no Drive: ' + file.getId());
  return file.getBlob();
}

/**
 * Exporta documento para PDF
 * @param {File} docFile - Arquivo do documento
 * @returns {File} Arquivo PDF gerado
 */
function exportarPDF(docFile) {
  // 1. Obter blob do PDF
  const blob = docFile.getAs('application/pdf');

  // 2. Configurar nome
  const nomePDF = docFile.getName().replace(/\.(docx?|gdoc)$/i, '') + '.pdf';
  blob.setName(nomePDF);

  // 3. Salvar na mesma pasta
  const pasta = obterOuCriarPasta(FOLDER_NAME);
  const pdfFile = pasta.createFile(blob);

  // 4. Verificar tamanho
  const tamanho = pdfFile.getSize();
  if (tamanho > PDF_MAX_SIZE) {
    Logger.log('⚠️ AVISO: PDF maior que 10MB (' + (tamanho / 1024 / 1024).toFixed(2) + ' MB)');
  }

  return pdfFile;
}

/**
 * Cria nome de arquivo padronizado
 * @param {Object} dados - Dados do formulário
 * @returns {string} Nome do arquivo
 */
function criarNomeArquivo(dados) {
  // Limpar nome da instituição
  const instituicao = (dados.instituicao || 'SemNome')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove acentos
    .replace(/[^a-zA-Z0-9\s]/g, '')   // Remove caracteres especiais
    .replace(/\s+/g, '_')              // Substitui espaços por underscore
    .substring(0, 50);                 // Limita tamanho

  // Formatar data
  const data = formatarDataArquivo(dados.dataVisita);

  // Adicionar timestamp HHmmss para unicidade
  const agora = new Date();
  const hora = Utilities.formatDate(agora, 'America/Sao_Paulo', 'HHmmss');

  return 'Relatorio_Fiscalizacao_' + instituicao + '_' + data + '_' + hora;
}

/**
 * Escape de caracteres especiais para regex
 * @param {string} string - String a ser escapada
 * @returns {string} String escapada
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
