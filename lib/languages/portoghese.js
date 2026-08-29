export default {
  
  // Sistema geral
  smsAvisoMG: () => "⚠️ Atenção!",
  smsWait: () => "⏳ Carregando...",
  smsError: () => "❌ Ocorreu um erro",
  smsSuccess: () => "✅ Operação concluída com sucesso",
  smsProcessing: () => "🔄 Processando...",
  
  // Comandos gerais
  smsOnlyGroup: () => "❌ Este comando só funciona em grupos!",
  smsOnlyAdmin: () => "❌ Apenas administradores podem usar este comando!",
  smsOnlyOwner: () => "❌ Apenas o proprietário pode usar este comando!",
  smsOnlyPremium: () => "💎 Este comando está disponível apenas para usuários premium!",
  smsInvalidCommand: () => "❌ Comando inválido",
  smsNoText: () => "❌ Insira algum texto",
  smsNoMedia: () => "❌ Envie ou responda a uma mídia",
  
  // IA e ChatGPT
  aiNoQuery: () => "⚠️ *Insira uma consulta válida para o ChatGPT!*\n\n📌 Exemplos:\n{prefix}{command} Conte-me uma piada\n{prefix}{command} Sugira 5 livros de fantasia\n{prefix}{command} Código HTML para uma página com login",
  aiError: () => "❌ Ocorreu um erro ao gerar a resposta. Tente novamente mais tarde.",
  aiProcessing: () => "🤖 Estou processando sua solicitação...",
  
  // Sistema de boas-vindas/adeus
  welcomeTitle: () => "✧ BEM-VINDO(A)! ✧",
  goodbyeTitle: () => "✧ ADEUS! ✧",
  welcomeDefault: (user, group, members) => `*Bem-vindo(a)* @${user} 🎉\n┊ *Grupo:* ${group}\n╰► *Membros:* ${members}`,
  goodbyeDefault: (user, members) => `*Adeus* @${user} 👋\n┊ Saiu do grupo\n╰► *Membros restantes:* ${members}`,
  
  welcomeSetHelp: () => `🎉 *Configurar mensagem de boas-vindas*

*Uso:* {command} <mensagem>

*Variáveis disponíveis:*
• @user - Marca o usuário
• $nome - Nome do usuário  
• $grupo - Nome do grupo
• $membros - Número de membros
• $numero - Número de telefone
• $tag - Tag do usuário (apelido de @user)

*Exemplo:*
{command} Olá @user! 👋 Bem-vindo(a) ao $grupo! Agora somos $membros membros! 🎉

*Para restaurar a mensagem padrão:*
{command} reset`,
  
  goodbyeSetHelp: () => `👋 *Configurar mensagem de despedida*

*Uso:* {command} <mensagem>

*Variáveis disponíveis:*
• @user - Marca o usuário
• $nome - Nome do usuário  
• $grupo - Nome do grupo
• $membros - Número de membros
• $numero - Número de telefone
• $tag - Tag do usuário (apelido de @user)

*Exemplo:*
{command} Adeus @user! 😢 Vamos sentir sua falta no $grupo. Restamos $membros membros.

*Para restaurar a mensagem padrão:*
{command} reset`,
  
  // Sistema de advertências
  warnMentionUser: () => "❌ Você deve mencionar um usuário ou responder à sua mensagem.",
  warnBotImmune: () => "🚫 Você não pode advertir o bot.",
  warnUserNotFound: () => "❌ Usuário não encontrado no banco de dados.",
  warnMessage: (params) => `⚠️ 𝐀𝐃𝐕𝐄𝐑𝐓𝐄𝐍𝐂𝐈𝐀 {warns}/𝟑 (𝟑 𝐚𝐝𝐯𝐞𝐫𝐭ê𝐧𝐜𝐢𝐚𝐬=𝐛𝐚𝐧)`,
  warnBanMessage: () => "⛔ 𝐔𝐒𝐔Á𝐑𝐈𝐎 𝐑𝐄𝐌𝐎𝐕𝐈𝐃𝐎 𝐀𝐏Ó𝐒 3 𝐀𝐃𝐕𝐄𝐑𝐓Ê𝐍𝐂𝐈𝐀𝐒",
  muteAdminOnly: () => '❌ Somente um administrador pode usar este comando.',
  muteNoTarget: () => '⚠️ Marque a pessoa que deseja silenciar ou responda a uma mensagem dela.',
  unmuteNoTarget: () => '⚠️ Marque a pessoa que deseja dessilenciar ou responda a uma mensagem dela.',
  muteBotImmune: () => '🤖 Você não pode silenciar o bot.',
  muteGroupOwnerImmune: () => '👑 O criador do grupo não pode ser silenciado.',
  muteSelfDenied: () => '⚠️ Você não pode silenciar a si mesmo.',
  unmuteSelfDenied: () => '⚠️ Peça a outro administrador para dessilenciar você.',
  muteAlreadyMuted: () => 'ℹ️ Este usuário já está silenciado.',
  unmuteNotMuted: () => 'ℹ️ Este usuário não está silenciado.',
  muteSuccess: ({ target }) => `🔇 Usuário silenciado\n\n@${target} não poderá mais falar no grupo: as mensagens dele serão apagadas.`,
  unmuteSuccess: ({ target }) => `🔊 Usuário dessilenciado\n\n@${target} pode voltar a escrever no grupo.`,
  
  menuownerChooseMenu: () => "Escolha um menu:",
  menuownerMainMenuButton: () => "🏠 Menu Principal",
  menuownerAdminMenuButton: () => "🛡️ Menu Admin/Mod",
  menuownerSecurityMenuButton: () => "🚨 Menu Segurança",
  menuownerGroupMenuButton: () => "👥 Menu Grupo",
  menuownerAiMenuButton: () => "🤖 Menu IA",
  menuownerTitle: () => "𝑴𝑬𝑵𝑼 𝑷𝑹𝑶𝑷𝑹𝑰𝑬𝑻Á𝑹𝑰𝑶",
  menuownerVersionLabel: () => "𝑽𝑬𝑹𝑺Ã𝑶",
  menuownerCollabLabel: () => "𝐂𝐎𝐋𝐀𝐁𝐎𝐑𝐀𝐂̧𝐀̃𝐎",
  menuownerSupportLabel: () => "𝐒𝐔𝐏𝐎𝐑𝐓𝐄",
  menuownerReservedCommands: () => "𝑪𝑶𝑴𝑨𝑵𝑫𝑶𝑺 𝑹𝑬𝑺𝑬𝑹𝑽𝑨𝑫𝑶𝑺 𝑨𝑶 𝑷𝑹𝑶𝑷𝑹𝑰𝑬𝑻Á𝑹𝑰𝑶",
  menuownerManageCommand: () => "gerenciar",
  menuownerSetGroupsCommand: () => "definirgrupos",
  menuownerAddGroupsCommand: () => "adicionargrupos",
  menuownerResetGroupsCommand: () => "resetargrupos",
  menuownerBanUserCommand: () => "banirusuario",
  menuownerUnbanUserCommand: () => "desbanirusuario",
  menuownerCleanupCommand: () => "limpar",
  menuownerGetFileCommand: () => "obterarquivo",
  menuownerSaveCommand: () => "salvarplugin",
  menuownerDpCommand: () => "delplugin",
  menuownerGetPluginCommand: () => "obterplugin",
  menuownerJoinCommand: () => "entrar",
  menuownerOutCommand: () => "sair",
  menuownerPrefixCommand: () => "prefixo",
  menuownerResetPrefixCommand: () => "resetarprefixo",
  menuownerGodModeCommand: () => "mododeus",
  menuownerResetCommand: () => "reiniciar",
  menuownerAddCommand: () => "adicionar",
  menuownerRemoveCommand: () => "remover",
  menuownerEveryGroupCommand: () => "todogrupo",
  menuownerBanChatCommand: () => "banirchat",
  menuownerUnbanChatCommand: () => "desbanirchat",
  menuownerRestartCommand: () => "reiniciar",
  menuownerShutdownBotCommand: () => "desligarbot",
  menuownerUpdateBotCommand: () => "atualizarbot",
  menuownerPluginParam: () => "plugin",
  menuownerLinkParam: () => "link",
  menuownerAutoAdminParam: () => "autoadmin",
  menuownerNumMessagesParam: () => "num. mensagens",
  menuownerCommandParam: () => "comando",
  menuownerGroupParam: () => "grupo",

  // Sistema de menus
  mainMenuTitle: () => '𝑴𝑬𝑵𝑼 𝑷𝑹𝑰𝑵𝑪𝑰𝑷𝑨𝑳',
  adminMenuTitle: () => '𝑴𝑬𝑵𝑼 𝑨𝑫𝑴𝑰𝑵',
  adminCommands: () => '𝑪𝑶𝑴𝑨𝑵𝑫𝑶𝑺 𝑨𝑫𝑴𝑰𝑵',
  chooseMenu: () => 'Escolha um menu:',
  mainMenuButton: () => '🏠 Menu Principal',
  ownerMenuButton: () => '👑 Menu Proprietário',
  securityMenuButton: () => '🚨 Menu Segurança',
  groupMenuButton: () => '👥 Menu Grupo',
  aiMenuButton: () => '🤖 Menu IA',
  promoteCommand: () => 'promover /tornaradmin',
  demoteCommand: () => 'rebaixar /removeradmin',
  warnCommands: () => 'advertir / removeradvertencia',
  muteCommands: () => 'silenciar / dessilenciar',
  setDescCommand: () => 'definirdescricao',
  setScheduleCommand: () => 'definirhorario',
  setNameCommand: () => 'definirnome',
  hidetagCommand: () => 'ocultaretiqueta',
  kickCommand: () => 'expulsar / chutar',
  adminsCommand: () => 'admins',
  tagallCommand: () => 'marcartodos',
  openCloseCommand: () => 'aberto / fechado',
  setWelcomeCommand: () => 'definirboasvindas',
  setByeCommand: () => 'definirdespedida',
  inactiveCommand: () => 'inativos',
  listNumCommand: () => 'listanum + prefixo',
  cleanupCommand: () => 'limpar + prefixo',
  clearPlayCommand: () => 'limparreproducao',
  rulesCommand: () => 'regras/definirregras',
  quarantineCommand: () => 'quarentena',
  dsCommand: () => 'ds',
  listWarnCommand: () => 'listaadvertencias',
  linkCommand: () => 'link',
  linkQrCommand: () => 'linkqr',
  poweredBy: () => 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ',
  
  // Menu grupo
  groupMenuTitle: () => '𝑴𝑬𝑵𝑼 𝑮𝑹𝑼𝑷𝑶',
  memberCommands: () => '𝑪𝑶𝑴𝑨𝑵𝑫𝑶𝑺 𝑷𝑨𝑹𝑨 𝑶𝑺 𝑴𝑬𝑴𝑩𝑹𝑶𝑺',
  musicAudioSection: () => 'MÚSICA & ÁUDIO',
  infoUtilitySection: () => 'INFORMAÇÃO & UTILIDADES',
  imageEditSection: () => 'IMAGENS & EDIÇÃO',
  pokemonSection: () => 'POKEMON',
  gangSystemSection: () => 'SISTEMA DE GANGUE',
  gamesCasinoSection: () => 'JOGOS & CASSINO',
  economyRankingSection: () => 'ECONOMIA & CLASSIFICAÇÕES',
  socialInteractionSection: () => 'INTERAÇÕES SOCIAIS',
  howMuchSection: () => 'QUANTO É?',
  personalityTestSection: () => 'TESTE DE PERSONALIDADE',
  songCommand: () => 'musica',
  audioCommand: () => 'audio',
  videoCommand: () => 'video',
  artistTitleCommand: () => 'artista-titulo',
  cityCommand: () => 'cidade',
  textCommand: () => 'texto',
  groupCommand: () => 'grupo',
  repoCommand: () => 'repositorio',
  userCommand: () => 'usuario',
  topicCommand: () => 'topico',
  checkSiteCommand: () => 'verificarsite',
  photoToStickerCommand: () => 'foto para sticker',
  stickerToPhotoCommand: () => 'sticker para foto',
  improveQualityCommand: () => 'melhorar qualidade foto',
  photoCommand: () => 'foto',
  hiddenPhotoCommand: () => 'foto oculta',
  memeCommand: () => 'meme',
  fromStickerCommand: () => 'de sticker',
  blurImageCommand: () => 'desfocar imagem',
  comingSoonCommand: () => 'em breve',
  quantityCommand: () => 'quantidade',
  headsOrTailsCommand: () => 'cara ou coroa',
  mathProblemCommand: () => 'problema matematica',
  rockPaperScissorsCommand: () => 'pedra papel tesoura',
  pokemonInfoCommand: () => 'info Pokémon',
  balanceCommand: () => 'saldo',
  topUsersCommand: () => 'top usuarios',
  buyUCCommand: () => 'comprar UC',
  withdrawUCCommand: () => 'UC do banco',
  earnXPCommand: () => 'ganhar XP',
  proposalCommand: () => 'proposta',
  endRelationshipCommand: () => 'fim relacionamento',
  affinityCommand: () => 'afinidade',
  charmCommand: () => 'charme',
  createFightCommand: () => 'criar brigas',
  truthOrDareCommand: () => 'verdade ou desafio',
  versionLabel: () => '𝑽𝑬𝑹𝑺Ã𝑶',
  collabLabel: () => '𝐂𝐎𝐋𝐀𝐁: 𝐎𝐍𝐄 𝐏𝐈𝐄𝐂𝐄',
  supportLabel: () => '𝐒𝐔𝐏𝐎𝐑𝐓𝐄',
  
  // Menu proprietário
  ownerMenuTitle: () => '𝑴𝑬𝑵𝑼 𝑷𝑹𝑶𝑷𝑹𝑰𝑬𝑻Á𝑹𝑰𝑶',
  ownerReservedCommands: () => '𝑪𝑶𝑴𝑨𝑵𝑫𝑶𝑺 𝑹𝑬𝑺𝑬𝑹𝑽𝑨𝑫𝑶𝑺 𝑨𝑶 𝑷𝑹𝑶𝑷𝑹𝑰𝑬𝑻Á𝑹𝑰𝑶',
  setNameCommand: () => 'definirnome',
  resetNameCommand: () => 'resetarnome',
  manageCommand: () => 'gerenciar',
  setGroupsCommand: () => 'definirgrupos',
  addGroupsCommand: () => 'adicionargrupos',
  resetGroupsCommand: () => 'resetargrupos',
  setPpCommand: () => 'definirpp',
  banUserCommand: () => 'banirusuario',
  unbanUserCommand: () => 'desbanirusuario',
  blockUserCommand: () => 'bloquearusuario',
  unblockUserCommand: () => 'desbloquearusuario',
  getFileCommand: () => 'obterarquivo',
  saveCommand: () => 'salvar',
  dpCommand: () => 'dp',
  getPluginCommand: () => 'obterplugin',
  joinCommand: () => 'entrar',
  outCommand: () => 'sair',
  prefixCommand: () => 'prefixo',
  resetPrefixCommand: () => 'resetarprefixo',
  godModeCommand: () => 'mododeus',
  resetCommand: () => 'reiniciar',
  addCommand: () => 'adicionar',
  removeCommand: () => 'remover',
  everyGroupCommand: () => 'todogrupo',
  banChatCommand: () => 'banirchat',
  unbanChatCommand: () => 'desbanirchat',
  restartCommand: () => 'reiniciar',
  shutdownBotCommand: () => 'desligarbot',
  updateBotCommand: () => 'atualizarbot',
  imageParam: () => 'imagem',
  pluginParam: () => 'plugin',
  linkParam: () => 'link',
  autoAdminParam: () => 'autoadmin',
  numMessagesParam: () => 'num. mensagens',
  commandParam: () => 'comando',
  groupParam: () => 'grupo',
  
  // Menu IA
  aiMenuTitle: () => '𝑴𝑬𝑵𝑼 𝑫𝑬 𝑰𝑨',
  generalCommands: () => '𝑪𝑶𝑴𝑨𝑵𝑫𝑶𝑺 𝑮𝑬𝑹𝑨𝑰𝑺',
  iaCommand: () => 'ia',
  alyaCommand: () => 'Alya',
  geminiCommand: () => 'gemini',
  chatgptCommand: () => 'chatgpt',
  deepseekCommand: () => 'deepseek',
  voiceCommand: () => 'voz',
  imageCommand: () => 'imagem',
  image2Command: () => 'imagem2',
  image3Command: () => 'imagem3',
  animalInfoCommand: () => 'infoanimal',
  kcalCommand: () => 'kcal',
  summaryCommand: () => 'resumo',
  recipeCommand: () => 'receita',
  
  // Menu Segurança
  securityMenuTitle: () => '𝑴𝑬𝑵𝑼 𝑺𝑬𝑮𝑼𝑹𝑨𝑵𝑪̧𝑨',
  activateDisable: () => '𝐀𝐓𝐈𝐕𝐀𝐑/𝐃𝐄𝐒𝐀𝐓𝐈𝐕𝐀𝐑',
  howToUse: () => '𝐂𝐎𝐌𝐎 𝐔𝐒𝐀𝐑',
  activateFunction: () => 'ativar [função]',
  disableFunction: () => 'desativar [função]',

// Plugin Ping/Status
systemStatusTitle: () => "⋆ ★ 🚀 𝑬𝑺𝑻𝑨𝑫𝑶 𝑫𝑶 𝑺𝑰𝑺𝑻𝑬𝑴𝑨 🚀 ★ ⋆",
uptime: () => "⌛ *Tempo ativo:*",
ping: () => "⚡ *Ping:*",
cpuLabel: () => "💻 *CPU:*",
cpuUsage: () => "🔋 *Uso:*",
ramLabel: () => "💾 *RAM:*",
freeRam: () => "🟢 *Livre:*",
version: () => "Versão:",

systemStatus: (params) => `${params?.title || '⋆ ★ 🚀 𝑬𝑺𝑻𝑨𝑫𝑶 𝑫𝑶 𝑺𝑰𝑺𝑻𝑬𝑴𝑨 🚀 ★ ⋆'}
╭♡꒷ ๑ ⋆˚₊⋆───ʚ˚ɞ───⋆˚₊⋆ ๑ ⪩
୧ ⌛ *Tempo ativo:* ${params?.uptime || 'N/A'}
୧ ⚡ *Ping:* ${params?.ping || 'N/A'} ms
  💻 *CPU:* ${params?.cpuModel || 'Desconhecido'}
  🔋 *Uso:* ${params?.cpuSpeed || 'N/A'} MHz
  💾 *RAM:* ${params?.ramUsed || 'N/A'} / ${params?.ramTotal || 'N/A'}
  🟢 *Livre:* ${params?.ramFree || 'N/A'}
╰♡꒷ ๑ ⋆˚₊⋆───ʚ˚ɞ───⋆˚₊⋆ ๑ ⪩`,

menuFooter: () => "Escolha um menu:",
menuAdmin: () => "🛡️ Menu Admin/Mod",
menuOwner: () => "👑 Menu Proprietário",
menuSecurity: () => "🚨 Menu Segurança",
menuGroup: () => "👥 Menu Grupo",
menuAI: () => "🤖 Menu IA",
mainMenuTitle: () => "𝑴𝑬𝑵𝑼 𝑫𝑶 𝑩𝑶𝑻",
staffCommand: () => "equipe",
candidatesCommand: () => "candidatos",
installCommand: () => "instalar",
guideCommand: () => "guia",
channelsCommand: () => "canais",
systemCommand: () => "sistema",
faqCommand: () => "FAQ",
pingCommand: () => "ping",
reportCommand: () => "reportar",
suggestCommand: () => "sugerir",
newsCommand: () => "novidades",
versionLabel: () => "𝑽𝑬𝑹𝑺Ã𝑶",
collabLabel: () => "𝐂𝐎𝐋𝐀𝐁: 𝐎𝐍𝐄 𝐏𝐈𝐄𝐂𝐄",
usersLabel: () => "𝐔𝐒𝐔Á𝐑𝐈𝐎𝐒",
chooseMenu: () => "Escolha um menu:",
mainMenuButton: () => "🏠 Menu Principal",
ownerMenuButton: () => "👑 Menu Proprietário",
securityMenuButton: () => "🚨 Menu Segurança",
groupMenuButton: () => "👥 Menu Grupo",
aiMenuButton: () => "🤖 Menu IA",
adminMenuTitle: () => "𝑴𝑬𝑵𝑼 𝑨𝑫𝑴𝑰𝑵",
promoteCommand: () => "p /tornaradmin",
demoteCommand: () => "r /removeradmin",
warnCommands: () => "advertir / removeradvertencia",
setScheduleCommand: () => "definirhorario",
setNameCommand: () => "definirnome",
hidetagCommand: () => "ocultaretiqueta",
tagallCommand: () => "marcartodos",
kickCommand: () => "expulsar / chutar",
adminsCommand: () => "admins",
openCloseCommand: () => "aberto / fechado",
setWelcomeCommand: () => "definirboasvindas",
setByeCommand: () => "definirdespedida",
inactiveCommand: () => "inativos",
listNumCommand: () => "listanum + prefixo",
cleanupCommand: () => "limpar + prefixo",
rulesCommand: () => "regras / definirregras",
listWarnCommand: () => "listaadvertencias",
linkCommand: () => "link",
linkQrCommand: () => "linkqr",
requestsCommand: () => "solicitacoes",
adminCommands: () => "𝑪𝑶𝑴𝑨𝑵𝑫𝑶𝑺 𝑨𝑫𝑴𝑰𝑵",
poweredBy: () => "ᴘᴏᴡᴇʀᴇᴅ ʙʏ",


installTitle: () => "⋆ ︵ ★ 💬 𝐂𝐇𝐀𝐓𝐔𝐍𝐈𝐓𝐘-𝐁𝐎𝐓 💬 ★ ︵ ⋆",
installIntro: () => "Quer instalar o ƌɽɛɑƌ-ʙᴏᴛ Bot no seu dispositivo?",
installDescription: () => "Siga o guia completo de instalação disponível no GitHub com todas as etapas detalhadas para Termux, Windows e outros sistemas operacionais.",
installGuideLabel: () => "📖 𝐆𝐮𝐢𝐚 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐨",
installRepoLabel: () => "📂 𝐑𝐞𝐩𝐨𝐬𝐢𝐭ó𝐫𝐢𝐨 𝐆𝐢𝐭𝐇𝐮𝐛",
installVideoLabel: () => "🎥 𝐕í𝐝𝐞𝐨 𝐓𝐮𝐭𝐨𝐫𝐢𝐚𝐥",
installFeatures: () => "✨ 𝐎 𝐪𝐮𝐞 𝐞𝐧𝐜𝐨𝐧𝐭𝐫𝐚𝐫á:",
installFeature1: () => "📱 Instalação completa para Termux",
installFeature2: () => "💻 Instalação para Windows e outros SO",
installFeature3: () => "🔧 Resolução de problemas comuns",
installFeature4: () => "📝 Comandos de configuração automática",
installCTA: () => "Visite o repositório GitHub para começar a instalação e descobrir todas as funcionalidades do bot!",
installNeedHelp: () => "Precisa de ajuda? Junte-se ao nosso canal de suporte!",

systemTitle: () => "⋆ ︵★ 🖥️ 𝐄𝐒𝐓𝐀𝐃𝐎 𝐃𝐎 𝐒𝐈𝐒𝐓𝐄𝐌𝐀 ★︵ ⋆",
systemHost: () => "🚩 *Host*",
systemOS: () => "🏆 *Sistema Operacional*",
systemArch: () => "💫 *Arquitetura*",
systemTotalRAM: () => "🥷 *RAM Total*",
systemFreeRAM: () => "🚀 *RAM Livre*",
systemUsedRAM: () => "⌛ *RAM Usada*",
systemUptime: () => "🕒 *Tempo ativo*",
systemNodeMemory: () => "🪴 *Memória Node.js:*",
systemRSS: () => "RSS",
systemHeapTotal: () => "Heap Total",
systemHeapUsed: () => "Heap Usada",
systemExternal: () => "Externa",
systemArrayBuffer: () => "ArrayBuffer",
systemDiskSpace: () => "☁️ *Espaço em Disco:*",
systemDiskTotal: () => "Total",
systemDiskUsed: () => "Usado",
systemDiskAvailable: () => "Disponível",
systemDiskPercent: () => "Percentual de Uso",
systemDiskError: () => "❌ Erro ao recuperar espaço em disco.",

reportNoText: () => "⚠️ Insira uma descrição detalhada do problema que deseja reportar.",
reportTooShort: () => "⚠️ A descrição é muito curta. Forneça pelo menos 10 caracteres para um relatório completo.",
reportTooLong: () => "⚠️ A descrição excede o limite máximo de 1000 caracteres. Reduza o texto.",
reportTitle: () => "❌️ `R𝐄𝐋𝐀𝐓Ó𝐑𝐈𝐎` ❌️",
reportNumber: () => "📱 Número",
reportUser: () => "👤 Usuário",
reportMessage: () => "📝 Mensagem",
reportQuote: () => "📎 Citação",
reportSuccess: () => "✅ Seu relatório foi enviado com sucesso para a equipe de desenvolvimento.\n\n_⚠️ Atenção: relatórios falsos ou inadequados podem resultar em restrições no uso do bot._",
reportChannelTitle: () => "⚠️ RELATÓRIO DE BUG ⚠️",
reportChannelBody: () => "Novo relatório recebido",
reportAnonymous: () => "Anônimo",
suggestNoText: () => "⚠️ Insira sua proposta de comando.\n\n*Exemplo:* .sugerir (nome comando) (descrição funcionalidade)",
suggestTooShort: () => "⚠️ A descrição é muito curta. Forneça pelo menos 10 caracteres para uma proposta completa.",
suggestTooLong: () => "⚠️ A descrição excede o limite máximo de 1000 caracteres. Reduza o texto.",
suggestTitle: () => "💡 `P𝐑𝐎𝐏𝐎𝐒𝐓𝐀` 💡",
suggestNumber: () => "📱 Número",
suggestUser: () => "👤 Usuário",
suggestMessage: () => "📝 Proposta",
suggestQuote: () => "📎 Citação",
suggestSuccess: () => "✅ Sua proposta foi enviada com sucesso para a equipe de desenvolvimento.\n\n_⚠️ Atenção: propostas de comandos ilícitos ou inadequados podem resultar em restrições no uso do bot._",
suggestChannelTitle: () => "💡 PROPOSTA DE COMANDO 💡",
suggestChannelBody: () => "Nova proposta recebida",
suggestAnonymous: () => "Anônimo",
unwarnNoUser: () => "❌ Você deve mencionar um usuário ou responder à sua mensagem para remover uma advertência.",
unwarnUserNotFound: () => "❌ Usuário não encontrado no banco de dados.",
unwarnNoWarnings: () => "ℹ️ Este usuário não tem advertências ativas para remover.",
unwarnSuccess: (params) => `✅ 𝐀𝐝𝐯𝐞𝐫𝐭ê𝐧𝐜𝐢𝐚 𝐫𝐞𝐦𝐨𝐯𝐢𝐝𝐚\n\n𝐀𝐝𝐯𝐞𝐫𝐭ê𝐧𝐜𝐢𝐚𝐬 𝐫𝐞𝐬𝐭𝐚𝐧𝐭𝐞𝐬: ${params?.remaining || 0}/3`,
setnameNoText: () => "⚠️ Insira o novo nome que deseja atribuir ao grupo.",
setnameSuccess: () => "✅ 𝐍𝐨𝐦𝐞 𝐝𝐨 𝐠𝐫𝐮𝐩𝐨 𝐚𝐥𝐭𝐞𝐫𝐚𝐝𝐨 𝐜𝐨𝐦 𝐬𝐮𝐜𝐞𝐬𝐬𝐨!",
setnameError: () => "❌ Ocorreu um erro ao alterar o nome do grupo. Tente novamente.",
hidetagDefaultMessage: () => "📢 Mensagem para todos",
hidetagStickerError: () => "❌ Não foi possível baixar o sticker. Tente novamente.",
tagallTitle: () => "⋆ ︵ ★ 📢 𝐌𝐄𝐌𝐁𝐑𝐎𝐒 𝐃𝐎 𝐆𝐑𝐔𝐏𝐎 ★ ︵ ⋆",
tagallBot: () => "🤖 BOT",
tagallMessage: () => "📝 Mensagem",
tagallEmptyMessage: () => "📢 Atenção membros do grupo!",
tagallMemberCount: (params) => `👥 Membros totais: ${params?.count || 0}`,
adminsCooldown: (params) => `⏳ Você deve esperar ${params?.time || 'um pouco'} antes de poder chamar os administradores novamente.\n\n_Este comando tem um limite de uso para evitar abusos._`,
adminsTitle: () => "⋆︵★ 🔔 𝐀𝐃𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐃𝐎𝐑𝐄𝐒 ★︵⋆",
adminsMessage: () => "📝 Motivo da chamada",
adminsWarning: () => "⚠️ Este comando deve ser usado apenas para problemas urgentes ou situações importantes. O uso inadequado pode resultar na remoção do grupo.",
adminsNoMessage: () => "Solicitação de assistência",
adminsNotification: () => "🔔 Os administradores foram notificados",
adminsExternalTitle: (params) => `${params?.groupName || 'Grupo'}`,
adminsExternalBody: () => "Chamando os administradores...",
groupOpen: () => "✅ 𝐂𝐡𝐚𝐭 𝐚𝐛𝐞𝐫𝐭𝐚 𝐩𝐚𝐫𝐚 𝐭𝐨𝐝𝐨𝐬\n\n୧ Todos os membros podem agora enviar mensagens no grupo.",
groupClose: () => "🔒 𝐂𝐡𝐚𝐭 𝐚𝐩𝐞𝐧𝐚𝐬 𝐩𝐚𝐫𝐚 𝐚𝐝𝐦𝐢𝐧𝐬\n\n୧ Apenas os administradores podem enviar mensagens no grupo.",
setwelcomeNoText: () => "⚠️ Insira a mensagem de boas-vindas personalizada que deseja configurar.\n\n*Variáveis disponíveis:*\n୧ @user - Menciona o usuário\n୧ @group - Nome do grupo\n୧ @desc - Descrição do grupo",
setwelcomeSuccess: () => "✅ 𝐌𝐞𝐧𝐬𝐚𝐠𝐞𝐦 𝐝𝐞 𝐛𝐨𝐚𝐬-𝐯𝐢𝐧𝐝𝐚𝐬 𝐜𝐨𝐧𝐟𝐢𝐠𝐮𝐫𝐚𝐝𝐚\n\n୧ A mensagem de boas-vindas foi definida com sucesso para este grupo.",
setbyeNoText: () => "⚠️ Insira a mensagem de despedida personalizada que deseja configurar.\n\n*Variáveis disponíveis:*\n୧ @user - Menciona o usuário\n୧ @group - Nome do grupo",
setbyeSuccess: () => "✅ 𝐌𝐞𝐧𝐬𝐚𝐠𝐞𝐦 𝐝𝐞 𝐝𝐞𝐬𝐩𝐞𝐝𝐢𝐝𝐚 𝐜𝐨𝐧𝐟𝐢𝐠𝐮𝐫𝐚𝐝𝐚\n\n୧ A mensagem de despedida foi definida com sucesso para este grupo.",
inactiveMenuTitle: () => "🌙 Gerenciamento de Membros Inativos",
inactiveMenuFound: (params) => `💤 Membros inativos encontrados: *${params?.inactive || 0}/${params?.total || 0}*\n\n⏰ Inativos há mais de 7 dias\n\nSelecione uma opção abaixo:`,
inactiveListTitle: () => "📋 Lista de Membros Inativos",
inactiveListNone: () => "✅ Nenhum membro inativo encontrado!\n\n🎉 Todos os membros estão ativos no grupo.",
inactiveListItem: (params) => `${params?.index}. @${params?.user}`,
inactiveRemoveStart: (params) => `⚠️ Remoção de inativos: você está prestes a excluir *${params?.count}* membros.\n\n❗ Esta ação não pode ser desfeita!\n\nConfirma que deseja continuar?`,
inactiveRemoveSuccess: (params) => `✅ Remoção concluída!\n\n🗑️ Membros removidos: *${params?.removed}*${params?.errors ? `\n⚠️ Erros: *${params.errors}* membros não removidos` : ''}`,
inactiveRemoveNone: () => "✅ Nenhum membro para remover! Todos os membros do grupo estão ativos.",
inactiveConfirmTitle: () => "⚠️ Confirmar Remoção",
inactiveBackButton: () => "🔄 Voltar ao Menu",
inactiveListButton: () => "📋 Ver Lista",
inactiveRemoveButton: () => "🗑️ Remover Inativos",
inactiveConfirmButton: () => "✅ Confirmar Remoção",
inactiveCancelButton: () => "❌ Cancelar",
inactiveNotAdmin: () => "❌ Apenas os *admin* podem usar esta função.",
inactiveUnknown: () => "❌ Opção inválida. Use os botões.",
inactiveResultTitle: () => "📊 Resultado remoção inativos",
inactiveGroupLabel: () => "👥 Grupo",
inactiveFooter: () => "Gestão grupo inativos",
noBotAdmin: () => "⚠️ Devo ser admin para remover usuários",
  noMention: () => "⚠️ Mencione ou responda à mensagem da pessoa a ser removida",
  cannotRemoveOwner: () => "⚠️ Você não pode remover o criador do bot",
  cannotRemoveBot: () => "⚠️ Você não pode remover o próprio bot",
  cannotRemoveSelf: () => "⚠️ Você não pode se remover",
  targetIsGroupOwner: () => "⚠️ Você não pode remover o criador do grupo",
  targetIsAdmin: () => "⚠️ Você não pode remover um admin do grupo",
  kickSuccess: (params) => `╭─────────────────\n│ ✦ @${params?.target} foi removido\n│ ✦ por @${params?.executor}${params?.reason ? `\n│\n│ 📝 Motivo: ${params.reason}` : ''}\n╰─────────────────`,
  title: () => "⚠️ Usuários Advertidos",
totalUsers: (params) => `Total: ${params?.count || 0} usuários`,
userEntry: (params) => `${params?.index}. ${params?.name || 'Desconhecido'} (${params?.warns}/3)`,
noWarns: () => "✓ Nenhum usuário recebeu advertências",
unknownUser: () => "Desconhecido",
noBotAdmin: () => "⚠️ Devo ser admin para recuperar o link do grupo",
qrCaption: (params) => `╭─────────────────\n│ 🔗 Código QR do grupo\n│ *${params?.groupName}*\n│\n│ Escaneie para entrar\n╰─────────────────`,
qrError: () => "❌ Erro durante a geração do código QR",
noBotAdmin: () => "⚠️ Devo ser admin para gerenciar solicitações",
noAdmin: () => "⚠️ Apenas os admin do grupo podem usar este comando",
noPending: () => "✓ Não há solicitações pendentes",
pendingCount: (params) => `╭─────────────────\n│ 📨 Solicitações pendentes: ${params?.count}\n│\n│ Selecione uma opção\n╰─────────────────`,
menuFooter: () => "Gestão solicitações grupo",
buttonAcceptAll: () => "✅ Aceitar todas",
buttonRejectAll: () => "❌ Rejeitar todas",
buttonAccept39: () => "🇮🇹 Aceitar +39",
buttonManage: () => "📥 Gerenciar solicitações",
acceptedSuccess: (params) => `✅ Aceitas ${params?.count} solicitações`,
rejectedSuccess: (params) => `❌ Rejeitadas ${params?.count} solicitações`,
no39Found: () => "⚠️ Nenhuma solicitação com prefixo +39 encontrada",
accepted39Success: (params) => `✅ Aceitas ${params?.count} solicitações com prefixo +39`,
errorAccepting: () => "❌ Erro durante a aceitação das solicitações",
errorRejecting: () => "❌ Erro durante a rejeição das solicitações",
invalidNumber: () => "⚠️ Número inválido. Use um número maior que 0",
invalidInput: () => "⚠️ Entrada inválida. Envie um número ou '39'",
manageCustom: (params) => `╭─────────────────\n│ 📥 Gestão personalizada\n│\n│ Quantas solicitações deseja aceitar?\n│\n│ ✦ Use: .${params?.command} aceitar <número>\n│ ✦ Exemplo: .${params?.command} aceitar 7\n╰─────────────────`,
manageFooter: () => "Gestão personalizada solicitações",
richieste: {
  noBotAdmin: () => "⚠️ Devo ser admin para gerenciar solicitações",
  noAdmin: () => "⚠️ Apenas os admin do grupo podem usar este comando",
  noPending: () => "✓ Não há solicitações pendentes",
  pendingCount: (params) => `╭─────────────────\n│ 📨 Solicitações pendentes: ${params?.count}\n│\n│ Selecione uma opção\n╰─────────────────`,
  menuFooter: () => "Gestão solicitações grupo",
  buttonAcceptAll: () => "✅ Aceitar todas",
  buttonRejectAll: () => "❌ Rejeitar todas",
  buttonAccept39: () => "🇮🇹 Aceitar +39",
  buttonManage: () => "📥 Gerenciar solicitações",
  acceptedSuccess: (params) => `✅ Aceitas ${params?.count} solicitações`,
  rejectedSuccess: (params) => `❌ Rejeitadas ${params?.count} solicitações`,
  no39Found: () => "⚠️ Nenhuma solicitação com prefixo +39 encontrada",
  accepted39Success: (params) => `✅ Aceitas ${params?.count} solicitações com prefixo +39`,
  errorAccepting: () => "❌ Erro durante a aceitação das solicitações",
  errorRejecting: () => "❌ Erro durante a rejeição das solicitações",
  invalidNumber: () => "⚠️ Número inválido. Use um número maior que 0",
  invalidInput: () => "⚠️ Entrada inválida. Envie um número ou '39'",
  manageCustom: (params) => `╭─────────────────\n│ 📥 Gestão personalizada\n│\n│ Quantas solicitações deseja aceitar?\n│\n│ ✦ Use: .${params?.command} aceitar <número>\n│ ✦ Exemplo: .${params?.command} aceitar 7\n╰─────────────────`,
  manageFooter: () => "Gestão personalizada solicitações"
},
linkqr: {
  noBotAdmin: () => "⚠️ Devo ser admin para recuperar o link do grupo",
  qrCaption: (params) => `╭─────────────────\n│ 🔗 Código QR do grupo\n│ *${params?.groupName}*\n│\n│ Escaneie para entrar\n╰─────────────────`,
  qrError: () => "❌ Erro durante a geração do código QR"
},
notAvailable: () => "⚠️ Este comando está disponível apenas com a base do ƌɽɛɑƌ-ʙᴏᴛ",
imageNotFound: () => "⚠️ Erro durante o carregamento das imagens",
mainTitle: () => "🌐 Nossas Redes Sociais",
mainSubtitle: () => "Siga-nos em todos os lugares para se manter atualizado",
mainFooter: () => "Powered by ƌɽɛɑƌ-ʙᴏᴛ",
instagramTitle: () => "📸 Instagram",
instagramBody: () => "Siga-nos no Instagram para fotos e stories diários!",
instagramButton: () => "Abrir Instagram",
tiktokTitle: () => "🎵 TikTok",
tiktokBody: () => "Conteúdos criativos e divertidos no TikTok!",
tiktokButton: () => "Abrir TikTok",
youtubeTitle: () => "🎬 YouTube",
youtubeBody: () => "Vídeos, tutoriais e lives no nosso canal do YouTube!",
youtubeButton: () => "Abrir YouTube",
discordTitle: () => "💬 Discord",
discordBody: () => "Junte-se à nossa comunidade no Discord!",
discordButton: () => "Abrir Discord",
telegramTitle: () => "✈️ Telegram",
telegramBody: () => "Notícias e atualizações no canal do Telegram!",
telegramButton: () => "Abrir Telegram",
whatsappTitle: () => "💚 Canal WhatsApp",
whatsappBody: () => "Mantenha-se atualizado no nosso canal oficial do WhatsApp!",
whatsappButton: () => "Abrir Canal",
cardFooter: () => "ƌɽɛɑƌ-ʙᴏᴛ Social",
followUpMessage: () => "👆 Deslize os cards para ver todos os nossos canais sociais!\n\n✦ Siga-nos para se manter atualizado",
followUpFooter: () => "ƌɽɛɑƌ-ʙᴏᴛ Team",
menuButton: () => "📋 Voltar ao Menu",
errorLoading: () => "⚠️ Erro durante o carregamento das redes sociais",


   linkTitle: () => "🔗 LINK DO GRUPO",
   linkFooter: () => "Copie o link e compartilhe",
    copyButton: () => "📋 Copiar Link",


  
  pingTitle: () => "⚡ PONG!",
  pingResponse: (params) => `⚡ *Ping:* ${params?.ping || 'N/A'} ms`,
  socialNotAvailable: () => "⚠️ O comando não está disponível no momento. Tente novamente mais tarde.",
socialInstagramTitle: () => "📸 Instagram",
socialInstagramBody: () => "Siga-nos no Instagram para conteúdos exclusivos, atualizações e novidades do bot!",
socialInstagramButton: () => "Seguir no Instagram",
socialTiktokTitle: () => "🎵 TikTok",
socialTiktokBody: () => "Descubra nossos vídeos no TikTok e mantenha-se atualizado com os conteúdos mais virais!",
socialTiktokButton: () => "Seguir no TikTok",
socialYoutubeTitle: () => "📺 YouTube",
socialYoutubeBody: () => "Inscreva-se no nosso canal do YouTube para tutoriais, guias e atualizações em vídeo!",
socialYoutubeButton: () => "Inscrever-se no YouTube",
socialDiscordTitle: () => "💬 Discord",
socialDiscordBody: () => "Junte-se à nossa comunidade Discord para suporte, chat e muito mais!",
socialDiscordButton: () => "Entrar no Discord",
socialTelegramTitle: () => "✈️ Telegram",
socialTelegramBody: () => "Siga-nos no Telegram para notícias instantâneas e comunicações diretas!",
socialTelegramButton: () => "Seguir no Telegram",
socialWhatsappTitle: () => "💚 WhatsApp",
socialWhatsappBody: () => "Inscreva-se no nosso canal do WhatsApp para receber atualizações oficiais!",
socialWhatsappButton: () => "Seguir no WhatsApp",
socialCardFooter: () => "ƌɽɛɑƌ-ʙᴏᴛ Social",
socialMainTitle: () => "⋆ ︵ ★ 🌐 𝐑𝐄𝐃𝐄𝐒 𝐒𝐎𝐂𝐈𝐀𝐈𝐒 ★ ︵ ⋆",
socialMainSubtitle: () => "Siga-nos nos nossos canais oficiais",
socialMainFooter: () => "Mantenha-se conectado com o ƌɽɛɑƌ-ʙᴏᴛ",
socialFollowUpMessage: () => "✨ Obrigado pelo seu interesse!\n\n୧ Siga-nos em todos os nossos canais sociais para não perder nenhuma atualização.",
socialFollowUpFooter: () => "ƌɽɛɑƌ-ʙᴏᴛ - Sempre conectados",
socialMenuButton: () => "🏠 Menu Principal",
socialErrorLoading: () => "❌ Ocorreu um erro durante o carregamento das redes sociais. Tente novamente mais tarde.",
listawarnTitle: () => "꒷꒦ ✦ Lista Usuários Advertidos ✦ ꒷꒦",
listawarnMode: () => "Modo",
listawarnGroup: () => "Grupo",
listawarnTotal: ({ count }) => `Total: ${count} ${count === 1 ? 'usuário advertido' : 'usuários advertidos'}`,
listawarnNoWarns: () => "✨ Nenhum usuário advertido",
listawarnUnknownUser: () => "Usuário Desconhecido",
listawarnUserNumber: ({ index }) => `${index}.`,
listawarnTag: () => "Tag:",
listawarnGroups: () => "Grupo(s):",
listawarnNoActiveWarns: () => "Nenhuma advertência ativa",
listawarnErrorRetrieving: () => "Erro na recuperação",
listawarnTotalWarns: ({ count }) => `${count} totais`,
listawarnOwnerOnly: () => "❌ Este comando pode ser usado em privado apenas pelos proprietários.",
listawarnAllUsers: () => "Todos os usuários",
kickNoBotAdmin: () => "❌ O bot deve ser administrador para remover usuários.",
kickNoMention: () => "⚠️ Mencione ou cite o usuário a ser removido do grupo.",
kickCannotRemoveOwner: () => "🛡️ Você não pode remover o criador do bot.",
kickCannotRemoveBot: () => "🤖 Você não pode remover o bot do grupo.",
kickCannotRemoveSelf: () => "😅 Você não pode se remover com este comando.",
kickTargetIsGroupOwner: () => "👑 O usuário que você tentou remover é o criador do grupo.",
kickTargetIsAdmin: () => "🛡️ O usuário que você tentou remover é administrador.",
kickSuccess: ({ target, executor, reason }) => `꒷꒦ ✦ Usuário Removido ✦ ꒷꒦\n\n┊ 『 👤 』 Usuário: @${target}\n┊ 『 ⚖️ 』 Removido por: @${executor}${reason ? `\n┊ 『 📝 』 Motivo: ${reason}` : ''}\n\n╰★────★────★`,
linkgroupNoBotAdmin: () => "❌ O bot deve ser administrador para obter o link do grupo.",
linkgroupLinkTitle: ({ groupName }) => `꒷꒦ ✦ Link do Grupo ✦ ꒷꒦\n\n┊ 『 📱 』 Grupo: ${groupName}\n┊ 『 🔗 』 Clique no botão para copiar o link`,
linkgroupLinkFooter: () => "Powered by ƌɽɛɑƌ-ʙᴏᴛ Bot",
linkgroupCopyButton: () => "📋 Copiar Link",
joinNoLink: ({ prefix, command }) => `⚠️ Insira o link do grupo.\n\n┊ 『 💡 』 Exemplo: ${prefix}${command} <link> <dias | inf>`,
joinInvalidLink: () => "❌ Link do grupo inválido.",
joinSuccessInfinite: () => "꒷꒦ ✦ Entrada no Grupo ✦ ꒷꒦\n\n┊ 『 ✅ 』 Entrei corretamente no grupo\n┊ 『 ⏰ 』 Permanência: Ilimitada\n\n╰★────★────★",
joinSuccessExpired: ({ days }) => `꒷꒦ ✦ Entrada no Grupo ✦ ꒷꒦\n\n┊ 『 ✅ 』 Entrei corretamente no grupo\n┊ 『 ⏰ 』 Permanência: ${days} dias\n\n╰★────★────★`,
banuserNoTarget: () => "⚠️ Por favor marque um usuário, responda a uma mensagem ou escreva o número de telefone.\n\n┊ 『 💡 』 Exemplo: @3934xxxxxxx",
banuserInvalidNumber: () => "❌ Número de telefone inválido.",
banuserSuccess: ({ target }) => `꒷꒦ ✦ Usuário Bloqueado ✦ ꒷꒦\n\n┊ 『 🚫 』 Usuário: @${target}\n┊ 『 ⚠️ 』 Este usuário foi bloqueado do bot\n┊ 『 📵 』 Não poderá mais usar os comandos\n\n╰★────★────★`,
unbanuserNoTarget: () => "⚠️ Marque um usuário, responda a uma mensagem ou escreva o número de telefone.\n\n┊ 『 💡 』 Exemplo: @3934xxxxxxx",
unbanuserInvalidNumber: () => "❌ Número de telefone inválido.",
unbanuserSuccess: ({ target }) => `꒷꒦ ✦ Usuário Desbloqueado ✦ ꒷꒦\n\n┊ 『 ✅ 』 Usuário: @${target}\n┊ 『 🎉 』 Este usuário foi desbloqueado\n┊ 『 📱 』 Pode agora usar os comandos do bot\n\n╰★────★────★`,
listanumNoPrefix: () => "⚠️ Insira o prefixo telefônico a ser pesquisado.\n\n┊ 『 💡 』 Exemplo: .listanum 39",
listanumInvalidPrefix: () => "❌ O prefixo deve ser um número válido.",
listanumTitle: ({ prefix }) => `꒷꒦ ✦ Lista Números +${prefix} ✦ ꒷꒦`,
listanumNoUsers: ({ prefix }) => `꒷꒦ ✦ Nenhum Usuário ✦ ꒷꒦\n\n┊ 『 ℹ️ 』 Nenhum usuário encontrado com prefixo +${prefix}\n\n╰★────★────★`,
puliziaStart: ({ prefix }) => `꒷꒦ ✦ Limpeza Iniciada ✦ ꒷꒦\n\n┊ 『 🔄 』 Removendo usuários com prefixo +${prefix}\n┊ 『 ⏳ 』 Aguarde o término...\n\n╰★────★────★`,
puliziaNoBotAdmin: () => "❌ O bot deve ser administrador para remover usuários.",
puliziaNoRestrict: () => "❌ O modo restritivo não está habilitado.",
puliziaUserLeft: ({ user }) => `@${user} foi removido`,
getNoInput: () => "⚠️ Uso incorreto do comando.\n\n╰★─ Exemplos Individuais ─★╮\n┊ getplugin menu-grupo script\n┊ getfile config.js file\n\n╰★─ Exemplos Múltiplos ─★╮\n┊ getplugin admin & menu & config\n┊ getplugin admin & menu & config script\n┊ getplugin admin script & menu file\n┊ (máximo 3 plugins simultaneamente)\n\n╰♡꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷",
getNoPluginFound: () => "❌ Nenhum plugin válido encontrado na solicitação múltipla.",
getMultiSelect: ({ pluginList }) => `꒷꒦ ✦ Plugins Selecionados ✦ ꒷꒦\n\n${pluginList}\n\n┊ 『 ❓ 』Como deseja receber todos os plugins?\n\n╰★────★────★`,
getMultiScriptBtn: () => "📄 Todos Script",
getMultiFileBtn: () => "📎 Todos Arquivos",
getMultiResult: ({ successCount, total, results }) => `꒷꒦ ✦ Solicitação Múltipla ✦ ꒷꒦\n\n┊ 『 📦 』 ${successCount}/${total} plugins encontrados\n\n${results}\n\n╰★────★────★`,
getFileSelect: ({ filename }) => `꒷꒦ ✦ Arquivo Selecionado ✦ ꒷꒦\n\n┊ 『 📁 』 ${filename}\n\n┊ 『 ❓ 』 O que deseja fazer?\n\n╰★────★────★`,
getScriptBtn: () => "📄 Script",
getFileBtn: () => "📎 Arquivo",
getNoSimilar: ({ type, name }) => `❌ Nenhum ${type} similar a "${name}" encontrado.`,
getFoundConfirm: ({ filename, score }) => `꒷꒦ ✦ Encontrado ✦ ꒷꒦\n\n┊ 『 ✨ 』 "${filename}"\n┊ 『 📊 』 Precisão: ${score}%\n\n┊ 『 ❓ 』 Confirma?\n\n╰♡꒷ ๑ Responda: sim/não`,
getMultiChoice: ({ name, options }) => `꒷꒦ ✦ Resultados para "${name}" ✦ ꒷꒦\n\n${options}\n\n┊ 『 📝 』 Escolha o número ou "não" para cancelar\n\n╰★────★────★`,
getDirNotFound: ({ dir }) => `❌ Diretório ${dir} não encontrado.`,
getFileSuccess: ({ prefix, filename, type }) => `${prefix}꒷꒦ ✦ Sucesso ✦ ꒷꒦\n\n┊ 『 ✅ 』 Aqui está o ${type}: ${filename}\n\n╰★────★────★`,
getScriptSuccess: ({ prefix, filename, content }) => `${prefix}꒷꒦ ✦ Código de ${filename} ✦ ꒷꒦\n\n${content}\n\n╰★────★────★`,
getInvalidOption: () => "❌ Opção inválida! Use \"file\" ou \"script\".",
getScriptOnlyJS: () => "❌ A opção script está disponível apenas para arquivos JavaScript.",
getSyntaxError: ({ prefix, filename, error }) => `${prefix}꒷꒦ ✦ Erro Sintaxe ✦ ꒷꒦\n\n┊ 『 ⛔️ 』 Arquivo: ${filename}\n\n${error}\n\n╰★────★────★`,
getFileError: ({ prefix, filename, error }) => `${prefix}❌ Erro: O arquivo ${filename} não existe ou não pode ser lido.\n\n${error}`,
getProcessError: ({ filename, error }) => `❌ Erro ao processar ${filename}: ${error}`,
getOperationCancelled: () => "꒷꒦ ✦ Operação Cancelada ✦ ꒷꒦\n\n┊ 『 ❌ 』 Solicitação cancelada com sucesso\n\n╰★────★────★",
getGenericError: ({ error }) => `❌ 𝐄𝐫𝐫𝐨: ${error}`,
leaveNotAdmin: () => "⚠️ Este comando pode ser usado apenas por admin e proprietários do grupo.",
leaveMessage: () => "꒷꒦ ✦ Adeus ✦ ꒷꒦\n\n┊ 『 👋 』 O bot está saindo do grupo\n\n╰★────★────★",
leaveError: () => "❌ Ocorreu um erro durante a saída do grupo.",
saveNoName: () => "⚠️ Especifique o nome do plugin a ser salvo.",
saveNoQuoted: () => "⚠️ É necessário responder à mensagem contendo o código do plugin.",
saveSaveSuccess: ({ path }) => `꒷꒦ ✦ Plugin Salvo ✦ ꒷꒦\n\n┊ 『 ✅ 』 Arquivo criado com sucesso\n┊ 『 📁 』 Caminho: ${path}\n\n╰★────★────★`,
saveErrorWrite: ({ error }) => `❌ Erro durante o salvamento do plugin.\n\n${error}`,
deleteNoPlugins: () => "⚠️ Nenhum plugin disponível para exclusão.",
deleteHelp: ({ usedPrefix, pluginList, total }) => `꒷꒦ ✦ Gerenciador de Exclusão de Plugin ✦ ꒷꒦\n\n┊ 『 📌 』 Uso do comando:\n┊ ${usedPrefix}deleteplugin <nome>\n\n┊ 『 ✨ 』 Exemplo:\n┊ ${usedPrefix}deleteplugin menu-oficial\n\n┊ 『 📋 』 Plugins disponíveis:\n${pluginList}${total > 15 ? `\n┊ ... e outros ${total - 15} plugins` : ''}\n\n╰★────★────★`,
deleteInvalidNumber: ({ max }) => `❌ Número inválido! Intervalo: 1-${max}`,
deleteNoSimilar: ({ input }) => `❌ Nenhum plugin similar a "${input}" encontrado.`,
deleteConfirm: ({ filename, score }) => `꒷꒦ ✦ Plugin Encontrado ✦ ꒷꒦\n\n┊ 『 ✨ 』 "${filename}"\n┊ 『 📊 』 Correspondência: ${score}%\n\n┊ 『 🗑️ 』 Deseja excluí-lo?\n\n╰♡꒷ ๑ Responda: sim/não`,
deleteMultiChoice: ({ input, options }) => `꒷꒦ ✦ Resultados para "${input}" ✦ ꒷꒦\n\n${options}\n\n┊ 『 📝 』 Escolha o número ou "não" para cancelar\n\n╰★────★────★`,
deleteNotFound: ({ path }) => `꒷꒦ ✦ Atenção ✦ ꒷꒦\n\n┊ 『 📁 』 Arquivo não encontrado no sistema de arquivos\n\n┊ 『 🔍 』 Caminho procurado:\n┊ ${path}\n\n╰★────★────★`,
deleteSuccess: ({ pluginName, sender, time }) => `꒷꒦ ✦ Plugin Excluído ✦ ꒷꒦\n\n┊ 『 🗑️ 』 Plugin excluído com sucesso\n\n┊ 『 📝 』 Nome: ${pluginName}.js\n┊ 『 👤 』 Excluído por: @${sender}\n┊ 『 🕐 』 Hora: ${time}\n\n┊ 『 ⚠️ 』 Nota: O bot pode exigir\n┊ uma reinicialização para aplicar as alterações\n\n╰★────★────★\n\n🎯 Operação concluída!`,
deleteError: ({ error }) => `꒷꒦ ✦ Erro Sistema ✦ ꒷꒦\n\n┊ 『 ❌ 』 Não foi possível excluir o plugin\n\n┊ 『 🔍 』 Detalhes do erro:\n┊ ${error}\n\n┊ 『 💡 』 Possíveis soluções:\n┊ -  Verifique as permissões do arquivo\n┊ -  Verifique se o plugin não está em uso\n┊ -  Tente novamente em alguns segundos\n\n╰★────★────★`,
deleteOperationCancelled: () => "꒷꒦ ✦ Operação Cancelada ✦ ꒷꒦\n\n┊ 『 ❌ 』 Exclusão cancelada\n\n╰★────★────★",
deleteGenericError: ({ error }) => `❌ Erro: ${error}`,
broadcastNoOwner: () => "❌ Apenas o proprietário pode usar este comando!",
broadcastNoGroups: () => "❌ O bot não está em nenhum grupo!",
broadcastHeader: () => "꒷꒦ ✦ Mensagem do ƌɽɛɑƌ-ʙᴏᴛ ✦ ꒷꒦",
broadcastIntro: () => "┊ 『 👑 』 Caros membros do grupo, chegou uma nova mensagem do proprietário:",
broadcastLabel: () => "┊ 『 📝 』 Mensagem:",
broadcastNote: () => "┊ 『 ⚠️ 』 Esta mensagem foi enviada a todos os membros do grupo",
broadcastFooter: () => "╰★────★────★\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ƌɽɛɑƌ-ʙᴏᴛ",
broadcastSuccess: ({ count }) => `꒷꒦ ✦ Broadcast Concluído ✦ ꒷꒦\n\n┊ 『 ✅ 』 Mensagem enviada com sucesso\n┊ 『 📊 』 Grupos alcançados: ${count}\n┊ 『 👥 』 Todos os membros foram mencionados\n\n╰★────★────★`,
broadcastDefaultMessage: () => "Esta é uma mensagem padrão enviada a todos os grupos.",
broadcastError: ({ group, error }) => `❌ Erro no envio da mensagem para o grupo ${group}: ${error}`,
banChatSuccess: () => "꒷꒦ ✦ Chat Bloqueada ✦ ꒷꒦\n\n┊ 『 🚫 』 Chat bloqueada com sucesso\n┊ 『 ⚠️ 』 O bot não responderá mais nesta chat\n\n╰★────★────★",
unbanChatSuccess: () => "꒷꒦ ✦ Chat Desbloqueada ✦ ꒷꒦\n\n┊ 『 ✅ 』 Chat desbloqueada com sucesso\n┊ 『 🎉 』 O bot pode responder novamente nesta chat\n\n╰★────★────★",
restartInitiating: () => "꒷꒦ ✦ Reinicialização em Andamento ✦ ꒷꒦\n\n┊ 『 ⏳ 』 Aguarde por favor...\n\n╰★────★────★",
restartProgress: () => "🚀🚀🚀🚀🚀🚀",
restartSuccess: () => "꒷꒦ ✦ Reinicialização Concluída ✦ ꒷꒦\n\n┊ 『 ✅ 』 Bot reiniciado com sucesso\n┊ 『 🎉 』 Sistema operacional\n\n╰★────★────★",
restartError: ({ error }) => `꒷꒦ ✦ Erro Reinicialização ✦ ꒷꒦\n\n┊ 『 ❌ 』 Não foi possível reiniciar o bot\n┊ 『 🔍 』 Erro: ${error}\n\n╰★────★────★`,
shutdownInitiating: () => "꒷꒦ ✦ Desligamento do Bot ✦ ꒷꒦\n\n┊ 『 🔌 』 Estou desligando o bot...\n┊ 『 🚫 』 Todas as chats foram bloqueadas\n┊ 『 ⏳ 』 Aguarde o encerramento\n\n╰★────★────★",
shutdownSuccess: () => "꒷꒦ ✦ Bot Desligado ✦ ꒷꒦\n\n┊ 『 ✅ 』 Desligamento concluído\n┊ 『 💤 』 Bot offline\n\n╰★────★────★",
shutdownChatsBanned: ({ count }) => `┊ 『 📊 』 ${count} chats bloqueadas`,
shutdownError: ({ error }) => `꒷꒦ ✦ Erro Desligamento ✦ ꒷꒦\n\n┊ 『 ❌ 』 Não foi possível desligar o bot\n┊ 『 🔍 』 Erro: ${error}\n\n╰★────★────★`,
updateInitiating: () => "꒷꒦ ✦ Atualização do Bot ✦ ꒷꒦\n\n┊ 『 🔄 』 Verificando atualizações...\n┊ 『 ⏳ 』 Aguarde por favor\n\n╰★────★────★",
updateSuccess: ({ output }) => `꒷꒦ ✦ Atualização Concluída ✦ ꒷꒦\n\n┊ 『 ✅ 』 Bot atualizado com sucesso\n\n┊ 『 📋 』 Detalhes:\n${output}\n\n╰★────★────★`,
updateError: ({ error }) => `꒷꒦ ✦ Erro Atualização ✦ ꒷꒦\n\n┊ 『 ❌ 』 Não foi possível atualizar o bot\n┊ 『 🔍 』 Erro: ${error}\n\n┊ 『 💡 』 Possíveis soluções:\n┊ -  Verifique a conexão com a internet\n┊ -  Verifique as permissões Git\n┊ -  Certifique-se de estar em um branch válido\n\n╰★────★────★`,
updateNoChanges: () => "꒷꒦ ✦ Já Atualizado ✦ ꒷꒦\n\n┊ 『 ℹ️ 』 O bot já está na versão mais recente\n┊ 『 ✅ 』 Nenhuma atualização disponível\n\n╰★────★────★",
groupMenuTitle: () => "𝑴𝑬𝑵𝑼 𝑮𝑹𝑼𝑷𝑶",
chooseMenu: () => "Escolha uma categoria do menu:",
mainMenuButton: () => "🏠 Menu Principal",
adminMenuButton: () => "🛡️ Menu Admin/Mod",
ownerMenuButton: () => "👑 Menu Proprietário",
securityMenuButton: () => "🚨 Menu Segurança",
aiMenuButton: () => "🤖 Menu IA",
musicAudioSection: () => "MÚSICA & ÁUDIO",
infoUtilitySection: () => "INFORMAÇÃO & UTILIDADES",
imageEditSection: () => "IMAGENS & EDIÇÃO",
pokemonSection: () => "POKEMON",
gamesCasinoSection: () => "JOGOS & CASSINO",
economyRankingSection: () => "ECONOMIA & CLASSIFICAÇÕES",
socialInteractionSection: () => "INTERAÇÕES SOCIAIS",
howMuchSection: () => "QUANTO É?",
personalityTestSection: () => "TESTE DE PERSONALIDADE",
memberCommands: () => "𝑪𝑶𝑴𝑨𝑵𝑫𝑶𝑺 𝑷𝑨𝑹𝑨 𝑶𝑺 𝑴𝑬𝑴𝑩𝑹𝑶𝑺",
versionLabel: () => "𝑽𝑬𝑹𝑺Ã𝑶",
collabLabel: () => "𝑪𝑶𝑳𝑨𝑩𝑶𝑹𝑨𝑪̧𝑨̃𝑶",
songCommand: () => "musica",
audioCommand: () => "audio",
videoCommand: () => "video",
cityCommand: () => "cidade",
textCommand: () => "texto",
groupCommand: () => "grupo",
userCommand: () => "usuario",
checkSiteCommand: () => "verificarsite",
photoToStickerCommand: () => "foto para sticker",
stickerToPhotoCommand: () => "sticker para foto",
improveQualityCommand: () => "melhorar qualidade foto",
photoCommand: () => "foto",
hiddenPhotoCommand: () => "foto oculta",
memeCommand: () => "meme",
fromStickerCommand: () => "de sticker",
blurImageCommand: () => "desfocar imagem",
comingSoonCommand: () => "em breve",
quantityCommand: () => "quantidade",
headsOrTailsCommand: () => "cara ou coroa",
mathProblemCommand: () => "problema matematica",
rockPaperScissorsCommand: () => "pedra papel tesoura",
pokemonInfoCommand: () => "info Pokémon",
balanceCommand: () => "saldo",
topUsersCommand: () => "top usuarios",
withdrawUCCommand: () => "UC do banco",
earnXPCommand: () => "ganhar XP",
endRelationshipCommand: () => "fim relacionamento",
affinityCommand: () => "afinidade",
charmCommand: () => "charme",
createFightCommand: () => "criar brigas",
truthOrDareCommand: () => "verdade ou desafio",
playNoText: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n ❗ Insira um título ou link\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
playNoResults: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n ❗ Nenhum resultado encontrado\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
playAudioLoading: () => "┊ ┊ ┊ ┊‿ ˚➶ ｡˚\n┊ ┊ ┊ ┊. ➶ ˚\n┊ ┊ ┊ ˚✧ 🎵 Áudio a caminho\n┊ ˚➶ ｡˚ ☁︎ Aguarde alguns instantes...",
playVideoLoading: () => "┊ ┊ ┊ ┊‿ ˚➶ ｡˚\n┊ ┊ ┊ ┊. ➶ ˚\n┊ ┊ ┊ ˚✧ 🎬 Vídeo a caminho\n┊ ˚➶ ｡˚ ☁︎ Aguarde alguns instantes...",
playDownloadComplete: () => "✅ Download concluído!",
playTooLong: ({ maxMinutes, duration }) => `╭★────★────★\n|ㅤㅤㅤㅤㅤㅤㅤ꒰¡VÍDEO LONGO DEMAIS!꒱\n|˚₊꒷ ⏳ ꒱ ฅ﹕Máximo: ${maxMinutes} minutos ₊˚๑\n|˚₊꒷ ⌛ ꒱ ฅ﹕Duração: ${duration} ₊˚๑\n╰★────★────★`,
playVideoInfo: ({ title, timestamp, views, author, ago, url }) => `⋆ ︵ ★ 🎥 INFORMAÇÕES DO VÍDEO 🎥 ★ ︵ ⋆\n\n\n꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧\n୧ ✍️ *Título:* ${title}\n୧ ⏳ *Duração:* ${timestamp}\n୧ 👀 *Visualizações:* ${views}\n୧ 🔰 *Canal:* ${author}\n୧ 🔳 *Publicado:* ${ago}\n୧ 🔗 *Link:* ${url}\n꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧\n\n\n╰♡꒷ ๑ ⋆˚₊⋆───ʚ˚ɞ───⋆˚₊⋆ ๑ ⪩\n  > Escolha um formato para baixar\n╰♡꒷ ๑ ⋆˚₊⋆───ʚ˚ɞ───⋆˚₊⋆ ๑ ⪩`,
playChooseFormat: () => "Escolha um formato:",
playAudioButton: () => "🎵 Áudio",
playVideoButton: () => "🎬 Vídeo",
playSaveButton: () => "💾 Salvar Playlist",
playError: ({ error }) => `꒰🩸꒱ ◦- ≫ ERRO\n ★・・・・・・・★\n  ${error}\n ★・・・・・・・★`,
playNoValidLink: () => "꒰🩸꒱ ◦- ≫ ERRO\n ★・・・・・・・★\n  Nenhum link válido encontrado\n ★・・・・・・・★",
playlistEmpty: ({ userName }) => `ℹ️ ${userName ? `${userName} não tem músicas salvas` : 'Sua playlist está vazia!'}`,
playlistHeader: ({ userName }) => `📋 ${userName ? `Playlist de ${userName}` : 'Sua playlist'}`,
playlistMore: ({ count }) => `...e outras ${count} músicas`,
playlistSelectToPlay: () => "Selecione uma música para reproduzir",
saveNoText: () => "⚠️ Especifique uma música para buscar",
saveSearching: ({ query }) => `⌛ Procurando "${query}"...`,
saveNoResults: () => "⚠️ Nenhum resultado encontrado",
saveAlreadyExists: () => "⚠️ Música já está na playlist! Use .playlist para ver as músicas salvas.",
saveSaved: () => "✅ Música salva!",
saveViewPlaylist: () => "📋 Ver Playlist",
savePlay: () => "🎵 Reproduzir",
saveDelete: () => "🗑️ Excluir",
saveSaveNew: () => "💾 Salvar nova",
deleteSelect: () => "🗑️ Selecione a música para excluir",
deleteUse: () => "Use: .elimina <número>",
deleteInvalid: () => "⚠️ Número inválido!",
deleteSuccess: () => "✅ Música excluída!",
deleteRestore: () => "💾 Restaurar",
backButton: () => "🔙 Voltar",
playlistError: ({ error }) => `⚠️ Erro: ${error}`,
playlistSignature: () => "꙰ 𝗖𝗿𝗶𝗮çã𝗼 𝗚𝗮𝗯𝟯𝟯𝟯 ꙰",
ytSearchMissingFiles: () => "❗ Para usar este comando use a base do ƌɽɛɑƌ-ʙᴏᴛ",
ytSearchMissingQuery: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n 📌 Insira o nome do vídeo\n Exemplo: .ytsearch compilação\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
ytSearchNoResults: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n ❌ Nenhum resultado encontrado\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
ytSearchTitle: () => "🔎 Pesquisa no YouTube",
ytSearchFooter: () => "ƌɽɛɑƌ-ʙᴏᴛ ✦ Downloader",
ytSearchResultTitle: () => "🎬 Resultados do YouTube",
ytSearchResultHeader: () => "╭┈ ─ ─ ✦ ─ ─ ┈╮\n ୧ 🎬 ୭ Resultados da pesquisa\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Aqui estão os resultados encontrados ✦ ꒷꒦",
ytSearchSelectPrompt: () => "╭★────★────★╮\n│ 🔢 Selecione um vídeo\n│ dos resultados acima\n╰★────★────★╯",
ytSearchDuration: () => "📺 Duração:",
ytSearchViews: () => "👁 Visualizações:",
ytSearchChannel: () => "👤 Canal:",
toAudioNoMedia: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ⚠️ Responda a um vídeo ou áudio\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
toAudioDownloadError: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ❌ Erro durante o download\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
toAudioConvertError: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ❌ Erro durante a conversão\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",

weatherNoCity: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ❗ Insira o nome de uma cidade\n  Uso: .meteo [nome da cidade]\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
weatherInfo: ({ name, country, temp, feels, min, max, humidity, main, desc, wind, pressure }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🌍 ୭ *Tempo ${name}, ${country}*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Informações meteorológicas ✦ ꒷꒦\n\n🌡 Temperatura: ${temp}°C\n🌡 Sensação: ${feels}°C\n🌡 Mínima: ${min}°C\n🌡 Máxima: ${max}°C\n💧 Umidade: ${humidity}%\n☁ Tempo: ${main}\n🌫 Descrição: ${desc}\n💨 Vento: ${wind} m/s\n🔽 Pressão: ${pressure} hPa\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🌤️\n│ Powered by OpenWeather\n╰★────★────★╯`,
weatherCityNotFound: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  🚫 Cidade não encontrada\n  Verifique a escrita\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
weatherError: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ⚠️ Erro durante a recuperação\n  Tente novamente mais tarde\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
translateHelp: ({ prefix, command, languages }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🌍 ୭ *TRADUTOR*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Exemplos de uso ✦ ꒷꒦\n\n│ ${prefix}${command} Olá\n│ ${prefix}${command} en Olá\n│ ${prefix}${command} ja Hello\n│ ${prefix}${command} [responder msg]\n│ ${prefix}fala ar texto\n\n꒷꒦ ✦ Idiomas disponíveis ✦ ꒷꒦\n\n${languages}\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🌐\n│ ƌɽɛɑƌ-ʙᴏᴛ Translator\n╰★────★────★╯`,
translateNoText: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ❌ Texto em falta para áudio\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
translateNoLang: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ❌ Idioma não especificado\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
translateWhatToTranslate: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ❌ E o que devo traduzir?\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
translateTooLong: ({ max, length }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ❌ Texto muito longo\n  Máximo: ${max} caracteres\n  Seu: ${length} caracteres\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
translateResult: ({ fromLang, toLang, translation }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🌍 ୭ *TRADUTOR*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ De: ${fromLang} ✦ ꒷꒦\n꒷꒦ ✦ Para: ${toLang} ✦ ꒷꒦\n\n${translation}\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🎯\n│ Tradução concluída\n╰★────★────★╯`,
translateListenOriginal: () => "🔊 Ouvir Original",
translateListenTranslation: () => "🎵 Ouvir Tradução",
translateFooter: () => "ƌɽɛɑƌ-ʙᴏᴛ Translator",
translateTTSError: ({ error }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ❌ Erro de áudio: ${error}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
translateError: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ❌ Erro durante a tradução\n  Tente novamente mais tarde\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
antiLinkNotAdmin: () => "╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ ⚠️ ୭ *Salvo por agora*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Não sou admin ✦ ꒷꒦\n\nNão posso fazer nada",
antiLinkDetected: ({ user, qrDetected }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🚫 ୭ *ANTI-LINK ATIVADO*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Violação de regras ✦ ꒷꒦\n\n${user} 🤨 Você violou as regras do grupo${qrDetected ? ', acha que não vejo os QR? 😂' : '.'}\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 👮\n│ Expulso automaticamente\n╰★────★────★╯`,
antiLinkRestrictOff: () => "╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ ⚠️ ୭ *Restrict Desativado*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Ação necessária ✦ ꒷꒦\n\nContate o proprietário do bot para ativar o RESTRICT\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🔧\n│ Função não disponível\n╰★────★────★╯",
antiMediaWarning: () => "╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ ⚠️ ୭ *ANTIMEDIA ATIVO*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Violação de regras ✦ ꒷꒦\n\nApenas fotos e vídeos com 1 visualização são permitidos\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🚫\n│ Mídia excluída\n╰★────★────★╯",
antiSpamDetected: () => "╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🚫 ୭ *ANTISPAM DETECTADO*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Spam detectado ✦ ꒷꒦\n\nO usuário foi removido por comportamento de spam\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ ⚡\n│ ƌɽɛɑƌ-ʙᴏᴛ x 333 Protection\n╰★────★────★╯",
antiTrabaAdminWarning: ({ user }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ ⚠️ ୭ *ATENÇÃO ADMIN*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Trava detectado ✦ ꒷꒦\n\nEI @${user} por acaso se diverte mandando trava aqui? Que sorte para você que é admin! -.-\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🛡️\n│ Protegido pelo status\n╰★────★────★╯`,
antiTrabaDetected: ({ user }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🚫 ୭ *ANTI-TRAVA ATIVO*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Mensagem longa detectada ✦ ꒷꒦\n\nO usuário @${user} enviou uma mensagem muito longa e será removido\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🚨\n│ ƌɽɛɑƌ-ʙᴏᴛ Protection\n╰★────★────★╯`,
antiTrabaNoPermission: () => "╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ ⚠️ ୭ *Permissões Ausentes*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Ação bloqueada ✦ ꒷꒦\n\nNão tenho permissões de administrador para remover quem envia trava\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🔒\n│ Solicite permissões de admin\n╰★────★────★╯",
infoSetAge: () => "╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🗓️ ୭ *Definir Idade*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Como proceder ✦ ꒷꒦\n\nPara definir sua idade use:\n.setanos <idade>\n\nPara remover sua idade use:\n.eliminaanos\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 📝\n│ Gerenciamento de perfil\n╰★────★────★╯",
infoSetIG: () => "╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🌐 ୭ *Definir Instagram*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Como proceder ✦ ꒷꒦\n\nPara definir Instagram use:\n.setig <username>\n\nPara remover use:\n.delig\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 📱\n│ Gerenciamento de redes sociais\n╰★────★────★╯",
infoGroupOnly: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Comando apenas para grupos\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
infoUserData: ({ messages, warn, role, age, gender, blasphemy, instagram }) => `⋆ ︵ ★ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀ÇÕ𝐄𝐒 𝐃𝐎 𝐔𝐒𝐔Á𝐑𝐈𝐎 ★ ︵ ⋆\n\n\n꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧\n୧ 📝 *Mensagens:* ${messages}\n୧ ⚠️ *Warn:* ${warn} / 4\n୧ 🟣 *Função:* ${role}\n୧ 🗓️ *Idade:* ${age}\n୧ 🚻 *Gênero:* ${gender}\n୧ 🤬 *Blasfêmias:* ${blasphemy}\n${instagram ? `୧ 🌐 instagram.com/${instagram}` : '୧ 🌐 *Instagram:* Não definido'}\n꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧`,
infoSetAgeButton: () => "🗓️ Definir Idade",
infoSetGenderMaleButton: () => "🚹 Gênero Masculino",
infoSetGenderFemaleButton: () => "🚺 Gênero Feminino",
infoSetIGButton: () => "🌐 Definir IG",
infoFooter: () => "Defina seus dados pessoais:",
infoCreator: () => "𝒄𝒓𝒊𝒂𝒅𝒐 𝒑𝒐𝒓 𝑶𝒏𝒊𝒙🌟",
infoRoleFounder: () => "𝐅𝐮𝐧𝐝𝐚𝐝𝐨𝐫 ⚜️",
infoRoleAdmin: () => "𝐀𝐝𝐦𝐢𝐧 👑",
infoRoleMember: () => "𝐌𝐞𝐦𝐛𝐫𝐨 🤍",
infoGenderNotSet: () => "𝐍ã𝐨 𝐝𝐞𝐟𝐢𝐧𝐢𝐝𝐨",
infoAgeNotSet: () => "Não definida",
infoAgeYears: ({ age }) => `${age} anos`,
setGenderUsage: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ Uso correto do comando\n  ━━✫ .setgenero masculino\n  ━━✫ .setgenero feminino\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
setGenderSuccess: ({ gender, emoji }) => `✓ Gênero definido como: ${gender} ${emoji}`,
deleteGenderSuccess: () => "✓ Gênero removido",
setAgeUsage: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ Insira uma idade válida\n  ━━✫ Idade de 10 a 80 anos\n  ━━✫ Use: .setanos <idade>\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
setAgeSuccess: ({ age }) => `✓ Idade definida como: ${age} anos`,
deleteAgeSuccess: () => "✓ Idade removida",
rulesNotSet: ({ prefix }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⓘ Nenhuma regra definida\n  ━━✫ Os admins ainda não\n  ━━✫ definiram as regras\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n\n📌 Para definir as regras use:\n${prefix}setregras <texto das regras>`,
rulesTitle: () => "📜 𝐑𝐞𝐠𝐫𝐚𝐬 𝐝𝐨 𝐆𝐫𝐮𝐩𝐨",
rulesDisplay: ({ rules }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 📜 ୭ *Regras do Grupo*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n${rules}\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ ⚖️\n│ Respeite as regras\n╰★────★────★╯`,
dashboardTitle: () => "⚡ 𝐓𝐎𝐏 𝟏𝟎 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 ⚡",
dashboardCommand: () => "📚 COMANDO",
dashboardUses: () => "🗂️ USOS",
dashboardLastUse: () => "⏱️ ÚLTIMO USO",
dashboardNeverUsed: () => "Nunca usado",
dashboardDaysAgo: ({ days }) => `${days} dias atrás`,
dashboardHoursAgo: ({ hours }) => `${hours} horas atrás`,
dashboardMinutesAgo: ({ minutes }) => `${minutes} minutos atrás`,
dashboardSecondsAgo: () => "poucos segundos atrás",
dashboardStats: ({ stats }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ ⚡ ୭ *TOP 10 COMANDOS*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n${stats}\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 📊\n│ Estatísticas do bot\n╰★────★────★╯`,
imageSearchBaseOnly: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ Este comando está disponível\n  ━━✫ apenas com a base ƌɽɛɑƌ-ʙᴏᴛ\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
imageSearchUsage: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⓘ Uso do comando\n  ━━✫ ${prefix}${command} <palavra-chave>\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
imageSearchForbidden: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Conteúdo não permitido\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
imageSearchNoResults: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 😢 Nenhuma imagem encontrada\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
imageSearchResults: ({ term }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🔍 ୭ *Resultados da pesquisa*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Consulta: ${term} ✦ ꒷꒦`,
imageSearchImageNum: ({ num }) => `Imagem #${num}`,
imageSearchResultFor: ({ term }) => `Resultado para: ${term}`,
imageSearchFooter: () => "Powered by ƌɽɛɑƌ-ʙᴏᴛ",
imageSearchOpenImage: () => "Abrir imagem",
imageSearchTitle: () => "Resultados de imagens",
imageSearchSubtitle: () => "Aqui estão as imagens encontradas no Google",
imageSearchAgainPrompt: () => "🔄 Quer buscar outras imagens com o mesmo termo?",
imageSearchAgainButton: () => "Buscar novamente",
obfuscateNoCode: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Insira código JavaScript\n  ━━✫ para ofuscar ou responda\n  ━━✫ a uma mensagem com código\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
obfuscateProcessing: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⏳ Ofuscamento em andamento...\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
obfuscateSuccess: () => "╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🔒 ୭ *Código ofuscado*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Ofuscamento concluído ✦ ꒷꒦",
obfuscateError: ({ error }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro no ofuscamento\n  ━━✫ ${error}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
bonkNoPhoto: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Nenhuma foto de perfil\n  ━━✫ O usuário não definiu\n  ━━✫ uma foto de perfil\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
bonkError: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro durante a execução\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
hornyCardCaption: () => "╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🔥 ୭ *Cartão Horny*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Quão horny você está? 🥵🔥 ✦ ꒷꒦",
stupidCaption: ({ user }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🤡 ୭ *Quão estúpido você é?*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ @${user} ✦ ꒷꒦`,
stupidDefaultText: () => "sou+estúpido",
wantedNoProfilePic: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Impossível recuperar\n  ━━✫ a foto de perfil\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
wantedNoProfilePicUser: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ O usuário não tem\n  ━━✫ foto de perfil\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
wantedYourProfilePic: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Você não tem uma foto de perfil\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
wantedUnsupportedFormat: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Formato não suportado\n  ━━✫ Use JPEG ou PNG\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
wantedUploadError: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro no upload da imagem\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
wantedAPIError: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro na API\n  ━━✫ Tente novamente mais tarde\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
wantedError: ({ error }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro: ${error}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
wantedCaption: () => "╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🚔 ୭ *PROCURO*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Procurado ✦ ꒷꒦\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 👮\n│ Powered by ƌɽɛɑƌ-ʙᴏᴛ\n╰★────★────★╯",
jokeNoProfilePic: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Impossível recuperar\n  ━━✫ a foto de perfil\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
jokeYourProfilePic: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Você não tem uma foto de perfil\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
jokeUnsupportedFormat: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Formato não suportado\n  ━━✫ Use JPEG ou PNG\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
jokeUploadError: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro no upload da imagem\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
jokeAPIError: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro na API\n  ━━✫ Tente novamente mais tarde\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
jokeError: ({ error }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro: ${error}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
jokeCaption: () => "╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🤡 ୭ *PIADA*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Piada sobre a cabeça ✦ ꒷꒦\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 😂\n│ Powered by ƌɽɛɑƌ-ʙᴏᴛ\n╰★────★────★╯",
jailNoProfilePic: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Impossível recuperar\n  ━━✫ a foto de perfil\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
jailUploadError: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro no upload da imagem\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
jailAPIError: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro na API\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
jailError: ({ error }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro: ${error}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
jailCaption: () => "╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🚔 ୭ *NA CADEIA*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 👮\n│ Powered by ƌɽɛɑƌ-ʙᴏᴛ\n╰★────★────★╯",
nokiaNoProfilePic: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Impossível recuperar\n  ━━✫ a foto de perfil\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
nokiaYourProfilePic: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Você não tem uma foto de perfil\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
nokiaUnsupportedFormat: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Formato não suportado\n  ━━✫ Use JPEG ou PNG\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
nokiaUploadError: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro no upload\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
nokiaAPIError: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro na API\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
nokiaError: ({ error }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro: ${error}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
nokiaCaption: () => "╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 📱 ୭ *NOKIA*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 📞\n│ Powered by ƌɽɛɑƌ-ʙᴏᴛ\n╰★────★────★╯",
adNoProfilePic: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Impossível recuperar\n  ━━✫ a foto de perfil\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
adYourProfilePic: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Você não tem uma foto de perfil\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
adUnsupportedFormat: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Formato não suportado\n  ━━✫ Use JPEG ou PNG\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
adUploadError: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro no upload\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
adAPIError: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro na API\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
adError: ({ error }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro: ${error}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
adCaption: () => "╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 📢 ୭ *PUBLICIDADE*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 📺\n│ Powered by ƌɽɛɑƌ-ʙᴏᴛ\n╰★────★────★╯",
pokeOpenNoType: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Especifique o tipo\n  ━━✫ base, imperium, premium, darkness\n  ━━✫ Exemplo: .abrepokemon base\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
pokeOpenNoPacks: ({ type }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⛔ Você não tem pacotes ${type.toUpperCase()}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
pokeOpenOpening: () => "🎁 Abrindo o pacote...",
pokeOpenRevealing: () => "✨ Revelando as cartas...",
pokeOpenNoCards: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 😢 Nenhuma carta encontrada\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
pokeOpenResult: ({ type, name, rarity, shiny, cardType, level, remaining }) => `🎉 Você abriu um pacote *${type.toUpperCase()}*:\n\n✨ *${name}* (${rarity})${shiny ? ' ✨ Shiny' : ''}\n🔰 Tipo: ${cardType} | Nível: ${level}\n\n📦 Pacotes restantes: *${remaining}* ${type}`,
pokeBuyUsage: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Uso correto\n  ━━✫ .comprapokemon <base|imperium|premium> <quantidade>\n  ━━✫ Exemplo: .comprapokemon base 3\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
pokeBuyNoCoins: ({ cost, balance }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ UnityCoins insuficientes\n  ━━✫ Necessários: ${cost}\n  ━━✫ Saldo: ${balance}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
pokeBuySuccess: ({ quantity, type, total, balance }) => `✅ Você comprou *${quantity}* pacotes ${type.toUpperCase()}!\n📦 Total agora: ${total}\n💸 UnityCoins restantes: ${balance}`,
pokeLeaderboardEmpty: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 😢 Nenhum colecionador encontrado\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
pokeLeaderboardTitle: () => "🏆 *Top 10 Colecionadores Pokémon*:",
pokeInventoryTitle: () => "📂 SEUS PACOTES",
pokeInventoryBase: ({ count }) => `• 📦 Base: ${count}`,
pokeInventoryImperium: ({ count }) => `• 👑 Imperium: ${count}`,
pokeInventoryPremium: ({ count }) => `• 🌌 Premium: ${count}`,
pokeInventoryFooter: () => "🎁 Use os botões para abrir um pacote agora!",
pokeInventoryOpenBase: () => "📦 Abrir Base",
pokeInventoryOpenImperium: () => "👑 Abrir Imperium",
pokeInventoryOpenPremium: () => "🌌 Abrir Premium",
pokeInventoryBuy: () => "➕ Comprar Pacotes",
pokeBattleNoMention: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚔️ Marque um usuário\n  ━━✫ Exemplo: .combate @usuário\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
pokeBattleNoPokemon: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 😓 Você não tem Pokémon\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
pokeBattleOpponentNoPokemon: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 😓 O oponente não tem Pokémon\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
pokeBattleResult: ({ user1, user2, poke1, poke2, result }) => `⚔️ *Combate Pokémon!*\n\n👤 @${user1} escolheu *${poke1.name}* (Nv. ${poke1.level})\n👤 @${user2} escolheu *${poke2.name}* (Nv. ${poke2.level})\n\n${result}`,
pokeBattleWinner: ({ user }) => `🏆 @${user} vence o combate!`,
pokeBattleTie: () => "🤝 Empate! Ambos os Pokémon estão exaustos.",
pokeEvolveNoName: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 📛 Especifique o nome do Pokémon\n  ━━✫ Exemplo: .evolui Charmander\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
pokeEvolveNotOwned: ({ name }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Você não possui *${name}*\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
pokeEvolveNoCoins: ({ balance, cost }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⛔ unitycoin insuficiente\n  ━━✫ Você tem: ${balance}\n  ━━✫ Necessários: ${cost}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
pokeEvolveNoEvolution: ({ name }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⛔ ${name} não pode evoluir\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
pokeEvolveEvolving: ({ name }) => `✨ *${name}* está evoluindo...`,
pokeEvolveProgress: () => "🔄 Evolução em andamento...",
pokeEvolveSuccess: ({ from, to }) => `🎉 *${from}* evoluiu para *${to}*!`,
pokeEvolveComplete: ({ balance }) => `✅ Evolução concluída!\n💰 unitycoin restantes: *${balance}*`,
tradeUsage: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 📌 Uso correto\n  ━━✫ .troca @usuário <seu_num> <num_dele>\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
tradeYourNotExist: ({ num }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Seu Pokémon n. ${num}\n  ━━✫ não existe\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
tradeTheirNotExist: ({ num, user }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ O Pokémon n. ${num}\n  ━━✫ de @${user} não existe\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
tradeRequest: ({ from, myPoke, theirPoke, target }) => `🔁 *Pedido de Troca*\n\n@${from} quer trocar:\n📤 *${myPoke.name}* (Nv. ${myPoke.level})\npor\n📥 *${theirPoke.name}* (Nv. ${theirPoke.level}) de @${target}\n\n✅ @${target}, responda com *.aceita* para confirmar.`,
tradeNoRequest: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Nenhum pedido de troca\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
tradeUnavailable: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Um dos Pokémon\n  ━━✫ não está mais disponível\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
tradeSuccess: ({ from, to, poke1, poke2 }) => `✅ Troca concluída entre @${from} e @${to}!\n\n🎁 ${poke1.name} ⇄ ${poke2.name}`,
pityTitle: () => "📊 *Sistema Pity Darkness*",
pityOpened: ({ count }) => `🔁 Pacotes abertos sem Darkness: *${count}*`,
pityRemaining: ({ remaining }) => `🎯 Próximo Darkness garantido em: *${remaining}* pacotes`,
pityGuaranteed: () => "✨ O próximo pacote tem um Darkness *garantido*!",
inventoryEmpty: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 📦 Inventário vazio\n  ━━✫ Use .abrepokemon base\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
inventoryInvalidPage: ({ max }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Página inválida\n  ━━✫ Escolha entre 1 e ${max}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
inventoryHeader: ({ user, total, page, totalPages, perPage }) => `╭━━━🗂️ *INVENTÁRIO POKÉMON* 🗂️━━━╮\n┃ 👤 *Treinador:* @${user}\n┃ 📦 *Total:* ${total}\n┃ 📄 *Página:* ${page}/${totalPages}\n┃ 📌 *Por página:* ${perPage}\n╰━━━━━━━━━━━━━━━━━━━━━━━╯`,
inventoryDarknessButton: () => "🌑 Pokémon Darkness",
inventoryPageButton: ({ num }) => `Página ${num}`,
inventoryFooter: () => "📂 Use `.inventario [página]` ou clique nos botões para navegar.",
darknessInfo: () => "🌑 *PACOTES DARKNESS* 🌑\n\nOs pacotes *Darkness* não podem ser comprados, mas são encontrados **aparentemente do nada** quando você abre pacotes *Premium*.\n\n➡️ A cada 10 pacotes *Premium* abertos, você tem 50% de chance de obter um pacote *Darkness* bônus.\n\n🎲 Abrindo um pacote *Darkness* você pode encontrar Pokémon Darkness especiais com 10% de chance.\n\nUse *.abrepokemon darkness* para abrir os pacotes Darkness.\n\nBoa sorte! 🍀",
trisAlreadyPlaying: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❗ Você já está jogando\n  ━━✫ com alguém\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
trisNoRoomName: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❗ Você deve dar um nome à sala\n  ━━✫ Exemplo: ${prefix}${command} sala1\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
trisGameStarting: () => "╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🕹️ ୭ *PARTIDA COMEÇA*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Um jogador entrou ✦ ꒷꒦",
trisTurnOf: ({ player }) => `Vez de @${player}`,
trisRoomCreated: () => "𝐒𝐀𝐋𝐀 𝐂𝐑𝐈𝐀𝐃𝐀 ✓",
trisWaiting: ({ room }) => `══════ •⊰✧⊱• ══════\n*𝐀𝐠𝐮𝐚𝐫𝐝𝐚𝐧𝐝𝐨 𝐣𝐨𝐠𝐚𝐝𝐨𝐫𝐞𝐬 ...*\n══════════════\n🕹️ 𝐏𝐚𝐫𝐚 𝐩𝐚𝐫𝐭𝐢𝐜𝐢𝐩𝐚𝐫 𝐝𝐢𝐠𝐢𝐭𝐞\n.joga ${room}\n══════════════\n⛔ 𝐏𝐚𝐫𝐚 𝐬𝐚𝐢𝐫 𝐝𝐚 𝐩𝐚𝐫𝐭𝐢𝐝𝐚\n𝐞𝐦 𝐚𝐧𝐝𝐚𝐦𝐞𝐧𝐭𝐨 𝐝𝐢𝐠𝐢𝐭𝐞 .sai\n══════ •⊰✧⊱• ══════`,
slotInvalidBet: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Aposta inválida\n  ━━✫ Exemplo: ${prefix}${command} 100\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
slotInsufficientUC: ({ bet }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚫 UC insuficientes\n  ━━✫ Você precisa de ${bet} UC\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
slotCooldown: ({ min, sec }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⏳ Aguarde ${min}m ${sec}s\n  ━━✫ antes de jogar novamente\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
slotWin: ({ uc, xp }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🎉 ୭ *VOCÊ GANHOU!*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Ganhos ✦ ꒷꒦\n\n┌──────────────\n│ ➕ *${uc} UC*\n│ ➕ *${xp} XP*\n└──────────────`,
slotLose: ({ uc, xp }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🤡 ୭ *VOCÊ PERDEU!*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Perdas ✦ ꒷꒦\n\n┌──────────────\n│ ➖ *${uc} UC*\n│ ➖ *${xp} XP*\n└──────────────`,
slotBalance: ({ uc, xp, current, max, prefix }) => `\n💎 *SALDO ATUAL*\n\n┌──────────────\n│ 👛 *UC: ${uc}*\n│ ⭐ *XP: ${xp}*\n│ 📊 *Progresso: ${current}/${max} XP*\n└──────────────\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ ℹ️\n│ Use ${prefix}menuxp para mais XP!\n╰★────★────★╯`,
betUsage: ({ prefix, command }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🎰 ୭ *CASSINO*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Como jogar ✦ ꒷꒦\n\nInsira a quantidade de 💶 UnityCoins para apostar contra *ƌɽɛɑƌ-ʙᴏᴛ-Bot*\n\n📌 Exemplo:\n${prefix}${command} 100\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🎲\n│ Escolha um valor abaixo!\n╰★────★────★╯`,
betCooldown: ({ time }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Você já apostou\n  ━━✫ Aguarde ⏱ ${time}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
betLose: ({ bot, user, amount, botName, userName }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🎲 ୭ *RESULTADO*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Números sorteados ✦ ꒷꒦\n\n🤖 *${botName}*: ${bot}\n👤 *${userName}*: ${user}\n\n╭★────★────★╮\n│ 😢 VOCÊ PERDEU!\n│ ➖ ${amount} 💶 UC\n╰★────★────★╯`,
betWin: ({ bot, user, amount, botName, userName }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🎲 ୭ *RESULTADO*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Números sorteados ✦ ꒷꒦\n\n🤖 *${botName}*: ${bot}\n👤 *${userName}*: ${user}\n\n╭★────★────★╮\n│ 🎉 VOCÊ GANHOU!\n│ ➕ ${amount} 💶 UC\n╰★────★────★╯`,
betDraw: ({ bot, user, amount, botName, userName }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🎲 ୭ *RESULTADO*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Números sorteados ✦ ꒷꒦\n\n🤖 *${botName}*: ${bot}\n👤 *${userName}*: ${user}\n\n╭★────★────★╮\n│ 🤝 EMPATE!\n│ ↩️ ${amount} 💶 UC devolvidos\n╰★────★────★╯`,
betInsufficientUC: ({ amount }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 💸 Você não tem ${amount} 💶 UC\n  ━━✫ para apostar!\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rpsAlreadyPlaying: ({ time }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⏱ Você já jogou\n  ━━✫ Aguarde ${time}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rpsChooseOption: () => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ ✊ ୭ *PEDRA PAPEL TESOURA*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Escolha sua jogada ✦ ꒷꒦\n\n🪨 Pedra vence Tesoura\n📄 Papel vence Pedra\n✂️ Tesoura vence Papel\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🎲\n│ Faça sua escolha!\n╰★────★────★╯`,
rpsInvalidOption: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Escolha inválida\n  ━━✫ Escolha: pedra/papel/tesoura\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rpsDraw: ({ player, bot, reward }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🤝 ୭ *EMPATE!*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Resultado ✦ ꒷꒦\n\n👤 Você: ${player}\n🤖 Bot: ${bot}\n\n╭★────★────★╮\n│ 🎁 Prêmio de consolação\n│ ➕ ${reward} 💶 UC\n╰★────★────★╯`,
rpsWin: ({ player, bot, reward }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🎉 ୭ *VOCÊ GANHOU!*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Resultado ✦ ꒷꒦\n\n👤 Você: ${player}\n🤖 Bot: ${bot}\n\n╭★────★────★╮\n│ 🏆 Vitória épica!\n│ ➕ ${reward} 💶 UC\n╰★────★────★╯`,
rpsLose: ({ player, bot, loss }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 😢 ୭ *VOCÊ PERDEU!*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Resultado ✦ ꒷꒦\n\n👤 Você: ${player}\n🤖 Bot: ${bot}\n\n╭★────★────★╮\n│ 💸 Melhor sorte na próxima vez\n│ ➖ ${loss} 💶 UC\n╰★────★────★╯`,
rpsRock: () => "🪨 Pedra",
rpsPaper: () => "📄 Papel",
rpsScissors: () => "✂️ Tesoura",
rpsButtonRock: () => "🪨 Pedra",
rpsButtonPaper: () => "📄 Papel",
rpsButtonScissors: () => "✂️ Tesoura",
rpsButtonRetry: () => "🔄 Tentar novamente",
bjInsufficientFunds: () => "💰 Fundos insuficientes!",
bjNotYourTurn: () => "❌ Não é sua vez!",
bjBusted: () => "💥 Estourou! Você passou de 21!",
bjDealerBusted: () => "🎉 Dealer estourou! Você ganhou!",
bjYouWin: () => "🎉 Você ganhou!",
bjDealerWins: () => "😔 Dealer vence!",
bjPush: () => "🤝 Empate!",
bjMakeBet: () => "💵 Faça sua aposta!",
bjYourTurn: () => "📋 Sua vez! Pedir ou Parar?",
bjYourScore: ({ score }) => `📋 Sua pontuação: ${score}`,
bjTimeoutTitle: () => "⏰ TEMPO ESGOTADO",
bjTimeoutMsg: ({ balance }) => `⏰ Tempo esgotado! Partida cancelada.\n💶 Carteira: ${balance} UC`,
bjGameInProgress: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🎰 Partida já em andamento\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
bjInvalidBet: ({ max }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Aposta inválida\n  ━━✫ Valor: 10-${max} UC\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
bjStartCaption: ({ name, bet, balance }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🎰 ୭ *BLACKJACK*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ ${name} ✦ ꒷꒦\n\n💶 Aposta: ${bet} UC\n📋 Saldo: ${balance} UC\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ ⚡\n│ .hit .stand .double\n╰★────★────★╯`,
bjNoGame: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Nenhuma partida em andamento\n  ━━✫ Use: .blackjack [aposta]\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
bjNotYourGame: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Não é sua vez!\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
bjDoubleOnlyTwo: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Dobrar apenas com 2 cartas\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
bjDoubleInsufficientFunds: () => "╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Fundos insuficientes\n  ━━✫ para dobrar\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱",
bjFooter: () => "♠️ Blackjack Bot ♣️",
bjPlayer: () => "JOGADOR",
bjDealer: () => "DEALER",
bjScore: () => "PONTUAÇÃO",
bjWallet: () => "💶 CARTEIRA",
bjBet: () => "🎯 APOSTA",
rouletteCooldown: ({ time }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Você já apostou\n  ━━✫ Aguarde ⏱ ${time}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rouletteUsage: ({ prefix, command }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🎰 ୭ *ROULETA*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Como jogar ✦ ꒷꒦\n\nInsira quantidade e cor:\n${prefix}${command} 20 preto\n${prefix}${command} 50 vermelho\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🎲\n│ Escolha sua cor!\n╰★────★────★╯`,
rouletteInvalidFormat: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Formato errado\n  ━━✫ Exemplo: ${prefix}${command} 20 preto\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rouletteInvalidAmount: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Quantidade inválida\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rouletteMaxBet: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Máximo 50 💶 UC\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rouletteInvalidColor: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Cor inválida\n  ━━✫ Escolha: preto ou vermelho\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rouletteInsufficientFunds: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 💶 UC insuficientes\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rouletteBetPlaced: ({ amount, color }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🎰 ୭ *APOSTA FEITA*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Detalhes ✦ ꒷꒦\n\n💰 Valor: ${amount} 💶 UC\n🎨 Cor: ${color === 'black' ? '⚫ PRETO' : '🔴 VERMELHO'}\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ ⏱\n│ Aguarde 10 segundos...\n╰★────★────★╯`,
rouletteWin: ({ amount, total, winColor }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🎉 ୭ *VOCÊ GANHOU!*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Resultado ✦ ꒷꒦\n\n🎯 Cor sorteada: ${winColor === 'black' ? '⚫ PRETO' : '🔴 VERMELHO'}\n\n╭★────★────★╮\n│ 💰 Ganho: +${amount} 💶 UC\n│ 💎 Total: ${total} 💶 UC\n╰★────★────★╯`,
rouletteLose: ({ amount, total, winColor }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 😢 ୭ *VOCÊ PERDEU!*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Resultado ✦ ꒷꒦\n\n🎯 Cor sorteada: ${winColor === 'black' ? '⚫ PRETO' : '🔴 VERMELHO'}\n\n╭★────★────★╮\n│ 💸 Perda: -${amount} 💶 UC\n│ 💎 Total: ${total} 💶 UC\n╰★────★────★╯`,
rouletteBlack: () => "⚫ Preto",
rouletteRed: () => "🔴 Vermelho",
rouletteButtonBlack10: () => "⚫ 10 UC",
rouletteButtonBlack25: () => "⚫ 25 UC",
rouletteButtonBlack50: () => "⚫ 50 UC",
rouletteButtonRed10: () => "🔴 10 UC",
rouletteButtonRed25: () => "🔴 25 UC",
rouletteButtonRed50: () => "🔴 50 UC",
// Cara ou Coroa
cfCooldown: ({ time }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⏳ Você já jogou\n  ━━✫ Aguarde ${time}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
cfWaiting: ({ player }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🪙 ୭ *CARA OU COROA*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Partida iniciada ✦ ꒷꒦\n\n🧑 Jogador 1: @${player}\n🕹️ Aguardando o segundo jogador...\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🎲\n│ Escreva cara ou coroa!\n╰★────★────★╯`,
cfPlayer1Ready: ({ player, choice }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🪙 ୭ *CARA OU COROA*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Jogador 1 pronto ✦ ꒷꒦\n\n🧑 @${player} escolheu *${choice}*\n🎯 Aguardando Jogador 2...\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🎮\n│ Sua vez!\n╰★────★────★╯`,
cfInvalidChoice: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Escolha inválida\n  ━━✫ Escreva: cara ou coroa\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
cfResult: ({ result, p1, p2, msg, prefix, command }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🪙 ୭ *RESULTADO: ${result.toUpperCase()}*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n${msg}\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🔄\n│ ${prefix}${command} para jogar novamente\n╰★────★────★╯`,
cfAlreadyChosen: ({ choice }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ Você já escolheu ${choice}\n  ━━✫ Aguarde outro jogador\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
cfNotAvailable: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Partida não disponível\n  ━━✫ ${prefix}${command} para iniciar\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
cfButtonHeads: () => "🪙 Cara",
cfButtonTails: () => "🪙 Coroa",

// Pedra Papel Tesoura v2
rps2Cooldown: ({ time }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⏳ Aguarde ${time}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rps2Usage: ({ prefix, command }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ ✊ ୭ *PEDRA PAPEL TESOURA*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Como jogar ✦ ꒷꒦\n\n${prefix}${command} pedra\n${prefix}${command} papel\n${prefix}${command} tesoura\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🎮\n│ Escolha sua jogada!\n╰★────★────★╯`,
rps2InvalidChoice: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Escolha inválida\n  ━━✫ ${prefix}${command} pedra/papel/tesoura\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rps2Draw: ({ bot, reward }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🤝 ୭ *EMPATE!*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Bot: ${bot} ✦ ꒷꒦\n\n╭★────★────★╮\n│ 🎁 +${reward} 💶 UC\n╰★────★────★╯`,
rps2Win: ({ bot, reward }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🎉 ୭ *VOCÊ GANHOU!*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Bot: ${bot} ✦ ꒷꒦\n\n╭★────★────★╮\n│ 💰 +${reward} 💶 UC\n╰★────★────★╯`,
rps2Lose: ({ bot, loss }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 😢 ୭ *VOCÊ PERDEU!*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Bot: ${bot} ✦ ꒷꒦\n\n╭★────★────★╮\n│ 💸 -${loss} 💶 UC\n╰★────★────★╯`,
rps2ButtonRock: () => "🪨 Pedra",
rps2ButtonPaper: () => "📄 Papel",
rps2ButtonScissors: () => "✂️ Tesoura",

// Pokedex
pokedexNoName: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Insira nome do Pokémon\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
pokedexSearching: ({ name }) => `🔍 Procurando ${name}...`,
pokedexError: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Erro na pesquisa do Pokémon\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
pokedexInfo: ({ name, id, type, abilities, height, weight, desc, url }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🎌 ୭ *POKÉDEX - ${name}*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Informações ✦ ꒷꒦\n\n🔹 *Nome:* ${name}\n🔹 *ID:* ${id}\n🔹 *Tipo:* ${type}\n🔹 *Habilidades:* ${abilities}\n🔹 *Altura:* ${height}\n🔹 *Peso:* ${weight}\n\n📝 *Descrição:*\n${desc}\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🌐\n│ ${url}\n╰★────★────★╯`,
flagGameActive: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Partida já ativa\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
flagGroupOnly: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Apenas para grupos\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
flagNoGame: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Nenhuma partida ativa\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
flagAdminOnly: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Apenas para admin\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
flagCooldown: ({ time }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⏳ Aguarde ${time}s\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
flagSkipped: ({ answer }) => `ㅤ⋆｡˚『 ╭ \`JOGO INTERROMPIDO\` ╯ 』˚｡⋆\n╭\n│ 『 🏳️ 』 \`A resposta era:\`\n│ 『 ‼️ 』 *\`${answer}\`*\n│ 『 👑 』 _*Interrompido por um admin*_\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
flagStart: ({ phrase }) => `ㅤ⋆｡˚『 ╭ \`${phrase}\` ╯ 』˚｡⋆\n╭\n│ 『 🏳️ 』 \`Responda com o nome\` *do país*\n│ 『 ⏱️ 』 \`Tempo disponível:\` *30 segundos*\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
flagTimeout: ({ answer }) => `ㅤ⋆｡˚『 ╭ \`TEMPO ESGOTADO!\` ╯ 』˚｡⋆\n╭\n│ 『 🏳️ 』 \`A resposta era:\`\n│ 『 ‼️ 』 *\`${answer}\`*\n│ 『 💡 』 _*Seja mais rápido na próxima vez!*_\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
flagCorrect: ({ answer, time, reward, exp, bonus }) => `ㅤ⋆｡˚『 ╭ \`RESPOSTA CORRETA!\` ╯ 』˚｡⋆\n╭\n│ 『 🏳️ 』 \`País:\` *${answer}*\n│ 『 ⏱️ 』 \`Tempo gasto:\` *${time}s*\n│ 『 🎁 』 \`Recompensas:\`\n│ 『 💰 』 *${reward}€* ${bonus > 0 ? `(+${bonus} bônus velocidade)` : ''}\n│ 『 🆙 』 *${exp} EXP*\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
flagAlmostThere: () => "👀 *Quase lá!*",
flagAttemptsExhausted: () => `ㅤ⋆｡˚『 ╭ \`TENTATIVAS ESGOTADAS!\` ╯ 』˚｡⋆\n╭\n│ 『 ❌ 』 \`Você esgotou seus 3 tentativas!\`\n│ 『 ⏳ 』 _*Aguarde que outros tentem...*_\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
flagWrongHint: ({ letter, length }) => `❌ *Resposta errada!*\n\n💡 *Dica:*\n  • Começa com a letra *"${letter}"*\n  • Tem *${length} letras*`,
flagWrong2: ({ remaining }) => `❌ *Resposta errada!*\n\n📝 *Tentativas restantes:* ${remaining}\n🤔 *Pense bem na sua próxima resposta!*`,
flagWrongLast: () => `❌ *Resposta errada!*\n\n📝 *Última tentativa restante..*`,
flagPlayAgain: () => "🏳️ Jogar Novamente!",
flagError: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro ao iniciar jogo\n  ━━✫ Tente novamente em alguns segundos\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
flagPhrase1: () => "🇺🇳 *ADIVINHE A BANDEIRA!* 🇺🇳",
flagPhrase2: () => "🌍 *Que país representa esta bandeira?*",
flagPhrase3: () => "🏳️ *Desafio geográfico: reconhece esta bandeira?*",
flagPhrase4: () => "🧭 *Adivinhe o país pela sua bandeira!*",
flagPhrase5: () => "🎯 *Quiz de bandeiras: qual país é este?*",
flagPhrase6: () => "🌟 *Teste seu conhecimento geográfico!*",
flagPhrase7: () => "🔍 *Observe atentamente e adivinhe o país!*",
songGameActive: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Partida já em andamento\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
songError: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Erro no jogo\n  ━━✫ Tente novamente mais tarde\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
songStart: ({ artist, time }) => `  ⋆｡˚『 ╭ \`ADIVINHE A MÚSICA\` ╯ 』˚｡⋆\n╭\n┃ 『 ⏱️ 』 \`Tempo:\` *${time} segundos*\n┃ 『 👤 』 \`Artista:\` *${artist}*\n┃\n┃ ➤  \`Escreva o título!\`\n╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒`,
songTimeout: ({ title, artist }) => `ㅤ⋆｡˚『 ╭ \`TEMPO ESGOTADO\` ╯ 』˚｡⋆\n╭\n│\n│ ➤ \`Ninguém acertou!\`\n┃ 『  』🎵 \`Título:\` *${title}*\n┃ 『  』👤 \`Artista:\` *${artist}*\n┃\n╰⭒─ׄ─ׅ─ׄ─⭒`,
songCorrect: ({ title, artist, reward, exp }) => `ㅤㅤ⋆｡˚『 ╭ \`CORRETO\` ╯ 』˚｡⋆\n╭\n│\n│ ➤ \`Resposta Correta!\`\n┃ 『  』🎵 \`Título:\` *${title}*\n┃ 『  』👤 \`Artista:\` *${artist}*\n┃\n┃ 『 🎁 』 \`Ganhos:\`\n│ ➤  \`${reward}\` *UC*\n│ ➤  \`${exp}\` *EXP*\n┃\n╰⭒─ׄ─ׅ─ׄ─⭒`,
songAlmostThere: () => "👀 *Quase lá!* Tente novamente...",
songPlayAgain: () => "『 🎵 』 Jogar Novamente",
songExternalTitle: () => "adivinhe a música",
songExternalArtist: ({ artist }) => `Artista: ${artist}`,
songExternalSource: () => "ƌɽɛɑƌ-ʙᴏᴛ Bot",
logoGroupOnly: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Apenas para grupos\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
logoNoGame: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Nenhuma partida ativa\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
logoAdminOnly: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Apenas admin\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
logoSkipped: ({ answer }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🛑 ୭ *JOGO INTERROMPIDO*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ A resposta era ✦ ꒷꒦\n\n🚗 *${answer}*`,
logoGameActive: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Partida já em andamento\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
logoCooldown: ({ time }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⏳ Aguarde ${time}s\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
logoStart: ({ phrase, time }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🚗 ୭ *${phrase}*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Adivinhe a marca ✦ ꒷꒦\n\n⌛ Tempo: ${time} segundos\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🔍\n│ Escreva o nome da marca!\n╰★────★────★╯`,
logoTimeout: ({ answer }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ ⏰ ୭ *TEMPO ESGOTADO!*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ A resposta era ✦ ꒷꒦\n\n🚗 *${answer}*\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🔄\n│ Tente novamente com .auto\n╰★────★────★╯`,
logoCorrect: ({ brand, time, reward, exp, bonus }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🎉 ୭ *RESPOSTA CORRETA!*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Detalhes ✦ ꒷꒦\n\n🚗 Marca: *${brand}*\n⏱ Tempo: *${time}s*\n\n╭★────★────★╮\n│ 🎁 Recompensas:\n│ • ${reward} 💰 UC${bonus > 0 ? ` (+${bonus} bônus)` : ''}\n│ • ${exp} 🆙 EXP\n╰★────★────★╯\n\n> \\by ƌɽɛɑƌ-ʙᴏᴛ\\`,
logoPhrase1: () => "🚘 ADIVINHE O LOGO!",
logoPhrase2: () => "🏁 Que marca é esta?",
logoPhrase3: () => "🔍 Reconhece este carro?",
logoPhrase4: () => "🚗 Quiz de Carros!",
logoPhrase5: () => "🏎️ Adivinhe a marca!",
logoButtonPlayAgain: () => "🚗 Jogar Novamente",
missionMainTitle: ({ bot }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🎯 ୭ *SISTEMA DE MISSÕES*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ ${bot} ✦ ꒷꒦`,
missionMainStats: ({ user, money, bank, dailyDone, dailyTotal, weeklyDone, weeklyTotal }) => `👤 Usuário: @${user}\n💰 Saldo: ${money} UC\n🏦 Banco: ${bank} UC\n📅 Diárias: ${dailyDone}/${dailyTotal} concluídas\n📆 Semanais: ${weeklyDone}/${weeklyTotal} concluídas\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🎯\n│ Selecione o tipo de missões:\n╰★────★────★╯`,
missionButtonDaily: () => "📅 DIÁRIAS",
missionButtonWeekly: () => "📆 SEMANAIS",
missionButtonClaim: () => "💰 RESGATAR",
missionButtonBack: () => "🔙 VOLTAR",
missionButtonWallet: () => "💰 CARTEIRA",
missionDailyTitle: ({ user }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 📅 ୭ *MISSÕES DIÁRIAS*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n👤 @${user}`,
missionDailyReset: ({ time }) => `⏳ Reset em: ${time}`,
missionWeeklyTitle: ({ user }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 📆 ୭ *MISSÕES SEMANAIS*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n👤 @${user}`,
missionWeeklyReset: ({ time }) => `⏳ Reset em: ${time}`,
missionEntry: ({ num, title, progress, target, reward, status }) => `▢ *${num}. ${title}*\n➠ Progresso: ${progress}/${target}\n➠ Recompensa: ${reward} UC\n➠ Status: ${status}`,
missionStatusCompleted: () => "✅ RESGATADA",
missionStatusReady: () => "💰 PRONTA",
missionStatusInProgress: () => "❌ EM ANDAMENTO",
missionFooterDaily: ({ prefix }) => `Use "${prefix}missoes claim" para resgatar!`,
missionFooterWeekly: () => "Missões semanais - Recompensas maiores!",
missionFooterMain: () => "Complete missões para ganhar UnityCoins!",
missionNoRewards: ({ user }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ @${user} você não tem missões\n  ━━✫ concluídas para resgatar!\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
missionClaimSuccess: ({ user, total, details, money, bank }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🎉 ୭ *RECOMPENSAS RESGATADAS*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n👤 @${user}\n💰 Total resgatado: *${total} UC*\n\n${details}\n\n╭★────★────★╮\n│ 💰 Saldo: ${money} UC\n│ 🏦 Banco: ${bank} UC\n╰★────★────★╯`,
missionClaimFooter: () => "Use .carteira para ver o saldo completo",
missionSendMessages: ({ count }) => `Envie ${count} mensagens`,
missionExecuteCommands: ({ count }) => `Execute ${count} comandos`,
missionNoWarn: () => "Fique sem advertências",
missionNoWarnWeek: () => "Fique 7 dias sem advertências",
missionTotalMessages: ({ count }) => `Atinja ${count} mensagens totais`,
walletNotFound: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Usuário não encontrado\n  ━━✫ no banco de dados\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
walletTitle: () => "💰 CARTEIRA",
walletInfo: ({ name, uc, bank }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 💰 ୭ *CARTEIRA*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ ${name} ✦ ꒷꒦\n\n👤 Usuário: ${name}\n💰 UnityCoins: ${uc} 💶\n🏛️ Banco: ${bank} 💳\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 💎\n│ Use .depositar para depositar\n│ Use .sacar para sacar\n╰★────★────★╯`,
walletExternalTitle: ({ name }) => `Carteira de ${name}`,
walletExternalBody: ({ uc }) => `Saldo: ${uc} UC`,
walletButtonDeposit: () => "🏛️ Depositar",
walletButtonWithdraw: () => "💰 Sacar",
walletButtonGames: () => "🎮 Jogos",
bankNotFound: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Usuário não encontrado\n  ━━✫ no banco de dados\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
bankYourBalance: ({ balance }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🏛️ ୭ *SUA CONTA*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Saldo Bancário ✦ ꒷꒦\n\n💰 Você tem *${balance} 💶 UnityCoins*\nno seu banco 🏛️\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 💎\n│ Use .depositar para depositar\n│ Use .sacar para sacar\n╰★────★────★╯`,
bankUserBalance: ({ user, balance }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🏛️ ୭ *CONTA BANCÁRIA*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ @${user} ✦ ꒷꒦\n\n💰 Tem *${balance} 💶 UnityCoins*\nno banco 🏛️`,
bankButtonDeposit: () => "🏛️ Depositar",
bankButtonWithdraw: () => "💰 Sacar",
bankButtonTransfer: () => "💸 Transferir",
transferNoMention: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Mencione o destinatário\n  ━━✫ Exemplo: @usuário 100\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
transferNoAmount: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Insira a quantidade\n  ━━✫ de 💶 UnityCoins para transferir\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
transferInvalidAmount: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Valor inválido\n  ━━✫ Use apenas números\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
transferMinAmount: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Mínimo transferível: 1 UC\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
transferInsufficient: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 💸 Saldo insuficiente\n  ━━✫ para esta transferência\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
transferSuccess: ({ amount, fee, total }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 💸 ୭ *TRANSFERÊNCIA REALIZADA*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Detalhes da Transação ✦ ꒷꒦\n\n💰 Valor enviado: *${amount}* 💶 UC\n📊 Taxa 2%: *${fee}* 💶 UC\n💳 Total debitado: *${total}* 💶 UC\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ ✅\n│ Transferência concluída!\n╰★────★────★╯`,
transferReceived: ({ amount }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 💰 ୭ *UC RECEBIDOS*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Você recebeu ✦ ꒷꒦\n\n💶 *+${amount} UnityCoins*\n\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🎁\n│ Verifique seu saldo!\n╰★────★────★╯`,
transferSelf: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ❌ Não pode transferir\n  ━━✫ para si mesmo\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
robNoTarget: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🧠 Marque alguém ou\n  ━━✫ responda a uma mensagem\n  ━━✫ Exemplo: ${prefix}${command} @usuário\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
robSelf: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🤡 Não pode roubar\n  ━━✫ de si mesmo\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
robCooldown: ({ time }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚨 Você já roubou\n  ━━✫ Tente novamente em ⏱ ${time}\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
robSuccess: ({ amount, target }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 💰 ୭ *ROUBO BEM-SUCEDIDO!*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Roubo perfeito ✦ ꒷꒦\n\nVocê roubou *${amount} 💶 UC*\nde @${target}\n\n╭★────★────★╮\n│ 💸 +${amount} 💶 UC\n│ ୭ ˚. ᵎᵎ ✅ No seu saldo\n╰★────★────★╯`,
robCaught: ({ fine, name }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 🚓 ୭ *PRESO!*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Capturado pela polícia ✦ ꒷꒦\n\n${name} foi detido!\n\n╭★────★────★╮\n│ 💸 Multa: -${fine} 💶 UC\n│ ୭ ˚. ᵎᵎ ❌ Melhor sorte na próxima vez\n╰★────★────★╯`,
robPartial: ({ amount, target }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ 💸 ୭ *ROUBO PARCIAL*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Quase conseguiu ✦ ꒷꒦\n\nVocê roubou apenas *${amount} 💶 UC*\nde @${target}\n\n╭★────★────★╮\n│ 💰 +${amount} 💶 UC\n│ ୭ ˚. ᵎᵎ ⚠️ No seu saldo\n╰★────★────★╯`,
robButtonRetry: () => "🔄 Tentar Novamente",
robButtonWallet: () => "💰 Carteira",
withdrawNoAmount: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Insira a quantidade\n  ━━✫ de 💶 UnityCoins para sacar\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
withdrawNoFunds: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Você não tem 💶 UnityCoins\n  ━━✫ na conta bancária\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
withdrawInvalidAmount: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Quantidade inválida\n  ━━✫ Use um número válido\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
withdrawMinAmount: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Insira pelo menos 1 UC\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
withdrawInsufficientFunds: ({ bank }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Você tem apenas *${bank}* 💶 na conta\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
withdrawSuccess: ({ count, bank }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ ✅ ୭ *SAQUE REALIZADO*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Você sacou ✦ ꒷꒦\n\n💶 *${count} UnityCoins*\nda conta bancária\n\n💳 Novo saldo banco: *${bank} UC*\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 💼\n│ Use .carteira para verificar\n╰★────★────★╯`,
  xpLevelDisplay: ({ level }) => `꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧  Nível: ${level}`,
  xpProgressDisplay: ({ current, needed }) => `Progresso XP: ${current} / ${needed}`,
  xpFooterText: () => "╰♡꒷ ๑ ⋆˚₊⋆───ʚ˚ɞ───⋆˚₊⋆ ๑ ⪩﹐ Continue escrevendo para subir de nível!",
  xpCaption: ({ user, level, exp, next }) => `꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧\n\n┊ 『 📊 』 Perfil XP de ${user}\n\n┃ Nível atual: ${level}\n┃ Experiência total: ${exp}\n┃ XP faltando para o próximo nível: ${next}\n\n╰♡꒷ ๑ ⋆˚₊⋆───ʚ˚ɞ───⋆˚₊⋆ ๑ ⪩﹐`,
rubaxpWait: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⏳ Você deve esperar mais antes de poder roubar novamente\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rubaxpWaitTime: ({ time }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⏳ Você deve esperar mais ${time} antes de poder roubar novamente\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rubaxpNoTarget: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 📍 Você deve marcar um usuário válido\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rubaxpUserNotFound: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ ⚠️ Usuário não encontrado no banco de dados\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rubaxpTooPoor: ({ target, limit }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 😢 @${target} tem menos de *${limit} XP*\n  ━━✫ Não roube dos pobres, seja gentil\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rubaxpSuccess: ({ amount, target }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n   ୧ ✅ ୭ *ROUBO REALIZADO*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Você roubou ✦ ꒷꒦\n\n💰 *${amount} XP*\nde @${target}\n╭★────★────★╮\n│ ୭ ˚. ᵎᵎ 🎮\n│ Continue assim!\n╰★────★────★╯`,
rubaxpTimeFormat: ({ hours, minutes, seconds }) => `${hours} Hora(s) ${minutes} Minuto(s) ${seconds} Segundo(s)`,darxpNoMention: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Você deve mencionar um usuário com @usuário\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
darxpNoAmount: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Insira a quantidade de 💫 XP para transferir\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
darxpInvalidAmount: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Insira apenas números válidos\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
darxpMinAmount: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 O mínimo transferível é 1 💫 XP\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
darxpInsufficientXP: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱\n  ━━✫ 🚩 Você não tem 💫 XP suficiente para transferir\n╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
darxpSuccess: ({ xp, tassa }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮\n  ୧ ✅ ୭ *TRANSFERÊNCIA REALIZADA*\n╰┈ ─ ─ ✦ ─ ─ ┈╯\n\n꒷꒦ ✦ Você transferiu ✦ ꒷꒦\n\n💫 *${xp} XP*\n(taxa: ${tassa} XP)\n╭★────★────★╮\n│ Continue jogando!\n╰★────★────★╯`,
marry_no_target: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🚩 Você deve mencionar um usuário para casar
  ━━✫ Use: ${prefix + command} @usuário
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
marry_self: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🚩 Não pode casar consigo mesmo
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
marry_user_not_found: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🚩 Usuário não encontrado no banco de dados
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
marry_already_married_sender: ({ spouse }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮
  ୧ 💍 ୭ *VOCÊ JÁ É CASADO*
╰┈ ─ ─ ✦ ─ ─ ┈╯

꒷꒦ ✦ Você é casado com ✦ ꒷꒦

❤ ${spouse}

╰♡꒷ ๑ ⋆˚₊⋆───ʚ˚ɞ───⋆˚₊⋆ ๑ ⪩﹐`,
marry_already_married_target: ({ target }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🚩 ${target} já é casado
  ━━✫ Procure alguém solteiro
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
marry_pending_proposal: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🚩 Você já tem uma proposta de casamento pendente
  ━━✫ Aguarde ser aceita ou recusada
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
marry_proposal_text: ({ sender, target }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮
  ୧ 💍 ୭ *PROPOSTA DE CASAMENTO*
╰┈ ─ ─ ✦ ─ ─ ┈╯

꒷꒦ ✦ ${sender} pediu a mão de ✦ ꒷꒦

❤ ${target}

Responda com "Sim" para aceitar
ou "Não" para recusar.

╰♡꒷ ๑ ⋆˚₊⋆───ʚ˚ɞ───⋆˚₊⋆ ๑ ⪩﹐`,
marry_proposal_expired: ({ sender, target }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ ⏳ A proposta entre ${sender} e ${target}
  ━━✫ expirou por inatividade
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
marry_proposal_rejected: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 💔 A proposta foi recusada
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
marry_user_not_found_db: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🚩 Erro: usuários não encontrados no banco de dados
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
marry_success: ({ sender, target }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮
  ୧ 💍 ୭ *CASAMENTO REGISTRADO*
╰┈ ─ ─ ✦ ─ ─ ┈╯

꒷꒦ ✦ Novo casal oficial ✦ ꒷꒦

❤ ${sender}  ×  ${target}

꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧
Que o amor comece!

╰♡꒷ ๑ ⋆˚₊⋆───ʚ˚ɞ───⋆˚₊⋆ ๑ ⪩﹐`,
divorce_not_married: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🚩 Você não é casado com ninguém
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
divorce_spouse_not_found: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🚩 Seu cônjuge não foi encontrado no banco de dados
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
divorce_success: ({ ex }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮
  ୧ 💔 ୭ *DIVÓRCIO CONCLUÍDO*
╰┈ ─ ─ ✦ ─ ─ ┈╯

꒷꒦ ✦ Você se separou de ✦ ꒷꒦

${ex}

· ୨୧ · · ୨୧ ·  ♡
Novo capítulo da sua vida iniciado.

╰♡꒷ ๑ ⋆˚₊⋆───ʚ˚ɞ───⋆˚₊⋆ ๑ ⪩﹐`,
shipNoUser: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ ❗ Use o comando assim:
  ━━✫ ${prefix + command} @usuário
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
shipNoUsersPair: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ ❗ Use o comando assim:
  ━━✫ ${prefix + command} @usuário1 [@usuário2]
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
shipInvalidUsers: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ ❌ Usuários inválidos
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
shipCaption: ({ user1, user2, percent }) => `꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧

💘 *@${user1}* ❤️ *@${user2}*
🔮 Compatibilidade: *${percent}%*

· ୨୧ · · ୨୧ ·  ♡`,
shipErrorImage: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ ❌ Erro durante a geração da imagem
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
kissNoTargetMention: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 💋 Você deve mencionar alguém ou responder a uma mensagem
  ━━✫ Exemplo: ${prefix + command} @usuário
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
kissNoTarget: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 💋 Você deve mencionar alguém para beijar
  ━━✫ Exemplo: .beija @usuário
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
kissSuccess: ({ senderName, targetName }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮
  ୧ 💋 ୭ *Beijo entregue*
╰┈ ─ ─ ✦ ─ ─ ┈╯

꒷꒦ ✦ ${senderName} deu um beijo em ✦ ꒷꒦

😘 ${targetName}

· ୨୧ · · ୨୧ ·  ♡`,
odioNoText: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 😡 Você deve especificar alguém
  ━━✫ Exemplo: ${prefix + command} @usuário
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
odioResult: ({ target, percent }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮
  ୧ 😡 ୭ *CALCULADORA DE ÓDIO*
╰┈ ─ ─ ✦ ─ ─ ┈╯

꒷꒦ ✦ Nível de ódio entre ✦ ꒷꒦

${target}  ✕  você

🔥 Ódio: *${percent}%*

꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧`,
rizzNoTarget: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🎯 Você deve marcar alguém ou responder a uma mensagem
  ━━✫ Exemplo: ${prefix + command} @usuário
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
rizzSuccess: ({ target, line }) => `╭┈ ─ ─ ✦ ─ ─ ┈╮
  ୧ ✨ ୭ *Jogada de Rizz*
╰┈ ─ ─ ✦ ─ ─ ┈╯

꒷꒦ ✦ @${target} olha aqui ✦ ꒷꒦

“${line}”

· ୨୧ · · ୨୧ ·  ♡`,
minacciaNoGroup: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🚩 Este comando só pode ser usado em grupos
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
minacciaDisabled: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🚩 Ameaças estão desativadas neste grupo
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
minacciaNoTarget: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🎯 Você deve especificar alguém para ameaçar
  ━━✫ Marque um usuário ou responda a uma mensagem
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
minacciaText: ({ target, line }) => `꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧

@${target} ${line}

· ୨୧ · · ୨୧ ·  ♡`,
zizzaniaNoGroup: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🚩 Este comando só pode ser usado em grupos
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
zizzaniaDisabled: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🚩 A discórdia está desativada neste grupo
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
zizzaniaText: ({ a, line, b }) => `꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧

@${a} ${line} @${b}

· ୨୧ · · ୨୧ ·  ♡`,
ditalinoNoTarget: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🎯 Você deve marcar alguém ou responder a uma mensagem
  ━━✫ Exemplo: ${prefix + command} @usuário
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
ditalinoStart: ({ target }) => `🤟🏻 Começo uma série de carícias especiais para *${target}*...`,
ditalinoMiddle: () => "🤟🏻 Estamos quase lá...",
ditalinoEnd: () => "👋🏻 Protejam-se da cascata!!",
ditalinoResult: ({ target, time }) => `✨ *${target}* explodiu de prazer após *${time}ms* 🥵`,
segaNoTarget: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🎯 Você deve marcar alguém ou responder a uma mensagem
  ━━✫ Exemplo: ${prefix + command} @usuário
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
segaStart: ({ target }) => `Agora cuidamos de ${target}... 😏`,
segaFrame: ({ frame }) => `${frame}`,
segaEnd: ({ target }) => `Oh ${target} chegou ao máximo prazer! 😋💦`,
insultNoGroup: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🚩 Este comando só pode ser usado em grupos
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
insultDisabled: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🚩 Insultos estão desativados neste grupo
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
insultNoTarget: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🎯 Quem você quer insultar?
  ━━✫ Marque alguém ou responda a uma mensagem
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
insultBotLines: () => [
  `Oh não! Você descobriu meu ponto fraco: insultos! Como vou me recuperar?`,
  `Ah, a arte de insultar um bot. Um verdadeiro mestre da ironia você é!`,
  `Incrível! Um ser humano que insulta um bot. Virada épica!`,
  `Você realmente me feriu com sua habilidade de insultar um bot. Muito bom!`,
  `Sua habilidade em insultar um bot é minha fonte de entretenimento favorita.`,
  `Insulta um bot: grande inteligência ou grande tédio?`,
  `Sua maestria em insultos a bots poderia dar aula.`,
  `Parece o Picasso dos insultos a bots, uma verdadeira obra-prima.`,
  `Insultos a bots são seu talento oculto. Carreira no cabaré digital chegando?`,
  `A audácia de insultar uma entidade sem emoções. Prêmio pela originalidade!`
],
insultUserText: ({ target, line }) => `꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧

@${target} ${line}

· ୨୧ · · ୨୧ ·  ♡`,
friendNoTarget: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ ⚠️ Marque a pessoa para quem quer enviar a solicitação de amizade
  ━━✫ Exemplo: ${prefix}${command} @tag
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
friendSelf: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ ❌ Não pode adicionar a si mesmo aos amigos
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
friendUserNotFound: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🚫 Pessoa não presente no sistema
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
friendAlready: ({ target }) => `✅ @${target} já está entre seus amigos.`,
friendPending: () => `⚠️ Uma solicitação de amizade já está em andamento.\nAguarde uma resposta ou cancelamento.`,
friendRequestText: ({ target, from }) => `👥 Solicitação de amizade em andamento...

@${target}, quer aceitar a amizade de @${from}?

> ⏳ Você tem 60 segundos para escolher.`,
friendTimeout: ({ from, target }) => `⏳ Solicitação de amizade cancelada
> @${from} e @${target} não responderam dentro do tempo limite.`,
friendRejected: () => `❌ Solicitação de amizade recusada.`,
friendAccepted: ({ from }) => `👥 Agora você e @${from} são amigos!`,
removeFriendNoTarget: () => `⚠️ Marque a pessoa que quer remover dos amigos.`,
removeFriendNotInList: ({ target }) => `🚫 @${target} não está entre seus amigos.`,
removeFriendSuccess: ({ target }) => `🚫 Você e @${target} não são mais amigos.`,
friendsNoData: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ ⚠️ Nenhum dado de usuário encontrado
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
friendsTitle: ({ name }) => `📜 Lista de Amigos de ${name}`,
friendsLastNone: () => `👤 Último amigo: Ninguém`,
friendsLastSome: ({ last }) => `👤 Último amigo: @${last}`,
friendsListHeader: () => `👥 Lista completa:`,
friendsListEmpty: () => `│   Ninguém, parabéns lobo solitário`,
friendsError: () => `❌ Ocorreu um erro durante a execução do comando.`,
lesbicaCalcNoTarget: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ ⚠️ Você deve mencionar alguém ou responder a uma mensagem
  ━━✫ Exemplo: ${prefix + command} @usuário
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
lesbicaCalcLine1: ({ tag, percentage }) => `@${tag} é ${percentage}% lésbica, o resto é apenas confusão hormonal.`,
lesbicaCalcLine2: ({ tag, percentage }) => `Teste completo: @${tag} tem o cérebro programado para mulheres em ${percentage}%.`,
lesbicaCalcLine3: ({ tag, percentage }) => `💕 @${tag} olha para mulheres com a intensidade de ${percentage}% porno em 4K.`,
pajeroCalcLine1: ({ tag, percentage }) => `@${tag} é ${percentage}% punheteiro, o restante ${100 - percentage}% passa procurando outros pornôs.`,
pajeroCalcLine2: ({ tag, percentage }) => `Laudo médico: @${tag} é ${percentage}% escravo do próprio pênis.`,
pajeroCalcLine3: ({ tag, percentage }) => `🍆 @${tag} pensa em se masturbar ${percentage}% do tempo, o resto passa limpando.`,
puttanaCalcLine1: ({ tag, percentage }) => `@${tag} é ${percentage}% puta, o taxímetro nunca desliga.`,
puttanaCalcLine2: ({ tag, percentage }) => `Análise detalhada: @${tag} tem a tabela de preços aberta em ${percentage}% 24/7.`,
puttanaCalcLine3: ({ tag, percentage }) => `💰 @${tag} tem o desconto puta de ${percentage}%, apressem-se antes que aumente.`,
genericCalcLine: ({ tag, percentage, cmd }) => `@${tag} é ${percentage}% ${cmd}, o resto é apenas vergonha acumulada.`,
downCalcNoTarget: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🚨 MARQUE ALGUÉM, GÊNIO
  ━━✫ Exemplo: ${prefix}${command} @nome
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
downCalcLine: ({ name, cmd, percent, frase, verdict }) => `*⚡️ VEREDITO FINAL ⚡️*

*Sujeito:* ${name}
*Nível de "${cmd}":* ${percent}%

*Diagnóstico:* ${frase}

*Prognóstico:* ${verdict}`,
downCalcPhrases: () => [
  "É tão inútil que até a lixeira de reciclagem o rejeita.",
  "Se a evolução funcionasse bem, você ainda seria uma célula única na lama.",
  "Você tem a profundidade emocional de uma poça e a inteligência de uma pedra molhada.",
  "Se o cérebro queimasse calorias, você engordaria mesmo dormindo.",
  "Quando você fala, cada neurônio do planeta faz um minuto de silêncio por respeito.",
  "Se a idiotice fosse energia renovável, só você bastaria para iluminar a Europa.",
  "Você tem a mesma utilidade de um guarda-chuva furado num furacão.",
  "Se fosse um bug, nem os desenvolvedores perderiam tempo consertando.",
  "Sua contribuição para o mundo é comparável à de uma bituca apagada numa poça.",
  "Você tem a coordenação mental de um pombo bêbado na estrada."
],
downCalcVerdicts: ({ percent }) => {
  if (percent > 90) return "🔴 CASO CLÍNICO IRRECUPERÁVEL. A humanidade pede oficialmente o reembolso.";
  if (percent > 70) return "🟠 PERIGO BIOLÓGICO. Proibido reproduzir sem permissão por escrito da OMS.";
  if (percent > 40) return "🟡 DEFEITO DE FÁBRICA. Usar apenas como exemplo nos cursos do que NÃO ser.";
  return "🟢 ANOMALIA ESTATÍSTICA. Talvez um cérebro exista... em algum lugar, sob todo aquele vazio.";
},
alcolNoText: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🍷 Nenhum nome especificado, usarei o seu
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
alcolHigh: () => "🍾 Você está tão cheio que até o fígado pediu aposentadoria antecipada.",
alcolMid: () => "🥂 Bebe como se amanhã não existisse, mas amanhã apresenta a conta.",
alcolLow: () => "🚰 Totalmente sóbrio, a única coisa que gira é sua tristeza.",
alcolResult: ({ target, percent, phrase }) => `『💬』 ══ •⊰✰⊱• ══ 『💬』

MOMENTO DO TESTE DE ÁLCOOL! 🍷
━━━━━━━━━━━━━━
${target} tem uma taxa alcoólica de ${percent}%! 🍷
『💬』 ══ •⊰✰⊱• ══ 『💬』

${phrase}`,
drugNoText: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🌿 Nenhum nome especificado, usarei o seu
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
drugHigh: () => "🌿 Tão chapado que se respirar forte intoxica o bairro.",
drugMid: () => "🌿 Não sabe cheirar, mas se esforça tanto que vai acabar nos manuais médicos.",
drugLow: () => "🌿 Um exemplo a seguir... neste grupo é quase uma criatura mitológica.",
drugResult: ({ target, percent, phrase }) => `『💬』 ══ •⊰✰⊱• ══ 『💬』

MOMENTO DO DRUG TEST! 🌿
━━━━━━━━━━━━━━
${target} tem uma taxa de substâncias no sangue de ${percent}%! 🌿
『💬』 ══ •⊰✰⊱• ══ 『💬』

${phrase}`,
raceCalcNoTarget: ({ prefix, command }) => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ ⚠️ Você deve marcar alguém ou responder a uma mensagem
  ━━✫ Exemplo: ${prefix + command} @usuário
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
raceCalcLine: ({ tag, percent, label }) => `꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧

@${tag} é ⚫ ${percent}% ${label}

· ୨୧ · · ୨୧ ·  ♡`,
cornutoNoTarget: () => `╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ 🤔 Falta o nome do(a) corno(a)
  ━━✫ Use: .cornuto @nome ou responda a uma mensagem
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱`,
cornutoSpecialText: () => `🤣 *BEM, AQUI ESTÁ O REI DAS CERNAS!* 🤣
Dizem que se tirar os chifres vira uma antena 5G📡💀`,
cornutoLow: () => "🛡 Tudo tranquilo... por enquanto. Mas fique de olho no telefone do parceiro.",
cornutoMid: () => "😬 Algumas conversas arquivadas demais... a suspeita está no ar.",
cornutoHigh: () => "👀 Cornômetro em alerta máximo! Os chifres estão carregando a 78%.",
cornutoMax: () => "🫣 NÍVEL MUNDIAL: se abrir o Google Maps aparece um triângulo de chifres na sua cabeça.",
cornutoAdviceHigh: () => "🔔 Conselho: não vire as costas... poderiam usá-los como apoio. 🤣",
cornutoAdviceLow: () => "😌 Respire, por enquanto está no limbo entre abençoado e futuro membro do clube.",
cornutoResult: ({ target, percent, message, advice }) => `🔍 CALCULADORA DE CHIFRES 🔍

👤 ${target}
📈 Nível de chifres: ${percent}%
${message}

${advice}`,}