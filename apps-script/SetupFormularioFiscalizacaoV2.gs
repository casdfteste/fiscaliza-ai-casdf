/**
   * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
   * Arquivo: SetupFormularioFiscalizacaoV2.gs
   * Descrição: Formulário de fiscalização - versão didática e acessível
   * Versão: 3.1
   *
   * NOTA: Campos de upload de foto NÃO podem ser criados por código.
   * Após executar, adicione manualmente os 6 campos de foto no formulário.
   */

  /**
   * Cria o formulário de fiscalização versão 3.1 (didático e acolhedor)
   * Linguagem simples, instruções passo a passo
   *
   * IMPORTANTE: Após rodar, você precisa adicionar MANUALMENTE
   * os campos de upload de foto no Google Forms (editar formulário).
   * O log vai indicar exatamente onde colocar cada um.
   */
  function criarFormularioFiscalizacaoV2() {

    const form = FormApp.create('Relatório de Fiscalização - CAS/DF');

    form.setDescription(
      'Bem-vindo(a), Conselheiro(a)!\n\n' +
      'Este formulário vai te guiar passo a passo durante a visita.\n' +
      'Fique tranquilo(a), é simples e rápido!\n\n' +
      'Vá respondendo cada pergunta na ordem.\n' +
      'Quando pedir uma foto, é só tocar no botão e escolher CÂMERA.\n\n' +
      'Vamos lá?'
    );

    form.setConfirmationMessage(
      'Parabéns! Seu relatório foi enviado!\n\n' +
      'O sistema vai gerar o documento automaticamente e enviar por e-mail.\n' +
      'Você receberá uma cópia no seu e-mail.\n\n' +
      'Obrigado(a) pelo seu trabalho!'
    );

    form.setProgressBar(true);
    form.setLimitOneResponsePerUser(false);

    // ════════════════════════════════════════════════════════════════════
    // ETAPA 1: SEUS DADOS
    // ════════════════════════════════════════════════════════════════════

    form.addSectionHeaderItem()
      .setTitle('ETAPA 1 de 11 - Seus Dados')
      .setHelpText(
        'Antes de sair para a visita, preencha suas informações.\n' +
        'Isso leva menos de 1 minuto.'
      );

    form.addListItem()
      .setTitle('Nome do(a) Conselheiro(a)')
      .setHelpText('Escolha seu nome na lista abaixo')
      .setRequired(true)
      .setChoiceValues([
        '[Cadastre os conselheiros no sistema]'
      ]);

    form.addTextItem()
      .setTitle('E-mail do(a) Conselheiro(a)')
      .setHelpText('Seu e-mail para receber uma cópia do relatório')
      .setRequired(true);

    form.addTextItem()
      .setTitle('Nome da Instituição Fiscalizada')
      .setHelpText('O nome da entidade que você vai visitar')
      .setRequired(true);

    form.addListItem()
      .setTitle('Tipo de Processo')
      .setHelpText('Escolha uma opção')
      .setRequired(true)
      .setChoiceValues([
        'Inscrição',
        'Renovação de Inscrição',
        'Acompanhamento'
      ]);

    form.addTextItem()
      .setTitle('Qual o ano do acompanhamento?')
      .setHelpText('Exemplo: 2026. Se não for acompanhamento, pode pular')
      .setRequired(false);

    form.addListItem()
      .setTitle('Modalidade da Inscrição')
      .setHelpText('Escolha uma opção')
      .setRequired(true)
      .setChoiceValues([
        'Assistência Social',
        'Saúde',
        'Educação',
        'Outra'
      ]);

    form.addTextItem()
      .setTitle('Nome do Serviço/Oferta Fiscalizada')
      .setHelpText('O nome do serviço ou programa que a entidade oferece')
      .setRequired(true);

    form.addPageBreakItem()
      .setTitle('Ótimo! Agora vamos para a visita');

    // ════════════════════════════════════════════════════════════════════
    // ETAPA 2: CHEGOU NA ENTIDADE
    // ════════════════════════════════════════════════════════════════════

    form.addSectionHeaderItem()
      .setTitle('ETAPA 2 de 11 - Você chegou na entidade!')
      .setHelpText(
        'Você está na frente da entidade.\n' +
        'Vamos registrar o endereço e a sua chegada.'
      );

    form.addTextItem()
      .setTitle('CEP da Entidade')
      .setHelpText(
        'Digite só os 8 números do CEP.\n' +
        'Exemplo: 70770502\n' +
        'O sistema vai buscar o endereço completo para você!'
      )
      .setRequired(true);

    form.addTextItem()
      .setTitle('Número')
      .setHelpText('O número do endereço. Se não tiver número, escreva S/N')
      .setRequired(true);

    form.addTextItem()
      .setTitle('Complemento (sala, bloco, andar)')
      .setHelpText('Se tiver complemento, escreva aqui. Se não tiver, pode pular')
      .setRequired(false);

    form.addDateItem()
      .setTitle('Data da Visita')
      .setHelpText('Selecione a data de hoje')
      .setRequired(true);

    form.addTimeItem()
      .setTitle('Horário da Visita')
      .setHelpText('Que horas você chegou?')
      .setRequired(true);

    form.addTextItem()
      .setTitle('Quem recebeu o(a) conselheiro(a)?')
      .setHelpText('Escreva o nome e o cargo da pessoa que te recebeu')
      .setRequired(true);

    form.addSectionHeaderItem()
      .setTitle('Hora da primeira foto!')
      .setHelpText(
        'Tire uma foto da FRENTE da entidade (fachada/entrada).\n\n' +
        'COMO TIRAR A FOTO:\n' +
        '1. Toque no botão abaixo\n' +
        '2. Escolha a opção CÂMERA\n' +
        '3. Tire a foto e confirme\n' +
        '4. Pronto! A foto já está no formulário'
      );

    // >>> FOTO 1: Adicionar manualmente campo "Upload de arquivo"
    // >>> Título: "Foto da Fachada/Entrada"
    // >>> Obrigatório: SIM | Tipo: Apenas imagens

    form.addPageBreakItem()
      .setTitle('Muito bem! Agora vamos ver os documentos');

    // ════════════════════════════════════════════════════════════════════
    // ETAPA 3: DOCUMENTAÇÃO
    // ════════════════════════════════════════════════════════════════════

    form.addSectionHeaderItem()
      .setTitle('ETAPA 3 de 11 - Documentos da entidade')
      .setHelpText(
        'Peça para ver a licença de funcionamento ou alvará.\n' +
        'Se não tiverem, tudo bem, basta informar.'
      );

    form.addMultipleChoiceItem()
      .setTitle('Licença de Funcionamento ou Laudo Técnico')
      .setHelpText('A entidade tem licença para funcionar?')
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
      .setHelpText('O serviço funciona em um prédio do governo? (escola, centro comunitário, etc.)')
      .setRequired(true)
      .setChoiceValues([
        'Sim',
        'Não'
      ]);

    form.addTextItem()
      .setTitle('Qual o instrumento jurídico da cessão?')
      .setHelpText('Se funciona em prédio público, qual documento autoriza? Se não sabe, pode pular')
      .setRequired(false);

    form.addSectionHeaderItem()
      .setTitle('Foto do documento (se tiver)')
      .setHelpText(
        'Se a entidade mostrou a licença ou alvará, tire uma foto.\n' +
        'Se não tiver documento, pode pular.\n\n' +
        'COMO TIRAR A FOTO:\n' +
        '1. Toque no botão abaixo\n' +
        '2. Escolha a opção CÂMERA\n' +
        '3. Tire a foto do documento'
      );

    // >>> FOTO 2: Adicionar manualmente campo "Upload de arquivo"
    // >>> Título: "Foto da Licença/Laudo (se houver)"
    // >>> Obrigatório: NÃO | Tipo: Apenas imagens

    form.addPageBreakItem()
      .setTitle('Boa! Vamos saber quem é atendido');

    // ════════════════════════════════════════════════════════════════════
    // ETAPA 4: PÚBLICO ATENDIDO
    // ════════════════════════════════════════════════════════════════════

    form.addSectionHeaderItem()
      .setTitle('ETAPA 4 de 11 - Quem a entidade atende?')
      .setHelpText(
        'Pergunte quem são as pessoas atendidas.\n' +
        'Pode marcar mais de uma opção.'
      );

    form.addCheckboxItem()
      .setTitle('Públicos Atendidos')
      .setHelpText('Marque TODOS os grupos de pessoas que a entidade atende')
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
      .setHelpText('CDI = Conselho dos Direitos do Idoso. Se não atende idosos, marque "Não se aplica"')
      .setRequired(false)
      .setChoiceValues([
        'Sim, possui registro',
        'Não possui registro',
        'Em processo de registro',
        'Não se aplica (não atende idosos)'
      ]);

    form.addMultipleChoiceItem()
      .setTitle('Se atende CRIANÇAS/ADOLESCENTES - Registro no CDCA/DF?')
      .setHelpText('CDCA = Conselho dos Direitos da Criança. Se não atende crianças, marque "Não se aplica"')
      .setRequired(false)
      .setChoiceValues([
        'Sim, possui registro',
        'Não possui registro',
        'Em processo de registro',
        'Não se aplica (não atende crianças/adolescentes)'
      ]);

    form.addTextItem()
      .setTitle('Se atende FAMÍLIAS - Registros')
      .setHelpText('Tem outros registros? Se não souber, pode pular')
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
      .setTitle('Metade do caminho! Vamos ver a equipe');

    // ════════════════════════════════════════════════════════════════════
    // ETAPA 5: EQUIPE
    // ════════════════════════════════════════════════════════════════════

    form.addSectionHeaderItem()
      .setTitle('ETAPA 5 de 11 - Equipe de trabalho')
      .setHelpText(
        'Pergunte sobre as pessoas que trabalham na entidade.\n' +
        'Se não souber o número exato, pode ser aproximado.'
      );

    form.addTextItem()
      .setTitle('Número de Voluntários')
      .setHelpText('Quantos voluntários? Se não tiver, escreva 0')
      .setRequired(true);

    form.addTextItem()
      .setTitle('Número de Contratados')
      .setHelpText('Quantos funcionários contratados? Se não tiver, escreva 0')
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
      .setTitle('Agora vamos caminhar pela entidade');

    // ════════════════════════════════════════════════════════════════════
    // ETAPA 6: ACESSIBILIDADE
    // ════════════════════════════════════════════════════════════════════

    form.addSectionHeaderItem()
      .setTitle('ETAPA 6 de 11 - Acessibilidade')
      .setHelpText(
        'Caminhe pela entidade e observe:\n' +
        'Tem rampa? Banheiro adaptado? Piso tátil?\n' +
        'Marque tudo que você encontrar.'
      );

    form.addCheckboxItem()
      .setTitle('Acessibilidade')
      .setHelpText('Marque TODOS os itens que a entidade possui')
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
      .setTitle('Foto da acessibilidade')
      .setHelpText(
        'Tire foto da rampa, banheiro adaptado, ou o que encontrou.\n' +
        'Se não encontrou nada, pode pular.\n\n' +
        'COMO TIRAR A FOTO:\n' +
        '1. Toque no botão abaixo\n' +
        '2. Escolha CÂMERA\n' +
        '3. Tire a foto e confirme'
      );

    // >>> FOTO 3: Adicionar manualmente campo "Upload de arquivo"
    // >>> Título: "Fotos de Acessibilidade"
    // >>> Obrigatório: NÃO | Tipo: Apenas imagens

    form.addPageBreakItem()
      .setTitle('Vamos ver os espaços da entidade');

    // ════════════════════════════════════════════════════════════════════
    // ETAPA 7: ESPAÇOS FÍSICOS
    // ════════════════════════════════════════════════════════════════════

    form.addSectionHeaderItem()
      .setTitle('ETAPA 7 de 11 - Espaços da entidade')
      .setHelpText(
        'Peça para conhecer as salas, cozinha, banheiros.\n' +
        'Observe se estão limpos e organizados.'
      );

    form.addMultipleChoiceItem()
      .setTitle('Tipo de Espaço')
      .setHelpText('O prédio onde funciona a entidade é:')
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
      .setHelpText('A entidade divide o espaço com outras organizações?')
      .setRequired(true)
      .setChoiceValues([
        'Sim',
        'Não'
      ]);

    form.addTextItem()
      .setTitle('Quais serviços compartilham o espaço?')
      .setHelpText('Se divide o espaço, escreva com quem. Se não divide, pode pular')
      .setRequired(false);

    form.addMultipleChoiceItem()
      .setTitle('Adequação do Espaço Físico')
      .setHelpText('O espaço é bom para as atividades? Está conservado?')
      .setRequired(true)
      .setChoiceValues([
        'Sim, totalmente adequados',
        'Parcialmente adequados (há alguns problemas)',
        'Não são adequados (há problemas graves)'
      ]);

    form.addParagraphTextItem()
      .setTitle('Descreva as inadequações')
      .setHelpText('Se marcou que há problemas, escreva quais são. Se está tudo bem, pode pular')
      .setRequired(false);

    form.addSectionHeaderItem()
      .setTitle('Fotos dos espaços')
      .setHelpText(
        'Tire fotos das salas, cozinha, banheiros e outros espaços.\n\n' +
        'COMO TIRAR A FOTO:\n' +
        '1. Toque no botão abaixo\n' +
        '2. Escolha CÂMERA\n' +
        '3. Tire a foto e confirme'
      );

    // >>> FOTO 4: Adicionar manualmente campo "Upload de arquivo"
    // >>> Título: "Fotos dos Espaços"
    // >>> Obrigatório: SIM | Tipo: Apenas imagens

    form.addPageBreakItem()
      .setTitle('Está indo muito bem! Vamos falar do funcionamento');

    // ════════════════════════════════════════════════════════════════════
    // ETAPA 8: FUNCIONAMENTO
    // ════════════════════════════════════════════════════════════════════

    form.addSectionHeaderItem()
      .setTitle('ETAPA 8 de 11 - Como funciona no dia a dia?')
      .setHelpText(
        'Pergunte sobre os horários, se cobra alguma coisa,\n' +
        'se funciona o ano todo.'
      );

    form.addMultipleChoiceItem()
      .setTitle('Funciona de dezembro a dezembro (ano todo)?')
      .setHelpText('A entidade abre todos os meses do ano?')
      .setRequired(true)
      .setChoiceValues([
        'Sim, funciona o ano todo',
        'Não, fecha em alguns períodos'
      ]);

    form.addMultipleChoiceItem()
      .setTitle('Há período de recesso ou férias coletivas?')
      .setHelpText('A entidade para em alguma época do ano?')
      .setRequired(true)
      .setChoiceValues([
        'Sim',
        'Não'
      ]);

    form.addTextItem()
      .setTitle('Qual o período de recesso/férias?')
      .setHelpText('Se marcou sim, quando? Exemplo: 20/12 a 10/01. Se não tem, pode pular')
      .setRequired(false);

    form.addMultipleChoiceItem()
      .setTitle('O serviço é totalmente gratuito?')
      .setHelpText('As pessoas pagam alguma coisa para participar?')
      .setRequired(true)
      .setChoiceValues([
        'Sim, 100% gratuito',
        'Não, há algum tipo de cobrança'
      ]);

    form.addTextItem()
      .setTitle('Por que o serviço não é gratuito?')
      .setHelpText('Se cobra algo, explique o motivo e o valor. Se é gratuito, pode pular')
      .setRequired(false);

    form.addMultipleChoiceItem()
      .setTitle('Há retenção de BPC?')
      .setHelpText('BPC = Benefício de Prestação Continuada. A entidade retém parte do benefício?')
      .setRequired(true)
      .setChoiceValues([
        'Sim',
        'Não',
        'Não se aplica'
      ]);

    form.addTextItem()
      .setTitle('Qual o percentual de BPC retido?')
      .setHelpText('Se retém, qual a porcentagem? Exemplo: 70%. Se não retém, pode pular')
      .setRequired(false);

    form.addPageBreakItem()
      .setTitle('Quase lá! Vamos ver as parcerias');

    // ════════════════════════════════════════════════════════════════════
    // ETAPA 9: ARTICULAÇÃO COM A REDE
    // ════════════════════════════════════════════════════════════════════

    form.addSectionHeaderItem()
      .setTitle('ETAPA 9 de 11 - Parcerias e articulações')
      .setHelpText(
        'Pergunte se a entidade trabalha junto com outros serviços.\n' +
        'Por exemplo: CRAS, CREAS, escolas, hospitais...'
      );

    form.addMultipleChoiceItem()
      .setTitle('Centro de Referência - CRAS')
      .setHelpText('A entidade tem contato com o CRAS?')
      .setRequired(true)
      .setChoiceValues([
        'Sim, articulação frequente',
        'Sim, articulação eventual',
        'Não há articulação'
      ]);

    form.addMultipleChoiceItem()
      .setTitle('Centro de Referência Especializado - CREAS')
      .setHelpText('A entidade tem contato com o CREAS?')
      .setRequired(true)
      .setChoiceValues([
        'Sim, articulação frequente',
        'Sim, articulação eventual',
        'Não há articulação'
      ]);

    form.addMultipleChoiceItem()
      .setTitle('Unidade de Acolhimento')
      .setHelpText('A entidade tem contato com unidades de acolhimento?')
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
      .setHelpText('Centro de Referência para População em Situação de Rua')
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
      .setHelpText('Defensoria, Ministério Público, etc.')
      .setRequired(true)
      .setChoiceValues([
        'Sim, articulação frequente',
        'Sim, articulação eventual',
        'Não há articulação'
      ]);

    form.addMultipleChoiceItem()
      .setTitle('Conselhos de Políticas Públicas')
      .setHelpText('Conselhos Tutelares, CMDCA, etc.')
      .setRequired(true)
      .setChoiceValues([
        'Sim, articulação frequente',
        'Sim, articulação eventual',
        'Não há articulação'
      ]);

    form.addParagraphTextItem()
      .setTitle('Outras Articulações Relevantes')
      .setHelpText('Tem outras parcerias importantes? Escreva aqui. Se não tiver, pode pular')
      .setRequired(false);

    form.addPageBreakItem()
      .setTitle('Falta pouco! Vamos avaliar as atividades');

    // ════════════════════════════════════════════════════════════════════
    // ETAPA 10: AVALIAÇÃO
    // ════════════════════════════════════════════════════════════════════

    form.addSectionHeaderItem()
      .setTitle('ETAPA 10 de 11 - Sua avaliação')
      .setHelpText(
        'Se possível, observe alguma atividade acontecendo.\n' +
        'Responda com base no que você viu e ouviu durante a visita.'
      );

    form.addMultipleChoiceItem()
      .setTitle('As ações executadas estão conforme o Plano de Trabalho?')
      .setHelpText('O que a entidade faz corresponde ao que está no plano?')
      .setRequired(true)
      .setChoiceValues([
        'Sim, totalmente conforme',
        'Parcialmente conforme',
        'Não estão conforme'
      ]);

    form.addParagraphTextItem()
      .setTitle('Descreva as divergências encontradas')
      .setHelpText('Se marcou que NÃO está conforme, escreva o que está diferente. Se está tudo certo, pode pular')
      .setRequired(false);

    form.addMultipleChoiceItem()
      .setTitle('A metodologia está adequada às normativas?')
      .setHelpText('A forma como as atividades são feitas está correta?')
      .setRequired(true)
      .setChoiceValues([
        'Sim, totalmente adequada',
        'Parcialmente adequada',
        'Não está adequada'
      ]);

    form.addParagraphTextItem()
      .setTitle('Descreva as inadequações ou ressalvas metodológicas')
      .setHelpText('Se marcou que NÃO está adequada, explique os problemas. Se está tudo certo, pode pular')
      .setRequired(false);

    form.addParagraphTextItem()
      .setTitle('Observações Adicionais')
      .setHelpText('Quer registrar algo mais sobre a visita? Escreva aqui. Se não tiver nada, pode pular')
      .setRequired(false);

    form.addSectionHeaderItem()
      .setTitle('Últimas fotos!')
      .setHelpText(
        'Se viu alguma atividade acontecendo, tire uma foto (com autorização).\n' +
        'Pode também tirar fotos de qualquer coisa importante que queira registrar.\n\n' +
        'COMO TIRAR A FOTO:\n' +
        '1. Toque no botão abaixo\n' +
        '2. Escolha CÂMERA\n' +
        '3. Tire a foto e confirme'
      );

    // >>> FOTO 5: Adicionar manualmente campo "Upload de arquivo"
    // >>> Título: "Fotos de Atividades"
    // >>> Obrigatório: NÃO | Tipo: Apenas imagens

    // >>> FOTO 6: Adicionar manualmente campo "Upload de arquivo"
    // >>> Título: "Fotos Adicionais"
    // >>> Obrigatório: NÃO | Tipo: Apenas imagens

    form.addPageBreakItem()
      .setTitle('Última etapa! Agora é o seu voto');

    // ════════════════════════════════════════════════════════════════════
    // ETAPA 11: VOTO
    // ════════════════════════════════════════════════════════════════════

    form.addSectionHeaderItem()
      .setTitle('ETAPA 11 de 11 - Seu Voto')
      .setHelpText(
        'Esta é a última etapa!\n' +
        'Com base em tudo que você viu, registre seu voto.'
      );

    form.addMultipleChoiceItem()
      .setTitle('Quanto às análises técnicas da Secretaria Executiva')
      .setHelpText('Você concorda com a análise técnica que foi feita antes da visita?')
      .setRequired(true)
      .setChoiceValues([
        'Concordo integralmente',
        'Concordo parcialmente',
        'Discordo'
      ]);

    form.addParagraphTextItem()
      .setTitle('Fundamentos da discordância')
      .setHelpText('Se marcou DISCORDO, explique por quê. Se concordou, pode pular')
      .setRequired(false);

    form.addMultipleChoiceItem()
      .setTitle('Voto do(a) Conselheiro(a)')
      .setHelpText('Qual é o seu voto?')
      .setRequired(true)
      .setChoiceValues([
        'FAVORÁVEL - A entidade atende aos requisitos',
        'FAVORÁVEL COM RESSALVAS - Há pontos a melhorar',
        'DESFAVORÁVEL - A entidade não atende aos requisitos',
        'DILIGÊNCIA - Necessita de mais informações'
      ]);

    form.addParagraphTextItem()
      .setTitle('Justificativa do Voto')
      .setHelpText('Escreva os motivos do seu voto com suas palavras')
      .setRequired(true);

    form.addDateItem()
      .setTitle('Data do Voto')
      .setHelpText('Selecione a data de hoje')
      .setRequired(true);

    // ════════════════════════════════════════════════════════════════════
    // FINALIZAÇÃO
    // ════════════════════════════════════════════════════════════════════

    const formId = form.getId();
    const formUrl = form.getEditUrl();
    const formPublicUrl = form.getPublishedUrl();

    Logger.log('════════════════════════════════════════════════════════════');
    Logger.log('FORMULÁRIO V3.1 CRIADO COM SUCESSO!');
    Logger.log('════════════════════════════════════════════════════════════');
    Logger.log('');
    Logger.log('ID do Formulário: ' + formId);
    Logger.log('');
    Logger.log('Link para EDITAR:');
    Logger.log(formUrl);
    Logger.log('');
    Logger.log('Link para RESPONDER (enviar para conselheiros):');
    Logger.log(formPublicUrl);
    Logger.log('');
    Logger.log('════════════════════════════════════════════════════════════');
    Logger.log('ATENÇÃO - ADICIONAR FOTOS MANUALMENTE:');
    Logger.log('════════════════════════════════════════════════════════════');
    Logger.log('O Google não permite criar campos de upload por código.');
    Logger.log('Abra o formulário no link de EDITAR acima e adicione');
    Logger.log('6 campos de "Upload de arquivo" (apenas imagens) nos locais:');
    Logger.log('');
    Logger.log('FOTO 1 - Após "Hora da primeira foto!" (Etapa 2)');
    Logger.log('  Título: Foto da Fachada/Entrada');
    Logger.log('  Obrigatório: SIM');
    Logger.log('');
    Logger.log('FOTO 2 - Após "Foto do documento" (Etapa 3)');
    Logger.log('  Título: Foto da Licença/Laudo (se houver)');
    Logger.log('  Obrigatório: NÃO');
    Logger.log('');
    Logger.log('FOTO 3 - Após "Foto da acessibilidade" (Etapa 6)');
    Logger.log('  Título: Fotos de Acessibilidade');
    Logger.log('  Obrigatório: NÃO');
    Logger.log('');
    Logger.log('FOTO 4 - Após "Fotos dos espaços" (Etapa 7)');
    Logger.log('  Título: Fotos dos Espaços');
    Logger.log('  Obrigatório: SIM');
    Logger.log('');
    Logger.log('FOTO 5 - Após "Últimas fotos!" (Etapa 10)');
    Logger.log('  Título: Fotos de Atividades');
    Logger.log('  Obrigatório: NÃO');
    Logger.log('');
    Logger.log('FOTO 6 - Logo após a Foto 5 (Etapa 10)');
    Logger.log('  Título: Fotos Adicionais');
    Logger.log('  Obrigatório: NÃO');
    Logger.log('');
    Logger.log('Em cada campo: clique nos 3 pontinhos > "Permitir apenas');
    Logger.log('tipos de arquivo específicos" > marque apenas "Imagem"');
    Logger.log('');
    Logger.log('════════════════════════════════════════════════════════════');
    Logger.log('DEPOIS DE ADICIONAR AS FOTOS:');
    Logger.log('════════════════════════════════════════════════════════════');
    Logger.log('1. Atualize o FORM_ID no Config.gs com: ' + formId);
    Logger.log('2. Cadastre os conselheiros na lista do formulário');
    Logger.log('3. Vincule a planilha de respostas');
    Logger.log('4. Execute instalarTrigger() para ativar o processamento');
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
          Logger.log('Lista de conselheiros atualizada no formulário');
        } else {
          Logger.log('Nenhum conselheiro informado');
        }

        return;
      }
    }

    Logger.log('Campo "Nome do(a) Conselheiro(a)" não encontrado');
  }
    function cadastrarConselheiros() {
    atualizarConselheirosFormularioFiscalizacao([
      'Adacto Artur Dornas de Oliveira',
      'Adriana Alves Chaves',
      'Afonso Abreu Mendes Júnior',
      'Alessandra Rodrigues Dourado',
      'Amanda Mota Meireles',
      'Ana Elizabeth de Andrade Farias Santos Sales',
      'Ana Luíza Ribeiro Câmara',
      'Ana Maria Gomes de Oliveira',
      'Anderson Lopes de Jesus',
      'Andrea Vanessa',
      'Antônio Célio Rodrigues Pimentel',
      'Bruno Cezar Santos',
      'Clemilson Correia de Oliveira',
      'Cristiane Pereira Rodrigues Neves',
      'Daniela Dias Freias',
      'Débora Garcia Guimarães',
      'Denise da Costa Eleutério',
      'Denise Drummond',
      'Diogo Santos de Paula',
      'Flávia da Guia Gonçalves',
      'Franceni Aparecida Faria Machado',
      'Francisco Rodrigues Corrêa',
      'Gabriela Fogaça Alves Pinheiro',
      'Gisele Bittencourt de Souza Silva',
      'Gislaine Andrea Almeida Medeiros',
      'Igor Jovita Shiratori',
      'Karen Christina Cavalcante de Abreu',
      'Lígia Pereira de Souza',
      'Lorena Marinho da Silva',
      'Lorena Natália dos Santos Mota',
      'Losangelis Viveiros Gregório da Cunha',
      'Luiz dos Santos Videro Neto',
      'Luizabete Batista Tavares',
      'Marcus Vinicius de Souza Bernarde',
      'Maria Vicentina Lopes de Lucena',
      'Natanael de Marcena Costa',
      'Suyane Karla de Souza Gontijo',
      'Telma dos Santos Teixeira'
    ]);
  }

  /**
   * Atualiza o campo "Nome da Instituição Fiscalizada" no formulário
   * Converte de TextItem para ListItem (dropdown) se necessário
   * @param {Array} instituicoes - Lista de nomes das instituições
   */
  function atualizarInstituicoesFormularioFiscalizacao(instituicoes) {
    var form = FormApp.openById(FORM_ID);
    var items = form.getItems();
    var targetIndex = -1;
    var targetItem = null;

    for (var i = 0; i < items.length; i++) {
      if (items[i].getTitle() === 'Nome da Instituição Fiscalizada') {
        targetIndex = i;
        targetItem = items[i];
        break;
      }
    }

    if (targetIndex === -1) {
      Logger.log('Campo "Nome da Instituição Fiscalizada" não encontrado no formulário');
      return;
    }

    if (!instituicoes || instituicoes.length === 0) {
      Logger.log('Nenhuma instituição informada');
      return;
    }

    // Se já é ListItem, apenas atualizar as opções
    if (targetItem.getType() === FormApp.ItemType.LIST) {
      targetItem.asListItem().setChoiceValues(instituicoes);
      Logger.log('Lista de instituições atualizada: ' + instituicoes.length + ' entidades');
      return;
    }

    // Se é TextItem, converter para ListItem (dropdown)
    Logger.log('Convertendo campo de texto para dropdown...');
    var helpText = targetItem.getHelpText();

    // Remover item antigo
    form.deleteItem(targetIndex);

    // Criar novo ListItem
    var listItem = form.addListItem();
    listItem.setTitle('Nome da Instituição Fiscalizada');
    listItem.setHelpText('Escolha o nome da entidade na lista abaixo');
    listItem.setRequired(true);
    listItem.setChoiceValues(instituicoes);

    // Mover para a posição original
    form.moveItem(form.getItems().length - 1, targetIndex);

    Logger.log('Campo convertido para dropdown com ' + instituicoes.length + ' instituições');
  }

  /**
   * Cadastra as 157 instituições com inscrição vigente no CAS/DF
   * Fonte: Lista oficial atualizada em dezembro de 2025
   * Executar esta função para popular o dropdown do formulário
   */
  function cadastrarInstituicoes() {
    atualizarInstituicoesFormularioFiscalizacao([
      'ABRIGO BEZERRA DE MENEZES / INSTITUTO DO CARINHO',
      'AÇÃO SOCIAL DO PLANALTO',
      'AÇÃO SOCIAL NOSSA SENHORA DO PERPÉTUO SOCORRO - PROMOVIDA',
      'AÇÃO SOCIAL RENASCER',
      'ACONCHEGO - GRUPO DE APOIO À CONVIVÊNCIA FAMILIAR E COMUNITÁRIA',
      'ALDEIAS INFANTIS SOS BRASIL',
      'AMPARE - ASSOCIAÇÃO DE MÃES, PAIS, AMIGOS E REABILITADORES DE EXCEPCIONAIS',
      'APABB - ASSOCIAÇÃO DE PAIS, AMIGOS E PESSOAS COM DEFICIÊNCIA DE FUNCIONÁRIOS DO BB E DA COMUNIDADE',
      'APB - ASSOCIAÇÃO POSITIVA DE BRASÍLIA',
      'ASSISTÊNCIA SOCIAL CASA AZUL',
      'ASSOCIAÇÃO ANTÔNIO VIEIRA - ASAV / CENTRO CULTURAL DE BRASÍLIA - CCB',
      'ASSOCIAÇÃO BANCORBRÁS DE RESPONSABILIDADE SOCIAL',
      'ASSOCIAÇÃO BENEFICENTE CORAÇÃO DE CRISTO',
      'ASSOCIAÇÃO BENEFICENTE CRISTÃ MÃOS SOLIDÁRIAS SOL NASCENTE',
      'ASSOCIAÇÃO BENÉFICA CRISTÃ PROMOTORA DO DESENVOLVIMENTO INTEGRAL - ABC PRODEIN',
      'ASSOCIAÇÃO BRASÍLIA E DIREITOS SOCIAIS - ABIDS',
      'ASSOCIAÇÃO BRASILEIRA DE ASSISTÊNCIA ÀS FAMÍLIAS DE CRIANÇAS PORTADORAS DE CÂNCER E HEMOPATIAS - ABRACE',
      'ASSOCIAÇÃO BRASILEIRA DE ASSISTÊNCIA ÀS PESSOAS COM CÂNCER - ABRAPEC',
      'ASSOCIAÇÃO BRASILIENSE DE DEFICIENTES VISUAIS - ABDV',
      'ASSOCIAÇÃO CENTRO DE TREINAMENTO DE EDUCAÇÃO FÍSICA ESPECIAL - CETEFE',
      'ASSOCIAÇÃO CENTRO SCALABRINIANO DE ESTUDOS MIGRATÓRIOS - CSEM',
      'ASSOCIAÇÃO COMUNITÁRIA DE SÃO SEBASTIÃO - ASCOM',
      'ASSOCIAÇÃO COMUNITÁRIA DE SAÚDE',
      'ASSOCIAÇÃO CRISTÃ DO LAGO NORTE',
      'ASSOCIAÇÃO CULTURAL JORNADA LITERÁRIA DO DISTRITO FEDERAL',
      'ASSOCIAÇÃO CULTURAL NAMASTÊ',
      'ASSOCIAÇÃO DAS OBRAS PAVONIANAS DE ASSISTÊNCIA - AOPA',
      'ASSOCIAÇÃO DAS OBRAS PAVONIANAS DE ASSISTÊNCIA - CEAL/LP',
      'ASSOCIAÇÃO DE APOIO À FAMÍLIA AO GRUPO E A COMUNIDADE - AFAGO',
      'ASSOCIAÇÃO DE APOIO AOS PORTADORES DE NECESSIDADES ESPECIAIS E DA COMUNIDADE DO DF - ADAPTE/DF',
      'ASSOCIAÇÃO DE CRIANÇAS CARENTES NOVA CANAÃ',
      'ASSOCIAÇÃO DE ENSINO SOCIAL PROFISSIONALIZANTE - ESPRO',
      'ASSOCIAÇÃO DE PAIS E AMIGOS DOS EXCEPCIONAIS DO DF - APAE/DF',
      'ASSOCIAÇÃO DE PAIS E AMIGOS DOS EXCEPCIONAIS E DEFICIENTES DE TAGUATINGA E CEILÂNDIA - APAED/DF',
      'ASSOCIAÇÃO DOS AMIGOS DA SAÚDE MENTAL - ASSIM',
      'ASSOCIAÇÃO DOS IDOSOS DA CEILÂNDIA',
      'ASSOCIAÇÃO DOS IDOSOS DE TAGUATINGA DF',
      'ASSOCIAÇÃO DOS MORADORES DO SETOR QNQ E QNR - AMSQR',
      'ASSOCIAÇÃO LUDOCRIARTE',
      'ASSOCIAÇÃO MARIA DA CONCEIÇÃO - ASMAC',
      'ASSOCIAÇÃO MARIA DE NAZARÉ',
      'ASSOCIAÇÃO MÃOS AMIGAS AMAS',
      'ASSOCIAÇÃO NACIONAL DE EQUOTERAPIA - ANDE-BRASIL',
      'ASSOCIAÇÃO NOSSA SENHORA MÃE DOS HOMENS',
      'ASSOCIAÇÃO PESTALOZZI DE BRASÍLIA',
      'ASSOCIAÇÃO QUALIDADE DE VIDA / INSTITUTO COMPARTILHAR',
      'ASSOCIAÇÃO RECICLE A VIDA',
      'ASSOCIAÇÃO SOCIOCULTURAL SÃO LUIZ ORIONE DO ITAPOÃ/DF - ASLOI',
      'ASSOCIAÇÃO TRAÇOS DE COMUNICAÇÃO E CULTURA',
      'ASSOCIAÇÃO TRANSFORMA VIDAS, AÇÕES SOCIAIS E HUMANITÁRIAS',
      'CARITAS ARQUIDIOCESANA DE BRASÍLIA',
      'CÁRITAS BRASILEIRA',
      'CASA DE ISMAEL - LAR DA CRIANÇA',
      'CASA DO CANDANGO - LAR SÃO JOSÉ',
      'CASA DO CEARÁ',
      'CASA LARES HUMBERTO DE CAMPOS',
      'CENTRO ASSISTENCIAL MARIA CARMEM COLERA',
      'CENTRO COMUNITÁRIO DA CRIANÇA - CCC',
      'CENTRO COMUNITÁRIO DO IDOSO LUÍSA MARILAC',
      'CENTRO DE ENSINO E REABILITAÇÃO - C.E.R',
      'CENTRO DE INTEGRAÇÃO EMPRESA-ESCOLA - CIEE',
      'CENTRO DE PROJETOS E ASSISTÊNCIA INTEGRAL - CEPAI',
      'CENTRO POPULAR DE FORMAÇÃO DA JUVENTUDE',
      'CENTRO SALESIANO DO MENOR - CESAM',
      'CENTRO SOCIAL COMUNITÁRIO TIA ANGELINA',
      'CENTRO SOCIAL FORMAR',
      'COLETIVO DA CIDADE',
      'COMUNIDADE DE RENOVAÇÃO ESPERANÇA E VIDA NOVA - CREVIN',
      'COMUNIDADE EVANGÉLICA DE ASSISTÊNCIA SOCIAL',
      'CONFEDERAÇÃO BRASILEIRA DE SALTOS ORNAMENTAIS',
      'CONGREGAÇÃO DE SÃO JOÃO BATISTA - INSTITUTO PROMOCIONAL MADALENA CAPUTO',
      'CONGREGAÇÃO IRMÃS OBLATAS DO MENINO JESUS',
      'CONSELHO METROPOLITANO DE BRASÍLIA DA SSVP',
      'DESPONTA BRASIL',
      'ÉDEN INSTITUTO DE APOIO AO DESENVOLVIMENTO HUMANO',
      'FEDERAÇÃO ESPÍRITA DO DISTRITO FEDERAL - FEDF',
      'FEDERAÇÃO NACIONAL DAS APAES - FENAPAES',
      'FENAPESTALOZZI - FEDERAÇÃO NACIONAL DAS ASSOCIAÇÕES PESTALOZZI',
      'FUNDAÇÃO BANCO DO BRASIL',
      'FUNDAÇÃO DE ASSISTÊNCIA JUDICIÁRIA DA OAB/DF',
      'FUNDAÇÃO PROCURADOR PEDRO JORGE DE MELO E SILVA',
      'FUNDAÇÃO SOBREVIVI',
      'GRÊMIO ESPÍRITA ATUALPA BARBOSA LIMA',
      'GRUPO DA FRATERNIDADE ESPÍRITA IRMÃO ESTEVÃO - GFEIE',
      'GRUPO LUZ E CURA',
      'HOSPITAL SÃO MATEUS',
      'HOTELZINHO SÃO VICENTE DE PAULO',
      'INSTITUTO AGOSTIN CASTEJON - IAC',
      'INSTITUTO AMPB DE SOLIDARIEDADE',
      'INSTITUTO ASCENDE DE POLÍTICAS PÚBLICAS E DESENVOLVIMENTO TECNOLÓGICO',
      'INSTITUTO BERÇO DA CIDADANIA',
      'INSTITUTO CRISTÃO E SOLIDÁRIO DE CEILÂNDIA - IN CESC',
      'INSTITUTO DE ESTUDOS SOCIOECONÔMICOS - INESC',
      'INSTITUTO DE PROMOÇÃO HUMANA, APRENDIZAGEM E CULTURA',
      'INSTITUTO DOANDO VIDA POR CLARA E RAFA - IDV',
      'INSTITUTO DOM ORIONE',
      'INSTITUTO EVA - EMPODERAMENTO, VALORIZAÇÃO E AUTOESTIMA',
      'INSTITUTO FUTURO E AÇÃO - IFA',
      'INSTITUTO INCLUSÃO DE DESENVOLVIMENTO E PROMOÇÃO SOCIAL',
      'INSTITUTO INTEGRIDADE (Lar dos Velhinhos Maria Madalena)',
      'INSTITUTO LEONARDO MURIALDO',
      'INSTITUTO LUCIMAR MALAQUIAS / COMISSÃO JOVEM GENTE COMO A GENTE',
      'INSTITUTO MAIS BRASAL',
      'INSTITUTO MIGRAÇÕES E DIREITOS HUMANOS - IMDH',
      'INSTITUTO NAIR VALADARES - INAV',
      'INSTITUTO PARA O DESENVOLVIMENTO DA CRIANÇA E DO ADOLESCENTE PELA CULTURA E ESPORTE',
      'INSTITUTO PRÓ EDUCAÇÃO E SAÚDE - PROEZA',
      'INSTITUTO RECICLANDO SONS',
      'INSTITUTO SANTA TERESINHA - INOSEB / NOSSA SENHORA DO BRASIL',
      'INSTITUTO SANTO ANIBAL',
      'INSTITUTO SOCIAL CARLA RIBEIRO',
      'INSTITUTO SOCIAL DO DISTRITO FEDERAL',
      'INSTITUTO SOCIAL E EDUCACIONAL AURORA',
      'INSTITUTO SOCIOCULTURAL, AMBIENTAL E TECNOLÓGICO DE PROJETOS DE ECONOMIA SOLIDÁRIA - IPES',
      'INSTITUTO TOCAR',
      'INSTITUTO VIDA PLENA',
      'INSTITUTO VIVER',
      'ISBET - INSTITUTO BRASILEIRO PRÓ-EDUCAÇÃO, TRABALHO E DESENVOLVIMENTO',
      'LAR ASSISTENCIAL MARIA DE NAZARÉ',
      'LAR DA CRIANÇA PADRE CÍCERO',
      'LAR DAS CRIANÇAS LUIZ HERMANI - LCLH',
      'LAR DE SÃO JOSÉ',
      'LAR DOS VELHINHOS',
      'LAR FABIANO DE CRISTO - CASA DE LÍVIA',
      'LAR INFANTIL CHICO XAVIER',
      'LEGIÃO DA BOA VONTADE - LBV',
      'LEVVO INSTITUTO',
      'MOVIMENTO DE EDUCAÇÃO DE BASE - MEB',
      'OBRA DE ASSISTÊNCIA À INFÂNCIA E À SOCIEDADE - OASIS',
      'OBRA SOCIAL SANTA ISABEL - OSSI',
      'OBRAS ASSISTENCIAIS BEZERRA DE MENEZES',
      'OBRAS ASSISTENCIAIS DO CENTRO ESPÍRITA IRMÃO ÁUREO',
      'OBRAS ASSISTENCIAIS PADRE NATALE BATTEZZI',
      'OBRAS BENEDITA CAMBIÁGIO',
      'OBRAS SOCIAIS DA SOCIEDADE DE DIVULGAÇÃO ESPÍRITA AUTA DE SOUZA',
      'OBRAS SOCIAIS DE ASSISTÊNCIA E DE SERVIÇO SOCIAL DA ARQUIDIOCESE DE BRASÍLIA - OASSAB',
      'OBRAS SOCIAIS DO CENTRO ESPÍRITA BATUÍRA',
      'OBRAS SOCIAIS DO CENTRO ESPÍRITA FRATERNIDADE JERONIMO CANDINHO',
      'ORGANIZAÇÃO NOVA ACRÓPOLE LAGO NORTE',
      'PROGRAMA PROVIDÊNCIA DE ELEVAÇÃO DE RENDA FAMILIAR',
      'PROJETO INTEGRAL DE VIDA - PRÓ-VIDA',
      'PROJETO NOVA VIDA',
      'PROJETO VIDA PADRE GAILHAC',
      'PROJETO VISÃO SOCIAL - PVS',
      'PROSPER - SOCIEDADE CIVIL DE PROFISSIONAIS ASSOCIADOS',
      'REDE FEMININA DE COMBATE AO CÂNCER DE BRASÍLIA - RFCC',
      'REDE NACIONAL DE APRENDIZAGEM, PROMOÇÃO SOCIAL E INTEGRAÇÃO - RENAPSI',
      'REDE SOLIDÁRIA JUNTOS FAREMOS MAIS',
      'SOCIEDADE BÍBLICA DO BRASIL',
      'SOCIEDADE CRISTÃ MARIA E JESUS "NOSSO LAR"',
      'SOCIEDADE ESPÍRITA DE AMPARO AO MENOR - CASA DO CAMINHO',
      'SOCIEDADE ESPÍRITA DE EDUCAÇÃO SEMENTE DE LUZ',
      'TRANSFORME - AÇÕES SOCIAIS E HUMANITÁRIAS',
      'VESP - VILA ESPERANÇA',
      'VILA DO PEQUENINO JESUS',
      'VILELAS SPORT CENTER SOCIAL DF',
      'VIVER - ASSOCIAÇÃO DOS VOLUNTÁRIOS PRÓ-VIDA ESTRUTURADA'
    ]);
  }