/**
 * SISTEMA DE DESIGNAÇÃO E CONTROLE - CAS/DF
 * Arquivo: Designacao.gs
 * Descrição: Processamento do formulário de designação
 * Versão: 1.0
 */

/**
 * Função executada quando o formulário de designação é submetido
 * @param {Object} e - Evento do Google Forms
 */
function onDesignacaoSubmit(e) {
  const startTime = new Date();

  try {
    Logger.log('=== INÍCIO DO PROCESSAMENTO DE DESIGNAÇÃO ===');
    Logger.log('Timestamp: ' + startTime.toISOString());

    // 1. Capturar dados do formulário
    const respostas = e.namedValues;
    Logger.log('Respostas capturadas');

    // 2. Extrair dados
    const dados = {
      conselheiro: respostas['Conselheiro'][0],
      entidade: respostas['Entidade a Fiscalizar'][0],
      processo: respostas['Nº do Processo'][0],
      reuniaoPlenaria: respostas['Nº da Reunião Plenária'][0],
      dataReuniao: respostas['Data da Reunião Plenária'][0],
      linkDocumentos: respostas['Link dos Documentos (Google Drive)'][0],
      observacoes: respostas['Observações'] ? respostas['Observações'][0] : '',
      dataDesignacao: new Date(),
      prazo: calcularPrazo(new Date(), PRAZO_PADRAO_DIAS)
    };

    Logger.log('Conselheiro: ' + dados.conselheiro);
    Logger.log('Entidade: ' + dados.entidade);
    Logger.log('Processo: ' + dados.processo);

    // 3. Buscar e-mail do conselheiro
    const emailConselheiro = buscarEmailConselheiro(dados.conselheiro);
    if (!emailConselheiro) {
      throw new Error('E-mail do conselheiro não encontrado: ' + dados.conselheiro);
    }
    dados.emailConselheiro = emailConselheiro;
    Logger.log('E-mail do conselheiro: ' + emailConselheiro);

    // 4. Registrar na planilha de controle
    registrarDesignacao(dados);
    Logger.log('Designação registrada na planilha de controle');

    // 5. Enviar e-mail ao conselheiro
    enviarEmailDesignacao(dados);
    Logger.log('E-mail de designação enviado');

    // Calcular tempo de execução
    const endTime = new Date();
    const tempoExecucao = (endTime - startTime) / 1000;
    Logger.log('Tempo de execução: ' + tempoExecucao + ' segundos');

    Logger.log('=== DESIGNAÇÃO CONCLUÍDA COM SUCESSO ===');

  } catch (error) {
    Logger.log('❌ ERRO NA DESIGNAÇÃO: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);

    // Notificar administrador
    notificarErroDesignacao(error, e);
  }
}

/**
 * Calcula a data de prazo
 * @param {Date} dataInicio - Data inicial
 * @param {number} dias - Quantidade de dias
 * @returns {Date} Data do prazo
 */
function calcularPrazo(dataInicio, dias) {
  const prazo = new Date(dataInicio);
  prazo.setDate(prazo.getDate() + dias);
  return prazo;
}

/**
 * Busca o e-mail do conselheiro na aba de cadastro
 * @param {string} nomeConselheiro - Nome do conselheiro
 * @returns {string|null} E-mail do conselheiro ou null
 */
function buscarEmailConselheiro(nomeConselheiro) {
  const sheet = SpreadsheetApp.openById(SHEET_CONTROLE_ID).getSheetByName(ABA_CONSELHEIROS);
  const dados = sheet.getDataRange().getValues();

  // Pula o cabeçalho (linha 0)
  for (let i = 1; i < dados.length; i++) {
    const nome = dados[i][0]; // Coluna A: Nome
    const email = dados[i][1]; // Coluna B: E-mail
    const status = dados[i][3]; // Coluna D: Status

    if (nome === nomeConselheiro && status === 'Ativo') {
      return email;
    }
  }

  return null;
}

/**
 * Registra a designação na planilha de controle
 * @param {Object} dados - Dados da designação
 */
function registrarDesignacao(dados) {
  const sheet = SpreadsheetApp.openById(SHEET_CONTROLE_ID).getSheetByName(ABA_CONTROLE);

  // Gerar ID único
  const id = gerarIdProcesso();

  // Formatar datas
  const dataDesignacaoFormatada = Utilities.formatDate(dados.dataDesignacao, 'America/Sao_Paulo', 'dd/MM/yyyy');
  const prazoFormatado = Utilities.formatDate(dados.prazo, 'America/Sao_Paulo', 'dd/MM/yyyy');

  // Adicionar nova linha
  sheet.appendRow([
    id,                           // A: ID
    dados.processo,               // B: Nº Processo
    dados.entidade,               // C: Entidade
    dados.conselheiro,            // D: Conselheiro
    dados.reuniaoPlenaria,        // E: Reunião Plenária
    dados.dataReuniao,            // F: Data da Reunião
    dataDesignacaoFormatada,      // G: Data Designação
    prazoFormatado,               // H: Prazo
    '',                           // I: Dias Restantes (fórmula)
    '',                           // J: Situação Prazo (fórmula)
    STATUS.DESIGNADO,             // K: Status
    '',                           // L: Data Relatório
    dados.linkDocumentos,         // M: Link Documentos
    '',                           // N: Link Relatório
    dados.observacoes             // O: Observações
  ]);

  // Aplicar fórmulas na última linha
  const ultimaLinha = sheet.getLastRow();

  // Fórmula para Dias Restantes
  sheet.getRange(ultimaLinha, 9).setFormula(
    '=SE(K' + ultimaLinha + '="' + STATUS.CONCLUIDO + '"; "-"; SE(H' + ultimaLinha + '=""; "-"; H' + ultimaLinha + '-HOJE()))'
  );

  // Fórmula para Situação Prazo
  sheet.getRange(ultimaLinha, 10).setFormula(
    '=SE(K' + ultimaLinha + '="' + STATUS.CONCLUIDO + '"; "' + SITUACAO_PRAZO.CONCLUIDO + '"; ' +
    'SE(I' + ultimaLinha + '<0; "' + SITUACAO_PRAZO.ATRASADO + '"; ' +
    'SE(I' + ultimaLinha + '<=' + ALERTA_DIAS_ANTES + '; "' + SITUACAO_PRAZO.VENCE_BREVE + '"; ' +
    '"' + SITUACAO_PRAZO.NO_PRAZO + '")))'
  );
}

/**
 * Gera um ID único para o processo
 * @returns {string} ID no formato FISC-AAAA-NNNN
 */
function gerarIdProcesso() {
  const ano = new Date().getFullYear();
  const sheet = SpreadsheetApp.openById(SHEET_CONTROLE_ID).getSheetByName(ABA_CONTROLE);
  const ultimaLinha = sheet.getLastRow();

  let sequencial = 1;
  if (ultimaLinha > 1) {
    const ultimoId = sheet.getRange(ultimaLinha, 1).getValue();
    if (ultimoId && ultimoId.includes('-')) {
      const partes = ultimoId.split('-');
      if (partes[1] === ano.toString()) {
        sequencial = parseInt(partes[2]) + 1;
      }
    }
  }

  return 'FISC-' + ano + '-' + sequencial.toString().padStart(4, '0');
}

/**
 * Envia e-mail de designação ao conselheiro
 * @param {Object} dados - Dados da designação
 */
function enviarEmailDesignacao(dados) {
  const prazoFormatado = Utilities.formatDate(dados.prazo, 'America/Sao_Paulo', 'dd/MM/yyyy');

  // Montar assunto
  const assunto = EMAIL_DESIGNACAO_ASSUNTO
    .replace('{{ENTIDADE}}', dados.entidade)
    .replace('{{PROCESSO}}', dados.processo);

  // Montar corpo
  const corpo = EMAIL_DESIGNACAO_CORPO
    .replace('{{CONSELHEIRO}}', dados.conselheiro)
    .replace('{{REUNIAO_PLENARIA}}', dados.reuniaoPlenaria)
    .replace('{{DATA_REUNIAO}}', dados.dataReuniao)
    .replace('{{ENTIDADE}}', dados.entidade)
    .replace('{{PROCESSO}}', dados.processo)
    .replace('{{PRAZO}}', prazoFormatado)
    .replace('{{LINK_DOCUMENTOS}}', dados.linkDocumentos)
    .replace('{{LINK_FORMULARIO}}', LINK_FORMULARIO_FISCALIZACAO);

  // Enviar e-mail
  GmailApp.sendEmail(dados.emailConselheiro, assunto, corpo, {
    name: 'Secretaria Executiva - CAS/DF',
    replyTo: EMAIL_CASDF
  });
}

/**
 * Notifica erro na designação
 * @param {Error} error - Objeto de erro
 * @param {Object} e - Evento original
 */
function notificarErroDesignacao(error, e) {
  const assunto = '❌ Erro no Sistema de Designação - CAS/DF';
  const corpo = `Ocorreu um erro no sistema de designação:

Erro: ${error.toString()}
Stack: ${error.stack}

Dados do formulário:
${JSON.stringify(e.namedValues, null, 2)}

Timestamp: ${new Date().toISOString()}`;

  GmailApp.sendEmail(EMAIL_ADMIN, assunto, corpo);
}

/**
 * Instala o trigger para o formulário de designação
 */
function instalarTriggerDesignacao() {
  // Remove triggers antigos
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onDesignacaoSubmit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Cria novo trigger
  const form = FormApp.openById(FORM_DESIGNACAO_ID);
  ScriptApp.newTrigger('onDesignacaoSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();

  Logger.log('✅ Trigger de designação instalado!');
}
