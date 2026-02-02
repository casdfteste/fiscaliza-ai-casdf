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

  // Reconstruir cabeçalho (o template original tem layout quebrado com logos)
  const header = doc.getHeader();
  if (header) {
    header.clear();

    const h1 = header.appendParagraph('CONSELHO DE ASSISTÊNCIA SOCIAL DO DISTRITO FEDERAL');
    h1.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    h1.setBold(true);
    h1.setFontSize(12);
    h1.setForegroundColor('#1a237e');

    const h2 = header.appendParagraph('SEPN Quadra 515 Lote 02 Bloco B, 4º andar - Asa Norte/DF - CEP 70.770-502');
    h2.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    h2.setFontSize(9);
    h2.setForegroundColor('#333333');

    const h3 = header.appendParagraph('E-mail: cas_df@sedes.df.gov.br');
    h3.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    h3.setFontSize(9);
    h3.setForegroundColor('#333333');
  }

  Logger.log('Formatação aplicada');
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
