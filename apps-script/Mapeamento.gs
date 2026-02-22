/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: Mapeamento.gs
 * Descrição: Mapeamento de campos do formulário
 * Versão: 1.0
 */

/**
 * Mapeia os campos do Google Forms para o objeto de dados
 * @param {Object} respostas - Objeto namedValues do Forms
 * @returns {Object} Dados estruturados
 */
function mapearCampos(respostas) {
  // Compor endereço a partir dos campos separados do formulário
  const cep = obterValor(respostas, 'CEP da Entidade');
  const numero = obterValor(respostas, 'Número');
  const complemento = obterValor(respostas, 'Complemento (sala, bloco, andar)');
  const enderecoCompleto = comporEnderecoPorCEP(cep, numero, complemento);

  const dados = {
    // ========================================
    // IDENTIFICAÇÃO
    // ========================================
    conselheiro: obterValor(respostas, 'Nome do(a) Conselheiro(a)'),
    emailConselheiro: obterValor(respostas, 'E-mail do(a) Conselheiro(a)'),
    instituicao: obterValor(respostas, 'Nome da Instituição Fiscalizada'),
    assuntoTipo: obterValor(respostas, 'Tipo de Processo'),
    anoAcompanhamento: obterValor(respostas, 'Qual o ano do acompanhamento?'),
    modalidade: obterValor(respostas, 'Modalidade da Inscrição'),
    oferta: obterValor(respostas, 'Nome do Serviço/Oferta Fiscalizada'),

    // ========================================
    // DADOS DA VISITA
    // ========================================
    endereco: enderecoCompleto,
    dataVisita: obterValor(respostas, 'Data da Visita'),
    horario: obterValor(respostas, 'Horário da Visita'),
    quemRecebeu: obterValor(respostas, 'Quem recebeu o(a) conselheiro(a)?'),

    // ========================================
    // DOCUMENTAÇÃO
    // ========================================
    licenca: obterValor(respostas, 'Licença de Funcionamento ou Laudo Técnico'),
    unidadePublica: obterValor(respostas, 'É executada em unidade pública cedida?'),
    instrumentoCessao: obterValor(respostas, 'Qual o instrumento jurídico da cessão?'),

    // ========================================
    // PÚBLICO-ALVO
    // ========================================
    publicosAtendidos: obterValor(respostas, 'Públicos Atendidos'),
    registroCDI: obterValor(respostas, 'Se atende IDOSOS - Registro no CDI/DF?'),
    registroCDCA: obterValor(respostas, 'Se atende CRIANÇAS/ADOLESCENTES - Registro no CDCA/DF?'),
    registrosFamilias: obterValor(respostas, 'Se atende FAMÍLIAS - Registros'),

    // ========================================
    // EQUIPE
    // ========================================
    formasAcesso: obterValor(respostas, 'Formas de Acesso dos Usuários'),
    numVoluntarios: obterValor(respostas, 'Número de Voluntários'),
    numContratados: obterValor(respostas, 'Número de Contratados'),
    especialidades: obterValor(respostas, 'Especialidades Presentes na Equipe'),

    // ========================================
    // INFRAESTRUTURA
    // ========================================
    tipoEspaco: obterValor(respostas, 'Tipo de Espaço'),
    acessibilidade: obterValor(respostas, 'Acessibilidade'),
    compartilhaEspaco: obterValor(respostas, 'Compartilha Espaço com Outros Serviços?'),
    servicosCompartilhados: obterValor(respostas, 'Quais serviços compartilham o espaço?'),
    espacoSatisfatorio: obterValor(respostas, 'Adequação do Espaço Físico'),
    inadequacoesEspaco: obterValor(respostas, 'Descreva as inadequações'),

    // ========================================
    // FUNCIONAMENTO
    // ========================================
    dezembroDezembro: obterValor(respostas, 'Funciona de dezembro a dezembro (ano todo)?'),
    recesso: obterValor(respostas, 'Há período de recesso ou férias coletivas?'),
    periodoRecesso: obterValor(respostas, 'Qual o período de recesso/férias?'),
    gratuidade: obterValor(respostas, 'O serviço é totalmente gratuito?'),
    justificativaNaoGratuito: obterValor(respostas, 'Por que o serviço não é gratuito?'),
    bpc: obterValor(respostas, 'Há retenção de BPC?'),
    percentualBPC: obterValor(respostas, 'Qual o percentual de BPC retido?'),

    // ========================================
    // ARTICULAÇÃO
    // ========================================
    articulacaoCRAS: obterValor(respostas, 'Centro de Referência - CRAS'),
    articulacaoCREAS: obterValor(respostas, 'Centro de Referência Especializado - CREAS'),
    articulacaoAcolhimento: obterValor(respostas, 'Unidade de Acolhimento'),
    articulacaoAbordagem: obterValor(respostas, 'Serviço de Abordagem Social'),
    articulacaoPOP: obterValor(respostas, 'Centro POP'),
    articulacaoSaude: obterValor(respostas, 'Serviços de Saúde'),
    articulacaoEducacao: obterValor(respostas, 'Serviços de Educação'),
    articulacaoJustica: obterValor(respostas, 'Sistema de Justiça'),
    articulacaoConselhos: obterValor(respostas, 'Conselhos de Políticas Públicas'),
    articulacao: obterValor(respostas, 'Outras Articulações Relevantes'),

    // ========================================
    // AVALIAÇÃO
    // ========================================
    acoesPlano: obterValor(respostas, 'As ações executadas estão conforme o Plano de Trabalho?'),
    divergenciasPlano: obterValor(respostas, 'Descreva as divergências encontradas'),
    metodologia: obterValor(respostas, 'A metodologia está adequada às normativas?'),
    inadequacoesMetodologia: obterValor(respostas, 'Descreva as inadequações ou ressalvas metodológicas'),
    observacoes: obterValor(respostas, 'Observações Adicionais'),

    // ========================================
    // VOTO
    // ========================================
    analiseTecnica: obterValor(respostas, 'Quanto às análises técnicas da Secretaria Executiva'),
    fundamentosDiscordancia: obterValor(respostas, 'Fundamentos da discordância'),
    voto: obterValor(respostas, 'Voto do(a) Conselheiro(a)'),
    justificativaVoto: obterValor(respostas, 'Justificativa do Voto'),
    dataVoto: obterValor(respostas, 'Data do Voto')
  };

  return dados;
}

/**
 * Obtém valor de um campo do formulário
 * @param {Object} respostas - Objeto de respostas
 * @param {string} nomeCampo - Nome do campo
 * @returns {string} Valor do campo ou string vazia
 */
function obterValor(respostas, nomeCampo) {
  if (respostas[nomeCampo] && respostas[nomeCampo][0]) {
    const valor = respostas[nomeCampo][0];

    // Tratar objetos Date do Google Sheets
    if (valor instanceof Date) {
      // Horários no Sheets têm ano 1899 (epoch de tempo)
      if (valor.getFullYear() === 1899) {
        return Utilities.formatDate(valor, 'America/Sao_Paulo', 'HH:mm');
      }
      return Utilities.formatDate(valor, 'America/Sao_Paulo', 'dd/MM/yyyy');
    }

    const str = valor.toString().trim();

    // Tratar strings de Date.toString() como "Sun Feb 08 2026 00:00:00 GMT-0300..."
    if (str.includes('GMT')) {
      try {
        const d = new Date(str);
        if (!isNaN(d.getTime())) {
          if (d.getFullYear() <= 1899) {
            return Utilities.formatDate(d, 'America/Sao_Paulo', 'HH:mm');
          }
          return Utilities.formatDate(d, 'America/Sao_Paulo', 'dd/MM/yyyy');
        }
      } catch (e) {}
    }

    return str;
  }
  return '';
}

/**
 * Gera mapa de substituições para o template
 * @param {Object} dados - Dados mapeados
 * @returns {Object} Mapa de placeholders para valores
 */
function gerarSubstituicoes(dados) {
  return {
    '{{conselheiro}}': dados.conselheiro || '(não informado)',
    '{{instituicao}}': dados.instituicao || '(não informado)',
    '{{assunto_tipo}}': dados.assuntoTipo || '(não informado)',
    '{{modalidade}}': dados.modalidade || '(não informado)',
    '{{oferta}}': dados.oferta || '(não informado)',
    '{{endereco}}': dados.endereco || '(não informado)',
    '{{data_visita}}': formatarData(dados.dataVisita),
    '{{horario}}': dados.horario || '(não informado)',
    '{{quem_recebeu}}': dados.quemRecebeu || '(não informado)',
    '{{licenca}}': dados.licenca || '(não informado)',
    '{{unidade_publica}}': dados.unidadePublica || '(não informado)',
    '{{registro_cdi}}': dados.registroCDI || 'N/A',
    '{{registro_cdca}}': dados.registroCDCA || 'N/A',
    '{{formas_acesso}}': dados.formasAcesso || '(não informado)',
    '{{num_voluntarios}}': dados.numVoluntarios || '0',
    '{{num_contratados}}': dados.numContratados || '0',
    '{{especialidades}}': dados.especialidades || '(não informado)',
    '{{tipo_espaco}}': dados.tipoEspaco || '(não informado)',
    '{{acessibilidade}}': dados.acessibilidade || '(não informado)',
    '{{compartilha_espaco}}': dados.compartilhaEspaco || '(não informado)',
    '{{espaco_satisfatorio}}': dados.espacoSatisfatorio || '(não informado)',
    '{{dezembro_dezembro}}': dados.dezembroDezembro || '(não informado)',
    '{{recesso}}': dados.recesso || '(não informado)',
    '{{gratuidade}}': dados.gratuidade || '(não informado)',
    '{{bpc}}': dados.bpc || '(não informado)',
    '{{articulacao}}': dados.articulacao || '(não informado)',
    '{{acoes_plano}}': dados.acoesPlano || '(não informado)',
    '{{metodologia}}': dados.metodologia || '(não informado)',
    '{{observacoes}}': dados.observacoes || '(sem observações)',
    '{{analise_tecnica}}': dados.analiseTecnica || '(não informado)',
    '{{fundamentos_discordancia}}': dados.fundamentosDiscordancia || 'N/A',
    '{{voto}}': dados.voto || '(não informado)',
    '{{data_voto}}': formatarData(dados.dataVoto),
    '{{assinatura_relator}}': dados.conselheiro || '(não informado)'
  };
}
