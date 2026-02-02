/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: Recibo.gs
 * Descrição: Geração de comprovante de recebimento no padrão oficial CAS/DF
 * Versão: 2.0
 */

/**
 * Cria comprovante de recebimento como Google Docs e exporta para PDF
 * O conteúdo é dinâmico: só aparece o que o conselheiro preencheu
 * @param {Object} dados - Dados mapeados do formulário
 * @param {Object} recibo - Objeto de recibo com protocolo
 * @returns {File} Arquivo PDF do comprovante
 */
function criarReciboPDF(dados, recibo) {
  // 1. Criar documento
  const nomeDoc = 'Comprovante_' + recibo.protocolo + '_' + (dados.instituicao || 'SemNome').substring(0, 30);
  const doc = DocumentApp.create(nomeDoc);
  const body = doc.getBody();

  // 2. Configurar margens
  body.setMarginTop(72);
  body.setMarginBottom(57);
  body.setMarginLeft(57);
  body.setMarginRight(57);

  // 3. Montar cabeçalho oficial
  montarCabecalhoOficial(doc);

  // 4. Título do comprovante
  body.appendParagraph('');
  const titulo = body.appendParagraph('COMPROVANTE DE RECEBIMENTO DE RELATÓRIO DE FISCALIZAÇÃO');
  titulo.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  titulo.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  titulo.setBold(true);
  titulo.setFontSize(13);
  titulo.setForegroundColor('#1a237e');

  body.appendParagraph('');

  // 5. Box do protocolo
  const proto = body.appendParagraph('Protocolo: ' + recibo.protocolo + '    |    Recebido em: ' + recibo.dataHora);
  proto.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  proto.setBold(true);
  proto.setFontSize(11);
  proto.setForegroundColor('#2e7d32');

  body.appendHorizontalRule();
  body.appendParagraph('');

  // 6. Identificação
  adicionarCampoBold(body, 'Interessado:', dados.instituicao);
  adicionarCampoBold(body, 'Conselheiro(a) Relator(a):', dados.conselheiro);
  adicionarCampoBold(body, 'Assunto:', dados.assuntoTipo);
  adicionarCampoBold(body, 'Modalidade:', dados.modalidade);
  if (dados.oferta) {
    adicionarCampoBold(body, 'Serviço/Oferta:', dados.oferta);
  }
  if (dados.anoAcompanhamento) {
    adicionarCampoBold(body, 'Ano de Acompanhamento:', dados.anoAcompanhamento);
  }

  body.appendHorizontalRule();

  // 7. Dados da Visita
  adicionarSecao(body, '1. DADOS DA VISITA');
  adicionarCampoBold(body, 'Endereço:', dados.endereco);
  adicionarCampoBold(body, 'Data da Visita:', formatarData(dados.dataVisita));
  adicionarCampoBold(body, 'Horário:', dados.horario);
  adicionarCampoBold(body, 'Quem recebeu o(a) conselheiro(a):', dados.quemRecebeu);

  body.appendHorizontalRule();

  // 8. Documentação
  adicionarSecao(body, '2. DOCUMENTAÇÃO');
  adicionarCampoBold(body, 'Licença de Funcionamento/Laudo:', dados.licenca);
  adicionarCampoBold(body, 'Executada em unidade pública cedida:', dados.unidadePublica);
  if (dados.instrumentoCessao) {
    adicionarCampoBold(body, 'Instrumento jurídico da cessão:', dados.instrumentoCessao);
  }

  body.appendHorizontalRule();

  // 9. Público-Alvo
  adicionarSecao(body, '3. PÚBLICO-ALVO');
  if (dados.publicosAtendidos) {
    adicionarCampoBold(body, 'Públicos Atendidos:', dados.publicosAtendidos);
  }
  adicionarCampoBold(body, 'Formas de Acesso:', dados.formasAcesso);
  if (dados.registroCDI && dados.registroCDI !== 'Não se aplica (não atende idosos)') {
    adicionarCampoBold(body, 'Registro CDI/DF (Idosos):', dados.registroCDI);
  }
  if (dados.registroCDCA && dados.registroCDCA !== 'Não se aplica (não atende crianças/adolescentes)') {
    adicionarCampoBold(body, 'Registro CDCA/DF (Crianças/Adolescentes):', dados.registroCDCA);
  }
  if (dados.registrosFamilias) {
    adicionarCampoBold(body, 'Registros Famílias:', dados.registrosFamilias);
  }

  body.appendHorizontalRule();

  // 10. Equipe
  adicionarSecao(body, '4. EQUIPE');
  adicionarCampoBold(body, 'Nº de Voluntários:', dados.numVoluntarios);
  adicionarCampoBold(body, 'Nº de Contratados:', dados.numContratados);
  if (dados.especialidades) {
    adicionarCampoBold(body, 'Especialidades:', dados.especialidades);
  }

  body.appendHorizontalRule();

  // 11. Infraestrutura
  adicionarSecao(body, '5. INFRAESTRUTURA');
  adicionarCampoBold(body, 'Tipo de Espaço:', dados.tipoEspaco);
  if (dados.acessibilidade) {
    adicionarCampoBold(body, 'Acessibilidade:', dados.acessibilidade);
  }
  adicionarCampoBold(body, 'Compartilha Espaço:', dados.compartilhaEspaco);
  if (dados.compartilhaEspaco === 'Sim' && dados.servicosCompartilhados) {
    adicionarCampoBold(body, 'Serviços que compartilham:', dados.servicosCompartilhados);
  }
  adicionarCampoBold(body, 'Adequação do Espaço:', dados.espacoSatisfatorio);
  if (dados.inadequacoesEspaco) {
    adicionarCampoBold(body, 'Inadequações:', dados.inadequacoesEspaco);
  }

  body.appendHorizontalRule();

  // 12. Funcionamento
  adicionarSecao(body, '6. FUNCIONAMENTO');
  adicionarCampoBold(body, 'Funciona dezembro a dezembro:', dados.dezembroDezembro);
  adicionarCampoBold(body, 'Período de recesso/férias:', dados.recesso);
  if (dados.recesso === 'Sim' && dados.periodoRecesso) {
    adicionarCampoBold(body, 'Período:', dados.periodoRecesso);
  }
  adicionarCampoBold(body, 'Serviço gratuito:', dados.gratuidade);
  if (dados.gratuidade && dados.gratuidade.indexOf('Não') >= 0 && dados.justificativaNaoGratuito) {
    adicionarCampoBold(body, 'Justificativa:', dados.justificativaNaoGratuito);
  }
  adicionarCampoBold(body, 'Retenção de BPC:', dados.bpc);
  if (dados.bpc === 'Sim' && dados.percentualBPC) {
    adicionarCampoBold(body, 'Percentual retido:', dados.percentualBPC);
  }

  body.appendHorizontalRule();

  // 13. Articulação com a Rede
  adicionarSecao(body, '7. ARTICULAÇÃO COM A REDE');
  adicionarCampoBold(body, 'CRAS:', dados.articulacaoCRAS);
  adicionarCampoBold(body, 'CREAS:', dados.articulacaoCREAS);
  if (dados.articulacaoAcolhimento && dados.articulacaoAcolhimento !== 'Não se aplica') {
    adicionarCampoBold(body, 'Unidade de Acolhimento:', dados.articulacaoAcolhimento);
  }
  if (dados.articulacaoAbordagem && dados.articulacaoAbordagem !== 'Não se aplica') {
    adicionarCampoBold(body, 'Abordagem Social:', dados.articulacaoAbordagem);
  }
  if (dados.articulacaoPOP && dados.articulacaoPOP !== 'Não se aplica') {
    adicionarCampoBold(body, 'Centro POP:', dados.articulacaoPOP);
  }
  adicionarCampoBold(body, 'Serviços de Saúde:', dados.articulacaoSaude);
  adicionarCampoBold(body, 'Serviços de Educação:', dados.articulacaoEducacao);
  adicionarCampoBold(body, 'Sistema de Justiça:', dados.articulacaoJustica);
  adicionarCampoBold(body, 'Conselhos de Políticas Públicas:', dados.articulacaoConselhos);
  if (dados.articulacao) {
    adicionarCampoBold(body, 'Outras Articulações:', dados.articulacao);
  }

  body.appendHorizontalRule();

  // 14. Avaliação
  adicionarSecao(body, '8. AVALIAÇÃO');
  adicionarCampoBold(body, 'Ações conforme Plano de Trabalho:', dados.acoesPlano);
  if (dados.divergenciasPlano) {
    adicionarCampoBold(body, 'Divergências:', dados.divergenciasPlano);
  }
  adicionarCampoBold(body, 'Metodologia adequada às normativas:', dados.metodologia);
  if (dados.inadequacoesMetodologia) {
    adicionarCampoBold(body, 'Inadequações/Ressalvas:', dados.inadequacoesMetodologia);
  }
  if (dados.observacoes) {
    adicionarCampoBold(body, 'Observações Adicionais:', dados.observacoes);
  }

  body.appendHorizontalRule();

  // 15. Voto
  adicionarSecao(body, '9. DO VOTO');
  adicionarCampoBold(body, 'Quanto às análises técnicas da Secretaria Executiva:', dados.analiseTecnica);
  if (dados.fundamentosDiscordancia) {
    adicionarCampoBold(body, 'Fundamentos da discordância:', dados.fundamentosDiscordancia);
  }

  body.appendParagraph('');
  const labelVoto = body.appendParagraph('O(A) Conselheiro(a) vota pelo(a):');
  labelVoto.setBold(true);
  const textoVoto = body.appendParagraph(dados.voto || '(não informado)');
  textoVoto.setBold(true);
  textoVoto.setFontSize(12);
  textoVoto.setForegroundColor('#1a237e');

  if (dados.justificativaVoto) {
    body.appendParagraph('');
    adicionarCampoBold(body, 'Justificativa:', dados.justificativaVoto);
  }

  body.appendParagraph('');
  adicionarCampoBold(body, 'Data do Voto:', formatarData(dados.dataVoto));

  // 16. Assinatura
  body.appendParagraph('');
  body.appendParagraph('');
  const deliberacao = body.appendParagraph('Seja o presente voto submetido à deliberação da plenária.');
  deliberacao.setItalic(true);

  body.appendParagraph('');
  body.appendParagraph('');

  const linhaAss = body.appendParagraph('_____________________________________________________________');
  linhaAss.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

  const nomeAss = body.appendParagraph((dados.conselheiro || 'Conselheiro(a)').toUpperCase());
  nomeAss.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  nomeAss.setBold(true);

  const cargoAss = body.appendParagraph('Conselheiro(a) Relator(a) - CAS/DF');
  cargoAss.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

  // 17. Rodapé oficial
  montarRodapeOficial(doc, recibo);

  // 18. Salvar e fechar
  doc.saveAndClose();

  // 19. Mover para pasta e exportar PDF
  const pasta = obterOuCriarPasta(FOLDER_NAME);
  const docFile = DriveApp.getFileById(doc.getId());
  docFile.moveTo(pasta);

  const blob = docFile.getAs('application/pdf');
  blob.setName('Comprovante_' + recibo.protocolo + '.pdf');
  const pdfFile = pasta.createFile(blob);

  Logger.log('Comprovante PDF gerado: ' + pdfFile.getName());
  return pdfFile;
}

/**
 * Monta cabeçalho oficial CAS/DF no documento
 * @param {Document} doc - Documento Google Docs
 */
function montarCabecalhoOficial(doc) {
  const header = doc.addHeader();

  const linha1 = header.appendParagraph('Governo do Distrito Federal');
  linha1.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  linha1.setFontSize(10);

  const linha2 = header.appendParagraph('Secretaria de Estado de Desenvolvimento Social do Distrito Federal');
  linha2.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  linha2.setFontSize(10);

  const linha3 = header.appendParagraph('Gabinete');
  linha3.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  linha3.setFontSize(10);

  const linha4 = header.appendParagraph('Conselho de Assistência Social do Distrito Federal');
  linha4.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  linha4.setBold(true);
  linha4.setFontSize(10);
}

/**
 * Monta rodapé oficial CAS/DF
 * @param {Document} doc - Documento Google Docs
 * @param {Object} recibo - Objeto de recibo
 */
function montarRodapeOficial(doc, recibo) {
  const footer = doc.addFooter();

  const sep = footer.appendParagraph('___________________________________________________________________________');
  sep.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  sep.setFontSize(8);
  sep.setForegroundColor('#999999');

  const f1 = footer.appendParagraph('"Brasília - Patrimônio Cultural da Humanidade"');
  f1.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  f1.setFontSize(8);

  const f2 = footer.appendParagraph('SEPN Quadra 515 Lote 02 Bloco B - Bairro Asa Norte - CEP 70.770-502 – DF');
  f2.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  f2.setFontSize(8);

  const f3 = footer.appendParagraph('Cas_df@sedes.df.gov.br');
  f3.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  f3.setFontSize(8);

  const f4 = footer.appendParagraph('3773-7213  3773-7214');
  f4.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  f4.setFontSize(8);

  const f5 = footer.appendParagraph('Protocolo: ' + recibo.protocolo + ' | Gerado em: ' + recibo.dataHora);
  f5.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  f5.setFontSize(7);
  f5.setForegroundColor('#999999');
}

/**
 * Adiciona título de seção formatado
 * @param {Body} body - Corpo do documento
 * @param {string} titulo - Texto da seção
 */
function adicionarSecao(body, titulo) {
  body.appendParagraph('');
  const p = body.appendParagraph(titulo);
  p.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  p.setBold(true);
  p.setForegroundColor('#283593');
  p.setFontSize(11);
}

/**
 * Adiciona campo com label em negrito e valor normal
 * Só adiciona se o valor existir
 * @param {Body} body - Corpo do documento
 * @param {string} label - Label do campo
 * @param {string} valor - Valor do campo
 */
function adicionarCampoBold(body, label, valor) {
  if (!valor) return;

  const p = body.appendParagraph(label + ' ' + valor);
  const texto = p.editAsText();
  texto.setBold(0, label.length - 1, true);
  texto.setBold(label.length, p.getText().length - 1, false);
  p.setFontSize(10);
}
