/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: Main.gs
 * Descrição: Função principal e trigger
 * Versão: 2.0
 */

/**
 * Função principal executada quando um formulário é submetido
 * @param {Object} e - Evento do Google Forms
 */
function onFormSubmit(e) {
  const startTime = new Date();

  try {
    Logger.log('=== INÍCIO DO PROCESSAMENTO ===');
    Logger.log('Timestamp: ' + startTime.toISOString());

    // 1. Capturar dados do formulário
    const respostas = e.namedValues;
    Logger.log('Respostas capturadas: ' + Object.keys(respostas).length + ' campos');

    // 2. Processar e mapear campos
    const dados = mapearCampos(respostas);
    Logger.log('Instituição: ' + dados.instituicao);
    Logger.log('Conselheiro: ' + dados.conselheiro);

    // 3. Processar fotos
    const fotos = processarFotos(respostas);
    dados.fotos = fotos;
    Logger.log('Fotos processadas: ' + fotos.length);

    // 4. Criar documento
    const docFile = criarDocumento(dados);
    Logger.log('Documento criado: ' + docFile.getName());

    // 5. Exportar PDF
    const pdfFile = exportarPDF(docFile);
    const tamanhoMB = (pdfFile.getSize() / 1024 / 1024).toFixed(2);
    Logger.log('PDF gerado: ' + pdfFile.getName() + ' (' + tamanhoMB + ' MB)');

    // 6. Gerar recibo com protocolo único
    const recibo = gerarRecibo(dados, pdfFile);
    Logger.log('Recibo gerado - Protocolo: ' + recibo.protocolo);

    // 7. Gerar comprovante PDF no padrão oficial CAS/DF
    const comprovantePdf = criarReciboPDF(dados, recibo);
    Logger.log('Comprovante PDF gerado: ' + comprovantePdf.getName());

    // 8. Atualizar planilha de controle ANTES do envio de email
    try {
      if (SHEET_CONTROLE_ID) {
        const linkRelatorio = pdfFile.getUrl();
        atualizarStatusRelatorioRecebido(dados.instituicao, dados.conselheiro, linkRelatorio);
        Logger.log('Planilha de controle atualizada');
      }
    } catch (e) {
      Logger.log('Aviso: Não foi possível atualizar planilha de controle: ' + e.message);
    }

    // 9. Enviar emails (CAS/DF + comprovante conselheiro)
    enviarEmail(dados, pdfFile, recibo, comprovantePdf);
    Logger.log('Emails enviados | Protocolo: ' + recibo.protocolo);

    // 10. Organizar no Drive
    organizarArquivos(docFile, pdfFile);
    Logger.log('Arquivos organizados na pasta: ' + FOLDER_NAME);

    // Calcular tempo de execução
    const endTime = new Date();
    const tempoExecucao = (endTime - startTime) / 1000;
    Logger.log('Tempo de execução: ' + tempoExecucao + ' segundos');
    Logger.log('Protocolo: ' + recibo.protocolo);

    Logger.log('=== PROCESSAMENTO CONCLUÍDO COM SUCESSO ===');

  } catch (error) {
    Logger.log('❌ ERRO: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);

    // Enviar email de erro para administrador
    notificarErro(error, e);
  }
}

/**
 * Instala o trigger para o formulário
 * Executar manualmente uma vez após configuração
 */
function instalarTrigger() {
  // Remove triggers antigos para evitar duplicação
  const triggers = ScriptApp.getProjectTriggers();
  let removidos = 0;

  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onFormSubmit') {
      ScriptApp.deleteTrigger(trigger);
      removidos++;
    }
  });

  Logger.log('Triggers antigos removidos: ' + removidos);

  // Cria novo trigger
  const form = FormApp.openById(FORM_ID);
  ScriptApp.newTrigger('onFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();

  Logger.log('✅ Trigger instalado com sucesso!');
  Logger.log('Form ID: ' + FORM_ID);
}

/**
 * Remove todos os triggers do projeto
 */
function removerTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  Logger.log('Todos os triggers foram removidos.');
}

/**
 * Função de teste manual
 * Simula uma submissão do formulário
 */
function testeManual() {
  // Buscar última resposta da planilha
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    Logger.log('Nenhuma resposta encontrada na planilha.');
    return;
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const values = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Montar objeto namedValues
  const namedValues = {};
  headers.forEach((header, index) => {
    namedValues[header] = [values[index]];
  });

  // Simular evento
  const evento = { namedValues: namedValues };

  Logger.log('Executando teste com dados da linha ' + lastRow);
  onFormSubmit(evento);
}
