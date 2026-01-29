/**
 * SISTEMA DE DESIGNAÇÃO E CONTROLE - CAS/DF
 * Arquivo: SetupPlanilha.gs
 * Descrição: Configuração inicial da planilha de controle
 * Versão: 1.0
 */

/**
 * Cria a estrutura completa da planilha de controle
 * Executar uma vez após criar a planilha
 */
function configurarPlanilhaControle() {
  const ss = SpreadsheetApp.openById(SHEET_CONTROLE_ID);

  // Criar/configurar todas as abas (versão completa)
  criarAbaDashboard(ss);
  criarAbaCadastroEntidades(ss);
  criarAbaControle(ss);
  criarAbaConselheiros(ss);
  criarAbaConfiguracoes(ss);

  // Remover aba padrão "Sheet1" se existir
  const sheet1 = ss.getSheetByName('Sheet1');
  if (sheet1) {
    ss.deleteSheet(sheet1);
  }

  Logger.log('✅ Planilha de controle configurada com sucesso!');
}

/**
 * Cria a aba de Controle de Fiscalizações
 * @param {SpreadsheetApp.Spreadsheet} ss - Planilha
 */
function criarAbaControle(ss) {
  let sheet = ss.getSheetByName(ABA_CONTROLE);

  if (!sheet) {
    sheet = ss.insertSheet(ABA_CONTROLE);
  }

  // Limpar e configurar
  sheet.clear();

  // Cabeçalhos
  const cabecalhos = [
    'ID',
    'Nº Processo',
    'Entidade',
    'Conselheiro',
    'Reunião Plenária',
    'Data Reunião',
    'Data Designação',
    'Prazo',
    'Dias Restantes',
    'Situação Prazo',
    'Status',
    'Data Relatório',
    'Link Documentos',
    'Link Relatório',
    'Observações'
  ];

  // Inserir cabeçalhos
  sheet.getRange(1, 1, 1, cabecalhos.length).setValues([cabecalhos]);

  // Formatação do cabeçalho
  const headerRange = sheet.getRange(1, 1, 1, cabecalhos.length);
  headerRange.setBackground('#1a237e');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');

  // Largura das colunas
  sheet.setColumnWidth(1, 120);  // ID
  sheet.setColumnWidth(2, 100);  // Nº Processo
  sheet.setColumnWidth(3, 200);  // Entidade
  sheet.setColumnWidth(4, 150);  // Conselheiro
  sheet.setColumnWidth(5, 120);  // Reunião Plenária
  sheet.setColumnWidth(6, 100);  // Data Reunião
  sheet.setColumnWidth(7, 110);  // Data Designação
  sheet.setColumnWidth(8, 100);  // Prazo
  sheet.setColumnWidth(9, 110);  // Dias Restantes
  sheet.setColumnWidth(10, 130); // Situação Prazo
  sheet.setColumnWidth(11, 150); // Status
  sheet.setColumnWidth(12, 110); // Data Relatório
  sheet.setColumnWidth(13, 250); // Link Documentos
  sheet.setColumnWidth(14, 250); // Link Relatório
  sheet.setColumnWidth(15, 200); // Observações

  // Congelar cabeçalho
  sheet.setFrozenRows(1);

  // Formatação condicional para Situação Prazo
  const range = sheet.getRange('J2:J1000');

  // Regra: Atrasado (vermelho)
  const ruleAtrasado = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Atrasado')
    .setBackground('#ffcdd2')
    .setFontColor('#b71c1c')
    .setRanges([range])
    .build();

  // Regra: Vence em breve (amarelo)
  const ruleVenceBreve = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Vence em breve')
    .setBackground('#fff9c4')
    .setFontColor('#f57f17')
    .setRanges([range])
    .build();

  // Regra: No prazo (verde)
  const ruleNoPrazo = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('No prazo')
    .setBackground('#c8e6c9')
    .setFontColor('#1b5e20')
    .setRanges([range])
    .build();

  // Regra: Concluído (azul)
  const ruleConcluido = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Concluído')
    .setBackground('#bbdefb')
    .setFontColor('#0d47a1')
    .setRanges([range])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(ruleAtrasado, ruleVenceBreve, ruleNoPrazo, ruleConcluido);
  sheet.setConditionalFormatRules(rules);

  // Formatação condicional para Status (coluna K)
  const rangeStatus = sheet.getRange('K2:K1000');

  const ruleStatusConcluido = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Concluído')
    .setBackground('#c8e6c9')
    .setRanges([rangeStatus])
    .build();

  const ruleStatusRecebido = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Recebido')
    .setBackground('#bbdefb')
    .setRanges([rangeStatus])
    .build();

  const ruleStatusAguardando = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Aguardando')
    .setBackground('#fff9c4')
    .setRanges([rangeStatus])
    .build();

  rules.push(ruleStatusConcluido, ruleStatusRecebido, ruleStatusAguardando);
  sheet.setConditionalFormatRules(rules);

  Logger.log('✅ Aba "' + ABA_CONTROLE + '" configurada');
}

/**
 * Cria a aba de Conselheiros
 * @param {SpreadsheetApp.Spreadsheet} ss - Planilha
 */
function criarAbaConselheiros(ss) {
  let sheet = ss.getSheetByName(ABA_CONSELHEIROS);

  if (!sheet) {
    sheet = ss.insertSheet(ABA_CONSELHEIROS);
  }

  // Limpar e configurar
  sheet.clear();

  // Cabeçalhos
  const cabecalhos = [
    'Nome Completo',
    'CPF',
    'E-mail',
    'Telefone',
    'Segmento',
    'Órgão/Entidade que Representa',
    'Titular/Suplente',
    'Início Mandato',
    'Fim Mandato',
    'Status'
  ];

  // Inserir cabeçalhos
  sheet.getRange(1, 1, 1, cabecalhos.length).setValues([cabecalhos]);

  // Formatação do cabeçalho
  const headerRange = sheet.getRange(1, 1, 1, cabecalhos.length);
  headerRange.setBackground('#1a237e');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');

  // Largura das colunas
  sheet.setColumnWidth(1, 200);  // Nome
  sheet.setColumnWidth(2, 120);  // CPF
  sheet.setColumnWidth(3, 220);  // E-mail
  sheet.setColumnWidth(4, 130);  // Telefone
  sheet.setColumnWidth(5, 130);  // Segmento
  sheet.setColumnWidth(6, 250);  // Órgão/Entidade
  sheet.setColumnWidth(7, 120);  // Titular/Suplente
  sheet.setColumnWidth(8, 110);  // Início Mandato
  sheet.setColumnWidth(9, 110);  // Fim Mandato
  sheet.setColumnWidth(10, 100); // Status

  // Congelar cabeçalho
  sheet.setFrozenRows(1);

  // Validação de dados para Segmento
  const segmentoRange = sheet.getRange('E2:E100');
  const segmentoRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Governo', 'Sociedade Civil'], true)
    .setAllowInvalid(false)
    .build();
  segmentoRange.setDataValidation(segmentoRule);

  // Validação de dados para Titular/Suplente
  const titularRange = sheet.getRange('G2:G100');
  const titularRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Titular', 'Suplente'], true)
    .setAllowInvalid(false)
    .build();
  titularRange.setDataValidation(titularRule);

  // Validação de dados para Status
  const statusRange = sheet.getRange('J2:J100');
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Ativo', 'Inativo'], true)
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(statusRule);

  // Formatação condicional para Segmento
  const ruleGoverno = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Governo')
    .setBackground('#e3f2fd')
    .setRanges([segmentoRange])
    .build();

  const ruleSociedade = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Sociedade Civil')
    .setBackground('#fff3e0')
    .setRanges([segmentoRange])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(ruleGoverno, ruleSociedade);
  sheet.setConditionalFormatRules(rules);

  // Adicionar exemplo
  sheet.getRange(2, 1, 1, 10).setValues([
    ['[Nome do Conselheiro]', '[000.000.000-00]', '[email@exemplo.com]', '(61) 99999-0000', 'Governo', '[Secretaria/Entidade]', 'Titular', '01/01/2025', '31/12/2026', 'Ativo']
  ]);
  sheet.getRange(2, 1, 1, 10).setFontColor('#999999');
  sheet.getRange(2, 1, 1, 10).setFontStyle('italic');

  Logger.log('✅ Aba "' + ABA_CONSELHEIROS + '" configurada');
}

/**
 * Cria a aba de Configurações
 * @param {SpreadsheetApp.Spreadsheet} ss - Planilha
 */
function criarAbaConfiguracoes(ss) {
  let sheet = ss.getSheetByName(ABA_CONFIGURACOES);

  if (!sheet) {
    sheet = ss.insertSheet(ABA_CONFIGURACOES);
  }

  // Limpar e configurar
  sheet.clear();

  // Configurações
  const configs = [
    ['CONFIGURAÇÕES DO SISTEMA', ''],
    ['', ''],
    ['Parâmetro', 'Valor'],
    ['Prazo padrão (dias)', PRAZO_PADRAO_DIAS],
    ['Alerta (dias antes)', ALERTA_DIAS_ANTES],
    ['E-mail CAS/DF', EMAIL_CASDF],
    ['E-mail Administrador', EMAIL_ADMIN],
    ['', ''],
    ['LINKS', ''],
    ['Formulário de Fiscalização', LINK_FORMULARIO_FISCALIZACAO],
    ['Formulário de Designação', 'https://docs.google.com/forms/d/' + FORM_DESIGNACAO_ID + '/viewform'],
    ['', ''],
    ['INSTRUÇÕES', ''],
    ['1. Cadastre os conselheiros na aba "Conselheiros"', ''],
    ['2. Use o Formulário de Designação para criar novos processos', ''],
    ['3. O sistema enviará alertas automáticos de prazo', ''],
    ['4. Quando o conselheiro preencher o relatório, o status será atualizado', '']
  ];

  sheet.getRange(1, 1, configs.length, 2).setValues(configs);

  // Formatação do título
  sheet.getRange(1, 1, 1, 2).merge();
  sheet.getRange(1, 1).setBackground('#1a237e');
  sheet.getRange(1, 1).setFontColor('#ffffff');
  sheet.getRange(1, 1).setFontWeight('bold');
  sheet.getRange(1, 1).setFontSize(14);

  // Formatação dos sub-títulos
  sheet.getRange(3, 1, 1, 2).setBackground('#e8eaf6');
  sheet.getRange(3, 1, 1, 2).setFontWeight('bold');

  sheet.getRange(9, 1).setBackground('#e8eaf6');
  sheet.getRange(9, 1).setFontWeight('bold');

  sheet.getRange(13, 1).setBackground('#e8eaf6');
  sheet.getRange(13, 1).setFontWeight('bold');

  // Largura das colunas
  sheet.setColumnWidth(1, 300);
  sheet.setColumnWidth(2, 400);

  Logger.log('✅ Aba "' + ABA_CONFIGURACOES + '" configurada');
}

/**
 * Lista os conselheiros ativos para o formulário
 * @returns {Array} Lista de nomes de conselheiros ativos
 */
function listarConselheirosAtivos() {
  const sheet = SpreadsheetApp.openById(SHEET_CONTROLE_ID).getSheetByName(ABA_CONSELHEIROS);
  const dados = sheet.getDataRange().getValues();
  const conselheiros = [];

  for (let i = 1; i < dados.length; i++) {
    const nome = dados[i][0];
    const status = dados[i][9]; // Coluna J (índice 9) - Status

    if (nome && nome !== '[Nome do Conselheiro]' && status === 'Ativo') {
      conselheiros.push(nome);
    }
  }

  return conselheiros;
}

// ════════════════════════════════════════════════════════════════════════════
// NOVAS ABAS - FASE 2
// ════════════════════════════════════════════════════════════════════════════

// Nomes das novas abas
const ABA_DASHBOARD = "Dashboard";
const ABA_ENTIDADES = "Cadastro de Entidades";

/**
 * Configura todas as abas da planilha (versão completa)
 */
function configurarPlanilhaCompleta() {
  const ss = SpreadsheetApp.openById(SHEET_CONTROLE_ID);

  // Criar/configurar todas as abas
  criarAbaDashboard(ss);
  criarAbaCadastroEntidades(ss);
  criarAbaControle(ss);
  criarAbaConselheiros(ss);
  criarAbaConfiguracoes(ss);

  // Remover aba padrão "Sheet1" se existir
  const sheet1 = ss.getSheetByName('Sheet1');
  if (sheet1) {
    ss.deleteSheet(sheet1);
  }

  Logger.log('✅ Planilha completa configurada com sucesso!');
}

/**
 * Cria a aba Dashboard
 * @param {SpreadsheetApp.Spreadsheet} ss - Planilha
 */
function criarAbaDashboard(ss) {
  let sheet = ss.getSheetByName(ABA_DASHBOARD);

  if (!sheet) {
    sheet = ss.insertSheet(ABA_DASHBOARD, 0); // Primeira aba
  }

  sheet.clear();

  // ═══════════════════════════════════════════════════════════════════
  // TÍTULO
  // ═══════════════════════════════════════════════════════════════════
  sheet.getRange('A1:H1').merge();
  sheet.getRange('A1').setValue('📊 DASHBOARD - SISTEMA DE GESTÃO CAS/DF');
  sheet.getRange('A1').setBackground('#1a237e');
  sheet.getRange('A1').setFontColor('#ffffff');
  sheet.getRange('A1').setFontSize(16);
  sheet.getRange('A1').setFontWeight('bold');
  sheet.getRange('A1').setHorizontalAlignment('center');

  sheet.getRange('A2:H2').merge();
  sheet.getRange('A2').setValue('Atualizado automaticamente | Última atualização: ' + new Date().toLocaleString('pt-BR'));
  sheet.getRange('A2').setFontSize(10);
  sheet.getRange('A2').setFontColor('#666666');
  sheet.getRange('A2').setHorizontalAlignment('center');

  // ═══════════════════════════════════════════════════════════════════
  // SEÇÃO 1: FISCALIZAÇÕES
  // ═══════════════════════════════════════════════════════════════════
  sheet.getRange('A4:H4').merge();
  sheet.getRange('A4').setValue('📋 FISCALIZAÇÕES');
  sheet.getRange('A4').setBackground('#e8eaf6');
  sheet.getRange('A4').setFontWeight('bold');
  sheet.getRange('A4').setFontSize(12);

  // Cards de fiscalização
  const cardsFiscalizacao = [
    ['Total', 'Designados', 'Aguardando', 'Concluídos', 'Atrasados', '', '', ''],
    [
      '=COUNTA(\'Controle de Fiscalizações\'!A2:A)',
      '=COUNTIF(\'Controle de Fiscalizações\'!K2:K;"*Designado*")',
      '=COUNTIF(\'Controle de Fiscalizações\'!K2:K;"*Aguardando*")',
      '=COUNTIF(\'Controle de Fiscalizações\'!K2:K;"*Concluído*")',
      '=COUNTIF(\'Controle de Fiscalizações\'!J2:J;"*Atrasado*")',
      '', '', ''
    ]
  ];
  sheet.getRange('A5:H6').setValues(cardsFiscalizacao);
  sheet.getRange('A5:E5').setBackground('#f5f5f5');
  sheet.getRange('A5:E5').setFontWeight('bold');
  sheet.getRange('A5:E5').setHorizontalAlignment('center');
  sheet.getRange('A6:E6').setFontSize(20);
  sheet.getRange('A6:E6').setFontWeight('bold');
  sheet.getRange('A6:E6').setHorizontalAlignment('center');

  // Cores dos cards
  sheet.getRange('A6').setFontColor('#1a237e'); // Total - azul
  sheet.getRange('B6').setFontColor('#ff9800'); // Designados - laranja
  sheet.getRange('C6').setFontColor('#ffc107'); // Aguardando - amarelo
  sheet.getRange('D6').setFontColor('#4caf50'); // Concluídos - verde
  sheet.getRange('E6').setFontColor('#f44336'); // Atrasados - vermelho

  // ═══════════════════════════════════════════════════════════════════
  // SEÇÃO 2: VOTOS
  // ═══════════════════════════════════════════════════════════════════
  sheet.getRange('A8:H8').merge();
  sheet.getRange('A8').setValue('⚖️ RESULTADO DOS VOTOS (Fiscalizações Concluídas)');
  sheet.getRange('A8').setBackground('#e8eaf6');
  sheet.getRange('A8').setFontWeight('bold');
  sheet.getRange('A8').setFontSize(12);

  // Nota: Os votos virão da planilha de respostas do formulário de fiscalização
  const cardsVotos = [
    ['Favorável', 'Favorável c/ Ressalvas', 'Desfavorável', 'Diligência', '', '', '', ''],
    [
      '=IFERROR(COUNTIF(\'Respostas\'!$AZ:$AZ;"*FAVORÁVEL - A entidade*");0)',
      '=IFERROR(COUNTIF(\'Respostas\'!$AZ:$AZ;"*FAVORÁVEL COM RESSALVAS*");0)',
      '=IFERROR(COUNTIF(\'Respostas\'!$AZ:$AZ;"*DESFAVORÁVEL*");0)',
      '=IFERROR(COUNTIF(\'Respostas\'!$AZ:$AZ;"*DILIGÊNCIA*");0)',
      '', '', '', ''
    ]
  ];
  sheet.getRange('A9:H10').setValues(cardsVotos);
  sheet.getRange('A9:D9').setBackground('#f5f5f5');
  sheet.getRange('A9:D9').setFontWeight('bold');
  sheet.getRange('A9:D9').setHorizontalAlignment('center');
  sheet.getRange('A10:D10').setFontSize(20);
  sheet.getRange('A10:D10').setFontWeight('bold');
  sheet.getRange('A10:D10').setHorizontalAlignment('center');

  // Cores dos votos
  sheet.getRange('A10').setFontColor('#4caf50'); // Favorável - verde
  sheet.getRange('B10').setFontColor('#ff9800'); // Com ressalvas - laranja
  sheet.getRange('C10').setFontColor('#f44336'); // Desfavorável - vermelho
  sheet.getRange('D10').setFontColor('#9c27b0'); // Diligência - roxo

  // ═══════════════════════════════════════════════════════════════════
  // SEÇÃO 3: COMPOSIÇÃO DO CONSELHO
  // ═══════════════════════════════════════════════════════════════════
  sheet.getRange('A12:H12').merge();
  sheet.getRange('A12').setValue('👥 COMPOSIÇÃO DO CONSELHO');
  sheet.getRange('A12').setBackground('#e8eaf6');
  sheet.getRange('A12').setFontWeight('bold');
  sheet.getRange('A12').setFontSize(12);

  const cardsConselho = [
    ['Total Ativos', 'Governo', 'Sociedade Civil', 'Titulares', 'Suplentes', '', '', ''],
    [
      '=COUNTIF(Conselheiros!J2:J;"Ativo")',
      '=COUNTIFS(Conselheiros!E2:E;"Governo";Conselheiros!J2:J;"Ativo")',
      '=COUNTIFS(Conselheiros!E2:E;"Sociedade Civil";Conselheiros!J2:J;"Ativo")',
      '=COUNTIFS(Conselheiros!G2:G;"Titular";Conselheiros!J2:J;"Ativo")',
      '=COUNTIFS(Conselheiros!G2:G;"Suplente";Conselheiros!J2:J;"Ativo")',
      '', '', ''
    ]
  ];
  sheet.getRange('A13:H14').setValues(cardsConselho);
  sheet.getRange('A13:E13').setBackground('#f5f5f5');
  sheet.getRange('A13:E13').setFontWeight('bold');
  sheet.getRange('A13:E13').setHorizontalAlignment('center');
  sheet.getRange('A14:E14').setFontSize(20);
  sheet.getRange('A14:E14').setFontWeight('bold');
  sheet.getRange('A14:E14').setHorizontalAlignment('center');

  // Cores
  sheet.getRange('A14').setFontColor('#1a237e');
  sheet.getRange('B14').setFontColor('#1565c0'); // Governo - azul
  sheet.getRange('C14').setFontColor('#e65100'); // Sociedade Civil - laranja
  sheet.getRange('D14').setFontColor('#2e7d32');
  sheet.getRange('E14').setFontColor('#7b1fa2');

  // ═══════════════════════════════════════════════════════════════════
  // SEÇÃO 4: ENTIDADES
  // ═══════════════════════════════════════════════════════════════════
  sheet.getRange('A16:H16').merge();
  sheet.getRange('A16').setValue('🏢 ENTIDADES CADASTRADAS');
  sheet.getRange('A16').setBackground('#e8eaf6');
  sheet.getRange('A16').setFontWeight('bold');
  sheet.getRange('A16').setFontSize(12);

  const cardsEntidades = [
    ['Total', 'Inscrição Ativa', 'Inscrição Vencida', 'Com Parceria SEDES', 'Com Emenda Parlamentar', '', '', ''],
    [
      '=COUNTA(\'Cadastro de Entidades\'!A2:A)',
      '=COUNTIF(\'Cadastro de Entidades\'!K2:K;"Ativa")',
      '=COUNTIF(\'Cadastro de Entidades\'!K2:K;"Vencida")',
      '=COUNTIF(\'Cadastro de Entidades\'!M2:M;"Sim")',
      '=COUNTIF(\'Cadastro de Entidades\'!T2:T;"Sim")',
      '', '', ''
    ]
  ];
  sheet.getRange('A17:H18').setValues(cardsEntidades);
  sheet.getRange('A17:E17').setBackground('#f5f5f5');
  sheet.getRange('A17:E17').setFontWeight('bold');
  sheet.getRange('A17:E17').setHorizontalAlignment('center');
  sheet.getRange('A18:E18').setFontSize(20);
  sheet.getRange('A18:E18').setFontWeight('bold');
  sheet.getRange('A18:E18').setHorizontalAlignment('center');

  // Cores
  sheet.getRange('A18').setFontColor('#1a237e');
  sheet.getRange('B18').setFontColor('#4caf50');
  sheet.getRange('C18').setFontColor('#f44336');
  sheet.getRange('D18').setFontColor('#1565c0');
  sheet.getRange('E18').setFontColor('#7b1fa2');

  // ═══════════════════════════════════════════════════════════════════
  // SEÇÃO 5: RECURSOS FINANCEIROS
  // ═══════════════════════════════════════════════════════════════════
  sheet.getRange('A20:H20').merge();
  sheet.getRange('A20').setValue('💰 RECURSOS FINANCEIROS');
  sheet.getRange('A20').setBackground('#e8eaf6');
  sheet.getRange('A20').setFontWeight('bold');
  sheet.getRange('A20').setFontSize(12);

  const cardsFinanceiro = [
    ['Total Parcerias SEDES', 'Total Emendas Parlamentares', '', '', '', '', '', ''],
    [
      '=IFERROR(TEXT(SUMIF(\'Cadastro de Entidades\'!M2:M;"Sim";\'Cadastro de Entidades\'!R2:R);"R$ #.##0,00");"R$ 0,00")',
      '=IFERROR(TEXT(SUMIF(\'Cadastro de Entidades\'!T2:T;"Sim";\'Cadastro de Entidades\'!W2:W);"R$ #.##0,00");"R$ 0,00")',
      '', '', '', '', '', ''
    ]
  ];
  sheet.getRange('A21:H22').setValues(cardsFinanceiro);
  sheet.getRange('A21:B21').setBackground('#f5f5f5');
  sheet.getRange('A21:B21').setFontWeight('bold');
  sheet.getRange('A21:B21').setHorizontalAlignment('center');
  sheet.getRange('A22:B22').setFontSize(16);
  sheet.getRange('A22:B22').setFontWeight('bold');
  sheet.getRange('A22:B22').setHorizontalAlignment('center');
  sheet.getRange('A22').setFontColor('#1565c0');
  sheet.getRange('B22').setFontColor('#7b1fa2');

  // Largura das colunas
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 180);
  sheet.setColumnWidth(4, 180);
  sheet.setColumnWidth(5, 180);

  // Altura das linhas de título
  sheet.setRowHeight(1, 40);

  Logger.log('✅ Aba "' + ABA_DASHBOARD + '" configurada');
}

/**
 * Cria a aba de Cadastro de Entidades
 * @param {SpreadsheetApp.Spreadsheet} ss - Planilha
 */
function criarAbaCadastroEntidades(ss) {
  let sheet = ss.getSheetByName(ABA_ENTIDADES);

  if (!sheet) {
    sheet = ss.insertSheet(ABA_ENTIDADES, 1); // Segunda aba
  }

  sheet.clear();

  // Cabeçalhos organizados em grupos
  const cabecalhos = [
    // DADOS DA ENTIDADE (A-H)
    'Nome da Entidade',           // A
    'CNPJ',                       // B
    'Endereço',                   // C
    'Telefone',                   // D
    'E-mail',                     // E
    'Responsável Legal',          // F
    'CPF Responsável',            // G
    'Área de Atuação',            // H

    // INSCRIÇÃO CAS/DF (I-L)
    'Nº Inscrição CAS/DF',        // I
    'Data Inscrição',             // J
    'Situação Inscrição',         // K
    'Validade Inscrição',         // L

    // PARCERIA SEDES (M-S)
    'Tem Parceria SEDES?',        // M
    'Tipo de Parceria',           // N
    'Nº Contrato/Termo',          // O
    'Nº Processo SEI',            // P
    'Objeto da Parceria',         // Q
    'Valor do Contrato',          // R
    'Vigência Parceria',          // S

    // EMENDA PARLAMENTAR (T-Y)
    'Recebeu Emenda?',            // T
    'Parlamentar',                // U
    'Nº da Emenda',               // V
    'Valor da Emenda',            // W
    'Ano Emenda',                 // X
    'Objeto Emenda',              // Y

    // HISTÓRICO (Z-AB)
    'Última Fiscalização',        // Z
    'Resultado Última Fisc.',     // AA
    'Observações'                 // AB
  ];

  // Inserir cabeçalhos
  sheet.getRange(1, 1, 1, cabecalhos.length).setValues([cabecalhos]);

  // Formatação do cabeçalho
  const headerRange = sheet.getRange(1, 1, 1, cabecalhos.length);
  headerRange.setBackground('#1a237e');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setWrap(true);

  // Cores de fundo para grupos de colunas (linha 1)
  sheet.getRange(1, 1, 1, 8).setBackground('#1a237e');   // Dados da Entidade
  sheet.getRange(1, 9, 1, 4).setBackground('#283593');   // Inscrição CAS/DF
  sheet.getRange(1, 13, 1, 7).setBackground('#303f9f');  // Parceria SEDES
  sheet.getRange(1, 20, 1, 6).setBackground('#3949ab');  // Emenda Parlamentar
  sheet.getRange(1, 26, 1, 3).setBackground('#3f51b5');  // Histórico

  // Largura das colunas
  sheet.setColumnWidth(1, 250);  // Nome da Entidade
  sheet.setColumnWidth(2, 150);  // CNPJ
  sheet.setColumnWidth(3, 250);  // Endereço
  sheet.setColumnWidth(4, 130);  // Telefone
  sheet.setColumnWidth(5, 200);  // E-mail
  sheet.setColumnWidth(6, 180);  // Responsável Legal
  sheet.setColumnWidth(7, 130);  // CPF Responsável
  sheet.setColumnWidth(8, 150);  // Área de Atuação
  sheet.setColumnWidth(9, 130);  // Nº Inscrição
  sheet.setColumnWidth(10, 110); // Data Inscrição
  sheet.setColumnWidth(11, 120); // Situação Inscrição
  sheet.setColumnWidth(12, 120); // Validade Inscrição
  sheet.setColumnWidth(13, 130); // Tem Parceria?
  sheet.setColumnWidth(14, 150); // Tipo de Parceria
  sheet.setColumnWidth(15, 140); // Nº Contrato
  sheet.setColumnWidth(16, 150); // Nº Processo SEI
  sheet.setColumnWidth(17, 200); // Objeto Parceria
  sheet.setColumnWidth(18, 130); // Valor Contrato
  sheet.setColumnWidth(19, 120); // Vigência
  sheet.setColumnWidth(20, 130); // Recebeu Emenda?
  sheet.setColumnWidth(21, 150); // Parlamentar
  sheet.setColumnWidth(22, 120); // Nº Emenda
  sheet.setColumnWidth(23, 130); // Valor Emenda
  sheet.setColumnWidth(24, 100); // Ano Emenda
  sheet.setColumnWidth(25, 200); // Objeto Emenda
  sheet.setColumnWidth(26, 120); // Última Fiscalização
  sheet.setColumnWidth(27, 150); // Resultado
  sheet.setColumnWidth(28, 200); // Observações

  // Congelar cabeçalho e primeira coluna
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(1);

  // Altura do cabeçalho
  sheet.setRowHeight(1, 50);

  // ═══════════════════════════════════════════════════════════════════
  // VALIDAÇÕES DE DADOS
  // ═══════════════════════════════════════════════════════════════════

  // Área de Atuação (H)
  const areaRange = sheet.getRange('H2:H500');
  const areaRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Assistência Social', 'Saúde', 'Educação', 'Múltiplas Áreas'], true)
    .setAllowInvalid(false)
    .build();
  areaRange.setDataValidation(areaRule);

  // Situação Inscrição (K)
  const situacaoRange = sheet.getRange('K2:K500');
  const situacaoRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Ativa', 'Vencida', 'Suspensa', 'Cancelada', 'Em Análise'], true)
    .setAllowInvalid(false)
    .build();
  situacaoRange.setDataValidation(situacaoRule);

  // Tem Parceria SEDES? (M)
  const parceriaRange = sheet.getRange('M2:M500');
  const parceriaRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Sim', 'Não'], true)
    .setAllowInvalid(false)
    .build();
  parceriaRange.setDataValidation(parceriaRule);

  // Tipo de Parceria (N)
  const tipoRange = sheet.getRange('N2:N500');
  const tipoRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Convênio', 'Termo de Fomento', 'Termo de Colaboração', 'Acordo de Cooperação', 'Contrato', 'Outro'], true)
    .setAllowInvalid(false)
    .build();
  tipoRange.setDataValidation(tipoRule);

  // Recebeu Emenda? (T)
  const emendaRange = sheet.getRange('T2:T500');
  const emendaRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Sim', 'Não'], true)
    .setAllowInvalid(false)
    .build();
  emendaRange.setDataValidation(emendaRule);

  // Resultado Última Fiscalização (AA)
  const resultadoRange = sheet.getRange('AA2:AA500');
  const resultadoRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Favorável', 'Favorável com Ressalvas', 'Desfavorável', 'Diligência', 'Não fiscalizada'], true)
    .setAllowInvalid(false)
    .build();
  resultadoRange.setDataValidation(resultadoRule);

  // ═══════════════════════════════════════════════════════════════════
  // FORMATAÇÃO CONDICIONAL
  // ═══════════════════════════════════════════════════════════════════

  // Situação Inscrição - cores
  const ruleAtiva = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Ativa')
    .setBackground('#c8e6c9')
    .setRanges([situacaoRange])
    .build();

  const ruleVencida = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Vencida')
    .setBackground('#ffcdd2')
    .setRanges([situacaoRange])
    .build();

  const ruleSuspensa = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Suspensa')
    .setBackground('#fff9c4')
    .setRanges([situacaoRange])
    .build();

  // Tem Parceria - cores
  const ruleParceriaSim = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Sim')
    .setBackground('#bbdefb')
    .setRanges([parceriaRange])
    .build();

  // Recebeu Emenda - cores
  const ruleEmendaSim = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Sim')
    .setBackground('#e1bee7')
    .setRanges([emendaRange])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(ruleAtiva, ruleVencida, ruleSuspensa, ruleParceriaSim, ruleEmendaSim);
  sheet.setConditionalFormatRules(rules);

  // Exemplo de linha (em itálico cinza)
  sheet.getRange(2, 1, 1, 28).setValues([[
    '[Nome da Entidade]',
    '[00.000.000/0000-00]',
    '[Endereço completo]',
    '(61) 0000-0000',
    '[email@entidade.org]',
    '[Nome do Responsável]',
    '[000.000.000-00]',
    'Assistência Social',
    '[000/2025]',
    '01/01/2025',
    'Ativa',
    '01/01/2027',
    'Sim',
    'Termo de Fomento',
    '[000/2025]',
    '[00000.000000/2025-00]',
    '[Descrição do objeto]',
    '100000',
    '31/12/2025',
    'Sim',
    '[Nome do Parlamentar]',
    '[0000]',
    '50000',
    '2025',
    '[Finalidade da emenda]',
    '15/03/2025',
    'Favorável',
    '[Observações]'
  ]]);
  sheet.getRange(2, 1, 1, 28).setFontColor('#999999');
  sheet.getRange(2, 1, 1, 28).setFontStyle('italic');

  // Formato de moeda para valores
  sheet.getRange('R2:R500').setNumberFormat('R$ #,##0.00');
  sheet.getRange('W2:W500').setNumberFormat('R$ #,##0.00');

  Logger.log('✅ Aba "' + ABA_ENTIDADES + '" configurada');
}

/**
 * Atualiza a data do Dashboard
 */
function atualizarDashboard() {
  const ss = SpreadsheetApp.openById(SHEET_CONTROLE_ID);
  const sheet = ss.getSheetByName(ABA_DASHBOARD);

  if (sheet) {
    sheet.getRange('A2').setValue('Atualizado automaticamente | Última atualização: ' + new Date().toLocaleString('pt-BR'));
  }
}
