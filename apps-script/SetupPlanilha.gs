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

  // Criar/configurar abas
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
  const cabecalhos = ['Nome Completo', 'E-mail', 'Telefone', 'Status'];

  // Inserir cabeçalhos
  sheet.getRange(1, 1, 1, cabecalhos.length).setValues([cabecalhos]);

  // Formatação do cabeçalho
  const headerRange = sheet.getRange(1, 1, 1, cabecalhos.length);
  headerRange.setBackground('#1a237e');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');

  // Largura das colunas
  sheet.setColumnWidth(1, 250); // Nome
  sheet.setColumnWidth(2, 250); // E-mail
  sheet.setColumnWidth(3, 150); // Telefone
  sheet.setColumnWidth(4, 100); // Status

  // Congelar cabeçalho
  sheet.setFrozenRows(1);

  // Validação de dados para Status
  const statusRange = sheet.getRange('D2:D100');
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Ativo', 'Inativo'], true)
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(statusRule);

  // Adicionar alguns exemplos (comentados)
  sheet.getRange(2, 1, 1, 4).setValues([
    ['[Nome do Conselheiro]', '[email@exemplo.com]', '(61) 99999-0000', 'Ativo']
  ]);
  sheet.getRange(2, 1, 1, 4).setFontColor('#999999');
  sheet.getRange(2, 1, 1, 4).setFontStyle('italic');

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
    const status = dados[i][3];

    if (nome && status === 'Ativo') {
      conselheiros.push(nome);
    }
  }

  return conselheiros;
}
