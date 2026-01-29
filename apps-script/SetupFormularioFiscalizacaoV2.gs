/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: SetupFormularioFiscalizacaoV2.gs
 * Descrição: Cria formulário de fiscalização reorganizado (versão didática)
 * Versão: 2.0
 */

/**
 * Cria o formulário de fiscalização versão 2.0 (didático)
 * Estrutura em 10 etapas com fotos integradas em cada seção
 */
function criarFormularioFiscalizacaoV2() {

  // Criar formulário
  const form = FormApp.create('Relatório de Fiscalização - CAS/DF v2.0');

  form.setDescription(
    '📋 ROTEIRO DE FISCALIZAÇÃO\n\n' +
    'Este formulário vai te guiar durante a visita de fiscalização.\n' +
    'Siga as etapas na ordem e tire as fotos quando solicitado.\n\n' +
    '📱 USE NO CELULAR para tirar as fotos diretamente\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '📸 IMPORTANTE SOBRE AS FOTOS:\n' +
    '• Use a câmera no modo NORMAL\n' +
    '• NÃO use modo HD, 4K ou profissional\n' +
    '• Fotos simples enviam mais rápido!\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  );

  form.setConfirmationMessage(
    '✅ RELATÓRIO ENVIADO COM SUCESSO!\n\n' +
    'Seu relatório será processado e enviado automaticamente para o CAS/DF.\n' +
    'Você receberá uma cópia por e-mail.\n\n' +
    'Obrigado pela fiscalização!'
  );

  form.setProgressBar(true); // Mostra barra de progresso
  form.setLimitOneResponsePerUser(false);

  // ════════════════════════════════════════════════════════════════════
  // ETAPA 1: ANTES DE COMEÇAR
  // ════════════════════════════════════════════════════════════════════

  form.addSectionHeaderItem()
    .setTitle('📝 ETAPA 1: ANTES DE COMEÇAR')
    .setHelpText('Preencha seus dados antes de iniciar a visita.');

  form.addListItem()
    .setTitle('Nome do(a) Conselheiro(a)')
    .setHelpText('Selecione seu nome na lista')
    .setRequired(true)
    .setChoiceValues([
      '[Cadastre os conselheiros no sistema]'
    ]);

  form.addTextItem()
    .setTitle('E-mail do(a) Conselheiro(a)')
    .setHelpText('Digite seu e-mail para receber uma cópia do relatório')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Nome da Instituição Fiscalizada')
    .setHelpText('Nome completo da entidade que você vai fiscalizar')
    .setRequired(true);

  form.addListItem()
    .setTitle('Tipo de Processo')
    .setHelpText('Selecione o tipo de processo')
    .setRequired(true)
    .setChoiceValues([
      'Inscrição',
      'Renovação de Inscrição',
      'Acompanhamento'
    ]);

  form.addTextItem()
    .setTitle('Qual o ano do acompanhamento?')
    .setHelpText('Ex: 2025')
    .setRequired(false);

  form.addListItem()
    .setTitle('Modalidade da Inscrição')
    .setRequired(true)
    .setChoiceValues([
      'Assistência Social',
      'Saúde',
      'Educação',
      'Outra'
    ]);

  form.addTextItem()
    .setTitle('Nome do Serviço/Oferta Fiscalizada')
    .setHelpText('Nome do serviço ou programa oferecido pela entidade')
    .setRequired(true);

  form.addPageBreakItem()
    .setTitle('Próxima etapa: Chegada na Entidade');

  // ════════════════════════════════════════════════════════════════════
  // ETAPA 2: CHEGADA NA ENTIDADE
  // ════════════════════════════════════════════════════════════════════

  form.addSectionHeaderItem()
    .setTitle('🏢 ETAPA 2: CHEGADA NA ENTIDADE')
    .setHelpText('Você chegou! Registre as informações da chegada e tire a primeira foto.');

  form.addTextItem()
    .setTitle('Endereço Completo')
    .setHelpText('Endereço da entidade (rua, número, bairro, cidade)')
    .setRequired(true);

  form.addDateItem()
    .setTitle('Data da Visita')
    .setHelpText('Data de hoje')
    .setRequired(true);

  form.addTimeItem()
    .setTitle('Horário da Visita')
    .setHelpText('Que horas você chegou?')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Quem recebeu o(a) conselheiro(a)?')
    .setHelpText('Nome e cargo da pessoa que te recebeu')
    .setRequired(true);

  form.addSectionHeaderItem()
    .setTitle('📸 FOTO DA FACHADA')
    .setHelpText('Tire uma foto da entrada/fachada da entidade AGORA');

  form.addFileUploadItem()
    .setTitle('📸 Foto da Fachada/Entrada')
    .setHelpText('💡 DICA: Use a câmera no modo NORMAL (não use HD, 4K ou modo profissional). Uma foto simples é suficiente!')
    .setRequired(true)
    .setAllowedFileTypes([FormApp.FileType.IMAGE]);

  form.addPageBreakItem()
    .setTitle('Próxima etapa: Documentação');

  // ════════════════════════════════════════════════════════════════════
  // ETAPA 3: DOCUMENTAÇÃO
  // ════════════════════════════════════════════════════════════════════

  form.addSectionHeaderItem()
    .setTitle('📄 ETAPA 3: DOCUMENTAÇÃO')
    .setHelpText('Peça para ver os documentos da entidade (Licença, Alvará, etc.)');

  form.addMultipleChoiceItem()
    .setTitle('Licença de Funcionamento ou Laudo Técnico')
    .setHelpText('A entidade possui licença de funcionamento válida?')
    .setRequired(true)
    .setChoiceValues([
      'Sim, possui licença válida',
      'Sim, mas está vencida',
      'Não possui licença',
      'Está em processo de obtenção',
      'Possui Laudo Técnico'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('É executada em unidade pública cedida?')
    .setHelpText('O serviço funciona em um prédio público (escola, centro comunitário, etc.)?')
    .setRequired(true)
    .setChoiceValues([
      'Sim',
      'Não'
    ]);

  form.addTextItem()
    .setTitle('Qual o instrumento jurídico da cessão?')
    .setHelpText('Se funciona em prédio público, qual documento autoriza? (Ex: Termo de Cessão, Convênio)')
    .setRequired(false);

  form.addSectionHeaderItem()
    .setTitle('📸 FOTO DA LICENÇA')
    .setHelpText('Se a entidade tiver licença, tire uma foto do documento AGORA');

  form.addFileUploadItem()
    .setTitle('📸 Foto da Licença/Laudo (se houver)')
    .setHelpText('Tire uma foto da licença de funcionamento ou laudo técnico. Se não houver, pule esta foto.\n💡 DICA: Foto no modo NORMAL, sem HD ou 4K.')
    .setRequired(false)
    .setAllowedFileTypes([FormApp.FileType.IMAGE]);

  form.addPageBreakItem()
    .setTitle('Próxima etapa: Público Atendido');

  // ════════════════════════════════════════════════════════════════════
  // ETAPA 4: PÚBLICO ATENDIDO
  // ════════════════════════════════════════════════════════════════════

  form.addSectionHeaderItem()
    .setTitle('👥 ETAPA 4: QUEM É ATENDIDO')
    .setHelpText('Pergunte sobre as pessoas atendidas pela entidade.');

  form.addCheckboxItem()
    .setTitle('Públicos Atendidos')
    .setHelpText('Marque TODOS os públicos que a entidade atende')
    .setRequired(true)
    .setChoiceValues([
      'Crianças (0 a 12 anos)',
      'Adolescentes (12 a 18 anos)',
      'Jovens (18 a 29 anos)',
      'Adultos (30 a 59 anos)',
      'Idosos (60 anos ou mais)',
      'Pessoas com Deficiência',
      'Famílias',
      'Pessoas em situação de rua',
      'Outros'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Se atende IDOSOS - Registro no CDI/DF?')
    .setHelpText('Conselho dos Direitos do Idoso do DF')
    .setRequired(false)
    .setChoiceValues([
      'Sim, possui registro',
      'Não possui registro',
      'Em processo de registro',
      'Não se aplica (não atende idosos)'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Se atende CRIANÇAS/ADOLESCENTES - Registro no CDCA/DF?')
    .setHelpText('Conselho dos Direitos da Criança e do Adolescente do DF')
    .setRequired(false)
    .setChoiceValues([
      'Sim, possui registro',
      'Não possui registro',
      'Em processo de registro',
      'Não se aplica (não atende crianças/adolescentes)'
    ]);

  form.addTextItem()
    .setTitle('Se atende FAMÍLIAS - Registros')
    .setHelpText('Informe outros registros relevantes, se houver')
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('Formas de Acesso dos Usuários')
    .setHelpText('Como as pessoas chegam até a entidade?')
    .setRequired(true)
    .setChoiceValues([
      'Procura espontânea (a pessoa procura diretamente)',
      'Encaminhamento de órgãos públicos (CRAS, CREAS, etc.)',
      'Busca ativa (a entidade vai até as pessoas)',
      'Todas as formas acima'
    ]);

  form.addPageBreakItem()
    .setTitle('Próxima etapa: Equipe');

  // ════════════════════════════════════════════════════════════════════
  // ETAPA 5: EQUIPE
  // ════════════════════════════════════════════════════════════════════

  form.addSectionHeaderItem()
    .setTitle('👨‍👩‍👧‍👦 ETAPA 5: EQUIPE DE TRABALHO')
    .setHelpText('Pergunte sobre as pessoas que trabalham na entidade.');

  form.addTextItem()
    .setTitle('Número de Voluntários')
    .setHelpText('Quantas pessoas trabalham como voluntárias? (digite 0 se não houver)')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Número de Contratados')
    .setHelpText('Quantas pessoas são funcionárias contratadas? (digite 0 se não houver)')
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Especialidades Presentes na Equipe')
    .setHelpText('Marque TODOS os profissionais que trabalham na entidade')
    .setRequired(true)
    .setChoiceValues([
      'Assistente Social',
      'Psicólogo(a)',
      'Pedagogo(a)',
      'Educador(a) Social',
      'Terapeuta Ocupacional',
      'Fisioterapeuta',
      'Enfermeiro(a)',
      'Nutricionista',
      'Advogado(a)',
      'Outros'
    ]);

  form.addPageBreakItem()
    .setTitle('Próxima etapa: Acessibilidade');

  // ════════════════════════════════════════════════════════════════════
  // ETAPA 6: ACESSIBILIDADE
  // ════════════════════════════════════════════════════════════════════

  form.addSectionHeaderItem()
    .setTitle('♿ ETAPA 6: ACESSIBILIDADE')
    .setHelpText('Caminhe pela entidade e VERIFIQUE os itens de acessibilidade.');

  form.addCheckboxItem()
    .setTitle('Acessibilidade')
    .setHelpText('Marque TODOS os itens de acessibilidade que a entidade possui')
    .setRequired(true)
    .setChoiceValues([
      'Rampa de acesso na entrada',
      'Banheiro adaptado para cadeirante',
      'Piso tátil para deficientes visuais',
      'Corrimão nas escadas',
      'Portas com largura adequada (mín. 80cm)',
      'Elevador ou plataforma elevatória',
      'Sinalização em Braille',
      'Intérprete de Libras',
      'Nenhum item de acessibilidade'
    ]);

  form.addSectionHeaderItem()
    .setTitle('📸 FOTOS DE ACESSIBILIDADE')
    .setHelpText('Tire fotos dos itens de acessibilidade que você verificou (rampa, banheiro adaptado, etc.)');

  form.addFileUploadItem()
    .setTitle('📸 Fotos de Acessibilidade')
    .setHelpText('Tire fotos dos itens de acessibilidade (rampa, banheiro adaptado, etc). Pode tirar várias.\n💡 DICA: Use modo NORMAL da câmera para envio mais rápido.')
    .setRequired(false)
    .setAllowedFileTypes([FormApp.FileType.IMAGE]);

  form.addPageBreakItem()
    .setTitle('Próxima etapa: Espaços Físicos');

  // ════════════════════════════════════════════════════════════════════
  // ETAPA 7: ESPAÇOS FÍSICOS
  // ════════════════════════════════════════════════════════════════════

  form.addSectionHeaderItem()
    .setTitle('🏠 ETAPA 7: ESPAÇOS FÍSICOS')
    .setHelpText('Peça para conhecer as salas e espaços onde as atividades acontecem.');

  form.addMultipleChoiceItem()
    .setTitle('Tipo de Espaço')
    .setHelpText('O imóvel onde funciona a entidade é:')
    .setRequired(true)
    .setChoiceValues([
      'Próprio (pertence à entidade)',
      'Alugado',
      'Cedido por órgão público',
      'Cedido por particular',
      'Comodato'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Compartilha Espaço com Outros Serviços?')
    .setHelpText('A entidade divide o espaço com outras organizações ou serviços?')
    .setRequired(true)
    .setChoiceValues([
      'Sim',
      'Não'
    ]);

  form.addTextItem()
    .setTitle('Quais serviços compartilham o espaço?')
    .setHelpText('Se compartilha, liste os outros serviços/organizações')
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('Adequação do Espaço Físico')
    .setHelpText('Os espaços são adequados para as atividades realizadas?')
    .setRequired(true)
    .setChoiceValues([
      'Sim, totalmente adequados',
      'Parcialmente adequados (há alguns problemas)',
      'Não são adequados (há problemas graves)'
    ]);

  form.addParagraphTextItem()
    .setTitle('Descreva as inadequações')
    .setHelpText('Se os espaços NÃO são adequados, descreva os problemas encontrados')
    .setRequired(false);

  form.addSectionHeaderItem()
    .setTitle('📸 FOTOS DOS ESPAÇOS')
    .setHelpText('Tire fotos das salas, espaços de atividades, cozinha, banheiros, etc.');

  form.addFileUploadItem()
    .setTitle('📸 Fotos dos Espaços')
    .setHelpText('Tire fotos das salas, cozinha, banheiros, etc. Pode tirar várias.\n💡 DICA: Use modo NORMAL da câmera para envio mais rápido.')
    .setRequired(true)
    .setAllowedFileTypes([FormApp.FileType.IMAGE]);

  form.addPageBreakItem()
    .setTitle('Próxima etapa: Funcionamento');

  // ════════════════════════════════════════════════════════════════════
  // ETAPA 8: FUNCIONAMENTO
  // ════════════════════════════════════════════════════════════════════

  form.addSectionHeaderItem()
    .setTitle('⏰ ETAPA 8: FUNCIONAMENTO')
    .setHelpText('Pergunte sobre como a entidade funciona no dia a dia.');

  form.addMultipleChoiceItem()
    .setTitle('Funciona de dezembro a dezembro (ano todo)?')
    .setHelpText('A entidade funciona todos os meses do ano?')
    .setRequired(true)
    .setChoiceValues([
      'Sim, funciona o ano todo',
      'Não, fecha em alguns períodos'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Há período de recesso ou férias coletivas?')
    .setRequired(true)
    .setChoiceValues([
      'Sim',
      'Não'
    ]);

  form.addTextItem()
    .setTitle('Qual o período de recesso/férias?')
    .setHelpText('Se houver, informe quando (Ex: 20/12 a 10/01)')
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('O serviço é totalmente gratuito?')
    .setHelpText('Os usuários pagam algo para participar?')
    .setRequired(true)
    .setChoiceValues([
      'Sim, 100% gratuito',
      'Não, há algum tipo de cobrança'
    ]);

  form.addTextItem()
    .setTitle('Por que o serviço não é gratuito?')
    .setHelpText('Se há cobrança, explique o motivo e o valor')
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('Há retenção de BPC?')
    .setHelpText('A entidade retém parte do Benefício de Prestação Continuada dos usuários?')
    .setRequired(true)
    .setChoiceValues([
      'Sim',
      'Não',
      'Não se aplica'
    ]);

  form.addTextItem()
    .setTitle('Qual o percentual de BPC retido?')
    .setHelpText('Se há retenção, informe o percentual (Ex: 70%)')
    .setRequired(false);

  form.addPageBreakItem()
    .setTitle('Próxima etapa: Articulação com a Rede');

  // ════════════════════════════════════════════════════════════════════
  // ETAPA 9: ARTICULAÇÃO COM A REDE
  // ════════════════════════════════════════════════════════════════════

  form.addSectionHeaderItem()
    .setTitle('🤝 ETAPA 9: ARTICULAÇÃO COM A REDE')
    .setHelpText('Pergunte se a entidade trabalha em parceria com outros serviços.');

  form.addMultipleChoiceItem()
    .setTitle('Centro de Referência - CRAS')
    .setHelpText('A entidade tem articulação com o CRAS?')
    .setRequired(true)
    .setChoiceValues([
      'Sim, articulação frequente',
      'Sim, articulação eventual',
      'Não há articulação'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Centro de Referência Especializado - CREAS')
    .setRequired(true)
    .setChoiceValues([
      'Sim, articulação frequente',
      'Sim, articulação eventual',
      'Não há articulação'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Unidade de Acolhimento')
    .setRequired(true)
    .setChoiceValues([
      'Sim, articulação frequente',
      'Sim, articulação eventual',
      'Não há articulação',
      'Não se aplica'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Serviço de Abordagem Social')
    .setRequired(true)
    .setChoiceValues([
      'Sim, articulação frequente',
      'Sim, articulação eventual',
      'Não há articulação',
      'Não se aplica'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Centro POP')
    .setRequired(true)
    .setChoiceValues([
      'Sim, articulação frequente',
      'Sim, articulação eventual',
      'Não há articulação',
      'Não se aplica'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Serviços de Saúde')
    .setHelpText('UBS, hospitais, CAPS, etc.')
    .setRequired(true)
    .setChoiceValues([
      'Sim, articulação frequente',
      'Sim, articulação eventual',
      'Não há articulação'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Serviços de Educação')
    .setHelpText('Escolas, creches, etc.')
    .setRequired(true)
    .setChoiceValues([
      'Sim, articulação frequente',
      'Sim, articulação eventual',
      'Não há articulação'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Sistema de Justiça')
    .setHelpText('Defensoria, Ministério Público, Vara da Infância, etc.')
    .setRequired(true)
    .setChoiceValues([
      'Sim, articulação frequente',
      'Sim, articulação eventual',
      'Não há articulação'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Conselhos de Políticas Públicas')
    .setHelpText('Conselhos Tutelares, CMDCA, CMI, etc.')
    .setRequired(true)
    .setChoiceValues([
      'Sim, articulação frequente',
      'Sim, articulação eventual',
      'Não há articulação'
    ]);

  form.addParagraphTextItem()
    .setTitle('Outras Articulações Relevantes')
    .setHelpText('Descreva outras parcerias importantes que a entidade possui')
    .setRequired(false);

  form.addPageBreakItem()
    .setTitle('Próxima etapa: Avaliação e Atividades');

  // ════════════════════════════════════════════════════════════════════
  // ETAPA 10: AVALIAÇÃO E ATIVIDADES
  // ════════════════════════════════════════════════════════════════════

  form.addSectionHeaderItem()
    .setTitle('📋 ETAPA 10: AVALIAÇÃO DAS ATIVIDADES')
    .setHelpText('Observe as atividades sendo realizadas (se possível) e faça sua avaliação.');

  form.addMultipleChoiceItem()
    .setTitle('As ações executadas estão conforme o Plano de Trabalho?')
    .setHelpText('As atividades que você viu correspondem ao que está no plano?')
    .setRequired(true)
    .setChoiceValues([
      'Sim, totalmente conforme',
      'Parcialmente conforme',
      'Não estão conforme'
    ]);

  form.addParagraphTextItem()
    .setTitle('Descreva as divergências encontradas')
    .setHelpText('Se as atividades NÃO estão conforme, descreva o que está diferente')
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('A metodologia está adequada às normativas?')
    .setHelpText('A forma como as atividades são realizadas está correta?')
    .setRequired(true)
    .setChoiceValues([
      'Sim, totalmente adequada',
      'Parcialmente adequada',
      'Não está adequada'
    ]);

  form.addParagraphTextItem()
    .setTitle('Descreva as inadequações ou ressalvas metodológicas')
    .setHelpText('Se a metodologia NÃO está adequada, explique os problemas')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('Observações Adicionais')
    .setHelpText('Registre qualquer outra observação importante sobre a visita')
    .setRequired(false);

  form.addSectionHeaderItem()
    .setTitle('📸 FOTOS DAS ATIVIDADES')
    .setHelpText('Se possível e autorizado, tire fotos das atividades sendo realizadas');

  form.addFileUploadItem()
    .setTitle('📸 Fotos de Atividades')
    .setHelpText('Fotos das atividades em andamento (se autorizadas pelos participantes).\n💡 DICA: Use modo NORMAL da câmera.')
    .setRequired(false)
    .setAllowedFileTypes([FormApp.FileType.IMAGE]);

  form.addFileUploadItem()
    .setTitle('📸 Fotos Adicionais')
    .setHelpText('Outras fotos que você considere importantes.\n💡 DICA: Use modo NORMAL da câmera.')
    .setRequired(false)
    .setAllowedFileTypes([FormApp.FileType.IMAGE]);

  form.addPageBreakItem()
    .setTitle('Última etapa: Seu Voto');

  // ════════════════════════════════════════════════════════════════════
  // ETAPA 11: VOTO DO CONSELHEIRO
  // ════════════════════════════════════════════════════════════════════

  form.addSectionHeaderItem()
    .setTitle('⚖️ ETAPA FINAL: SEU VOTO')
    .setHelpText('Agora que você conheceu a entidade, registre sua avaliação e voto.');

  form.addMultipleChoiceItem()
    .setTitle('Quanto às análises técnicas da Secretaria Executiva')
    .setHelpText('Você concorda com a análise técnica prévia?')
    .setRequired(true)
    .setChoiceValues([
      'Concordo integralmente',
      'Concordo parcialmente',
      'Discordo'
    ]);

  form.addParagraphTextItem()
    .setTitle('Fundamentos da discordância')
    .setHelpText('Se você DISCORDA da análise técnica, explique seus motivos')
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('Voto do(a) Conselheiro(a)')
    .setHelpText('Qual é o seu voto para esta entidade?')
    .setRequired(true)
    .setChoiceValues([
      'FAVORÁVEL - A entidade atende aos requisitos',
      'FAVORÁVEL COM RESSALVAS - Há pontos a melhorar',
      'DESFAVORÁVEL - A entidade não atende aos requisitos',
      'DILIGÊNCIA - Necessita de mais informações'
    ]);

  form.addParagraphTextItem()
    .setTitle('Justificativa do Voto')
    .setHelpText('Explique os motivos do seu voto')
    .setRequired(true);

  form.addDateItem()
    .setTitle('Data do Voto')
    .setHelpText('Data de hoje')
    .setRequired(true);

  // ════════════════════════════════════════════════════════════════════
  // FINALIZAÇÃO
  // ════════════════════════════════════════════════════════════════════

  const formId = form.getId();
  const formUrl = form.getEditUrl();
  const formPublicUrl = form.getPublishedUrl();

  Logger.log('════════════════════════════════════════════════════════════');
  Logger.log('✅ FORMULÁRIO DE FISCALIZAÇÃO V2.0 CRIADO COM SUCESSO!');
  Logger.log('════════════════════════════════════════════════════════════');
  Logger.log('');
  Logger.log('📋 ID do Formulário: ' + formId);
  Logger.log('');
  Logger.log('🔗 Link para EDITAR o formulário:');
  Logger.log(formUrl);
  Logger.log('');
  Logger.log('🔗 Link para RESPONDER o formulário (enviar para conselheiros):');
  Logger.log(formPublicUrl);
  Logger.log('');
  Logger.log('════════════════════════════════════════════════════════════');
  Logger.log('⚠️ PRÓXIMOS PASSOS:');
  Logger.log('════════════════════════════════════════════════════════════');
  Logger.log('1. Atualize o FORM_ID no arquivo Config.gs com: ' + formId);
  Logger.log('2. Cadastre os conselheiros na lista do formulário');
  Logger.log('3. Vincule a planilha de respostas');
  Logger.log('4. Execute instalarTrigger() para ativar o processamento automático');
  Logger.log('');

  return formId;
}

/**
 * Atualiza a lista de conselheiros no formulário de fiscalização
 * @param {Array} conselheiros - Lista de nomes dos conselheiros
 */
function atualizarConselheirosFormularioFiscalizacao(conselheiros) {
  const form = FormApp.openById(FORM_ID);
  const items = form.getItems();

  for (let i = 0; i < items.length; i++) {
    if (items[i].getTitle() === 'Nome do(a) Conselheiro(a)') {
      const listItem = items[i].asListItem();

      if (conselheiros && conselheiros.length > 0) {
        listItem.setChoiceValues(conselheiros);
        Logger.log('✅ Lista de conselheiros atualizada no formulário de fiscalização');
      } else {
        Logger.log('⚠️ Nenhum conselheiro informado');
      }

      return;
    }
  }

  Logger.log('❌ Campo "Nome do(a) Conselheiro(a)" não encontrado');
}
