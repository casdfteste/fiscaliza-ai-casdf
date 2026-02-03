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

  // ========================================
  // IDENTIFICAÇÃO (campos do formulário)
  // ========================================
  adicionarCampoBold(body, 'Nome do(a) Conselheiro(a):', dados.conselheiro);
  adicionarCampoBold(body, 'Nome da Instituição Fiscalizada:', dados.instituicao);
  adicionarCampoBold(body, 'Tipo de Processo:', dados.assuntoTipo);
  adicionarCampoBold(body, 'Modalidade da Inscrição:', dados.modalidade);
  adicionarCampoBold(body, 'Nome do Serviço/Oferta Fiscalizada:', dados.oferta);
  adicionarCampoBold(body, 'Ano do acompanhamento:', dados.anoAcompanhamento);

  body.appendHorizontalRule();

  // ========================================
  // DADOS DA VISITA
  // ========================================
  adicionarSecao(body, 'DADOS DA VISITA');
  adicionarCampoBold(body, 'Endereço Completo:', dados.endereco);
  adicionarCampoBold(body, 'Data da Visita:', formatarData(dados.dataVisita));
  adicionarCampoBold(body, 'Horário da Visita:', dados.horario);
  adicionarCampoBold(body, 'Quem recebeu o(a) conselheiro(a)?', dados.quemRecebeu);

  body.appendHorizontalRule();

  // ========================================
  // DOCUMENTAÇÃO
  // ========================================
  adicionarSecao(body, 'DOCUMENTAÇÃO');
  adicionarCampoBold(body, 'Licença de Funcionamento ou Laudo Técnico:', dados.licenca);
  adicionarCampoBold(body, 'É executada em unidade pública cedida?', dados.unidadePublica);
  if (dados.instrumentoCessao) {
    adicionarCampoBold(body, 'Qual o instrumento jurídico da cessão?', dados.instrumentoCessao);
  }

  body.appendHorizontalRule();

  // ========================================
  // PÚBLICO-ALVO
  // ========================================
  adicionarSecao(body, 'PÚBLICO-ALVO');
  adicionarCampoBold(body, 'Públicos Atendidos:', dados.publicosAtendidos);
  adicionarCampoBold(body, 'Formas de Acesso dos Usuários:', dados.formasAcesso);
  if (dados.registroCDI) {
    adicionarCampoBold(body, 'Se atende IDOSOS - Registro no CDI/DF?', dados.registroCDI);
  }
  if (dados.registroCDCA) {
    adicionarCampoBold(body, 'Se atende CRIANÇAS/ADOLESCENTES - Registro no CDCA/DF?', dados.registroCDCA);
  }
  if (dados.registrosFamilias) {
    adicionarCampoBold(body, 'Se atende FAMÍLIAS - Registros:', dados.registrosFamilias);
  }

  body.appendHorizontalRule();

  // ========================================
  // EQUIPE
  // ========================================
  adicionarSecao(body, 'EQUIPE DE PROFISSIONAIS');
  adicionarCampoBold(body, 'Número de Voluntários:', dados.numVoluntarios);
  adicionarCampoBold(body, 'Número de Contratados:', dados.numContratados);
  adicionarCampoBold(body, 'Especialidades Presentes na Equipe:', dados.especialidades);

  body.appendHorizontalRule();

  // ========================================
  // INFRAESTRUTURA
  // ========================================
  adicionarSecao(body, 'INFRAESTRUTURA');
  adicionarCampoBold(body, 'Tipo de Espaço:', dados.tipoEspaco);
  adicionarCampoBold(body, 'Acessibilidade:', dados.acessibilidade);
  adicionarCampoBold(body, 'Compartilha Espaço com Outros Serviços?', dados.compartilhaEspaco);
  if (dados.servicosCompartilhados) {
    adicionarCampoBold(body, 'Quais serviços compartilham o espaço?', dados.servicosCompartilhados);
  }
  adicionarCampoBold(body, 'Adequação do Espaço Físico:', dados.espacoSatisfatorio);
  if (dados.inadequacoesEspaco) {
    adicionarCampoBold(body, 'Descreva as inadequações:', dados.inadequacoesEspaco);
  }

  body.appendHorizontalRule();

  // ========================================
  // FUNCIONAMENTO
  // ========================================
  adicionarSecao(body, 'FUNCIONAMENTO');
  adicionarCampoBold(body, 'Funciona de dezembro a dezembro (ano todo)?', dados.dezembroDezembro);
  adicionarCampoBold(body, 'Há período de recesso ou férias coletivas?', dados.recesso);
  if (dados.periodoRecesso) {
    adicionarCampoBold(body, 'Qual o período de recesso/férias?', dados.periodoRecesso);
  }
  adicionarCampoBold(body, 'O serviço é totalmente gratuito?', dados.gratuidade);
  if (dados.justificativaNaoGratuito) {
    adicionarCampoBold(body, 'Por que o serviço não é gratuito?', dados.justificativaNaoGratuito);
  }
  adicionarCampoBold(body, 'Há retenção de BPC?', dados.bpc);
  if (dados.percentualBPC) {
    adicionarCampoBold(body, 'Qual o percentual de BPC retido?', dados.percentualBPC);
  }

  body.appendHorizontalRule();

  // ========================================
  // ARTICULAÇÃO COM A REDE
  // ========================================
  adicionarSecao(body, 'ARTICULAÇÃO COM A REDE SETORIAL SUAS');
  adicionarCampoBold(body, 'Centro de Referência - CRAS:', dados.articulacaoCRAS);
  adicionarCampoBold(body, 'Centro de Referência Especializado - CREAS:', dados.articulacaoCREAS);
  adicionarCampoBold(body, 'Unidade de Acolhimento:', dados.articulacaoAcolhimento);
  adicionarCampoBold(body, 'Serviço de Abordagem Social:', dados.articulacaoAbordagem);
  adicionarCampoBold(body, 'Centro POP:', dados.articulacaoPOP);
  adicionarCampoBold(body, 'Serviços de Saúde:', dados.articulacaoSaude);
  adicionarCampoBold(body, 'Serviços de Educação:', dados.articulacaoEducacao);
  adicionarCampoBold(body, 'Sistema de Justiça:', dados.articulacaoJustica);
  adicionarCampoBold(body, 'Conselhos de Políticas Públicas:', dados.articulacaoConselhos);
  if (dados.articulacao) {
    adicionarCampoBold(body, 'Outras Articulações Relevantes:', dados.articulacao);
  }

  body.appendHorizontalRule();

  // ========================================
  // AVALIAÇÃO
  // ========================================
  adicionarSecao(body, 'AVALIAÇÃO');
  adicionarCampoBold(body, 'As ações executadas estão conforme o Plano de Trabalho?', dados.acoesPlano);
  if (dados.divergenciasPlano) {
    adicionarCampoBold(body, 'Descreva as divergências encontradas:', dados.divergenciasPlano);
  }
  adicionarCampoBold(body, 'A metodologia está adequada às normativas?', dados.metodologia);
  if (dados.inadequacoesMetodologia) {
    adicionarCampoBold(body, 'Descreva as inadequações ou ressalvas metodológicas:', dados.inadequacoesMetodologia);
  }
  adicionarCampoBold(body, 'Observações Adicionais:', dados.observacoes);

  body.appendHorizontalRule();

  // ========================================
  // DO VOTO
  // ========================================
  adicionarSecao(body, 'DO VOTO');
  adicionarCampoBold(body, 'Quanto às análises técnicas da Secretaria Executiva:', dados.analiseTecnica);
  if (dados.fundamentosDiscordancia) {
    adicionarCampoBold(body, 'Fundamentos da discordância:', dados.fundamentosDiscordancia);
  }

  body.appendParagraph('');
  const labelVoto = body.appendParagraph('Voto do(a) Conselheiro(a):');
  labelVoto.setBold(true);
  const textoVoto = body.appendParagraph(dados.voto || '(não informado)');
  textoVoto.setBold(true);
  textoVoto.setFontSize(12);
  textoVoto.setForegroundColor('#1a237e');

  if (dados.justificativaVoto) {
    body.appendParagraph('');
    adicionarCampoBold(body, 'Justificativa do Voto:', dados.justificativaVoto);
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

  // Inserir logo CAS/DF
  try {
    var logoBlob = obterLogoBlob();
    if (logoBlob) {
      var imgPar = header.appendParagraph('');
      imgPar.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      var img = imgPar.appendInlineImage(logoBlob);
      var larguraOriginal = img.getWidth();
      var alturaOriginal = img.getHeight();
      var novaLargura = 150;
      var novaAltura = Math.round(alturaOriginal * (novaLargura / larguraOriginal));
      img.setWidth(novaLargura);
      img.setHeight(novaAltura);
    }
  } catch (e) {
    Logger.log('Aviso: logo no comprovante: ' + e.message);
  }

  const linha1 = header.appendParagraph('Governo do Distrito Federal');
  linha1.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  linha1.setFontSize(10);
  linha1.setForegroundColor('#333333');

  const linha2 = header.appendParagraph('Secretaria de Estado de Desenvolvimento Social do Distrito Federal');
  linha2.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  linha2.setFontSize(10);
  linha2.setForegroundColor('#333333');

  const linha3 = header.appendParagraph('Gabinete');
  linha3.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  linha3.setFontSize(10);
  linha3.setForegroundColor('#333333');

  const linha4 = header.appendParagraph('Conselho de Assistência Social do Distrito Federal');
  linha4.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  linha4.setBold(true);
  linha4.setFontSize(10);
  linha4.setForegroundColor('#1a237e');
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
