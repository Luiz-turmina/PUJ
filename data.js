/* ============================================================
   data.js — ÚNICO arquivo que precisa mudar para atualizar o site.
   Funil, totais, barras e textos são calculados/gerados daqui.

   Para atualizar os números: cole as linhas novas do export do CRM em
   `planilha` (uma linha por usuário) e use  incluir: true/false  para
   escolher quem entra na conta.
   ============================================================ */
window.PUJ_DATA = {
  demo: false,

  cliente: "PULJ",
  razaoSocial: "Preza, Unikowsky, Leipnitz & Jacoboski Sociedade de Advogados",
  periodo: "Projeto iniciado em 31 de julho de 2026 · posição de novembro de 2026",

  titulo: "Prospecção ativa:",
  tituloDestaque: "o que construímos e o que voltou.",
  lede:
    "A BLU montou do zero a operação de prospecção ativa da PULJ para duas teses tributárias, IPI e PAT: desenvolveu as listas e um sistema de validação, colocou o time na rua e ajustou a rota até o critério atual. Este documento mostra o caminho, os números e o que falta fazer até o fim do ano.",

  /* Rótulo do "ganho" do CRM (ajustar conforme o significado na operação) */
  rotuloGanho: "Reuniões agendadas",
  contratos: 1,
  funilNota:
    "Leads e atividades vêm do export de David e Luiz no CRM. As 24 reuniões incluem a da Zenaplast, do período inicial, e algumas estão sendo canceladas após o novo critério de faturamento (acima de R$ 200 milhões). O contrato fechado é da Zenaplast, empresa de porte abaixo desse critério.",

  /* Linhas do export do CRM. incluir:false tira a pessoa do total. */
  planilha: [
    {
      usuario: "David Schuster", incluir: true,
      leads: 142, atividades: 1310, realizadas: 1124,
      finalizados: 50, perdidos: 40, ganhos: 10,
      ligacoes: 817, ligSig: 37, ligSigPct: 12.98,
      emails: 65, social: 101, pesquisas: 141
    },
    {
      usuario: "Luiz Turmina", incluir: true,
      leads: 307, atividades: 5102, realizadas: 4758,
      finalizados: 229, perdidos: 216, ganhos: 13,
      ligacoes: 3265, ligSig: 150, ligSigPct: 8.2,
      emails: 9, social: 972, pesquisas: 512
    }
  ],

  /* Cartões grandes do "Resumo" e da abertura.
     chave: leads | atividades | realizadas | finalizados | ganhos | ligacoes | contratos
     tipo "taxa": conversão entre duas chaves */
  resumo: [
    { chave: "leads", rotulo: "Leads trabalhados", nota: "empresas que entraram em cadência de prospecção" },
    { chave: "realizadas", rotulo: "Atividades realizadas", nota: "ligações, e-mails, redes sociais e pesquisas registrados no CRM" },
    { chave: "ganhos", /* usa rotuloGanho */ nota: "leads que viraram reunião marcada com a PULJ" },
    { chave: "contratos", rotulo: "Contratos fechados", nota: "primeira venda já realizada" }
  ],
  aberturaResumo: [0, 1, 3],

  /* Esforço por canal (atividades finalizadas) */
  canais: [
    { rotulo: "Ligações", chave: "ligacoes" },
    { rotulo: "Redes sociais", chave: "social" },
    { rotulo: "Pesquisa da empresa", chave: "pesquisas" },
    { rotulo: "E-mail", chave: "emails" }
  ],

  /* Reuniões agendadas = leads com status "Ganho" no CRM.
     termino = data de finalização da cadência (AAAA-MM-DD).
     tese: IPI | PAT | IPI e PAT (conforme as anotações de cada lead). */
  reunioes: [
    { empresa: "Torre Empreendimentos Rural e Construção Ltda", tese: "PAT", uf: "BA", termino: "2026-09-04" },
    { empresa: "Zenaplast Ltda", tese: "IPI", uf: "PR", termino: "2026-10-19", contrato: true },
    { empresa: "Bolivar Produtos Plásticos Ltda", tese: "IPI", uf: "MG", termino: "2026-10-26" },
    { empresa: "Termomaster Indústria de Plásticos Ltda", tese: "IPI e PAT", uf: "RS", termino: "2026-10-27" },
    { empresa: "Plasnox Ind. e Com. Importações Ltda", tese: "IPI", uf: "SC", termino: "2026-10-27" },
    { empresa: "Emplaca Automação e Tecnologia Ltda", tese: "IPI", uf: "SP", termino: "2026-10-27" },
    { empresa: "Primaq", tese: "IPI", uf: "", termino: "2026-10-28" },
    { empresa: "Tote Embalagens Ltda", tese: "IPI", uf: "SC", termino: "2026-10-28" },
    { empresa: "Lonax Indústria Brasileira de Lonas Ltda", tese: "IPI", uf: "MG", termino: "2026-10-28" },
    { empresa: "Dipaes do Brasil Ltda", tese: "IPI", uf: "SC", termino: "2026-10-28" },
    { empresa: "Companhia Melhoramentos Norte do Paraná", tese: "IPI", uf: "", termino: "2026-10-29" },
    { empresa: "Minaplast Máquinas Ind. e Artefatos Plásticos Ltda", tese: "PAT", uf: "SC", termino: "2026-10-29" },
    { empresa: "Fibratecpar Industrial Ltda", tese: "IPI", uf: "PR", termino: "2026-10-29" },
    { empresa: "Ssoil Energy S/A", tese: "PAT", uf: "SP", termino: "2026-10-29" },
    { empresa: "Duck Plast Injeção de Plásticos Ltda", tese: "IPI", uf: "PR", termino: "2026-10-30" },
    { empresa: "Jamplastic Indústria e Comércio Ltda", tese: "IPI", uf: "MG", termino: "2026-10-30" },
    { empresa: "Transportadora Peregrina Ltda", tese: "PAT", uf: "SC", termino: "2026-11-04" },
    { empresa: "Verdesan Indústria e Comércio Ltda", tese: "IPI", uf: "SC", termino: "2026-11-04" },
    { empresa: "C-Pack Creative Packaging S/A", tese: "PAT", uf: "SC", termino: "2026-11-05" },
    { empresa: "Destra Indústria de Plásticos Ltda", tese: "IPI", uf: "RS", termino: "2026-11-06" },
    { empresa: "Construtora Elevação Ltda", tese: "PAT", uf: "PR", termino: "2026-11-09" },
    { empresa: "Ibrasde Ltda", tese: "IPI", uf: "SC", termino: "2026-11-10" },
    { empresa: "Vemag Equipamentos Industriais Ltda", tese: "IPI", uf: "SP", termino: "2026-11-16" },
    { empresa: "Proquimia Produtos Químicos do Brasil S.A.", tese: "IPI", uf: "SC", termino: "2026-11-17" }
  ],

  /* Atividades registradas por mês no CRM (export de David e Luiz).
     parcial: índice do mês ainda em andamento. */
  mensal: {
    meses: ["Agosto", "Setembro", "Outubro", "Novembro"],
    atividades: [152, 1466, 2996, 1497],
    parcial: 3,
    parcialNota: "até 19/11"
  },

  teses: [
    {
      sigla: "IPI",
      titulo: "Redução da base de cálculo do IPI",
      texto: "Com base na Repercussão Geral Tema 84, os tribunais têm entendido que o IPI não deve incidir sobre valores que não compõem o preço da mercadoria. O contribuinte precisa ingressar com a ação para recuperar o que pagou a mais e reduzir o custo tributário daqui para frente.",
      pontos: ["Descontos incondicionais (Tema 84)", "Fretes, destacados ou embutidos no custo", "Seguros e bonificações em mercadorias"]
    },
    {
      sigla: "PAT",
      titulo: "Dedução em dobro do PAT",
      texto: "A Lei 6.321/1976 permite deduzir do lucro tributável o dobro das despesas com o Programa de Alimentação do Trabalhador. Normas posteriores limitaram a dedução ao imposto devido, e os tribunais têm reconhecido essa limitação como indevida.",
      pontos: ["Dobro das despesas comprovadas com o PAT", "Dedução sobre o lucro tributável, não sobre o IRPJ devido", "Inclui o adicional do Imposto de Renda"]
    }
  ],
  janela: {
    rotulo: "A janela",
    texto: "Com a reforma tributária, o IPI tende a perder a viabilidade. Por isso a prospecção desta tese precisa acontecer até o fim do ano."
  },

  jornada: [
    {
      data: "31 de julho",
      titulo: "Início do projeto",
      texto: "Desenvolvimento das listas de prospecção e de um sistema próprio que valida se a empresa já tem ação ajuizada nos dois temas, IPI e PAT, antes de qualquer abordagem."
    },
    {
      data: "20 de agosto",
      titulo: "A prospecção começa",
      texto: "Primeiras abordagens ativas, com BDRs da BLU em cadência de ligações, e-mails e redes sociais."
    },
    {
      data: "Primeiro mês",
      titulo: "Ritmo abaixo do previsto",
      texto: "O arranque teve instabilidade na equipe de prospecção. A BLU trocou e reforçou os BDRs até estabilizar a operação com profissionais mais experientes."
    },
    {
      data: "Em seguida",
      titulo: "A operação ganha tração",
      texto: "Com o time estável, a cadência passou a fluir e os agendamentos começaram a entrar na agenda da PULJ."
    },
    {
      data: "Novembro",
      titulo: "Novo critério de porte",
      destaque: true,
      texto: "A PULJ definiu que só devem acontecer reuniões com empresas que faturem com certeza acima de R$ 200 milhões. A BLU reformulou as listas e cancelou os agendamentos que não se encaixam."
    },
    {
      data: "No período",
      titulo: "Primeira venda",
      destaque: true,
      texto: "Uma das reuniões já virou contrato: a Zenaplast, empresa de porte abaixo do novo critério. A lista atual mira contas maiores."
    },
    {
      data: "Até dezembro",
      titulo: "Reta final",
      texto: "Com a janela do IPI se fechando, a equipe e as listas estão dedicadas a fazer as reuniões acontecerem antes do fim do ano."
    }
  ],

  aprendizados: [
    { titulo: "Time estável vale mais que volume", texto: "As atividades saíram de 152 em agosto para 2.996 em outubro, e outubro concentrou 15 das 24 reuniões, já com a equipe de BDRs estabilizada." },
    { titulo: "Porte define o valor da reunião", texto: "O piso de R$ 200 milhões de faturamento reorganizou as listas e passou a filtrar quem de fato entra na agenda." },
    { titulo: "O IPI abriu mais portas", texto: "17 das 24 reuniões vieram da tese de IPI, 6 da de PAT e 1 de IPI e PAT, com muitas indústrias de plástico e embalagens." }
  ],

  proximosPassos: [
    { titulo: "Fechar as listas no novo critério", texto: "Concluir a reformulação das listas apenas com empresas de faturamento seguramente acima de R$ 200 milhões." },
    { titulo: "Confirmar a agenda que cabe", texto: "Manter as reuniões que passam no critério, reagendar o que for possível e cancelar o restante." },
    { titulo: "Concentrar esforço até dezembro", texto: "Time e listas dedicados a gerar o maior número de reuniões qualificadas antes que a janela do IPI se feche." }
  ],

  fontes: [
    "Registros da prospecção ativa da BLU para a PULJ — export do CRM de prospecção, novembro de 2026.",
    "Papers da PULJ: “IPI – redução da base de cálculo” e “Programa de Alimentação do Trabalhador (PAT) e suas limitações ilegais”.",
    "Taxas de conversão calculadas sobre os registros acima."
  ]
};
