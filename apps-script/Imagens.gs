/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: Imagens.gs
 * Descrição: Processamento de fotos
 * Versão: 1.0
 */

/**
 * Processa todas as fotos do formulário
 * @param {Object} respostas - Objeto namedValues do Forms
 * @returns {Array} Array de objetos com dados das fotos
 */
function processarFotos(respostas) {
  const fotos = [];

  CAMPOS_FOTO.forEach(campo => {
    if (respostas[campo] && respostas[campo][0]) {
      const url = respostas[campo][0];
      const fileId = extrairFileId(url);

      if (fileId) {
        try {
          const file = DriveApp.getFileById(fileId);
          const blob = file.getBlob();

          fotos.push({
            campo: campo,
            fileId: fileId,
            blob: blob,
            legenda: campo.replace('📸 ', ''),
            nome: file.getName(),
            tamanho: file.getSize()
          });

          Logger.log('✅ Foto processada: ' + campo);
        } catch (error) {
          Logger.log('⚠️ Erro ao processar foto "' + campo + '": ' + error.message);
        }
      }
    }
  });

  return fotos;
}

/**
 * Extrai o FILE_ID de uma URL do Google Drive
 * @param {string} url - URL do arquivo no Drive
 * @returns {string|null} FILE_ID ou null se não encontrado
 */
function extrairFileId(url) {
  if (!url) return null;

  // Padrões comuns de URLs do Google Drive
  const patterns = [
    /\/d\/([a-zA-Z0-9_-]+)/,           // /d/FILE_ID/
    /id=([a-zA-Z0-9_-]+)/,             // ?id=FILE_ID
    /open\?id=([a-zA-Z0-9_-]+)/,       // open?id=FILE_ID
    /file\/d\/([a-zA-Z0-9_-]+)/,       // file/d/FILE_ID
    /uc\?id=([a-zA-Z0-9_-]+)/          // uc?id=FILE_ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Tenta URL como ID direto (caso seja apenas o ID)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(url)) {
    return url;
  }

  return null;
}

/**
 * Insere foto no documento
 * @param {Body} body - Corpo do documento
 * @param {string} placeholder - Placeholder a ser substituído
 * @param {Blob} blob - Imagem como blob
 * @param {string} legenda - Legenda da foto
 * @returns {boolean} Sucesso da operação
 */
function inserirFoto(body, placeholder, blob, legenda) {
  try {
    const searchResult = body.findText(placeholder);

    if (searchResult) {
      const element = searchResult.getElement();
      const parent = element.getParent();
      const parentIndex = body.getChildIndex(parent);

      // Inserir imagem
      const image = body.insertImage(parentIndex + 1, blob);

      // Configurar tamanho mantendo proporção
      const originalWidth = image.getWidth();
      const originalHeight = image.getHeight();

      if (originalWidth > IMAGE_MAX_WIDTH) {
        const ratio = IMAGE_MAX_WIDTH / originalWidth;
        image.setWidth(IMAGE_MAX_WIDTH);
        image.setHeight(originalHeight * ratio);
      }

      // Limitar altura máxima
      if (image.getHeight() > IMAGE_MAX_HEIGHT) {
        const ratio = IMAGE_MAX_HEIGHT / image.getHeight();
        image.setHeight(IMAGE_MAX_HEIGHT);
        image.setWidth(image.getWidth() * ratio);
      }

      // Adicionar legenda
      const legendaParagrafo = body.insertParagraph(parentIndex + 2, legenda);
      legendaParagrafo.setItalic(true);
      legendaParagrafo.setForegroundColor(COLOR_CAPTION);
      legendaParagrafo.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

      // Remover placeholder
      parent.removeFromParent();

      return true;
    }

    return false;
  } catch (error) {
    Logger.log('Erro ao inserir foto: ' + error.message);
    return false;
  }
}

/**
 * Remove seção de foto quando não foi fornecida
 * @param {Body} body - Corpo do documento
 * @param {string} placeholder - Placeholder a ser removido
 */
function removerSecaoSemFoto(body, placeholder) {
  try {
    const searchResult = body.findText(placeholder);

    if (searchResult) {
      const element = searchResult.getElement();
      const parent = element.getParent();
      parent.removeFromParent();
    }
  } catch (error) {
    Logger.log('Erro ao remover seção: ' + error.message);
  }
}

/**
 * Processa e insere todas as fotos no documento
 * @param {Body} body - Corpo do documento
 * @param {Array} fotos - Array de objetos de foto
 */
function inserirTodasFotos(body, fotos) {
  if (fotos.length === 0) {
    Logger.log('Nenhuma foto para inserir');
    return;
  }

  // Adicionar seção de fotos no final do documento
  body.appendParagraph(''); // Linha em branco

  const titulo = body.appendParagraph('REGISTROS FOTOGRÁFICOS DA VISITA');
  titulo.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  titulo.setBold(true);
  titulo.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

  body.appendParagraph(''); // Linha em branco

  // Inserir cada foto
  fotos.forEach(foto => {
    try {
      // Adicionar legenda antes da foto
      const legenda = body.appendParagraph(foto.legenda + ':');
      legenda.setBold(true);

      // Inserir imagem
      const image = body.appendImage(foto.blob);

      // Configurar tamanho mantendo proporção
      const originalWidth = image.getWidth();
      const originalHeight = image.getHeight();

      if (originalWidth > IMAGE_MAX_WIDTH) {
        const ratio = IMAGE_MAX_WIDTH / originalWidth;
        image.setWidth(IMAGE_MAX_WIDTH);
        image.setHeight(originalHeight * ratio);
      }

      // Limitar altura máxima
      if (image.getHeight() > IMAGE_MAX_HEIGHT) {
        const ratio = IMAGE_MAX_HEIGHT / image.getHeight();
        image.setHeight(IMAGE_MAX_HEIGHT);
        image.setWidth(image.getWidth() * ratio);
      }

      // Linha em branco após a foto
      body.appendParagraph('');

      Logger.log('✅ Foto inserida no documento: ' + foto.legenda);
    } catch (error) {
      Logger.log('❌ Erro ao inserir foto ' + foto.legenda + ': ' + error.message);
    }
  });

  Logger.log('Total de fotos inseridas: ' + fotos.length);
}
