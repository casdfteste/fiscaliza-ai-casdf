/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: Email.gs
 * Descrição: Envio de emails
 * Versão: 1.0
 */

/**
 * Envia email com relatório anexo
 * @param {Object} dados - Dados do formulário
 * @param {File} pdfFile - Arquivo PDF para anexar
 */
function enviarEmail(dados, pdfFile) {
  // Preparar corpo HTML
  const htmlBody = gerarEmailHTML(dados);

  // Configurar email
  const assunto = 'Relatório de Fiscalização - ' + dados.instituicao + ' - ' + formatarData(dados.dataVisita);

  const opcoes = {
    to: EMAIL_CASDF,
    subject: assunto,
    htmlBody: htmlBody,
    attachments: [pdfFile.getBlob()],
    name: 'Sistema de Fiscalização CAS/DF'
  };

  // Adicionar CC para o conselheiro se email válido
  if (dados.emailConselheiro && dados.emailConselheiro.includes('@')) {
    opcoes.cc = dados.emailConselheiro;
    opcoes.replyTo = dados.emailConselheiro;
  }

  // Enviar
  MailApp.sendEmail(opcoes);

  Logger.log('Email enviado para: ' + EMAIL_CASDF);
  if (opcoes.cc) {
    Logger.log('CC para: ' + opcoes.cc);
  }
}

/**
 * Gera corpo do email em HTML
 * @param {Object} dados - Dados do formulário
 * @returns {string} HTML do email
 */
function gerarEmailHTML(dados) {
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
        Este é um email automático gerado pelo Sistema de Fiscalização v9.0
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
Sistema de Fiscalização CAS/DF v1.0
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
