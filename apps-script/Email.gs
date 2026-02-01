/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: Email.gs
 * Descrição: Envio de emails com recibo de protocolo
 * Versão: 2.0
 */

/**
 * Envia email com relatório anexo para CAS/DF e comprovante para conselheiro
 * @param {Object} dados - Dados do formulário
 * @param {File} pdfFile - Arquivo PDF do relatório
 * @param {Object} recibo - Objeto de recibo gerado por gerarRecibo()
 * @param {File} comprovantePdf - PDF do comprovante no padrão CAS/DF
 */
function enviarEmail(dados, pdfFile, recibo, comprovantePdf) {
  // 1. Enviar email principal para CAS/DF (com relatório + comprovante)
  enviarEmailCASDF(dados, pdfFile, recibo, comprovantePdf);

  // 2. Enviar comprovante separado para conselheiro
  if (dados.emailConselheiro && validarEmail(dados.emailConselheiro)) {
    enviarReciboConselheiro(dados, pdfFile, recibo, comprovantePdf);
  } else {
    Logger.log('Email do conselheiro ausente ou inválido - comprovante não enviado');
  }
}

/**
 * Envia email principal para CAS/DF com relatório anexo
 * @param {Object} dados - Dados do formulário
 * @param {File} pdfFile - Arquivo PDF
 * @param {Object} recibo - Objeto de recibo
 */
function enviarEmailCASDF(dados, pdfFile, recibo, comprovantePdf) {
  const htmlBody = gerarEmailHTML(dados, recibo);
  const assunto = 'Relatório de Fiscalização [' + recibo.protocolo + '] - ' +
    dados.instituicao + ' - ' + formatarData(dados.dataVisita);

  const anexos = [pdfFile.getBlob()];
  if (comprovantePdf) {
    anexos.push(comprovantePdf.getBlob());
  }

  const opcoes = {
    to: EMAIL_CASDF,
    subject: assunto,
    htmlBody: htmlBody,
    attachments: anexos,
    name: 'Sistema de Fiscalização CAS/DF'
  };

  if (dados.emailConselheiro && validarEmail(dados.emailConselheiro)) {
    opcoes.cc = dados.emailConselheiro;
    opcoes.replyTo = dados.emailConselheiro;
  }

  try {
    MailApp.sendEmail(opcoes);
    Logger.log('Email CAS/DF enviado para: ' + EMAIL_CASDF + ' | Protocolo: ' + recibo.protocolo);
  } catch (error) {
    Logger.log('ERRO ao enviar email CAS/DF: ' + error.message);
    notificarErroEmail(error, dados, recibo);
    throw error;
  }
}

/**
 * Envia email de recibo/comprovante diretamente para o conselheiro
 * @param {Object} dados - Dados do formulário
 * @param {File} pdfFile - Arquivo PDF
 * @param {Object} recibo - Objeto de recibo
 */
function enviarReciboConselheiro(dados, pdfFile, recibo, comprovantePdf) {
  const htmlBody = gerarReciboHTML(dados, recibo);
  const assunto = 'Comprovante de Recebimento [' + recibo.protocolo + '] - ' + dados.instituicao;

  const anexos = [];
  if (comprovantePdf) {
    anexos.push(comprovantePdf.getBlob());
  }
  anexos.push(pdfFile.getBlob());

  const opcoes = {
    to: dados.emailConselheiro,
    subject: assunto,
    htmlBody: htmlBody,
    attachments: anexos,
    name: 'Sistema de Fiscalização CAS/DF',
    replyTo: EMAIL_CASDF
  };

  try {
    MailApp.sendEmail(opcoes);
    Logger.log('Recibo enviado para conselheiro: ' + dados.emailConselheiro);
  } catch (error) {
    Logger.log('ERRO ao enviar recibo para conselheiro: ' + error.message);
    // Não lança exceção - o email principal já foi enviado
  }
}

/**
 * Notifica administrador sobre falha no envio de email
 * @param {Error} error - Erro ocorrido
 * @param {Object} dados - Dados do formulário
 * @param {Object} recibo - Objeto de recibo
 */
function notificarErroEmail(error, dados, recibo) {
  try {
    MailApp.sendEmail({
      to: EMAIL_ADMIN,
      subject: '❌ FALHA NO ENVIO - Protocolo ' + recibo.protocolo,
      body: 'Falha ao enviar email do relatório de fiscalização.\n\n' +
        'Protocolo: ' + recibo.protocolo + '\n' +
        'Instituição: ' + (dados.instituicao || 'N/A') + '\n' +
        'Conselheiro: ' + (dados.conselheiro || 'N/A') + '\n' +
        'Erro: ' + error.message + '\n' +
        'Timestamp: ' + new Date().toISOString() + '\n\n' +
        'Verifique a cota diária do Gmail (500/dia) e os logs de execução.'
    });
  } catch (e) {
    Logger.log('Falha ao notificar admin sobre erro de email: ' + e.message);
  }
}

/**
 * Gera corpo do email principal (CAS/DF) em HTML com dados do recibo
 * @param {Object} dados - Dados do formulário
 * @param {Object} recibo - Objeto de recibo
 * @returns {string} HTML do email
 */
function gerarEmailHTML(dados, recibo) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .badge {
      background: #4CAF50;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
      display: inline-block;
      margin-bottom: 10px;
    }
    .header h1 {
      margin: 10px 0;
      font-size: 24px;
    }
    .header p {
      margin: 5px 0;
      opacity: 0.9;
    }
    .protocolo-box {
      background: #e8f5e9;
      border: 2px solid #4CAF50;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
      text-align: center;
    }
    .protocolo-box .numero {
      font-size: 22px;
      font-weight: bold;
      color: #2e7d32;
      letter-spacing: 2px;
    }
    .protocolo-box .label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }
    .content {
      background: white;
      padding: 30px;
      border: 1px solid #e0e0e0;
    }
    .info-box {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .info-item {
      margin: 10px 0;
    }
    .label {
      font-weight: bold;
      color: #666;
    }
    .footer {
      background: #f5f5f5;
      padding: 20px;
      text-align: center;
      border-radius: 0 0 10px 10px;
      font-size: 12px;
      color: #666;
    }
    .footer p {
      margin: 5px 0;
    }
    .auto-msg {
      margin-top: 15px;
      color: #999;
      font-size: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">✓ FISCALIZAÇÃO CONCLUÍDA</div>
      <h1>Relatório de Fiscalização</h1>
      <p>CAS/DF - Conselho de Assistência Social do Distrito Federal</p>
    </div>

    <div class="content">
      <div class="protocolo-box">
        <div class="label">Número de Protocolo</div>
        <div class="numero">${recibo.protocolo}</div>
        <div class="label">Recebido em ${recibo.dataHora}</div>
      </div>

      <p>Prezada Secretaria Executiva do CAS/DF,</p>

      <p>Segue em anexo o Relatório de Fiscalização com as seguintes informações:</p>

      <div class="info-box">
        <div class="info-item">
          <span class="label">📋 Instituição:</span> ${dados.instituicao || '(não informado)'}
        </div>
        <div class="info-item">
          <span class="label">📍 Endereço:</span> ${dados.endereco || '(não informado)'}
        </div>
        <div class="info-item">
          <span class="label">📅 Data da Visita:</span> ${formatarData(dados.dataVisita)}
        </div>
        <div class="info-item">
          <span class="label">🕐 Horário:</span> ${dados.horario || '(não informado)'}
        </div>
        <div class="info-item">
          <span class="label">👤 Quem recebeu:</span> ${dados.quemRecebeu || '(não informado)'}
        </div>
        <div class="info-item">
          <span class="label">👨‍💼 Conselheiro(a):</span> ${dados.conselheiro || '(não informado)'}
        </div>
        <div class="info-item">
          <span class="label">🗳️ Voto:</span> ${dados.voto || '(não informado)'}
        </div>
      </div>

      <p><strong>📎 Documentos anexos:</strong></p>
      <ul>
        <li>Relatório completo de fiscalização (PDF)</li>
        <li>Fotografias documentais incorporadas</li>
      </ul>

      <p>Atenciosamente,<br>
      <strong>${dados.conselheiro || 'Conselheiro(a)'}</strong><br>
      Conselheiro(a) - CAS/DF</p>
    </div>

    <div class="footer">
      <p><strong>Conselho de Assistência Social do Distrito Federal</strong></p>
      <p>SEPN Quadra 515 Lote 02 Bloco B, 4º andar - Asa Norte/DF - CEP 70.770-502</p>
      <p>E-mail: cas_df@sedes.df.gov.br</p>
      <p class="auto-msg">
        Este é um email automático gerado pelo Sistema de Fiscalização v2.0 | Protocolo: ${recibo.protocolo}
      </p>
    </div>
  </div>
</body>
</html>`;

  return html;
}

/**
 * Gera email HTML de comprovante/recibo para o conselheiro
 * @param {Object} dados - Dados do formulário
 * @param {Object} recibo - Objeto de recibo
 * @returns {string} HTML do email de recibo
 */
function gerarReciboHTML(dados, recibo) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #2e7d32 0%, #388e3c 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .badge {
      background: rgba(255,255,255,0.2);
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
      display: inline-block;
      margin-bottom: 10px;
    }
    .header h1 {
      margin: 10px 0;
      font-size: 22px;
    }
    .header p {
      margin: 5px 0;
      opacity: 0.9;
    }
    .protocolo-destaque {
      background: #e8f5e9;
      border: 2px solid #4CAF50;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    .protocolo-destaque .numero {
      font-size: 28px;
      font-weight: bold;
      color: #2e7d32;
      letter-spacing: 3px;
    }
    .protocolo-destaque .sublabel {
      font-size: 11px;
      color: #888;
      margin-top: 5px;
    }
    .content {
      background: white;
      padding: 30px;
      border: 1px solid #e0e0e0;
    }
    .dados-box {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .dados-item {
      margin: 8px 0;
      font-size: 14px;
    }
    .dados-label {
      font-weight: bold;
      color: #555;
    }
    .proximos-passos {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
      padding: 15px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    .proximos-passos h3 {
      margin: 0 0 10px 0;
      color: #e65100;
      font-size: 14px;
    }
    .proximos-passos ul {
      margin: 0;
      padding-left: 20px;
    }
    .proximos-passos li {
      margin: 5px 0;
      font-size: 13px;
    }
    .footer {
      background: #f5f5f5;
      padding: 20px;
      text-align: center;
      border-radius: 0 0 10px 10px;
      font-size: 12px;
      color: #666;
    }
    .footer p {
      margin: 5px 0;
    }
    .auto-msg {
      margin-top: 15px;
      color: #999;
      font-size: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">✓ COMPROVANTE DE RECEBIMENTO</div>
      <h1>Relatório Recebido com Sucesso</h1>
      <p>CAS/DF - Conselho de Assistência Social do Distrito Federal</p>
    </div>

    <div class="content">
      <p>Prezado(a) Conselheiro(a) <strong>${dados.conselheiro || ''}</strong>,</p>

      <p>Seu relatório de fiscalização foi <strong>recebido com sucesso</strong> pelo sistema. Guarde este comprovante para referência.</p>

      <div class="protocolo-destaque">
        <div style="font-size: 11px; color: #888; text-transform: uppercase;">Número de Protocolo</div>
        <div class="numero">${recibo.protocolo}</div>
        <div class="sublabel">Recebido em ${recibo.dataHora} (horário de Brasília)</div>
      </div>

      <div class="dados-box">
        <div class="dados-item">
          <span class="dados-label">Instituição:</span> ${dados.instituicao || '(não informado)'}
        </div>
        <div class="dados-item">
          <span class="dados-label">Data da Visita:</span> ${formatarData(dados.dataVisita)}
        </div>
        <div class="dados-item">
          <span class="dados-label">Conselheiro(a):</span> ${dados.conselheiro || '(não informado)'}
        </div>
        <div class="dados-item">
          <span class="dados-label">Arquivo:</span> ${recibo.pdfNome}
        </div>
      </div>

      <div class="proximos-passos">
        <h3>📌 Próximos Passos</h3>
        <ul>
          <li>Seu relatório será analisado pela Secretaria Executiva do CAS/DF</li>
          <li>O relatório será submetido à deliberação da plenária</li>
          <li>Em caso de dúvidas, entre em contato informando o protocolo <strong>${recibo.protocolo}</strong></li>
        </ul>
      </div>

      <p style="font-size: 13px; color: #666;">
        Uma cópia do relatório em PDF está anexada a este email para seus registros.
      </p>
    </div>

    <div class="footer">
      <p><strong>Conselho de Assistência Social do Distrito Federal</strong></p>
      <p>SEPN Quadra 515 Lote 02 Bloco B, 4º andar - Asa Norte/DF - CEP 70.770-502</p>
      <p>E-mail: cas_df@sedes.df.gov.br</p>
      <p class="auto-msg">
        Este é um email automático. Não responda a esta mensagem.<br>
        Sistema de Fiscalização v2.0 | Protocolo: ${recibo.protocolo}
      </p>
    </div>
  </div>
</body>
</html>`;

  return html;
}

/**
 * Notifica administrador sobre erro no sistema
 * @param {Error} error - Objeto de erro
 * @param {Object} evento - Evento do formulário
 */
function notificarErro(error, evento) {
  const assunto = '❌ ERRO - Sistema de Fiscalização CAS/DF';

  let dadosFormulario = 'Não disponível';
  try {
    dadosFormulario = JSON.stringify(evento.namedValues, null, 2);
  } catch (e) {
    dadosFormulario = 'Erro ao serializar: ' + e.message;
  }

  const corpo = `
ERRO NO SISTEMA DE FISCALIZAÇÃO CAS/DF

Timestamp: ${new Date().toISOString()}

ERRO:
${error.toString()}

STACK TRACE:
${error.stack || 'Não disponível'}

DADOS DO FORMULÁRIO:
${dadosFormulario}

---
Sistema de Fiscalização CAS/DF v2.0
`;

  try {
    MailApp.sendEmail({
      to: EMAIL_ADMIN,
      subject: assunto,
      body: corpo
    });
    Logger.log('Email de erro enviado para: ' + EMAIL_ADMIN);
  } catch (e) {
    Logger.log('Falha ao enviar email de erro: ' + e.message);
  }
}
