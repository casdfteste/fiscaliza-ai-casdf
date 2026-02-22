/**
 * SISTEMA DE DESIGNAÇÃO E CONTROLE - CAS/DF
 * Arquivo: ControlePrazos.gs
 * Descrição: Controle de prazos e alertas automáticos
 * Versão: 1.0
 */

/**
 * Verifica prazos e envia alertas
 * Deve ser executada diariamente via trigger
 */
function verificarPrazos() {
  Logger.log('=== VERIFICAÇÃO DE PRAZOS ===');

  const sheet = SpreadsheetApp.openById(SHEET_CONTROLE_ID).getSheetByName(ABA_CONTROLE);
  const dados = sheet.getDataRange().getValues();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const alertasConselheiros = [];
  const processosAtrasados = [];

  // Pula o cabeçalho (linha 0)
  for (let i = 1; i < dados.length; i++) {
    const linha = dados[i];
    const status = linha[10]; // Coluna K: Status

    // Só verifica processos pendentes (Designado ou Aguardando)
    if (status === STATUS.DESIGNADO || status === STATUS.AGUARDANDO) {
      const id = linha[0];
      const processo = linha[1];
      const entidade = linha[2];
      const conselheiro = linha[3];
      const prazoStr = linha[7]; // Coluna H: Prazo

      if (prazoStr) {
        const prazo = new Date(prazoStr);
        prazo.setHours(0, 0, 0, 0);
        const diasRestantes = Math.floor((prazo - hoje) / (1000 * 60 * 60 * 24));

        // Buscar e-mail do conselheiro
        const emailConselheiro = buscarEmailConselheiro(conselheiro);

        if (diasRestantes < 0) {
          // Processo atrasado
          processosAtrasados.push({
            id: id,
            processo: processo,
            entidade: entidade,
            conselheiro: conselheiro,
            email: emailConselheiro,
            diasAtraso: Math.abs(diasRestantes),
            linha: i + 1
          });
          Logger.log('⚠️ ATRASADO: ' + entidade + ' (' + Math.abs(diasRestantes) + ' dias)');

        } else if (diasRestantes <= ALERTA_DIAS_ANTES && diasRestantes >= 0) {
          // Próximo do vencimento - enviar alerta
          alertasConselheiros.push({
            conselheiro: conselheiro,
            email: emailConselheiro,
            entidade: entidade,
            processo: processo,
            prazo: Utilities.formatDate(prazo, 'America/Sao_Paulo', 'dd/MM/yyyy'),
            diasRestantes: diasRestantes
          });
          Logger.log('⏰ ALERTA: ' + entidade + ' (vence em ' + diasRestantes + ' dias)');
        }
      }
    }
  }

  // Enviar alertas aos conselheiros
  alertasConselheiros.forEach(alerta => {
    if (alerta.email) {
      enviarAlertaConselheiro(alerta);
    }
  });
  Logger.log('Alertas enviados: ' + alertasConselheiros.length);

  // Enviar resumo de atrasados para a secretaria (se houver)
  if (processosAtrasados.length > 0) {
    enviarRelatorioAtrasados(processosAtrasados);
    Logger.log('Relatório de atrasados enviado para secretaria');
  }

  Logger.log('=== VERIFICAÇÃO CONCLUÍDA ===');
}

/**
 * Envia alerta de prazo ao conselheiro
 * @param {Object} alerta - Dados do alerta
 */
function enviarAlertaConselheiro(alerta) {
  const assunto = EMAIL_ALERTA_ASSUNTO
    .replace('{{ENTIDADE}}', alerta.entidade);

  const corpo = EMAIL_ALERTA_CORPO
    .replace('{{CONSELHEIRO}}', alerta.conselheiro)
    .replace('{{ENTIDADE}}', alerta.entidade)
    .replace('{{PROCESSO}}', alerta.processo)
    .replace('{{PRAZO}}', alerta.prazo)
    .replace('{{DIAS_RESTANTES}}', alerta.diasRestantes.toString())
    .replace('{{LINK_FORMULARIO}}', LINK_FORMULARIO_FISCALIZACAO);

  GmailApp.sendEmail(alerta.email, assunto, corpo, {
    name: 'Secretaria Executiva - CAS/DF',
    replyTo: EMAIL_CASDF
  });
}

/**
 * Envia relatório de processos atrasados para a secretaria
 * @param {Array} atrasados - Lista de processos atrasados
 */
function enviarRelatorioAtrasados(atrasados) {
  let listaFormatada = '';

  atrasados.forEach((proc, index) => {
    listaFormatada += `${index + 1}. ${proc.entidade}
   • Processo: ${proc.processo}
   • Conselheiro: ${proc.conselheiro}
   • Dias de atraso: ${proc.diasAtraso}

`;
  });

  const corpo = EMAIL_ATRASO_CORPO
    .replace('{{LISTA_ATRASADOS}}', listaFormatada)
    .replace('{{TOTAL_ATRASADOS}}', atrasados.length.toString());

  GmailApp.sendEmail(EMAIL_CASDF, EMAIL_ATRASO_ASSUNTO, corpo, {
    name: 'Sistema de Controle - CAS/DF'
  });
}

/**
 * Marca um processo como concluído
 * @param {number} linha - Número da linha na planilha
 */
function marcarComoConcluido(linha) {
  const sheet = SpreadsheetApp.openById(SHEET_CONTROLE_ID).getSheetByName(ABA_CONTROLE);
  sheet.getRange(linha, 11).setValue(STATUS.CONCLUIDO);
  Logger.log('✅ Processo marcado como concluído na linha ' + linha);
}

/**
 * Instala trigger diário para verificação de prazos
 */
function instalarTriggerPrazos() {
  // Remove triggers antigos
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'verificarPrazos') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Criar trigger diário às 8h
  ScriptApp.newTrigger('verificarPrazos')
    .timeBased()
    .atHour(8)
    .everyDays(1)
    .create();

  Logger.log('✅ Trigger de verificação de prazos instalado (diário às 8h)');
}

/**
 * Gera relatório resumido de todos os processos
 * @returns {Object} Estatísticas dos processos
 */
function gerarEstatisticas() {
  const sheet = SpreadsheetApp.openById(SHEET_CONTROLE_ID).getSheetByName(ABA_CONTROLE);
  const dados = sheet.getDataRange().getValues();

  const stats = {
    total: 0,
    designados: 0,
    aguardando: 0,
    recebidos: 0,
    concluidos: 0,
    atrasados: 0,
    noPrazo: 0
  };

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  for (let i = 1; i < dados.length; i++) {
    stats.total++;
    const status = dados[i][10];
    const prazoStr = dados[i][7];

    switch (status) {
      case STATUS.DESIGNADO:
        stats.designados++;
        break;
      case STATUS.AGUARDANDO:
        stats.aguardando++;
        break;
      case STATUS.RECEBIDO:
        stats.recebidos++;
        break;
      case STATUS.CONCLUIDO:
        stats.concluidos++;
        break;
    }

    // Verificar atraso
    if (status !== STATUS.CONCLUIDO && prazoStr) {
      const prazo = new Date(prazoStr);
      if (prazo < hoje) {
        stats.atrasados++;
      } else {
        stats.noPrazo++;
      }
    }
  }

  Logger.log('📊 Estatísticas:');
  Logger.log('Total: ' + stats.total);
  Logger.log('Designados: ' + stats.designados);
  Logger.log('Aguardando: ' + stats.aguardando);
  Logger.log('Recebidos: ' + stats.recebidos);
  Logger.log('Concluídos: ' + stats.concluidos);
  Logger.log('Atrasados: ' + stats.atrasados);
  Logger.log('No prazo: ' + stats.noPrazo);

  return stats;
}
