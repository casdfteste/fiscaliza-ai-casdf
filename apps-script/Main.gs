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
 * Atualiza a planilha de controle quando um relatório é recebido
 * @param {string} instituicao - Nome da instituição
 * @param {string} conselheiro - Nome do conselheiro
 * @param {string} linkRelatorio - URL do relatório PDF
 */
function atualizarStatusRelatorioRecebido(instituicao, conselheiro, linkRelatorio) {
  if (!SHEET_CONTROLE_ID) return;

  var ss = SpreadsheetApp.openById(SHEET_CONTROLE_ID);
  var sheet = ss.getSheetByName(ABA_CONTROLE);
  if (!sheet) {
    Logger.log('Aba "' + ABA_CONTROLE + '" nao encontrada na planilha de controle');
    return;
  }

  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  // Localizar colunas relevantes (busca flexível)
  var colEntidade = -1, colStatus = -1, colLink = -1, colData = -1, colSituacao = -1;
  for (var c = 0; c < headers.length; c++) {
    var h = headers[c].toString().toLowerCase();
    if (h.indexOf('entidade') >= 0 || h.indexOf('institui') >= 0) colEntidade = c;
    if (h === 'status') colStatus = c;
    if (h.indexOf('link') >= 0 && h.indexOf('relat') >= 0) colLink = c;
    if (h.indexOf('data') >= 0 && h.indexOf('receb') >= 0) colData = c;
    if (h.indexOf('situa') >= 0 && h.indexOf('prazo') >= 0) colSituacao = c;
  }

  if (colEntidade === -1) {
    Logger.log('Coluna de entidade nao encontrada na planilha de controle');
    return;
  }

  // Buscar linha da instituição (mais recente primeiro)
  for (var i = data.length - 1; i >= 1; i--) {
    var valor = data[i][colEntidade] ? data[i][colEntidade].toString() : '';
    if (valor && valor.toLowerCase().indexOf(instituicao.toLowerCase()) >= 0) {
      var row = i + 1; // Converter para 1-based

      if (colStatus >= 0) {
        sheet.getRange(row, colStatus + 1).setValue(STATUS.RECEBIDO);
      }
      if (colLink >= 0 && linkRelatorio) {
        sheet.getRange(row, colLink + 1).setValue(linkRelatorio);
      }
      if (colData >= 0) {
        sheet.getRange(row, colData + 1).setValue(new Date());
      }
      if (colSituacao >= 0) {
        sheet.getRange(row, colSituacao + 1).setValue(SITUACAO_PRAZO.CONCLUIDO);
      }

      Logger.log('Planilha de controle atualizada - Linha ' + row + ': ' + instituicao);
      return;
    }
  }

  Logger.log('Instituicao "' + instituicao + '" nao encontrada na planilha de controle');
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
 * Teste com dados fictícios — não depende de respostas reais no Forms/Planilha.
 * Cobre todos os campos de Mapeamento.gs, incluindo os campos condicionais.
 * Ideal para validar o fluxo completo: documento → PDF → email → comprovante.
 */
function testeComDadosFicticios() {
  const nv = function(valor) { return [valor]; };

  const namedValues = {
    // Identificação
    'Nome do(a) Conselheiro(a)':                          nv('Maria da Silva Santos'),
    'E-mail do(a) Conselheiro(a)':                        nv(EMAIL_ADMIN),
    'Nome da Instituição Fiscalizada':                    nv('APAE - Associação de Pais e Amigos dos Excepcionais'),
    'Tipo de Processo':                                   nv('Acompanhamento anual'),
    'Qual o ano do acompanhamento?':                      nv('2025'),
    'Modalidade da Inscrição':                            nv('Anexo I'),
    'Nome do Serviço/Oferta Fiscalizada':                 nv('Serviço de Convivência e Fortalecimento de Vínculos'),

    // Endereço
    'CEP da Entidade':                                    nv('70770-502'),
    'Número':                                             nv('515'),
    'Complemento (sala, bloco, andar)':                   nv('Bloco B, 4º andar'),

    // Dados da visita
    'Data da Visita':                                     nv('22/02/2026'),
    'Horário da Visita':                                  nv('10:00'),
    'Quem recebeu o(a) conselheiro(a)?':                  nv('João Pereira da Costa - Diretor Técnico'),

    // Documentação
    'Licença de Funcionamento ou Laudo Técnico':          nv('Sim, possui licença vigente até 12/2026'),
    'É executada em unidade pública cedida?':             nv('Não'),
    'Qual o instrumento jurídico da cessão?':             nv(''),

    // Público-alvo
    'Públicos Atendidos':                                 nv('Pessoas com deficiência intelectual'),
    'Se atende IDOSOS - Registro no CDI/DF?':             nv('Não se aplica'),
    'Se atende CRIANÇAS/ADOLESCENTES - Registro no CDCA/DF?': nv('Não se aplica'),
    'Se atende FAMÍLIAS - Registros':                     nv(''),

    // Equipe
    'Formas de Acesso dos Usuários':                      nv('Encaminhamento do CRAS e demanda espontânea'),
    'Número de Voluntários':                              nv('3'),
    'Número de Contratados':                              nv('12'),
    'Especialidades Presentes na Equipe':                 nv('Psicólogo, Assistente Social, Terapeuta Ocupacional, Pedagogo'),

    // Infraestrutura
    'Tipo de Espaço':                                     nv('Imóvel próprio da entidade'),
    'Acessibilidade':                                     nv('Rampa de acesso, banheiro adaptado, piso tátil'),
    'Compartilha Espaço com Outros Serviços?':            nv('Não'),
    'Quais serviços compartilham o espaço?':              nv(''),
    'Adequação do Espaço Físico':                         nv('Satisfatório'),
    'Descreva as inadequações':                           nv(''),

    // Funcionamento
    'Funciona de dezembro a dezembro (ano todo)?':        nv('Sim'),
    'Há período de recesso ou férias coletivas?':         nv('Sim'),
    'Qual o período de recesso/férias?':                  nv('Janeiro - 2 primeiras semanas'),
    'O serviço é totalmente gratuito?':                   nv('Sim'),
    'Por que o serviço não é gratuito?':                  nv(''),
    'Há retenção de BPC?':                                nv('Não'),
    'Qual o percentual de BPC retido?':                   nv(''),

    // Articulação
    'Centro de Referência - CRAS':                        nv('Sim - CRAS Asa Norte'),
    'Centro de Referência Especializado - CREAS':         nv('Sim - CREAS Plano Piloto'),
    'Unidade de Acolhimento':                             nv('Não'),
    'Serviço de Abordagem Social':                        nv('Não'),
    'Centro POP':                                         nv('Não'),
    'Serviços de Saúde':                                  nv('Sim - UBS 03 de Brasília'),
    'Serviços de Educação':                               nv('Sim - CED 01 de Brasília'),
    'Sistema de Justiça':                                 nv('Não'),
    'Conselhos de Políticas Públicas':                    nv('Sim - CDPD/DF'),
    'Outras Articulações Relevantes':                     nv('Parceria com Secretaria de Educação para transporte escolar'),

    // Avaliação
    'As ações executadas estão conforme o Plano de Trabalho?': nv('Sim, em conformidade'),
    'Descreva as divergências encontradas':               nv(''),
    'A metodologia está adequada às normativas?':         nv('Sim, metodologia adequada'),
    'Descreva as inadequações ou ressalvas metodológicas':nv(''),
    'Observações Adicionais':                             nv('Entidade bem organizada, equipe comprometida e espaço adequado para o atendimento.'),

    // Voto
    'Quanto às análises técnicas da Secretaria Executiva': nv('Concordo integralmente com as análises técnicas apresentadas'),
    'Fundamentos da discordância':                        nv(''),
    'Voto do(a) Conselheiro(a)':                          nv('Deferimento'),
    'Justificativa do Voto':                              nv('A entidade demonstra plena capacidade técnica e operacional para execução dos serviços.'),
    'Data do Voto':                                       nv('22/02/2026')
  };

  Logger.log('=== TESTE COM DADOS FICTÍCIOS ===');
  Logger.log('Instituição: APAE - SCFV');
  Logger.log('Conselheiro: Maria da Silva Santos');

  onFormSubmit({ namedValues: namedValues });
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
  // Buscar última resposta da planilha (sempre primeira aba = respostas do Forms)
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
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
