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
  var totalOriginal = 0;
  var totalComprimido = 0;

  CAMPOS_FOTO.forEach(campo => {
    if (respostas[campo] && respostas[campo][0]) {
      const url = respostas[campo][0];
      const fileId = extrairFileId(url);

      if (fileId) {
        try {
          const file = DriveApp.getFileById(fileId);
          const tamanhoOriginal = file.getSize();
          totalOriginal += tamanhoOriginal;

          // Comprimir imagem (passa fileId para fallback via thumbnail)
          const blobComprimido = comprimirImagem(file, campo, fileId);
          const tamanhoFinal = blobComprimido.getBytes().length;
          totalComprimido += tamanhoFinal;

          var economia = Math.round((1 - tamanhoFinal / tamanhoOriginal) * 100);
          if (economia < 0) economia = 0;

          fotos.push({
            campo: campo,
            fileId: fileId,
            blob: blobComprimido,
            legenda: campo,
            nome: file.getName(),
            tamanho: tamanhoFinal
          });

          Logger.log('Foto processada: ' + campo +
            ' | Original: ' + formatarTamanho_(tamanhoOriginal) +
            ' -> Comprimido: ' + formatarTamanho_(tamanhoFinal) +
            ' (' + economia + '% reducao)');
        } catch (error) {
          Logger.log('Erro ao processar foto "' + campo + '": ' + error.message);
        }
      }
    }
  });

  Logger.log('Resumo compressao: ' +
    formatarTamanho_(totalOriginal) + ' -> ' + formatarTamanho_(totalComprimido) +
    ' (economia total: ' + formatarTamanho_(totalOriginal - totalComprimido) + ')');

  return fotos;
}

/**
 * Comprime uma imagem convertendo para JPEG e redimensionando se necessário
 * @param {File} file - Arquivo da imagem no Drive
 * @param {string} campo - Nome do campo (para log)
 * @param {string} fileId - ID do arquivo no Drive
 * @returns {Blob} Imagem comprimida
 */
function comprimirImagem(file, campo, fileId) {
  try {
    var blob = file.getBlob();
    var mimeType = blob.getContentType();
    var blobProcessado = blob;

    // Converter para JPEG se não for (PNG, HEIC, WEBP -> JPEG reduz muito)
    if (mimeType !== 'image/jpeg' && mimeType !== 'image/jpg') {
      try {
        blobProcessado = blob.getAs('image/jpeg');
        Logger.log('Convertido para JPEG: ' + campo + ' (' + mimeType + ' -> image/jpeg)');
      } catch (convErr) {
        Logger.log('Falha na conversao JPEG de ' + campo + ': ' + convErr.message);
      }
    }

    // Verificar tamanho - usar file.getSize() como referência
    var tamanho = file.getSize();
    if (tamanho > MAX_FOTO_BYTES) {
      Logger.log('Foto grande (' + formatarTamanho_(tamanho) + '), tentando thumbnail: ' + campo);

      // Tentar obter versão redimensionada via Drive thumbnail
      var thumbnail = obterThumbnailDrive_(fileId);
      if (thumbnail) {
        Logger.log('Thumbnail obtido para ' + campo + ': ' + formatarTamanho_(thumbnail.getBytes().length));
        return thumbnail;
      }

      // Fallback: forçar conversão JPEG (pode reduzir PNGs e HEICs)
      try {
        blobProcessado = file.getAs('image/jpeg');
      } catch (e2) {
        Logger.log('Fallback JPEG falhou: ' + e2.message);
      }
    }

    return blobProcessado;
  } catch (error) {
    Logger.log('Erro na compressao de "' + campo + '": ' + error.message + ' - usando original');
    return file.getBlob();
  }
}

/**
 * Obtém versão redimensionada da imagem via Google Drive thumbnail
 * @param {string} fileId - ID do arquivo no Drive
 * @returns {Blob|null} Blob redimensionado ou null
 */
function obterThumbnailDrive_(fileId) {
  // Tentar diferentes URLs de thumbnail do Google Drive
  var urls = [
    'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w800',
    'https://lh3.googleusercontent.com/d/' + fileId + '=w800'
  ];

  var token = ScriptApp.getOAuthToken();

  for (var i = 0; i < urls.length; i++) {
    try {
      var response = UrlFetchApp.fetch(urls[i], {
        headers: { 'Authorization': 'Bearer ' + token },
        muteHttpExceptions: true,
        followRedirects: true
      });

      if (response.getResponseCode() === 200) {
        var contentType = response.getHeaders()['Content-Type'] || '';
        if (contentType.indexOf('image') >= 0) {
          var thumbBlob = response.getBlob().setName('foto_' + fileId + '.jpeg');
          Logger.log('Thumbnail via URL ' + (i + 1) + ' OK: ' + formatarTamanho_(thumbBlob.getBytes().length));
          return thumbBlob;
        }
      }
    } catch (e) {
      Logger.log('Thumbnail URL ' + (i + 1) + ' falhou: ' + e.message);
    }
  }

  return null;
}

/**
 * Formata tamanho em bytes para exibição legível
 * @param {number} bytes - Tamanho em bytes
 * @returns {string} Tamanho formatado (ex: "1.5 MB", "800 KB")
 */
function formatarTamanho_(bytes) {
  if (bytes >= 1048576) {
    return (bytes / 1048576).toFixed(1) + ' MB';
  } else if (bytes >= 1024) {
    return (bytes / 1024).toFixed(0) + ' KB';
  }
  return bytes + ' B';
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

      Logger.log('Foto inserida no documento: ' + foto.legenda);
    } catch (error) {
      Logger.log('Erro ao inserir foto ' + foto.legenda + ': ' + error.message);
    }
  });

  Logger.log('Total de fotos inseridas: ' + fotos.length);
}
