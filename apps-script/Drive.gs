/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: Drive.gs
 * Descrição: Gerenciamento de arquivos no Google Drive
 * Versão: 1.0
 */

/**
 * Obtém ou cria a pasta de destino
 * @param {string} nomePasta - Nome da pasta
 * @returns {Folder} Pasta do Google Drive
 */
function obterOuCriarPasta(nomePasta) {
  const folders = DriveApp.getFoldersByName(nomePasta);

  if (folders.hasNext()) {
    const pasta = folders.next();
    Logger.log('Pasta existente encontrada: ' + pasta.getName());
    return pasta;
  } else {
    const novaPasta = DriveApp.createFolder(nomePasta);
    Logger.log('Nova pasta criada: ' + novaPasta.getName());
    return novaPasta;
  }
}

/**
 * Organiza arquivos na pasta correta
 * @param {File} docFile - Arquivo do documento
 * @param {File} pdfFile - Arquivo PDF
 */
function organizarArquivos(docFile, pdfFile) {
  // Arquivos já são criados na pasta correta
  // Esta função pode ser expandida para organização adicional

  Logger.log('Arquivos organizados:');
  Logger.log(' - DOC: ' + docFile.getName());
  Logger.log(' - PDF: ' + pdfFile.getName());
}

/**
 * Lista todos os relatórios na pasta
 * @returns {Array} Lista de arquivos
 */
function listarRelatorios() {
  const pasta = obterOuCriarPasta(FOLDER_NAME);
  const arquivos = pasta.getFiles();
  const lista = [];

  while (arquivos.hasNext()) {
    const arquivo = arquivos.next();
    lista.push({
      nome: arquivo.getName(),
      id: arquivo.getId(),
      url: arquivo.getUrl(),
      tamanho: arquivo.getSize(),
      dataCriacao: arquivo.getDateCreated()
    });
  }

  Logger.log('Total de arquivos na pasta: ' + lista.length);
  return lista;
}

/**
 * Limpa arquivos antigos (mais de X dias)
 * @param {number} diasRetencao - Número de dias para manter arquivos
 */
function limparArquivosAntigos(diasRetencao) {
  const pasta = obterOuCriarPasta(FOLDER_NAME);
  const arquivos = pasta.getFiles();
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - diasRetencao);

  let removidos = 0;

  while (arquivos.hasNext()) {
    const arquivo = arquivos.next();
    if (arquivo.getDateCreated() < dataLimite) {
      arquivo.setTrashed(true);
      removidos++;
      Logger.log('Arquivo movido para lixeira: ' + arquivo.getName());
    }
  }

  Logger.log('Total de arquivos removidos: ' + removidos);
}

/**
 * Verifica espaço disponível na conta
 * @returns {Object} Informações de armazenamento
 */
function verificarEspaco() {
  const total = DriveApp.getStorageLimit();
  const usado = DriveApp.getStorageUsed();
  const disponivel = total - usado;

  const info = {
    totalGB: (total / 1024 / 1024 / 1024).toFixed(2),
    usadoGB: (usado / 1024 / 1024 / 1024).toFixed(2),
    disponivelGB: (disponivel / 1024 / 1024 / 1024).toFixed(2),
    percentualUsado: ((usado / total) * 100).toFixed(1)
  };

  Logger.log('Espaço no Drive:');
  Logger.log(' - Total: ' + info.totalGB + ' GB');
  Logger.log(' - Usado: ' + info.usadoGB + ' GB (' + info.percentualUsado + '%)');
  Logger.log(' - Disponível: ' + info.disponivelGB + ' GB');

  return info;
}
