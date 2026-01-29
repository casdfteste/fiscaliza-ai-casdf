/**
 * SISTEMA DE DESIGNAÇÃO E CONTROLE - CAS/DF
 * Arquivo: SetupFormularioDesignacao.gs
 * Descrição: Criação automática do formulário de designação
 * Versão: 1.0
 */

/**
 * Cria o formulário de designação automaticamente
 * Executar uma vez para criar o formulário
 * @returns {string} ID do formulário criado
 */
function criarFormularioDesignacao() {
  // Criar formulário
  const form = FormApp.create('Designação de Fiscalização - CAS/DF');

  form.setDescription(
    'Formulário para a Secretaria Executiva designar conselheiros para fiscalização.\n\n' +
    'Após o preenchimento, o conselheiro receberá um e-mail com os dados da designação ' +
    'e o link para o formulário de fiscalização.'
  );

  form.setConfirmationMessage(
    '✅ Designação registrada com sucesso!\n\n' +
    'O conselheiro receberá um e-mail com as informações do processo.'
  );

  // Permitir apenas uma resposta por sessão (mas múltiplas no geral)
  form.setLimitOneResponsePerUser(false);

  // ========================================
  // SEÇÃO 1: DADOS DO CONSELHEIRO
  // ========================================

  form.addSectionHeaderItem()
    .setTitle('📋 Dados do Conselheiro');

  // Campo: Conselheiro (dropdown)
  const conselheiroItem = form.addListItem()
    .setTitle('Conselheiro')
    .setHelpText('Selecione o conselheiro que realizará a fiscalização')
    .setRequired(true);

  // Buscar conselheiros da planilha (se já existir)
  try {
    const conselheiros = listarConselheirosAtivos();
    if (conselheiros.length > 0) {
      conselheiroItem.setChoiceValues(conselheiros);
    } else {
      conselheiroItem.setChoiceValues(['[Cadastre conselheiros na planilha]']);
    }
  } catch (e) {
    conselheiroItem.setChoiceValues(['[Cadastre conselheiros na planilha]']);
  }

  // ========================================
  // SEÇÃO 2: DADOS DA ENTIDADE
  // ========================================

  form.addSectionHeaderItem()
    .setTitle('🏢 Dados da Entidade');

  form.addTextItem()
    .setTitle('Entidade a Fiscalizar')
    .setHelpText('Nome completo da entidade que será fiscalizada')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Nº do Processo')
    .setHelpText('Número do processo administrativo')
    .setRequired(true);

  // ========================================
  // SEÇÃO 3: DADOS DA REUNIÃO PLENÁRIA
  // ========================================

  form.addSectionHeaderItem()
    .setTitle('📅 Dados da Reunião Plenária');

  form.addTextItem()
    .setTitle('Nº da Reunião Plenária')
    .setHelpText('Número da reunião onde foi feita a distribuição (ex: 347)')
    .setRequired(true);

  form.addDateItem()
    .setTitle('Data da Reunião Plenária')
    .setHelpText('Data em que ocorreu a reunião')
    .setRequired(true);

  // ========================================
  // SEÇÃO 4: DOCUMENTOS
  // ========================================

  form.addSectionHeaderItem()
    .setTitle('📎 Documentos');

  form.addTextItem()
    .setTitle('Link dos Documentos (Google Drive)')
    .setHelpText('Cole o link da pasta ou arquivo no Google Drive com os documentos do processo')
    .setRequired(true);

  // ========================================
  // SEÇÃO 5: OBSERVAÇÕES
  // ========================================

  form.addSectionHeaderItem()
    .setTitle('📝 Observações');

  form.addParagraphTextItem()
    .setTitle('Observações')
    .setHelpText('Informações adicionais sobre o processo (opcional)')
    .setRequired(false);

  // ========================================
  // FINALIZAÇÃO
  // ========================================

  const formId = form.getId();
  const formUrl = form.getEditUrl();
  const formPublicUrl = form.getPublishedUrl();

  Logger.log('✅ Formulário de Designação criado com sucesso!');
  Logger.log('ID: ' + formId);
  Logger.log('URL de edição: ' + formUrl);
  Logger.log('URL pública: ' + formPublicUrl);
  Logger.log('');
  Logger.log('⚠️ IMPORTANTE: Atualize o FORM_DESIGNACAO_ID no arquivo ConfigDesignacao.gs com o ID: ' + formId);

  return formId;
}

/**
 * Atualiza a lista de conselheiros no formulário de designação
 * Executar sempre que adicionar/remover conselheiros
 */
function atualizarConselheirosFormulario() {
  if (!FORM_DESIGNACAO_ID) {
    Logger.log('❌ FORM_DESIGNACAO_ID não configurado');
    return;
  }

  const form = FormApp.openById(FORM_DESIGNACAO_ID);
  const items = form.getItems();

  // Encontrar o campo de conselheiro
  for (let i = 0; i < items.length; i++) {
    if (items[i].getTitle() === 'Conselheiro') {
      const listItem = items[i].asListItem();
      const conselheiros = listarConselheirosAtivos();

      if (conselheiros.length > 0) {
        listItem.setChoiceValues(conselheiros);
        Logger.log('✅ Lista de conselheiros atualizada: ' + conselheiros.length + ' conselheiros');
      } else {
        Logger.log('⚠️ Nenhum conselheiro ativo encontrado');
      }

      return;
    }
  }

  Logger.log('❌ Campo "Conselheiro" não encontrado no formulário');
}

/**
 * Cria a planilha de controle automaticamente
 * @returns {string} ID da planilha criada
 */
function criarPlanilhaControle() {
  const ss = SpreadsheetApp.create('Controle de Fiscalizações - CAS/DF');

  const sheetId = ss.getId();
  const sheetUrl = ss.getUrl();

  Logger.log('✅ Planilha de Controle criada com sucesso!');
  Logger.log('ID: ' + sheetId);
  Logger.log('URL: ' + sheetUrl);
  Logger.log('');
  Logger.log('⚠️ IMPORTANTE: Atualize o SHEET_CONTROLE_ID no arquivo ConfigDesignacao.gs com o ID: ' + sheetId);

  return sheetId;
}

/**
 * Setup completo do sistema
 * Cria planilha, formulário e configura tudo
 */
function setupCompleto() {
  Logger.log('=== SETUP COMPLETO DO SISTEMA ===');
  Logger.log('');

  // 1. Criar planilha
  Logger.log('1. Criando planilha de controle...');
  const sheetId = criarPlanilhaControle();

  // 2. Criar formulário
  Logger.log('');
  Logger.log('2. Criando formulário de designação...');
  const formId = criarFormularioDesignacao();

  Logger.log('');
  Logger.log('=== PRÓXIMOS PASSOS ===');
  Logger.log('');
  Logger.log('1. Abra o arquivo ConfigDesignacao.gs');
  Logger.log('2. Atualize as constantes:');
  Logger.log('   FORM_DESIGNACAO_ID = "' + formId + '"');
  Logger.log('   SHEET_CONTROLE_ID = "' + sheetId + '"');
  Logger.log('');
  Logger.log('3. Execute: configurarPlanilhaControle()');
  Logger.log('4. Execute: instalarTriggerDesignacao()');
  Logger.log('5. Execute: instalarTriggerPrazos()');
  Logger.log('');
  Logger.log('6. Cadastre os conselheiros na aba "Conselheiros"');
  Logger.log('7. Execute: atualizarConselheirosFormulario()');
  Logger.log('');
  Logger.log('=== SETUP CONCLUÍDO ===');
}
