/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: Config.gs
 * Descrição: Constantes e configurações globais
 * Versão: 1.0
 */

// ========================================
// IDs DOS RECURSOS GOOGLE
// ========================================

// Google Forms - Formulário de Fiscalização v9.0
const FORM_ID = "1qwMKiEYcp9nUGJQZGqBInmXZwbUc4djDC4N2HW37GLg";

// Planilha de Respostas
const SHEET_ID = "1LuF54HNB_VbRlZMEq3-nmx4HfUXosG_ZcGUW1MxPffI";

// Template do Documento
const TEMPLATE_ID = "1gmdFgJt7KTfDfnh5gXBrv_mKbn8kjETaei_KcBGgYJ4";

// Email Institucional CAS/DF
const EMAIL_CASDF = "cas_df@sedes.df.gov.br";

// Email do Administrador (para notificações de erro)
const EMAIL_ADMIN = "adactoartur.gestor@gmail.com";

// Pasta de Destino no Drive
const FOLDER_NAME = "Relatórios CAS-DF 2026";

// ========================================
// CONFIGURAÇÕES DE IMAGEM
// ========================================

const IMAGE_MAX_WIDTH = 450;   // pixels (~15cm)
const IMAGE_MAX_HEIGHT = 300;  // pixels (~10cm)

// ========================================
// CONFIGURAÇÕES DE PDF
// ========================================

const PDF_MAX_SIZE = 10485760; // 10MB em bytes

// ========================================
// CORES INSTITUCIONAIS
// ========================================

const COLOR_TITLE = "#1a237e";      // Azul escuro
const COLOR_SUBTITLE = "#283593";   // Azul médio
const COLOR_TEXT = "#000000";       // Preto
const COLOR_CAPTION = "#666666";    // Cinza

// ========================================
// CAMPOS DE FOTO NO FORMULÁRIO
// ========================================

const CAMPOS_FOTO = [
  '📸 Foto da Licença/Laudo (se houver)',
  '📸 Foto da Fachada/Identificação',
  '📸 Fotos de Acessibilidade',
  '📸 Fotos dos Espaços',
  '📸 Fotos de Atividades',
  '📸 Fotos Adicionais'
];
/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: Utils.gs
 * Descrição: Funções utilitárias
 * Versão: 1.0
 */

/**
 * Formata data para exibição (DD/MM/AAAA)
 * @param {string|Date} data - Data a ser formatada
 * @returns {string} Data formatada
 */
function formatarData(data) {
  if (!data) return '(não informado)';

  try {
    // Se for string no formato YYYY-MM-DD
    if (typeof data === 'string') {
      if (data.includes('-')) {
        const partes = data.split('-');
        if (partes.length === 3) {
          return partes[2] + '/' + partes[1] + '/' + partes[0];
        }
      }
      // Se já está no formato DD/MM/YYYY
      if (data.includes('/')) {
        return data;
      }
    }

    // Se for objeto Date
    if (data instanceof Date) {
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      return dia + '/' + mes + '/' + ano;
    }

    return data.toString();
  } catch (error) {
    Logger.log('Erro ao formatar data: ' + error.message);
    return data.toString();
  }
}

/**
 * Formata data para nome de arquivo (AAAA-MM-DD)
 * @param {string|Date} data - Data a ser formatada
 * @returns {string} Data formatada para arquivo
 */
function formatarDataArquivo(data) {
  if (!data) {
    const hoje = new Date();
    return Utilities.formatDate(hoje, 'America/Sao_Paulo', 'yyyy-MM-dd');
  }

  try {
    // Se já está no formato YYYY-MM-DD
    if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return data;
    }

    // Se está no formato DD/MM/YYYY
    if (typeof data === 'string' && data.includes('/')) {
      const partes = data.split('/');
      if (partes.length === 3) {
        return partes[2] + '-' + partes[1] + '-' + partes[0];
      }
    }

    // Se for objeto Date
    if (data instanceof Date) {
      return Utilities.formatDate(data, 'America/Sao_Paulo', 'yyyy-MM-dd');
    }

    // Tenta converter para Date
    const dataObj = new Date(data);
    if (!isNaN(dataObj.getTime())) {
      return Utilities.formatDate(dataObj, 'America/Sao_Paulo', 'yyyy-MM-dd');
    }

    return 'sem-data';
  } catch (error) {
    Logger.log('Erro ao formatar data para arquivo: ' + error.message);
    return 'sem-data';
  }
}

/**
 * Valida email
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se válido
 */
function validarEmail(email) {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Limpa texto removendo caracteres especiais
 * @param {string} texto - Texto a ser limpo
 * @returns {string} Texto limpo
 */
function limparTexto(texto) {
  if (!texto) return '';

  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove acentos
    .replace(/[^\w\s.-]/g, '')         // Remove caracteres especiais
    .trim();
}

/**
 * Trunca texto em tamanho máximo
 * @param {string} texto - Texto a ser truncado
 * @param {number} tamanhoMax - Tamanho máximo
 * @returns {string} Texto truncado
 */
function truncarTexto(texto, tamanhoMax) {
  if (!texto) return '';
  if (texto.length <= tamanhoMax) return texto;
  return texto.substring(0, tamanhoMax - 3) + '...';
}

/**
 * Gera timestamp para log
 * @returns {string} Timestamp formatado
 */
function timestamp() {
  return Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd HH:mm:ss');
}

/**
 * Log com timestamp
 * @param {string} mensagem - Mensagem a ser logada
 */
function log(mensagem) {
  Logger.log('[' + timestamp() + '] ' + mensagem);
}

/**
 * Verifica se está em horário comercial
 * @returns {boolean} True se em horário comercial
 */
function emHorarioComercial() {
  const agora = new Date();
  const hora = agora.getHours();
  const diaSemana = agora.getDay();

  // Segunda a Sexta (1-5), das 8h às 18h
  return diaSemana >= 1 && diaSemana <= 5 && hora >= 8 && hora < 18;
}

/**
 * Obtém versão do sistema
 * @returns {Object} Informações da versão
 */
function obterVersao() {
  return {
    sistema: 'Sistema de Fiscalização CAS/DF',
    versao: '1.0.0',
    dataAtualizacao: '2026-01-28',
    autor: 'Adacto Artur'
  };
}

/**
 * Exibe informações do sistema no log
 */
function exibirInfoSistema() {
  const versao = obterVersao();

  Logger.log('========================================');
  Logger.log(versao.sistema);
  Logger.log('Versão: ' + versao.versao);
  Logger.log('Atualizado em: ' + versao.dataAtualizacao);
  Logger.log('========================================');
}
/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: Drive.gs
 * Descrição: Gerenciamento de arquivos no Google Drive
 * Versão: 1.0
 */

/**
 * Obtém ou cria a pasta de destino
 * @param {string} nomePasta - Nome da pasta
 * @returns {Folder} Pasta do Google Drive
 */
function obterOuCriarPasta(nomePasta) {
  const folders = DriveApp.getFoldersByName(nomePasta);

  if (folders.hasNext()) {
    const pasta = folders.next();
    Logger.log('Pasta existente encontrada: ' + pasta.getName());
    return pasta;
  } else {
    const novaPasta = DriveApp.createFolder(nomePasta);
    Logger.log('Nova pasta criada: ' + novaPasta.getName());
    return novaPasta;
  }
}

/**
 * Organiza arquivos na pasta correta
 * @param {File} docFile - Arquivo do documento
 * @param {File} pdfFile - Arquivo PDF
 */
function organizarArquivos(docFile, pdfFile) {
  // Arquivos já são criados na pasta correta
  // Esta função pode ser expandida para organização adicional

  Logger.log('Arquivos organizados:');
  Logger.log(' - DOC: ' + docFile.getName());
  Logger.log(' - PDF: ' + pdfFile.getName());
}

/**
 * Lista todos os relatórios na pasta
 * @returns {Array} Lista de arquivos
 */
function listarRelatorios() {
  const pasta = obterOuCriarPasta(FOLDER_NAME);
  const arquivos = pasta.getFiles();
  const lista = [];

  while (arquivos.hasNext()) {
    const arquivo = arquivos.next();
    lista.push({
      nome: arquivo.getName(),
      id: arquivo.getId(),
      url: arquivo.getUrl(),
      tamanho: arquivo.getSize(),
      dataCriacao: arquivo.getDateCreated()
    });
  }

  Logger.log('Total de arquivos na pasta: ' + lista.length);
  return lista;
}

/**
 * Limpa arquivos antigos (mais de X dias)
 * @param {number} diasRetencao - Número de dias para manter arquivos
 */
function limparArquivosAntigos(diasRetencao) {
  const pasta = obterOuCriarPasta(FOLDER_NAME);
  const arquivos = pasta.getFiles();
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - diasRetencao);

  let removidos = 0;

  while (arquivos.hasNext()) {
    const arquivo = arquivos.next();
    if (arquivo.getDateCreated() < dataLimite) {
      arquivo.setTrashed(true);
      removidos++;
      Logger.log('Arquivo movido para lixeira: ' + arquivo.getName());
    }
  }

  Logger.log('Total de arquivos removidos: ' + removidos);
}

/**
 * Verifica espaço disponível na conta
 * @returns {Object} Informações de armazenamento
 */
function verificarEspaco() {
  const total = DriveApp.getStorageLimit();
  const usado = DriveApp.getStorageUsed();
  const disponivel = total - usado;

  const info = {
    totalGB: (total / 1024 / 1024 / 1024).toFixed(2),
    usadoGB: (usado / 1024 / 1024 / 1024).toFixed(2),
    disponivelGB: (disponivel / 1024 / 1024 / 1024).toFixed(2),
    percentualUsado: ((usado / total) * 100).toFixed(1)
  };

  Logger.log('Espaço no Drive:');
  Logger.log(' - Total: ' + info.totalGB + ' GB');
  Logger.log(' - Usado: ' + info.usadoGB + ' GB (' + info.percentualUsado + '%)');
  Logger.log(' - Disponível: ' + info.disponivelGB + ' GB');

  return info;
}
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
    endereco: obterValor(respostas, 'Endereço Completo'),
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
    return respostas[nomeCampo][0].toString().trim();
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
    '{{data_voto}}': formatarData(dados.dataVoto)
  };
}
/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: Imagens.gs
 * Descrição: Processamento de fotos
 * Versão: 1.0
 */

/**
 * Processa todas as fotos do formulário
 * @param {Object} respostas - Objeto namedValues do Forms
 * @returns {Array} Array de objetos com dados das fotos
 */
function processarFotos(respostas) {
  const fotos = [];

  CAMPOS_FOTO.forEach(campo => {
    if (respostas[campo] && respostas[campo][0]) {
      const url = respostas[campo][0];
      const fileId = extrairFileId(url);

      if (fileId) {
        try {
          const file = DriveApp.getFileById(fileId);
          const blob = file.getBlob();

          fotos.push({
            campo: campo,
            fileId: fileId,
            blob: blob,
            legenda: campo.replace('📸 ', ''),
            nome: file.getName(),
            tamanho: file.getSize()
          });

          Logger.log('✅ Foto processada: ' + campo);
        } catch (error) {
          Logger.log('⚠️ Erro ao processar foto "' + campo + '": ' + error.message);
        }
      }
    }
  });

  return fotos;
}

/**
 * Extrai o FILE_ID de uma URL do Google Drive
 * @param {string} url - URL do arquivo no Drive
 * @returns {string|null} FILE_ID ou null se não encontrado
 */
function extrairFileId(url) {
  if (!url) return null;

  // Padrões comuns de URLs do Google Drive
  const patterns = [
    /\/d\/([a-zA-Z0-9_-]+)/,           // /d/FILE_ID/
    /id=([a-zA-Z0-9_-]+)/,             // ?id=FILE_ID
    /open\?id=([a-zA-Z0-9_-]+)/,       // open?id=FILE_ID
    /file\/d\/([a-zA-Z0-9_-]+)/,       // file/d/FILE_ID
    /uc\?id=([a-zA-Z0-9_-]+)/          // uc?id=FILE_ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Tenta URL como ID direto (caso seja apenas o ID)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(url)) {
    return url;
  }

  return null;
}

/**
 * Insere foto no documento
 * @param {Body} body - Corpo do documento
 * @param {string} placeholder - Placeholder a ser substituído
 * @param {Blob} blob - Imagem como blob
 * @param {string} legenda - Legenda da foto
 * @returns {boolean} Sucesso da operação
 */
function inserirFoto(body, placeholder, blob, legenda) {
  try {
    const searchResult = body.findText(placeholder);

    if (searchResult) {
      const element = searchResult.getElement();
      const parent = element.getParent();
      const parentIndex = body.getChildIndex(parent);

      // Inserir imagem
      const image = body.insertImage(parentIndex + 1, blob);

      // Configurar tamanho mantendo proporção
      const originalWidth = image.getWidth();
      const originalHeight = image.getHeight();

      if (originalWidth > IMAGE_MAX_WIDTH) {
        const ratio = IMAGE_MAX_WIDTH / originalWidth;
        image.setWidth(IMAGE_MAX_WIDTH);
        image.setHeight(originalHeight * ratio);
      }

      // Limitar altura máxima
      if (image.getHeight() > IMAGE_MAX_HEIGHT) {
        const ratio = IMAGE_MAX_HEIGHT / image.getHeight();
        image.setHeight(IMAGE_MAX_HEIGHT);
        image.setWidth(image.getWidth() * ratio);
      }

      // Adicionar legenda
      const legendaParagrafo = body.insertParagraph(parentIndex + 2, legenda);
      legendaParagrafo.setItalic(true);
      legendaParagrafo.setForegroundColor(COLOR_CAPTION);
      legendaParagrafo.setAlignment(DocumentApp.HorizontalAlignment.CENTER);

      // Remover placeholder
      parent.removeFromParent();

      return true;
    }

    return false;
  } catch (error) {
    Logger.log('Erro ao inserir foto: ' + error.message);
    return false;
  }
}

/**
 * Remove seção de foto quando não foi fornecida
 * @param {Body} body - Corpo do documento
 * @param {string} placeholder - Placeholder a ser removido
 */
function removerSecaoSemFoto(body, placeholder) {
  try {
    const searchResult = body.findText(placeholder);

    if (searchResult) {
      const element = searchResult.getElement();
      const parent = element.getParent();
      parent.removeFromParent();
    }
  } catch (error) {
    Logger.log('Erro ao remover seção: ' + error.message);
  }
}

/**
 * Processa e insere todas as fotos no documento
 * @param {Body} body - Corpo do documento
 * @param {Array} fotos - Array de objetos de foto
 */
function inserirTodasFotos(body, fotos) {
  // Criar mapa de fotos por campo
  const mapaFotos = {};
  fotos.forEach(foto => {
    mapaFotos[foto.campo] = foto;
  });

  // Processar cada campo de foto
  CAMPOS_FOTO.forEach((campo, index) => {
    const placeholder = '{{foto_' + (index + 1) + '}}';

    if (mapaFotos[campo]) {
      const foto = mapaFotos[campo];
      const sucesso = inserirFoto(body, placeholder, foto.blob, foto.legenda);

      if (!sucesso) {
        Logger.log('Placeholder não encontrado: ' + placeholder);
      }
    } else {
      // Remover placeholder de foto não fornecida
      removerSecaoSemFoto(body, placeholder);
    }
  });
}
/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: Documento.gs
 * Descrição: Criação e formatação de documentos
 * Versão: 1.0
 */

/**
 * Cria documento a partir do template
 * @param {Object} dados - Dados mapeados do formulário
 * @returns {File} Arquivo do documento criado
 */
function criarDocumento(dados) {
  // 1. Obter template
  const templateFile = DriveApp.getFileById(TEMPLATE_ID);

  // 2. Criar nome do arquivo
  const nomeArquivo = criarNomeArquivo(dados);

  // 3. Fazer cópia do template
  const pasta = obterOuCriarPasta(FOLDER_NAME);
  const novaCopia = templateFile.makeCopy(nomeArquivo, pasta);

  Logger.log('Documento criado: ' + novaCopia.getName());

  // 4. Abrir documento para edição
  const doc = DocumentApp.openById(novaCopia.getId());
  const body = doc.getBody();

  // 5. Substituir placeholders de texto
  substituirTextos(body, dados);

  // 6. Inserir fotos
  if (dados.fotos && dados.fotos.length > 0) {
    inserirTodasFotos(body, dados.fotos);
  }

  // 7. Aplicar formatação final
  aplicarFormatacao(doc);

  // 8. Salvar e fechar
  doc.saveAndClose();

  return novaCopia;
}

/**
 * Substitui todos os placeholders de texto no documento
 * @param {Body} body - Corpo do documento
 * @param {Object} dados - Dados mapeados
 */
function substituirTextos(body, dados) {
  const substituicoes = gerarSubstituicoes(dados);

  for (const [placeholder, valor] of Object.entries(substituicoes)) {
    try {
      body.replaceText(escapeRegex(placeholder), valor);
    } catch (error) {
      Logger.log('Erro ao substituir ' + placeholder + ': ' + error.message);
    }
  }

  Logger.log('Substituições de texto concluídas');
}

/**
 * Aplica formatação final ao documento
 * @param {Document} doc - Documento Google Docs
 */
function aplicarFormatacao(doc) {
  const body = doc.getBody();

  // Configurar margens (em pontos: 72 pontos = 1 polegada ≈ 2.54cm)
  body.setMarginTop(72);      // ~2.5cm
  body.setMarginBottom(57);   // ~2cm
  body.setMarginLeft(57);     // ~2cm
  body.setMarginRight(57);    // ~2cm

  Logger.log('Formatação aplicada');
}

/**
 * Exporta documento para PDF
 * @param {File} docFile - Arquivo do documento
 * @returns {File} Arquivo PDF gerado
 */
function exportarPDF(docFile) {
  // 1. Obter blob do PDF
  const blob = docFile.getAs('application/pdf');

  // 2. Configurar nome
  const nomePDF = docFile.getName().replace(/\.(docx?|gdoc)$/i, '') + '.pdf';
  blob.setName(nomePDF);

  // 3. Salvar na mesma pasta
  const pasta = obterOuCriarPasta(FOLDER_NAME);
  const pdfFile = pasta.createFile(blob);

  // 4. Verificar tamanho
  const tamanho = pdfFile.getSize();
  if (tamanho > PDF_MAX_SIZE) {
    Logger.log('⚠️ AVISO: PDF maior que 10MB (' + (tamanho / 1024 / 1024).toFixed(2) + ' MB)');
  }

  return pdfFile;
}

/**
 * Cria nome de arquivo padronizado
 * @param {Object} dados - Dados do formulário
 * @returns {string} Nome do arquivo
 */
function criarNomeArquivo(dados) {
  // Limpar nome da instituição
  const instituicao = (dados.instituicao || 'SemNome')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove acentos
    .replace(/[^a-zA-Z0-9\s]/g, '')   // Remove caracteres especiais
    .replace(/\s+/g, '_')              // Substitui espaços por underscore
    .substring(0, 50);                 // Limita tamanho

  // Formatar data
  const data = formatarDataArquivo(dados.dataVisita);

  return 'Relatorio_Fiscalizacao_' + instituicao + '_' + data;
}

/**
 * Escape de caracteres especiais para regex
 * @param {string} string - String a ser escapada
 * @returns {string} String escapada
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
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
/**
 * SISTEMA DE AUTOMAÇÃO DE FISCALIZAÇÃO CAS/DF
 * Arquivo: Main.gs
 * Descrição: Função principal e trigger
 * Versão: 1.0
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

    // 6. Enviar email
    enviarEmail(dados, pdfFile);
    Logger.log('Email enviado para: ' + EMAIL_CASDF);

    // 7. Organizar no Drive
    organizarArquivos(docFile, pdfFile);
    Logger.log('Arquivos organizados na pasta: ' + FOLDER_NAME);

    // Calcular tempo de execução
    const endTime = new Date();
    const tempoExecucao = (endTime - startTime) / 1000;
    Logger.log('Tempo de execução: ' + tempoExecucao + ' segundos');

    Logger.log('=== PROCESSAMENTO CONCLUÍDO COM SUCESSO ===');

  } catch (error) {
    Logger.log('❌ ERRO: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);

    // Enviar email de erro para administrador
    notificarErro(error, e);
  }
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
  // Buscar última resposta da planilha
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
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
