export default {

  // Sistema generale
  smsAvisoMG: () => "⚠️ Attenzione",
  smsWait: () => "⏳ Caricamento in corso...",
  smsError: () => "❌ Si è verificato un errore.",
  smsSuccess: () => "✅ Operazione completata con successo.",
  smsProcessing: () => "🔄 Elaborazione in corso...",

  // Comandi generali
  smsOnlyGroup: () => "❌ Questo comando è disponibile solo nei gruppi.",
  smsOnlyAdmin: () => "❌ Questo comando può essere usato solo dagli admin.",
  smsOnlyOwner: () => "❌ Questo comando è riservato al proprietario.",
  smsOnlyPremium: () => "💎 Questo comando è disponibile solo per utenti premium.",
  smsInvalidCommand: () => "❌ Comando non valido.",
  smsNoText: () => "❌ Inserisci un testo valido.",
  smsNoMedia: () => "❌ Invia o rispondi a un contenuto multimediale.",

  // AI e ChatGPT
  aiNoQuery: () => "⚠️ Inserisci una richiesta valida per ChatGPT.\n\n📌 Esempi:\n{prefix}{command} Raccontami una barzelletta\n{prefix}{command} Suggeriscimi 5 libri fantasy\n{prefix}{command} Codice HTML per una pagina con login",
  aiError: () => "❌ Si è verificato un errore durante la generazione della risposta. Riprova più tardi.",
  aiProcessing: () => "🤖 Sto elaborando la tua richiesta...",

  // Sistema benvenuto/addio
  welcomeTitle: () => "Benvenuto",
  goodbyeTitle: () => "Arrivederci",
  welcomeDefault: (user, group, members) => `Benvenuto, @${user}

Gruppo: ${group}
Membri: ${members}`,
  goodbyeDefault: (user, members) => `Arrivederci, @${user}

Membri rimasti: ${members}`,

  welcomeSetHelp: () => `Messaggio di benvenuto

Uso: {command} <messaggio>

Variabili disponibili:
- @user: Tag dell'utente
- $nome: Nome dell'utente
- $gruppo: Nome del gruppo
- $membri: Numero membri
- $numero: Numero di telefono
- $tag: Alias di @user

Esempio:
{command} Ciao @user, benvenuto in $gruppo. Ora siamo $membri membri.

Ripristino:
{command} reset`,

  goodbyeSetHelp: () => `Messaggio di addio

Uso: {command} <messaggio>

Variabili disponibili:
- @user: Tag dell'utente
- $nome: Nome dell'utente
- $gruppo: Nome del gruppo
- $membri: Numero membri
- $numero: Numero di telefono
- $tag: Alias di @user

Esempio:
{command} Arrivederci @user, ci vediamo presto. Nel gruppo restano $membri membri.

Ripristino:
{command} reset`,

  // Sistema warn
  warnMentionUser: () => "❌ Menziona un utente o rispondi a un suo messaggio.",
  warnBotImmune: () => "🚫 Non puoi assegnare avvertimenti al bot.",
  warnUserNotFound: () => "❌ Utente non trovato nel database.",
  warnMessage: (params) => `⚠️ AVVERTIMENTO ${params?.warns || '{warns}'}/3
Al raggiungimento di 3 avvertimenti l'utente verrà rimosso.`,
  warnBanMessage: () => "⛔ Utente rimosso dopo 3 avvertimenti.",
  muteAdminOnly: () => "❌ Solo un amministratore può usare questo comando.",
  muteNoTarget: () => "⚠️ Tagga la persona da mutare o rispondi a un suo messaggio.",
  unmuteNoTarget: () => "⚠️ Tagga la persona da smutare o rispondi a un suo messaggio.",
  muteBotImmune: () => "🤖 Non puoi mutare il bot.",
  muteGroupOwnerImmune: () => "👑 Il creatore del gruppo non può essere mutato.",
  muteSelfDenied: () => "⚠️ Non puoi mutare te stesso.",
  unmuteSelfDenied: () => "⚠️ Chiedi a un altro amministratore di smutarti.",
  muteAlreadyMuted: () => "ℹ️ Questo utente è già mutato.",
  unmuteNotMuted: () => "ℹ️ Questo utente non è mutato.",
  muteSuccess: ({ target }) => `🔇 Utente mutato

@${target} non potrà più parlare nel gruppo e i suoi messaggi verranno eliminati.`,
  unmuteSuccess: ({ target }) => `🔊 Utente smutato

@${target} può tornare a scrivere nel gruppo.`,

  menuownerChooseMenu: () => "Scegli un menu:",
  menuownerMainMenuButton: () => "Menu Principale",
  menuownerAdminMenuButton: () => "Menu Admin",
  menuownerSecurityMenuButton: () => "Menu Sicurezza",
  menuownerGroupMenuButton: () => "Menu Gruppo",
  menuownerAiMenuButton: () => "Menu IA",
  menuownerTitle: () => "Menu Owner",
  menuownerVersionLabel: () => "Versione",
  menuownerCollabLabel: () => "Collab",
  menuownerSupportLabel: () => "Supporto",
  menuownerReservedCommands: () => "Comandi riservati all'owner",
  menuownerManageCommand: () => "gestisci",
  menuownerSetGroupsCommand: () => "setgruppi",
  menuownerAddGroupsCommand: () => "aggiungigruppi",
  menuownerResetGroupsCommand: () => "resetgruppi",
  menuownerBanUserCommand: () => "banuser",
  menuownerUnbanUserCommand: () => "unbanuser",
  menuownerCleanupCommand: () => "pulizia",
  menuownerGetFileCommand: () => "getfile",
  menuownerSaveCommand: () => "saveplugin",
  menuownerDpCommand: () => "delplugin",
  menuownerGetPluginCommand: () => "getplugin",
  menuownerJoinCommand: () => "join",
  menuownerOutCommand: () => "out",
  menuownerPrefixCommand: () => "prefisso",
  menuownerResetPrefixCommand: () => "resetprefisso",
  menuownerGodModeCommand: () => "godmode",
  menuownerResetCommand: () => "azzera",
  menuownerAddCommand: () => "aggiungi",
  menuownerRemoveCommand: () => "rimuovi",
  menuownerEveryGroupCommand: () => "everygroup",
  menuownerBanChatCommand: () => "banchat",
  menuownerUnbanChatCommand: () => "unbanchat",
  menuownerRestartCommand: () => "riavvia",
  menuownerShutdownBotCommand: () => "spegnibot",
  menuownerUpdateBotCommand: () => "aggiornabot",
  menuownerPluginParam: () => "plugin",
  menuownerLinkParam: () => "link",
  menuownerAutoAdminParam: () => "autoadmin",
  menuownerNumMessagesParam: () => "num. messaggi",
  menuownerCommandParam: () => "comando",
  menuownerGroupParam: () => "gruppo",

  // Menu system
  mainMenuTitle: () => "Menu Principale",
  adminMenuTitle: () => "Menu Admin",
  adminCommands: () => "Comandi Admin",
  chooseMenu: () => "Scegli un menu:",
  mainMenuButton: () => "Menu Principale",
  ownerMenuButton: () => "Menu Owner",
  securityMenuButton: () => "Menu Sicurezza",
  groupMenuButton: () => "Menu Gruppo",
  aiMenuButton: () => "Menu IA",
  promoteCommand: () => "promuovi /mettiadmin",
  demoteCommand: () => "retrocedi /togliadmin",
  warnCommands: () => "warn / unwarn",
  muteCommands: () => "muta / smuta",
  setDescCommand: () => "setdescrizione",
  setScheduleCommand: () => "setorario",
  setNameCommand: () => "setnome",
  hidetagCommand: () => "hidetag",
  kickCommand: () => "kick / cacca",
  adminsCommand: () => "admins",
  tagallCommand: () => "tagall",
  openCloseCommand: () => "aperto / chiuso",
  setWelcomeCommand: () => "setwelcome",
  setByeCommand: () => "setbye",
  inactiveCommand: () => "inattivi",
  listNumCommand: () => "listanum + prefisso",
  cleanupCommand: () => "pulizia + prefisso",
  clearPlayCommand: () => "clearplay",
  rulesCommand: () => "regole / setregole",
  quarantineCommand: () => "quarantena",
  dsCommand: () => "ds",
  listWarnCommand: () => "listawarn",
  linkCommand: () => "link",
  linkQrCommand: () => "linkqr",
  poweredBy: () => "Powered by",

  // Menu gruppo
  groupMenuTitle: () => "Menu Gruppo",
  memberCommands: () => "Comandi per i membri",
  musicAudioSection: () => "Musica e audio",
  infoUtilitySection: () => "Informazioni e utilità",
  imageEditSection: () => "Immagini e modifica",
  pokemonSection: () => "Pokemon",
  gangSystemSection: () => "Gang system",
  gamesCasinoSection: () => "Giochi e casinò",
  economyRankingSection: () => "Economia e classifiche",
  socialInteractionSection: () => "Interazioni sociali",
  howMuchSection: () => "Quanto è?",
  personalityTestSection: () => "Test personalità",
  songCommand: () => "canzone",
  audioCommand: () => "audio",
  videoCommand: () => "video",
  artistTitleCommand: () => "artista-titolo",
  cityCommand: () => "città",
  textCommand: () => "testo",
  groupCommand: () => "gruppo",
  repoCommand: () => "repo",
  userCommand: () => "utente",
  topicCommand: () => "argomento",
  checkSiteCommand: () => "check sito",
  photoToStickerCommand: () => "foto a sticker",
  stickerToPhotoCommand: () => "sticker a foto",
  improveQualityCommand: () => "migliora qualità foto",
  photoCommand: () => "foto",
  hiddenPhotoCommand: () => "foto nascosta",
  memeCommand: () => "meme",
  fromStickerCommand: () => "da sticker",
  blurImageCommand: () => "sfoca immagine",
  comingSoonCommand: () => "in arrivo",
  quantityCommand: () => "quantità",
  headsOrTailsCommand: () => "testa o croce",
  mathProblemCommand: () => "problema mate",
  rockPaperScissorsCommand: () => "sasso carta forbici",
  pokemonInfoCommand: () => "info Pokémon",
  balanceCommand: () => "saldo",
  topUsersCommand: () => "top utenti",
  buyUCCommand: () => "acquista UC",
  withdrawUCCommand: () => "UC dalla banca",
  earnXPCommand: () => "guadagna XP",
  proposalCommand: () => "proposta",
  endRelationshipCommand: () => "fine relazione",
  affinityCommand: () => "affinità",
  charmCommand: () => "fascino",
  createFightCommand: () => "crea litigi",
  truthOrDareCommand: () => "obb o v",
  versionLabel: () => "Versione",
  supportLabel: () => "Supporto",

  // Menu owner
  ownerMenuTitle: () => "Menu Owner",
  ownerReservedCommands: () => "Comandi riservati all'owner",
  setNameCommand: () => "impostanome",
  resetNameCommand: () => "resetnome",
  manageCommand: () => "gestisci",
  setGroupsCommand: () => "setgruppi",
  addGroupsCommand: () => "aggiungigruppi",
  resetGroupsCommand: () => "resetgruppi",
  setPpCommand: () => "setpp",
  banUserCommand: () => "banuser",
  unbanUserCommand: () => "unbanuser",
  blockUserCommand: () => "blockuser",
  unblockUserCommand: () => "unblockuser",
  getFileCommand: () => "getfile",
  saveCommand: () => "salva",
  dpCommand: () => "dp",
  getPluginCommand: () => "getplugin",
  joinCommand: () => "join",
  outCommand: () => "out",
  prefixCommand: () => "prefisso",
  resetPrefixCommand: () => "resetprefisso",
  godModeCommand: () => "godmode",
  resetCommand: () => "azzera",
  addCommand: () => "aggiungi",
  removeCommand: () => "rimuovi",
  everyGroupCommand: () => "everygroup",
  banChatCommand: () => "banchat",
  unbanChatCommand: () => "unbanchat",
  restartCommand: () => "riavvia",
  shutdownBotCommand: () => "spegnibot",
  updateBotCommand: () => "aggiornabot",
  imageParam: () => "immagine",
  pluginParam: () => "plugin",
  linkParam: () => "link",
  autoAdminParam: () => "autoadmin",
  numMessagesParam: () => "num. messaggi",
  commandParam: () => "comando",
  groupParam: () => "gruppo",
  
  // Menu Sicurezza
  securityMenuTitle: () => '🔐 MENU SICUREZZA',
  activateDisable: () => '🔧 ATTIVA/DISABILITA',
  howToUse: () => '📖 COME SI USA',
  activateFunction: () => 'attiva [funzione]',
  disableFunction: () => 'disabilita [funzione]',

// Ping/Status plugin
systemStatusTitle: () => "🚀 STATO SISTEMA",
uptime: () => "⌛ `Uptime:`",
ping: () => "⚡ `Ping:`",
cpuLabel: () => "💻 `CPU:`",
cpuUsage: () => "🔋 `Utilizzo:`",
ramLabel: () => "💾 `RAM:`",
freeRam: () => "🟢 `Libera:`",
version: () => "`Versione:`",

systemStatus: (params) => `${params?.title || '🚀 STATO SISTEMA'}
┌──────────
┃ ⌛ Uptime: ${params?.uptime || 'N/A'}
┃ ⚡ Ping: ${params?.ping || 'N/A'} ms
┃ 💻 CPU: ${params?.cpuModel || 'Sconosciuta'}
┃ 🔋 Utilizzo: ${params?.cpuSpeed || 'N/A'} MHz
┃ 💾 RAM: ${params?.ramUsed || 'N/A'} / ${params?.ramTotal || 'N/A'}
┃ 🟢 Libera: ${params?.ramFree || 'N/A'}
└──────────`,

menuFooter: () => "Scegli un menu:",
menuAdmin: () => "🛡️ Menu Admin/Mod",
menuOwner: () => "👑 Menu Owner",
menuSecurity: () => "🚨 Menu Sicurezza",
menuGroup: () => "👥 Menu Gruppo",
menuAI: () => "🤖 Menu IA",
mainMenuTitle: () => "🏠 MENU DEL BOT",
staffCommand: () => "staff",
candidatesCommand: () => "candidati",
installCommand: () => "installa",
guideCommand: () => "guida",
channelsCommand: () => "canali",
systemCommand: () => "sistema",
faqCommand: () => "FAQ",
pingCommand: () => "ping",
reportCommand: () => "segnala",
suggestCommand: () => "consiglia",
newsCommand: () => "novità",
versionLabel: () => "📦 VERSIONE",
usersLabel: () => "👥 UTENTI",
chooseMenu: () => "Scegli un menu:",
mainMenuButton: () => "🏠 Menu Principale",
ownerMenuButton: () => "👑 Menu Owner",
securityMenuButton: () => "🚨 Menu Sicurezza",
groupMenuButton: () => "👥 Menu Gruppo",
aiMenuButton: () => "🤖 Menu IA",
adminMenuTitle: () => "🛡️ Menu Admin/Mod",
promoteCommand: () => "p /mettiadmin",
demoteCommand: () => "r /togliadmin",
warnCommands: () => "warn / unwarn",
setScheduleCommand: () => "setorario",
setNameCommand: () => "setnome",
hidetagCommand: () => "hidetag",
tagallCommand: () => "tagall",
kickCommand: () => "kick / cacca",
adminsCommand: () => "admins",
openCloseCommand: () => "aperto / chiuso",
setWelcomeCommand: () => "setwelcome",
setByeCommand: () => "setbye",
inactiveCommand: () => "inattivi",
listNumCommand: () => "listanum + prefisso",
cleanupCommand: () => "pulizia + prefisso",
rulesCommand: () => "regole /setregole",
listWarnCommand: () => "listawarn",
linkCommand: () => "link",
linkQrCommand: () => "linkqr",
requestsCommand: () => "richieste",
adminCommands: () => "𝑪𝑶𝑴𝑨𝑵𝑫𝑰 𝑨𝑫𝑴𝑰𝑵",
poweredBy: () => "ᴘᴏᴡᴇʀᴇᴅ ʙʏ",


installTitle: () => "💬 CHATUNITY BOT",
installIntro: () => "Vuoi installare ƌɽɛɑƌ-ʙᴏᴛ Bot sul tuo dispositivo?",
installDescription: () => "Segui la guida completa di installazione disponibile su GitHub con tutti i passaggi dettagliati per Termux, Windows e altri sistemi operativi.",
installGuideLabel: () => "📖 Guida Completa",
installRepoLabel: () => "📂 Repository GitHub",
installVideoLabel: () => "🎥 Video Tutorial",
installFeatures: () => "✨ Cosa troverai:",
installFeature1: () => "📱 Installazione completa per Termux",
installFeature2: () => "💻 Installazione per Windows e altri OS",
installFeature3: () => "🔧 Risoluzione problemi comuni",
installFeature4: () => "📝 Comandi di setup automatici",
installCTA: () => "Visita il repository GitHub per iniziare l'installazione e scoprire tutte le funzionalità del bot!",
installNeedHelp: () => "Hai bisogno di aiuto? Unisciti al nostro canale di supporto!",

systemTitle: () => "🖥️ STATO DEL SISTEMA",
systemHost: () => "🚩 *Host*",
systemOS: () => "🏆 *Sistema Operativo*",
systemArch: () => "💫 *Architettura*",
systemTotalRAM: () => "🥷 *RAM Totale*",
systemFreeRAM: () => "🚀 *RAM Libera*",
systemUsedRAM: () => "⌛ *RAM Usata*",
systemUptime: () => "🕒 *Uptime*",
systemNodeMemory: () => "🪴 *Memoria Node.js:*",
systemRSS: () => "RSS",
systemHeapTotal: () => "Heap Totale",
systemHeapUsed: () => "Heap Usata",
systemExternal: () => "Esterna",
systemArrayBuffer: () => "ArrayBuffer",
systemDiskSpace: () => "☁️ *Spazio su Disco:*",
systemDiskTotal: () => "Totale",
systemDiskUsed: () => "Usato",
systemDiskAvailable: () => "Disponibile",
systemDiskPercent: () => "Percentuale di Uso",
systemDiskError: () => "❌ Errore nel recupero dello spazio su disco.",

reportNoText: () => "⚠️ Inserisci una descrizione `dettagliata` del problema da segnalare.",
reportTooShort: () => "⚠️ La descrizione è troppo `breve`. Inserisci almeno 10 caratteri.",
reportTooLong: () => "⚠️ La descrizione supera il limite di `1000 caratteri`. Riduci il testo.",
reportTitle: () => "⚠️ SEGNALAZIONE",
reportNumber: () => "📱 Numero",
reportUser: () => "👤 Utente",
reportMessage: () => "📝 Messaggio",
reportQuote: () => "📎 Citazione",
reportSuccess: () => "✅ La tua segnalazione è stata inviata con `successo` al team di sviluppo.\n\n_⚠️ Le segnalazioni false o inappropriate possono comportare restrizioni nell'uso del bot._",
reportChannelTitle: () => "⚠️ SEGNALAZIONE BUG",
reportChannelBody: () => "Nuova segnalazione `ricevuta`.",
reportAnonymous: () => "Anonimo",
suggestNoText: () => "⚠️ Inserisci una proposta di `comando`.\n\n`Esempio:` .consiglia nomecomando descrizione della funzionalità",
suggestTooShort: () => "⚠️ La descrizione è troppo `breve`. Inserisci almeno 10 caratteri.",
suggestTooLong: () => "⚠️ La descrizione supera il limite di `1000 caratteri`. Riduci il testo.",
suggestTitle: () => "💡 PROPOSTA",
suggestNumber: () => "📱 Numero",
suggestUser: () => "👤 Utente",
suggestMessage: () => "📝 Proposta",
suggestQuote: () => "📎 Citazione",
suggestSuccess: () => "✅ La tua proposta è stata inviata con `successo` al team di sviluppo.\n\n_⚠️ Le proposte inappropriate o illecite possono comportare restrizioni nell'uso del bot._",
suggestChannelTitle: () => "💡 PROPOSTA COMANDO",
suggestChannelBody: () => "Nuova proposta `ricevuta`.",
suggestAnonymous: () => "Anonimo",
unwarnNoUser: () => "❌ Menziona un `utente` o rispondi al suo messaggio per rimuovere un avvertimento.",
unwarnUserNotFound: () => "❌ `Utente` non trovato nel database.",
unwarnNoWarnings: () => "ℹ️ Questo utente non ha `avvertimenti` attivi da rimuovere.",
unwarnSuccess: (params) => `✅ \`Avvertimento rimosso\`\n\n┊ Avvertimenti rimanenti: ${params?.remaining || 0}/3`,
setnameNoText: () => "⚠️ Inserisci il nuovo `nome` da assegnare al gruppo.",
setnameSuccess: () => "✅ `Nome del gruppo` aggiornato con successo.",
setnameError: () => "❌ Si è verificato un `errore` durante la modifica del nome del gruppo. Riprova.",
hidetagDefaultMessage: () => "📢 Messaggio per tutti",
hidetagStickerError: () => "❌ Impossibile scaricare lo sticker. Riprova.",
tagallTitle: () => "📢 MEMBRI DEL GRUPPO",
tagallBot: () => "🤖 BOT",
tagallMessage: () => "📝 Messaggio",
tagallEmptyMessage: () => "📢 Attenzione membri del gruppo!",
tagallMemberCount: (params) => `👥 Membri totali: ${params?.count || 0}`,
adminsCooldown: (params) => `⏳ Attendi ancora ${params?.time || 'qualche istante'} prima di richiamare gli admin.\n\n_Questo comando ha un limite di utilizzo per evitare abusi._`,
adminsTitle: () => "🔔 AMMINISTRATORI",
adminsMessage: () => "📝 Motivo della chiamata",
adminsWarning: () => "⚠️ Usa questo comando solo per `urgenze` o situazioni realmente importanti. L'uso improprio può comportare la rimozione dal gruppo.",
adminsNoMessage: () => "Richiesta assistenza",
adminsNotification: () => "🔔 Gli amministratori sono stati notificati",
adminsExternalTitle: (params) => `${params?.groupName || 'Gruppo'}`,
adminsExternalBody: () => "Chiamata agli amministratori...",
groupOpen: () => "✅ `Chat aperta a tutti`\n\n• Tutti i membri possono inviare messaggi nel gruppo.",
groupClose: () => "🔒 `Chat riservata agli admin`\n\n• Solo gli amministratori possono inviare messaggi nel gruppo.",
setwelcomeNoText: () => "⚠️ Inserisci il messaggio di `benvenuto` che desideri configurare.\n\n`Variabili disponibili:`\n• @user - Menziona l'utente\n• @group - Nome del gruppo\n• @desc - Descrizione del gruppo",
setwelcomeSuccess: () => "✅ `Messaggio di benvenuto` configurato con successo per questo gruppo.",
setbyeNoText: () => "⚠️ Inserisci il messaggio di `addio` che desideri configurare.\n\n`Variabili disponibili:`\n• @user - Menziona l'utente\n• @group - Nome del gruppo",
setbyeSuccess: () => "✅ `Messaggio di addio` configurato con successo per questo gruppo.",
inactiveMenuTitle: () => "🌙 Gestione Membri Inattivi",
inactiveMenuFound: (params) => `💤 Membri inattivi trovati: *${params?.inactive || 0}/${params?.total || 0}*\n\n⏰ Inattivi da oltre 7 giorni\n\nSeleziona un’opzione qui sotto:`,
inactiveListTitle: () => "📋 Lista Membri Inattivi",
inactiveListNone: () => "✅ Nessun membro inattivo trovato!\n\n🎉 Tutti i membri sono attivi nel gruppo.",
inactiveListItem: (params) => `${params?.index}. @${params?.user}`,
inactiveRemoveStart: (params) => `⚠️ Rimozione inattivi: stai per eliminare *${params?.count}* membri.\n\n❗ Questa azione non può essere annullata!\n\nConfermi di voler continuare?`,
inactiveRemoveSuccess: (params) => `✅ Rimozione completata!\n\n🗑️ Membri rimossi: *${params?.removed}*${params?.errors ? `\n⚠️ Errori: *${params.errors}* membri non rimossi` : ''}`,
inactiveRemoveNone: () => "✅ Nessun membro da rimuovere! Tutti i membri del gruppo sono attivi.",
inactiveConfirmTitle: () => "⚠️ Conferma Rimozione",
inactiveBackButton: () => "🔄 Torna al Menu",
inactiveListButton: () => "📋 Visualizza Lista",
inactiveRemoveButton: () => "🗑️ Rimuovi Inattivi",
inactiveConfirmButton: () => "✅ Conferma Rimozione",
inactiveCancelButton: () => "❌ Annulla",
inactiveNotAdmin: () => "❌ Solo gli *admin* possono usare questa funzione.",
inactiveUnknown: () => "❌ Opzione non valida. Usa i bottoni.",
inactiveResultTitle: () => "📊 Risultato rimozione inattivi",
inactiveGroupLabel: () => "👥 Gruppo",
inactiveFooter: () => "Gestione gruppo inattivi",
noBotAdmin: () => "⚠️ Devo essere `admin` per rimuovere utenti.",
  noMention: () => "⚠️ Menziona un `utente` o rispondi al suo messaggio per rimuoverlo.",
  cannotRemoveOwner: () => "⚠️ Non puoi rimuovere il `creatore del bot`.",
  cannotRemoveBot: () => "⚠️ Non puoi rimuovere il `bot`.",
  cannotRemoveSelf: () => "⚠️ Non puoi rimuovere `te stesso`.",
  targetIsGroupOwner: () => "⚠️ Non puoi rimuovere il `creatore del gruppo`.",
  targetIsAdmin: () => "⚠️ Non puoi rimuovere un `admin` del gruppo.",
  kickSuccess: (params) => `• \`Utente rimosso\`\n\n┊ [👤] Utente: @${params?.target}\n┊ [⚖️] Rimosso da: @${params?.executor}${params?.reason ? `\n┊ [📝] Motivo: ${params.reason}` : ''}\n\n└──────────`,
  title: () => "⚠️ Utenti Avvertiti",
totalUsers: (params) => `Totale: ${params?.count || 0} utenti`,
userEntry: (params) => `${params?.index}. ${params?.name || 'Sconosciuto'} (${params?.warns}/3)`,
noWarns: () => "✓ Nessun utente ha ricevuto avvertimenti",
unknownUser: () => "Sconosciuto",
noBotAdmin: () => "⚠️ Devo essere admin per recuperare il link del gruppo",
qrCaption: (params) => `┌──────────\n│ 🔗 QR Code del gruppo\n│ *${params?.groupName}*\n│\n│ Scansiona per unirti\n└──────────`,
qrError: () => "❌ Errore durante la generazione del QR Code",
noBotAdmin: () => "⚠️ Devo essere admin per gestire le richieste",
noAdmin: () => "⚠️ Solo gli admin del gruppo possono usare questo comando",
noPending: () => "✓ Non ci sono richieste in sospeso",
pendingCount: (params) => `┌──────────\n│ 📨 Richieste in sospeso: ${params?.count}\n│\n│ Seleziona un'opzione\n└──────────`,
menuFooter: () => "Gestione richieste gruppo",
buttonAcceptAll: () => "✅ Accetta tutte",
buttonRejectAll: () => "❌ Rifiuta tutte",
buttonAccept39: () => "🇮🇹 Accetta +39",
buttonManage: () => "📥 Gestisci richieste",
acceptedSuccess: (params) => `✅ Accettate ${params?.count} richieste`,
rejectedSuccess: (params) => `❌ Rifiutate ${params?.count} richieste`,
no39Found: () => "⚠️ Nessuna richiesta con prefisso +39 trovata",
accepted39Success: (params) => `✅ Accettate ${params?.count} richieste con prefisso +39`,
errorAccepting: () => "❌ Errore durante l'accettazione delle richieste",
errorRejecting: () => "❌ Errore durante il rifiuto delle richieste",
invalidNumber: () => "⚠️ Numero non valido. Usa un numero maggiore di 0",
invalidInput: () => "⚠️ Input non valido. Invia un numero o '39'",
manageCustom: (params) => `┌──────────\n│ 📥 Gestione personalizzata\n│\n│ Quante richieste vuoi accettare?\n│\n│ ✦ Usa: .${params?.command} accetta <numero>\n│ ✦ Esempio: .${params?.command} accetta 7\n└──────────`,
manageFooter: () => "Gestione personalizzata richieste",
richieste: {
  noBotAdmin: () => "⚠️ Devo essere admin per gestire le richieste",
  noAdmin: () => "⚠️ Solo gli admin del gruppo possono usare questo comando",
  noPending: () => "✓ Non ci sono richieste in sospeso",
  pendingCount: (params) => `┌──────────\n│ 📨 Richieste in sospeso: ${params?.count}\n│\n│ Seleziona un'opzione\n└──────────`,
  menuFooter: () => "Gestione richieste gruppo",
  buttonAcceptAll: () => "✅ Accetta tutte",
  buttonRejectAll: () => "❌ Rifiuta tutte",
  buttonAccept39: () => "🇮🇹 Accetta +39",
  buttonManage: () => "📥 Gestisci richieste",
  acceptedSuccess: (params) => `✅ Accettate ${params?.count} richieste`,
  rejectedSuccess: (params) => `❌ Rifiutate ${params?.count} richieste`,
  no39Found: () => "⚠️ Nessuna richiesta con prefisso +39 trovata",
  accepted39Success: (params) => `✅ Accettate ${params?.count} richieste con prefisso +39`,
  errorAccepting: () => "❌ Errore durante l'accettazione delle richieste",
  errorRejecting: () => "❌ Errore durante il rifiuto delle richieste",
  invalidNumber: () => "⚠️ Numero non valido. Usa un numero maggiore di 0",
  invalidInput: () => "⚠️ Input non valido. Invia un numero o '39'",
  manageCustom: (params) => `┌──────────\n│ 📥 Gestione personalizzata\n│\n│ Quante richieste vuoi accettare?\n│\n│ ✦ Usa: .${params?.command} accetta <numero>\n│ ✦ Esempio: .${params?.command} accetta 7\n└──────────`,
  manageFooter: () => "Gestione personalizzata richieste"
},
linkqr: {
  noBotAdmin: () => "⚠️ Devo essere admin per recuperare il link del gruppo",
  qrCaption: (params) => `┌──────────\n│ 🔗 QR Code del gruppo\n│ *${params?.groupName}*\n│\n│ Scansiona per unirti\n└──────────`,
  qrError: () => "❌ Errore durante la generazione del QR Code"
},
notAvailable: () => "⚠️ Questo comando è disponibile solo con la base di ƌɽɛɑƌ-ʙᴏᴛ",
imageNotFound: () => "⚠️ Errore durante il caricamento delle immagini",
mainTitle: () => "🌐 I nostri Social Network",
mainSubtitle: () => "Seguici ovunque per restare aggiornato",
mainFooter: () => "Powered by ƌɽɛɑƌ-ʙᴏᴛ",
instagramTitle: () => "📸 Instagram",
instagramBody: () => "Seguici su Instagram per foto e stories quotidiane!",
instagramButton: () => "Apri Instagram",
tiktokTitle: () => "🎵 TikTok",
tiktokBody: () => "Contenuti creativi e divertenti su TikTok!",
tiktokButton: () => "Apri TikTok",
youtubeTitle: () => "🎬 YouTube",
youtubeBody: () => "Video, tutorial e live sul nostro canale YouTube!",
youtubeButton: () => "Apri YouTube",
discordTitle: () => "💬 Discord",
discordBody: () => "Unisciti alla nostra community su Discord!",
discordButton: () => "Apri Discord",
telegramTitle: () => "✈️ Telegram",
telegramBody: () => "News e aggiornamenti sul canale Telegram!",
telegramButton: () => "Apri Telegram",
whatsappTitle: () => "💚 Canale WhatsApp",
whatsappBody: () => "Resta aggiornato sul nostro canale ufficiale WhatsApp!",
whatsappButton: () => "Apri Canale",
cardFooter: () => "ƌɽɛɑƌ-ʙᴏᴛ Social",
followUpMessage: () => "👆 Scorri le card per vedere tutti i nostri canali social!\n\n✦ Seguici per rimanere aggiornato",
followUpFooter: () => "ƌɽɛɑƌ-ʙᴏᴛ Team",
menuButton: () => "📋 Torna al Menu",
errorLoading: () => "⚠️ Errore durante il caricamento dei social",


   linkTitle: () => "🔗 LINK DEL GRUPPO",
   linkFooter: () => "Copia il link e condividilo",
    copyButton: () => "📋 Copia Link",


  
  pingTitle: () => "⚡ PONG!",
  pingResponse: (params) => `⚡ *Ping:* ${params?.ping || 'N/A'} ms`,
  socialNotAvailable: () => "⚠️ Il comando non è disponibile al momento. Riprova più tardi.",
socialInstagramTitle: () => "📸 Instagram",
socialInstagramBody: () => "Seguici su Instagram per contenuti esclusivi, aggiornamenti e novità del bot!",
socialInstagramButton: () => "Segui su Instagram",
socialTiktokTitle: () => "🎵 TikTok",
socialTiktokBody: () => "Scopri i nostri video su TikTok e resta aggiornato con i contenuti più virali!",
socialTiktokButton: () => "Segui su TikTok",
socialYoutubeTitle: () => "📺 YouTube",
socialYoutubeBody: () => "Iscriviti al nostro canale YouTube per tutorial, guide e aggiornamenti video!",
socialYoutubeButton: () => "Iscriviti su YouTube",
socialDiscordTitle: () => "💬 Discord",
socialDiscordBody: () => "Unisciti alla nostra community Discord per supporto, chat e tanto altro!",
socialDiscordButton: () => "Entra su Discord",
socialTelegramTitle: () => "✈️ Telegram",
socialTelegramBody: () => "Seguici su Telegram per news istantanee e comunicazioni dirette!",
socialTelegramButton: () => "Segui su Telegram",
socialWhatsappTitle: () => "💚 WhatsApp",
socialWhatsappBody: () => "Iscriviti al nostro canale WhatsApp per ricevere aggiornamenti ufficiali!",
socialWhatsappButton: () => "Segui su WhatsApp",
socialCardFooter: () => "ƌɽɛɑƌ-ʙᴏᴛ Social",
socialMainTitle: () => "🌐 SOCIAL MEDIA",
socialMainSubtitle: () => "Seguici sui nostri canali ufficiali",
socialMainFooter: () => "Resta connesso con ƌɽɛɑƌ-ʙᴏᴛ",
socialFollowUpMessage: () => "✨ Grazie per il tuo interesse!\n\n• Seguici su tutti i nostri canali social per non perdere nessun aggiornamento.",
socialFollowUpFooter: () => "ƌɽɛɑƌ-ʙᴏᴛ - Sempre connessi",
socialMenuButton: () => "🏠 Menu Principale",
socialErrorLoading: () => "❌ Si è verificato un errore durante il caricamento dei social. Riprova più tardi.",
listawarnTitle: () => "• Lista Utenti Avvertiti",
listawarnMode: () => "Modalità",
listawarnGroup: () => "Gruppo",
listawarnTotal: ({ count }) => `Totale: ${count} ${count === 1 ? 'utente avvertito' : 'utenti avvertiti'}`,
listawarnNoWarns: () => "✨ Nessun utente avvertito",
listawarnUnknownUser: () => "Utente Sconosciuto",
listawarnUserNumber: ({ index }) => `${index}.`,
listawarnTag: () => "Tag:",
listawarnGroups: () => "Gruppo/i:",
listawarnNoActiveWarns: () => "Nessun avvertimento attivo",
listawarnErrorRetrieving: () => "Errore nel recupero",
listawarnTotalWarns: ({ count }) => `${count} totali`,
listawarnOwnerOnly: () => "❌ Questo comando può essere usato in privato solo dagli owner.",
listawarnAllUsers: () => "Tutti gli utenti",
kickNoBotAdmin: () => "❌ Il bot deve essere amministratore per rimuovere utenti.",
kickNoMention: () => "⚠️ Menziona o quota l'utente da rimuovere dal gruppo.",
kickCannotRemoveOwner: () => "🛡️ Non puoi rimuovere il creatore del bot.",
kickCannotRemoveBot: () => "🤖 Non puoi rimuovere il bot dal gruppo.",
kickCannotRemoveSelf: () => "😅 Non puoi rimuovere te stesso con questo comando.",
kickTargetIsGroupOwner: () => "👑 L'utente che hai provato a rimuovere è il creatore del gruppo.",
kickTargetIsAdmin: () => "🛡️ L'utente che hai provato a rimuovere è amministratore.",
kickSuccess: ({ target, executor, reason }) => `• Utente Rimosso\n\n┊ [👤] Utente: @${target}\n┊ [⚖️] Rimosso da: @${executor}${reason ? `\n┊ [📝] Motivo: ${reason}` : ''}\n\n└──────────`,
linkgroupNoBotAdmin: () => "❌ Il bot deve essere amministratore per ottenere il link del gruppo.",
linkgroupLinkTitle: ({ groupName }) => `• Link del Gruppo\n\n┊ [📱] Gruppo: ${groupName}\n┊ [🔗] Clicca sul pulsante per copiare il link`,
linkgroupLinkFooter: () => "Powered by ƌɽɛɑƌ-ʙᴏᴛ Bot",
linkgroupCopyButton: () => "📋 Copia Link",
joinNoLink: ({ prefix, command }) => `⚠️ Inserisci il link del gruppo.\n\n┊ [💡] Esempio: ${prefix}${command} <link> <giorni | inf>`,
joinInvalidLink: () => "❌ Link del gruppo non valido.",
joinSuccessInfinite: () => "• Ingresso Gruppo\n\n┊ [✅] Mi sono unito correttamente al gruppo\n┊ [⏰] Permanenza: Illimitata\n\n└──────────",
joinSuccessExpired: ({ days }) => `• Ingresso Gruppo\n\n┊ [✅] Mi sono unito correttamente al gruppo\n┊ [⏰] Permanenza: ${days} giorni\n\n└──────────`,
banuserNoTarget: () => "⚠️ Per favore tagga un utente, rispondi a un messaggio o scrivi il numero di telefono.\n\n┊ [💡] Esempio: @3934xxxxxxx",
banuserInvalidNumber: () => "❌ Numero di telefono non valido.",
banuserSuccess: ({ target }) => `• Utente Bloccato\n\n┊ [🚫] Utente: @${target}\n┊ [⚠️] Questo utente è stato bloccato dal bot\n┊ [📵] Non potrà più utilizzare i comandi\n\n└──────────`,
unbanuserNoTarget: () => "⚠️ Tagga un utente, rispondi a un messaggio o scrivi il numero di telefono.\n\n┊ [💡] Esempio: @3934xxxxxxx",
unbanuserInvalidNumber: () => "❌ Numero di telefono non valido.",
unbanuserSuccess: ({ target }) => `• Utente Sbloccato\n\n┊ [✅] Utente: @${target}\n┊ [🎉] Questo utente è stato sbloccato\n┊ [📱] Può ora utilizzare i comandi del bot\n\n└──────────`,
listanumNoPrefix: () => "⚠️ Inserisci il prefisso telefonico da cercare.\n\n┊ [💡] Esempio: .listanum 39",
listanumInvalidPrefix: () => "❌ Il prefisso deve essere un numero valido.",
listanumTitle: ({ prefix }) => `• Lista Numeri +${prefix}`,
listanumNoUsers: ({ prefix }) => `• Nessun Utente\n\n┊ [ℹ️] Nessun utente trovato con prefisso +${prefix}\n\n└──────────`,
puliziaStart: ({ prefix }) => `• Pulizia Avviata\n\n┊ [🔄] Rimozione utenti con prefisso +${prefix}\n┊ [⏳] Attendere il completamento...\n\n└──────────`,
puliziaNoBotAdmin: () => "❌ Il bot deve essere amministratore per rimuovere utenti.",
puliziaNoRestrict: () => "❌ La modalità restrittiva non è abilitata.",
puliziaUserLeft: ({ user }) => `@${user} è stato rimosso`,
getNoInput: () => "⚠️ Utilizzo non corretto del comando.\n\n╰★─ Esempi Singoli ─★╮\n┊ getplugin menu-gruppo script\n┊ getfile config.js file\n\n╰★─ Esempi Multipli ─★╮\n┊ getplugin admin & menu & config\n┊ getplugin admin & menu & config script\n┊ getplugin admin script & menu file\n┊ (massimo 3 plugin contemporaneamente)\n\n╰♡꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷",
getNoPluginFound: () => "❌ Nessun plugin valido trovato nella richiesta multipla.",
getMultiSelect: ({ pluginList }) => `• Plugin Selezionati\n\n${pluginList}\n\n┊ [❓]Come vuoi ricevere tutti i plugin?\n\n└──────────`,
getMultiScriptBtn: () => "📄 Tutti Script",
getMultiFileBtn: () => "📎 Tutti File",
getMultiResult: ({ successCount, total, results }) => `• Richiesta Multipla\n\n┊ [📦] ${successCount}/${total} plugin trovati\n\n${results}\n\n└──────────`,
getFileSelect: ({ filename }) => `• File Selezionato\n\n┊ [📁] ${filename}\n\n┊ [❓] Cosa vuoi fare?\n\n└──────────`,
getScriptBtn: () => "📄 Script",
getFileBtn: () => "📎 File",
getNoSimilar: ({ type, name }) => `❌ Nessun ${type} simile a "${name}" trovato.`,
getFoundConfirm: ({ filename, score }) => `• Trovato\n\n┊ [✨] "${filename}"\n┊ [📊] Precisione: ${score}%\n\n┊ [❓] Confermi?\n\n╰♡꒷ ๑ Rispondi: si/no`,
getMultiChoice: ({ name, options }) => `• Risultati per "${name}"\n\n${options}\n\n┊ [📝] Scegli il numero o "no" per annullare\n\n└──────────`,
getDirNotFound: ({ dir }) => `❌ Directory ${dir} non trovata.`,
getFileSuccess: ({ prefix, filename, type }) => `${prefix}• Successo\n\n┊ [✅] Ecco il ${type}: ${filename}\n\n└──────────`,
getScriptSuccess: ({ prefix, filename, content }) => `${prefix}• Codice di ${filename}\n\n${content}\n\n└──────────`,
getInvalidOption: () => "❌ Opzione non valida! Usa \"file\" o \"script\".",
getScriptOnlyJS: () => "❌ L'opzione script è disponibile solo per file JavaScript.",
getSyntaxError: ({ prefix, filename, error }) => `${prefix}• Errore Sintassi\n\n┊ [⛔️] File: ${filename}\n\n${error}\n\n└──────────`,
getFileError: ({ prefix, filename, error }) => `${prefix}❌ Errore: Il file ${filename} non esiste o non può essere letto.\n\n${error}`,
getProcessError: ({ filename, error }) => `❌ Errore nel processare ${filename}: ${error}`,
getOperationCancelled: () => "• Operazione Annullata\n\n┊ [❌] Richiesta annullata con successo\n\n└──────────",
getGenericError: ({ error }) => `❌ 𝐄𝐫𝐫𝐨𝐫𝐞: ${error}`,
leaveNotAdmin: () => "⚠️ Questo comando può essere usato solo da admin e owner del gruppo.",
leaveMessage: () => "• Arrivederci\n\n┊ [👋] Il bot sta abbandonando il gruppo\n\n└──────────",
leaveError: () => "❌ Si è verificato un errore durante l'uscita dal gruppo.",
saveNoName: () => "⚠️ Specificare il nome del plugin da salvare.",
saveNoQuoted: () => "⚠️ È necessario rispondere al messaggio contenente il codice del plugin.",
saveSaveSuccess: ({ path }) => `• Plugin Salvato\n\n┊ [✅] File creato con successo\n┊ [📁] Percorso: ${path}\n\n└──────────`,
saveErrorWrite: ({ error }) => `❌ Errore durante il salvataggio del plugin.\n\n${error}`,
deleteNoPlugins: () => "⚠️ Nessun plugin disponibile da eliminare.",
deleteHelp: ({ usedPrefix, pluginList, total }) => `• Delete Plugin Manager\n\n┊ [📌] Uso del comando:\n┊ ${usedPrefix}deleteplugin <nome>\n\n┊ [✨] Esempio:\n┊ ${usedPrefix}deleteplugin menu-official\n\n┊ [📋] Plugin disponibili:\n${pluginList}${total > 15 ? `\n┊ ... e altri ${total - 15} plugin` : ''}\n\n└──────────`,
deleteInvalidNumber: ({ max }) => `❌ Numero non valido! Range: 1-${max}`,
deleteNoSimilar: ({ input }) => `❌ Nessun plugin simile a "${input}" trovato.`,
deleteConfirm: ({ filename, score }) => `• Plugin Trovato\n\n┊ [✨] "${filename}"\n┊ [📊] Corrispondenza: ${score}%\n\n┊ [🗑️] Vuoi eliminarlo?\n\n╰♡꒷ ๑ Rispondi: si/no`,
deleteMultiChoice: ({ input, options }) => `• Risultati per "${input}"\n\n${options}\n\n┊ [📝] Scegli il numero o "no" per annullare\n\n└──────────`,
deleteNotFound: ({ path }) => `• Attenzione\n\n┊ [📁] File non trovato nel filesystem\n\n┊ [🔍] Percorso cercato:\n┊ ${path}\n\n└──────────`,
deleteSuccess: ({ pluginName, sender, time }) => `• Plugin Eliminato\n\n┊ [🗑️] Plugin eliminato con successo\n\n┊ [📝] Nome: ${pluginName}.js\n┊ [👤] Eliminato da: @${sender}\n┊ [🕐] Ora: ${time}\n\n┊ [⚠️] Nota: Il bot potrebbe richiedere\n┊ un riavvio per applicare le modifiche\n\n└──────────\n\n🎯 Operazione completata!`,
deleteError: ({ error }) => `• Errore Sistema\n\n┊ [❌] Impossibile eliminare il plugin\n\n┊ [🔍] Dettagli errore:\n┊ ${error}\n\n┊ [💡] Possibili soluzioni:\n┊ -  Controlla i permessi del file\n┊ -  Verifica che il plugin non sia in uso\n┊ -  Riprova tra qualche secondo\n\n└──────────`,
deleteOperationCancelled: () => "• Operazione Annullata\n\n┊ [❌] Eliminazione annullata\n\n└──────────",
deleteGenericError: ({ error }) => `❌ Errore: ${error}`,
broadcastNoOwner: () => "❌ Solo l'owner può usare questo comando!",
broadcastNoGroups: () => "❌ Il bot non è in nessun gruppo!",
broadcastHeader: () => "• Messaggio da ƌɽɛɑƌ-ʙᴏᴛ",
broadcastIntro: () => "┊ [👑] Cari membri del gruppo, è arrivato un nuovo messaggio da parte dell'owner:",
broadcastLabel: () => "┊ [📝] Messaggio:",
broadcastNote: () => "┊ [⚠️] Questo messaggio è stato inviato a tutti i membri del gruppo",
broadcastFooter: () => "└──────────\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ƌɽɛɑƌ-ʙᴏᴛ",
broadcastSuccess: ({ count }) => `• Broadcast Completato\n\n┊ [✅] Messaggio inviato con successo\n┊ [📊] Gruppi raggiunti: ${count}\n┊ [👥] Tutti i membri sono stati menzionati\n\n└──────────`,
broadcastDefaultMessage: () => "Questo è un messaggio predefinito inviato a tutti i gruppi.",
broadcastError: ({ group, error }) => `❌ Errore nell'invio del messaggio al gruppo ${group}: ${error}`,
banChatSuccess: () => "• Chat Bloccata\n\n┊ [🚫] Chat bloccata con successo\n┊ [⚠️] Il bot non risponderà più in questa chat\n\n└──────────",
unbanChatSuccess: () => "• Chat Sbloccata\n\n┊ [✅] Chat sbloccata con successo\n┊ [🎉] Il bot può nuovamente rispondere in questa chat\n\n└──────────",
restartInitiating: () => "• Riavvio in corso\n\n┊ [⏳] Attendere prego...\n\n└──────────",
restartProgress: () => "🚀🚀🚀🚀🚀🚀",
restartSuccess: () => "• Riavvio Completato\n\n┊ [✅] Bot riavviato con successo\n┊ [🎉] Sistema operativo\n\n└──────────",
restartError: ({ error }) => `• Errore Riavvio\n\n┊ [❌] Impossibile riavviare il bot\n┊ [🔍] Errore: ${error}\n\n└──────────`,
shutdownInitiating: () => "• Spegnimento Bot\n\n┊ [🔌] Sto spegnendo il bot...\n┊ [🚫] Tutte le chat sono state bloccate\n┊ [⏳] Attendere la chiusura\n\n└──────────",
shutdownSuccess: () => "• Bot Spento\n\n┊ [✅] Spegnimento completato\n┊ [💤] Bot offline\n\n└──────────",
shutdownChatsBanned: ({ count }) => `┊ [📊] ${count} chat bloccate`,
shutdownError: ({ error }) => `• Errore Spegnimento\n\n┊ [❌] Impossibile spegnere il bot\n┊ [🔍] Errore: ${error}\n\n└──────────`,
updateInitiating: () => "• Aggiornamento Bot\n\n┊ [🔄] Controllo aggiornamenti...\n┊ [⏳] Attendere prego\n\n└──────────",
updateSuccess: ({ output }) => `• Aggiornamento Completato\n\n┊ [✅] Bot aggiornato con successo\n\n┊ [📋] Dettagli:\n${output}\n\n└──────────`,
updateError: ({ error }) => `• Errore Aggiornamento\n\n┊ [❌] Impossibile aggiornare il bot\n┊ [🔍] Errore: ${error}\n\n┊ [💡] Possibili soluzioni:\n┊ -  Verifica la connessione internet\n┊ -  Controlla i permessi Git\n┊ -  Assicurati di essere su un branch valido\n\n└──────────`,
updateNoChanges: () => "• Già Aggiornato\n\n┊ [ℹ️] Il bot è già all'ultima versione\n┊ [✅] Nessun aggiornamento disponibile\n\n└──────────",
groupMenuTitle: () => "👥 MENU GRUPPO",
chooseMenu: () => "Scegli una categoria dal menu:",
mainMenuButton: () => "🏠 Menu Principale",
adminMenuButton: () => "🛡️ Menu Admin/Mod",
ownerMenuButton: () => "👑 Menu Owner",
securityMenuButton: () => "🚨 Menu Sicurezza",
aiMenuButton: () => "🤖 Menu IA",
musicAudioSection: () => "MUSICA & AUDIO",
infoUtilitySection: () => "INFORMAZIONI & UTILITÀ",
imageEditSection: () => "IMMAGINI & MODIFICA",
pokemonSection: () => "POKEMON",
gamesCasinoSection: () => "GIOCHI & CASINÒ",
economyRankingSection: () => "ECONOMIA & CLASSIFICHE",
socialInteractionSection: () => "INTERAZIONI SOCIALI",
howMuchSection: () => "QUANTO È?",
personalityTestSection: () => "TEST PERSONALITÀ",
memberCommands: () => "𝑪𝑶𝑴𝑨𝑵𝑫𝑰 𝑷𝑬𝑹 𝑰 𝑴𝑬𝑴𝑩𝑹𝑰",
versionLabel: () => "📦 VERSIONE",
collabLabel: () => "COLLABORAZIONE",
songCommand: () => "canzone",
audioCommand: () => "audio",
videoCommand: () => "video",
cityCommand: () => "città",
textCommand: () => "testo",
groupCommand: () => "gruppo",
userCommand: () => "utente",
checkSiteCommand: () => "check sito",
photoToStickerCommand: () => "foto a sticker",
stickerToPhotoCommand: () => "sticker a foto",
improveQualityCommand: () => "migliora qualità foto",
photoCommand: () => "foto",
hiddenPhotoCommand: () => "foto nascosta",
memeCommand: () => "meme",
fromStickerCommand: () => "da sticker",
blurImageCommand: () => "sfoca immagine",
comingSoonCommand: () => "in arrivo",
quantityCommand: () => "quantità",
headsOrTailsCommand: () => "testa o croce",
mathProblemCommand: () => "problema mate",
rockPaperScissorsCommand: () => "sasso carta forbici",
pokemonInfoCommand: () => "info Pokémon",
balanceCommand: () => "saldo",
topUsersCommand: () => "top utenti",
withdrawUCCommand: () => "UC dalla banca",
earnXPCommand: () => "guadagna XP",
endRelationshipCommand: () => "fine relazione",
affinityCommand: () => "affinità",
charmCommand: () => "fascino",
createFightCommand: () => "crea litigi",
truthOrDareCommand: () => "obb o v",
playNoText: () => "┌──────────\n ❗ Inserisci un titolo o link\n└──────────",
playNoResults: () => "┌──────────\n ❗ Nessun risultato trovato\n└──────────",
playAudioLoading: () => "┊ ┊ ┊ ┊‿ ˚➶ ｡˚\n┊ ┊ ┊ ┊. ➶ ˚\n┊ ┊ ┊ ˚✧ 🎵 Audio in arrivo\n┊ ˚➶ ｡˚ ☁︎ Attendi qualche istante...",
playVideoLoading: () => "┊ ┊ ┊ ┊‿ ˚➶ ｡˚\n┊ ┊ ┊ ┊. ➶ ˚\n┊ ┊ ┊ ˚✧ 🎬 Video in arrivo\n┊ ˚➶ ｡˚ ☁︎ Attendi qualche istante...",
playDownloadComplete: () => "✅ Download completato!",
playTooLong: ({ maxMinutes, duration }) => `┌──────────\n|ㅤㅤㅤㅤㅤㅤㅤ(¡VIDEO TROPPO LUNGO!)\n|˚₊꒷ ⏳ ) ฅ﹕Massimo: ${maxMinutes} minuti ₊˚๑\n|˚₊꒷ ⌛ ) ฅ﹕Durata: ${duration} ₊˚๑\n└──────────`,
playVideoInfo: ({ title, timestamp, views, author, ago, url }) => `🎥 INFO VIDEO\n\n\n•\n• ✍️ *Titolo:* ${title}\n• ⏳ *Durata:* ${timestamp}\n• 👀 *Visualizzazioni:* ${views}\n• 🔰 *Canale:* ${author}\n• 🔳 *Pubblicato:* ${ago}\n• 🔗 *Link:* ${url}\n•\n\n\n└──────────\n  > Scegli un formato per scaricare\n└──────────`,
playChooseFormat: () => "Scegli un formato:",
playAudioButton: () => "🎵 Audio",
playVideoButton: () => "🎬 Video",
playSaveButton: () => "💾 Salva Playlist",
playError: ({ error }) => `(🩸) • → ERRORE\n ★・・・・・・・★\n  ${error}\n ★・・・・・・・★`,
playNoValidLink: () => "(🩸) • → ERRORE\n ★・・・・・・・★\n  Nessun link valido trovato\n ★・・・・・・・★",
playlistEmpty: ({ userName }) => `ℹ️ ${userName ? `${userName} non ha brani salvati` : 'La tua playlist è vuota!'}`,
playlistHeader: ({ userName }) => `📋 ${userName ? `Playlist di ${userName}` : 'La tua playlist'}`,
playlistMore: ({ count }) => `...e altri ${count} brani`,
playlistSelectToPlay: () => "Seleziona un brano da riprodurre",
saveNoText: () => "⚠️ Specifica un brano da cercare",
saveSearching: ({ query }) => `⌛ Cerco "${query}"...`,
saveNoResults: () => "⚠️ Nessun risultato trovato",
saveAlreadyExists: () => "⚠️ Canzone già in playlist! Usa .playlist per vedere i brani salvati.",
saveSaved: () => "✅ Canzone salvata!",
saveViewPlaylist: () => "📋 Vedi Playlist",
savePlay: () => "🎵 Riproduci",
saveDelete: () => "🗑️ Elimina",
saveSaveNew: () => "💾 Salva nuovo",
deleteSelect: () => "🗑️ Seleziona brano da eliminare",
deleteUse: () => "Usa: .elimina <numero>",
deleteInvalid: () => "⚠️ Numero non valido!",
deleteSuccess: () => "✅ Brano eliminato!",
deleteRestore: () => "💾 Ripristina",
backButton: () => "🔙 Indietro",
playlistError: ({ error }) => `⚠️ Errore: ${error}`,
playlistSignature: () => "꙰ Creazione di Gab333 ꙰",
ytSearchMissingFiles: () => "❗ Per usare questo comando usa la base di ƌɽɛɑƌ-ʙᴏᴛ",
ytSearchMissingQuery: () => "┌──────────\n 📌 Inserisci il nome del video\n Esempio: .ytsearch compilation\n└──────────",
ytSearchNoResults: () => "┌──────────\n ❌ Nessun risultato trovato\n└──────────",
ytSearchTitle: () => "🔎 YouTube Search",
ytSearchFooter: () => "ƌɽɛɑƌ-ʙᴏᴛ ✦ Downloader",
ytSearchResultTitle: () => "🎬 Risultati YouTube",
ytSearchResultHeader: () => "┌──────────\n • 🎬 ୭ Risultati ricerca\n└──────────\n\n• Ecco i risultati trovati",
ytSearchSelectPrompt: () => "┌──────────╮\n│ 🔢 Seleziona un video\n│ dai risultati sopra\n└──────────",
ytSearchDuration: () => "📺 Durata:",
ytSearchViews: () => "👁 Visualizzazioni:",
ytSearchChannel: () => "👤 Canale:",
toAudioNoMedia: () => "┌──────────\n  ⚠️ Rispondi a un video o audio\n└──────────",
toAudioDownloadError: () => "┌──────────\n  ❌ Errore durante il download\n└──────────",
toAudioConvertError: () => "┌──────────\n  ❌ Errore durante la conversione\n└──────────",


weatherNoCity: () => "┌──────────\n  ❗ Inserisci il nome di una città\n  Uso: .meteo [nome città]\n└──────────",
weatherInfo: ({ name, country, temp, feels, min, max, humidity, main, desc, wind, pressure }) => `┌──────────\n   • 🌍 ୭ *Meteo ${name}, ${country}*\n└──────────\n\n• Informazioni meteo\n\n🌡 Temperatura: ${temp}°C\n🌡 Percepita: ${feels}°C\n🌡 Minima: ${min}°C\n🌡 Massima: ${max}°C\n💧 Umidità: ${humidity}%\n☁ Meteo: ${main}\n🌫 Descrizione: ${desc}\n💨 Vento: ${wind} m/s\n🔽 Pressione: ${pressure} hPa\n\n┌──────────╮\n│ \n│ Powered by OpenWeather\n└──────────`,
weatherCityNotFound: () => "┌──────────\n  🚫 Città non trovata\n  Controlla la scrittura\n└──────────",
weatherError: () => "┌──────────\n  ⚠️ Errore durante il recupero\n  Riprova più tardi\n└──────────",
translateHelp: ({ prefix, command, languages }) => `┌──────────\n   • 🌍 ୭ *TRADUTTORE*\n└──────────\n\n• Esempi d'uso\n\n│ ${prefix}${command} Ciao\n│ ${prefix}${command} en Ciao\n│ ${prefix}${command} ja Hello\n│ ${prefix}${command} [rispondi msg]\n│ ${prefix}parla ar testo\n\n• Lingue disponibili\n\n${languages}\n\n┌──────────╮\n│ \n│ ƌɽɛɑƌ-ʙᴏᴛ Translator\n└──────────`,
translateNoText: () => "┌──────────\n  ❌ Testo mancante per audio\n└──────────",
translateNoLang: () => "┌──────────\n  ❌ Lingua non specificata\n└──────────",
translateWhatToTranslate: () => "┌──────────\n  ❌ E che dovrei tradurre?\n└──────────",
translateTooLong: ({ max, length }) => `┌──────────\n  ❌ Testo troppo lungo\n  Massimo: ${max} caratteri\n  Il tuo: ${length} caratteri\n└──────────`,
translateResult: ({ fromLang, toLang, translation }) => `┌──────────\n   • 🌍 ୭ *TRADUTTORE*\n└──────────\n\n• Da: ${fromLang}\n• A: ${toLang}\n\n${translation}\n\n┌──────────╮\n│ \n│ Traduzione completata\n└──────────`,
translateListenOriginal: () => "🔊 Ascolta Originale",
translateListenTranslation: () => "🎵 Ascolta Traduzione",
translateFooter: () => "ƌɽɛɑƌ-ʙᴏᴛ Translator",
translateTTSError: ({ error }) => `┌──────────\n  ❌ Errore audio: ${error}\n└──────────`,
translateError: () => "┌──────────\n  ❌ Errore durante traduzione\n  Riprova più tardi\n└──────────",
antiLinkNotAdmin: () => "┌──────────\n   • ⚠️ ୭ *Salvato per ora*\n└──────────\n\n• Non sono admin\n\nNon posso fare niente",
antiLinkDetected: ({ user, qrDetected }) => `┌──────────\n   • 🚫 ୭ *ANTI-LINK ATTIVATO*\n└──────────\n\n• Violazione regole\n\n${user} 🤨 Hai infranto le regole del gruppo${qrDetected ? ', ti pare che non vedo i QR? 😂' : '.'}\n\n┌──────────╮\n│ \n│ Espulso automaticamente\n└──────────`,
antiLinkRestrictOff: () => "┌──────────\n   • ⚠️ ୭ *Restrict Disattivato*\n└──────────\n\n• Azione richiesta\n\nContatta il proprietario del bot per attivare il RESTRICT\n\n┌──────────╮\n│ \n│ Funzione non disponibile\n└──────────",
antiMediaWarning: () => "┌──────────\n   • ⚠️ ୭ *ANTIMEDIA ATTIVO*\n└──────────\n\n• Violazione regole\n\nSolo foto e video a 1 visual sono permessi\n\n┌──────────╮\n│ ˚. ᵎᵎ 🚫\n│ Media eliminato\n└──────────",
antiSpamDetected: () => "┌──────────\n   • 🚫 ୭ *ANTISPAM RILEVATO*\n└──────────\n\n• Spam rilevato\n\nL'utente è stato rimosso per comportamento spam\n\n┌──────────╮\n│ ˚. ᵎᵎ ⚡\n│ ƌɽɛɑƌ-ʙᴏᴛ x 333 Protection\n└──────────",
antiTrabaAdminWarning: ({ user }) => `┌──────────\n   • ⚠️ ୭ *ATTENZIONE ADMIN*\n└──────────\n\n• Trava rilevato\n\nHEY @${user} per caso ti diverti a mandare trava qui? Che fortuna per te che sei admin! -.-\n\n┌──────────╮\n│ ˚. ᵎᵎ 🛡️\n│ Protetto dallo status\n└──────────`,
antiTrabaDetected: ({ user }) => `┌──────────\n   • 🚫 ୭ *ANTI-TRAVA ATTIVO*\n└──────────\n\n• Messaggio lungo rilevato\n\nL'utente @${user} ha inviato un messaggio troppo lungo e verrà rimosso\n\n┌──────────╮\n│ ˚. ᵎᵎ 🚨\n│ ƌɽɛɑƌ-ʙᴏᴛ Protection\n└──────────`,
antiTrabaNoPermission: () => "┌──────────\n   • ⚠️ ୭ *Permessi Mancanti*\n└──────────\n\n• Azione bloccata\n\nNon ho i permessi da amministratore per rimuovere chi invia trava\n\n┌──────────╮\n│ ˚. ᵎᵎ 🔒\n│ Richiedi permessi admin\n└──────────",
infoSetAge: () => "┌──────────\n   • 🗓️ ୭ *Imposta Età*\n└──────────\n\n• Come procedere\n\nPer impostare la tua età usa:\n.setanni <età>\n\nPer rimuovere la tua età usa:\n.eliminaanni\n\n┌──────────╮\n│ ˚. ᵎᵎ 📝\n│ Gestione profilo\n└──────────",
infoSetIG: () => "┌──────────\n   • 🌐 ୭ *Imposta Instagram*\n└──────────\n\n• Come procedere\n\nPer impostare Instagram usa:\n.setig <username>\n\nPer rimuoverlo usa:\n.delig\n\n┌──────────╮\n│ ˚. ᵎᵎ 📱\n│ Gestione social\n└──────────",
infoGroupOnly: () => "┌──────────\n  ━━✫ ❌ Comando solo per gruppi\n└──────────",
infoUserData: ({ messages, warn, role, age, gender, blasphemy, instagram }) => `⋆ ︵ ★ 𝐈𝐍𝐅𝐎 𝐔𝐓𝐄𝐍𝐓𝐄 ★ ︵ ⋆\n\n\n•\n• 📝 *Messaggi:* ${messages}\n• ⚠️ *Warn:* ${warn} / 4\n• 🟣 *Ruolo:* ${role}\n• 🗓️ *Età:* ${age}\n• 🚻 *Genere:* ${gender}\n• 🤬 *Bestemmie:* ${blasphemy}\n${instagram ? `• 🌐 instagram.com/${instagram}` : '• 🌐 *Instagram:* Non impostato'}\n•`,
infoSetAgeButton: () => "🗓️ Imposta Età",
infoSetGenderMaleButton: () => "🚹 Genere Maschio",
infoSetGenderFemaleButton: () => "🚺 Genere Femmina",
infoSetIGButton: () => "🌐 Imposta IG",
infoFooter: () => "Imposta i tuoi dati personali:",
infoCreator: () => "𝒄𝒓𝒆𝒂𝒛𝒊𝒐𝒏𝒆 𝒅𝒊 𝑶𝒏𝒊𝒙🌟",
infoRoleFounder: () => "𝐅𝐨𝐮𝐧𝐝𝐞𝐫 ⚜️",
infoRoleAdmin: () => "𝐀𝐝𝐦𝐢𝐧 👑",
infoRoleMember: () => "𝐌𝐞𝐦𝐛𝐫𝐨 🤍",
infoGenderNotSet: () => "𝐍𝐨𝐧 𝐢𝐦𝐩𝐨𝐬𝐭𝐚𝐭𝐨",
infoAgeNotSet: () => "Non impostata",
infoAgeYears: ({ age }) => `${age} anni`,
setGenderUsage: () => "┌──────────\n  ━━✫ Uso corretto del comando\n  ━━✫ .setgenere maschio\n  ━━✫ .setgenere femmina\n└──────────",
setGenderSuccess: ({ gender, emoji }) => `✓ Genere impostato come: ${gender} ${emoji}`,
deleteGenderSuccess: () => "✓ Genere rimosso",
setAgeUsage: () => "┌──────────\n  ━━✫ Inserisci un'età valida\n  ━━✫ Età da 10 a 80 anni\n  ━━✫ Usa: .setanni <età>\n└──────────",
setAgeSuccess: ({ age }) => `✓ Età impostata come: ${age} anni`,
deleteAgeSuccess: () => "✓ Età rimossa",
rulesNotSet: ({ prefix }) => `┌──────────\n  ━━✫ ⓘ Nessuna regola impostata\n  ━━✫ Gli admin non hanno ancora\n  ━━✫ impostato le regole\n└──────────\n\n📌 Per impostare le regole usa:\n${prefix}setregole <testo regole>`,
rulesTitle: () => "📜 𝐑𝐞𝐠𝐨𝐥𝐞 𝐝𝐞𝐥 𝐆𝐫𝐮𝐩𝐩𝐨",
rulesDisplay: ({ rules }) => `┌──────────\n   • 📜 ୭ *Regole del Gruppo*\n└──────────\n\n${rules}\n\n┌──────────╮\n│ ˚. ᵎᵎ ⚖️\n│ Rispetta le regole\n└──────────`,
dashboardTitle: () => "⚡ 𝐓𝐎𝐏 10 𝐂𝐎𝐌𝐀𝐍𝐃𝐈 ⚡",
dashboardCommand: () => "📚 COMANDO",
dashboardUses: () => "🗂️ USI",
dashboardLastUse: () => "⏱️ ULTIMO USO",
dashboardNeverUsed: () => "Mai usato",
dashboardDaysAgo: ({ days }) => `${days} giorni fa`,
dashboardHoursAgo: ({ hours }) => `${hours} ore fa`,
dashboardMinutesAgo: ({ minutes }) => `${minutes} minuti fa`,
dashboardSecondsAgo: () => "pochi secondi fa",
dashboardStats: ({ stats }) => `┌──────────\n   • ⚡ ୭ *TOP 10 COMANDI*\n└──────────\n\n${stats}\n\n┌──────────╮\n│ ˚. ᵎᵎ 📊\n│ Statistiche bot\n└──────────`,
imageSearchBaseOnly: () => "┌──────────\n  ━━✫ Questo comando è disponibile\n  ━━✫ solo con la base ƌɽɛɑƌ-ʙᴏᴛ\n└──────────",
imageSearchUsage: ({ prefix, command }) => `┌──────────\n  ━━✫ ⓘ Uso del comando\n  ━━✫ ${prefix}${command} <parola chiave>\n└──────────`,
imageSearchForbidden: () => "┌──────────\n  ━━✫ ⚠️ Contenuto non permesso\n└──────────",
imageSearchNoResults: () => "┌──────────\n  ━━✫ 😢 Nessuna immagine trovata\n└──────────",
imageSearchResults: ({ term }) => `┌──────────\n   • 🔍 ୭ *Risultati ricerca*\n└──────────\n\n• Query: ${term}`,
imageSearchImageNum: ({ num }) => `Immagine #${num}`,
imageSearchResultFor: ({ term }) => `Risultato per: ${term}`,
imageSearchFooter: () => "Powered by ƌɽɛɑƌ-ʙᴏᴛ",
imageSearchOpenImage: () => "Apri immagine",
imageSearchTitle: () => "Risultati immagini",
imageSearchSubtitle: () => "Ecco le immagini trovate su Google",
imageSearchAgainPrompt: () => "🔄 Vuoi cercare altre immagini con lo stesso termine?",
imageSearchAgainButton: () => "Cerca di nuovo",
obfuscateNoCode: () => "┌──────────\n  ━━✫ ⚠️ Inserisci codice JavaScript\n  ━━✫ da offuscare o rispondi\n  ━━✫ a un messaggio con codice\n└──────────",
obfuscateProcessing: () => "┌──────────\n  ━━✫ ⏳ Offuscamento in corso...\n└──────────",
obfuscateSuccess: () => "┌──────────\n   • 🔒 ୭ *Codice offuscato*\n└──────────\n\n• Offuscamento completato",
obfuscateError: ({ error }) => `┌──────────\n  ━━✫ ❌ Errore offuscamento\n  ━━✫ ${error}\n└──────────`,
bonkNoPhoto: () => "┌──────────\n  ━━✫ ⚠️ Nessuna foto profilo\n  ━━✫ L'utente non ha impostato\n  ━━✫ una foto profilo\n└──────────",
bonkError: () => "┌──────────\n  ━━✫ ❌ Errore durante l'esecuzione\n└──────────",
hornyCardCaption: () => "┌──────────\n   • 🔥 ୭ *Horny Card*\n└──────────\n\n• Quanto sei horny? 🥵🔥",
stupidCaption: ({ user }) => `┌──────────\n   • 🤡 ୭ *Quanto sei stupido?*\n└──────────\n\n• @${user}`,
stupidDefaultText: () => "im+stupid",
wantedNoProfilePic: () => "┌──────────\n  ━━✫ ⚠️ Impossibile recuperare\n  ━━✫ la foto profilo\n└──────────",
wantedNoProfilePicUser: () => "┌──────────\n  ━━✫ ⚠️ L'utente non ha\n  ━━✫ foto profilo\n└──────────",
wantedYourProfilePic: () => "┌──────────\n  ━━✫ ⚠️ Non hai una foto profilo\n└──────────",
wantedUnsupportedFormat: () => "┌──────────\n  ━━✫ ⚠️ Formato non supportato\n  ━━✫ Usa JPEG o PNG\n└──────────",
wantedUploadError: () => "┌──────────\n  ━━✫ ❌ Errore upload immagine\n└──────────",
wantedAPIError: () => "┌──────────\n  ━━✫ ❌ Errore API\n  ━━✫ Riprova più tardi\n└──────────",
wantedError: ({ error }) => `┌──────────\n  ━━✫ ❌ Errore: ${error}\n└──────────`,
wantedCaption: () => "┌──────────\n   • 🚔 ୭ *WANTED*\n└──────────\n\n• Ricercato\n\n┌──────────╮\n│ \n│ Powered by ƌɽɛɑƌ-ʙᴏᴛ\n└──────────",
jokeNoProfilePic: () => "┌──────────\n  ━━✫ ⚠️ Impossibile recuperare\n  ━━✫ la foto profilo\n└──────────",
jokeYourProfilePic: () => "┌──────────\n  ━━✫ ⚠️ Non hai una foto profilo\n└──────────",
jokeUnsupportedFormat: () => "┌──────────\n  ━━✫ ⚠️ Formato non supportato\n  ━━✫ Usa JPEG o PNG\n└──────────",
jokeUploadError: () => "┌──────────\n  ━━✫ ❌ Errore upload immagine\n└──────────",
jokeAPIError: () => "┌──────────\n  ━━✫ ❌ Errore API\n  ━━✫ Riprova più tardi\n└──────────",
jokeError: ({ error }) => `┌──────────\n  ━━✫ ❌ Errore: ${error}\n└──────────`,
jokeCaption: () => "┌──────────\n   • 🤡 ୭ *SCHERZO*\n└──────────\n\n• Joke over head\n\n┌──────────╮\n│ ˚. ᵎᵎ 😂\n│ Powered by ƌɽɛɑƌ-ʙᴏᴛ\n└──────────",
jailNoProfilePic: () => "┌──────────\n  ━━✫ ⚠️ Impossibile recuperare\n  ━━✫ la foto profilo\n└──────────",
jailUploadError: () => "┌──────────\n  ━━✫ ❌ Errore upload immagine\n└──────────",
jailAPIError: () => "┌──────────\n  ━━✫ ❌ Errore API\n└──────────",
jailError: ({ error }) => `┌──────────\n  ━━✫ ❌ Errore: ${error}\n└──────────`,
jailCaption: () => "┌──────────\n   • 🚔 ୭ *IN CARCERE*\n└──────────\n\n┌──────────╮\n│ \n│ Powered by ƌɽɛɑƌ-ʙᴏᴛ\n└──────────",
nokiaNoProfilePic: () => "┌──────────\n  ━━✫ ⚠️ Impossibile recuperare\n  ━━✫ la foto profilo\n└──────────",
nokiaYourProfilePic: () => "┌──────────\n  ━━✫ ⚠️ Non hai una foto profilo\n└──────────",
nokiaUnsupportedFormat: () => "┌──────────\n  ━━✫ ⚠️ Formato non supportato\n  ━━✫ Usa JPEG o PNG\n└──────────",
nokiaUploadError: () => "┌──────────\n  ━━✫ ❌ Errore upload\n└──────────",
nokiaAPIError: () => "┌──────────\n  ━━✫ ❌ Errore API\n└──────────",
nokiaError: ({ error }) => `┌──────────\n  ━━✫ ❌ Errore: ${error}\n└──────────`,
nokiaCaption: () => "┌──────────\n   • 📱 ୭ *NOKIA*\n└──────────\n\n┌──────────╮\n│ ˚. ᵎᵎ 📞\n│ Powered by ƌɽɛɑƌ-ʙᴏᴛ\n└──────────",
adNoProfilePic: () => "┌──────────\n  ━━✫ ⚠️ Impossibile recuperare\n  ━━✫ la foto profilo\n└──────────",
adYourProfilePic: () => "┌──────────\n  ━━✫ ⚠️ Non hai una foto profilo\n└──────────",
adUnsupportedFormat: () => "┌──────────\n  ━━✫ ⚠️ Formato non supportato\n  ━━✫ Usa JPEG o PNG\n└──────────",
adUploadError: () => "┌──────────\n  ━━✫ ❌ Errore upload\n└──────────",
adAPIError: () => "┌──────────\n  ━━✫ ❌ Errore API\n└──────────",
adError: ({ error }) => `┌──────────\n  ━━✫ ❌ Errore: ${error}\n└──────────`,
adCaption: () => "┌──────────\n   • 📢 ୭ *PUBBLICITÀ*\n└──────────\n\n┌──────────╮\n│ ˚. ᵎᵎ 📺\n│ Powered by ƌɽɛɑƌ-ʙᴏᴛ\n└──────────",
pokeOpenNoType: () => "┌──────────\n  ━━✫ ❌ Specifica il tipo\n  ━━✫ base, imperium, premium, darkness\n  ━━✫ Esempio: .apripokemon base\n└──────────",
pokeOpenNoPacks: ({ type }) => `┌──────────\n  ━━✫ ⛔ Non hai pacchetti ${type.toUpperCase()}\n└──────────`,
pokeOpenOpening: () => "🎁 Aprendo il pacchetto...",
pokeOpenRevealing: () => "✨ Rivelando le carte...",
pokeOpenNoCards: () => "┌──────────\n  ━━✫ 😢 Nessuna carta trovata\n└──────────",
pokeOpenResult: ({ type, name, rarity, shiny, cardType, level, remaining }) => `🎉 Hai aperto un pacchetto *${type.toUpperCase()}*:\n\n✨ *${name}* (${rarity})${shiny ? ' ✨ Shiny' : ''}\n🔰 Tipo: ${cardType} | Lvl: ${level}\n\n📦 Pacchetti rimasti: *${remaining}* ${type}`,
pokeBuyUsage: () => "┌──────────\n  ━━✫ ❌ Uso corretto\n  ━━✫ .buypokemon <base|imperium|premium> <quantità>\n  ━━✫ Esempio: .buypokemon base 3\n└──────────",
pokeBuyNoCoins: ({ cost, balance }) => `┌──────────\n  ━━✫ ❌ UnityCoins insufficienti\n  ━━✫ Richiesti: ${cost}\n  ━━✫ Saldo: ${balance}\n└──────────`,
pokeBuySuccess: ({ quantity, type, total, balance }) => `✅ Hai comprato *${quantity}* pacchetti ${type.toUpperCase()}!\n📦 Totale ora: ${total}\n💸 UnityCoins rimanenti: ${balance}`,
pokeLeaderboardEmpty: () => "┌──────────\n  ━━✫ 😢 Nessun collezionista trovato\n└──────────",
pokeLeaderboardTitle: () => "🏆 *Top 10 Collezionisti Pokémon*:",
pokeInventoryTitle: () => "📂 I TUOI PACCHETTI",
pokeInventoryBase: ({ count }) => `• 📦 Base: ${count}`,
pokeInventoryImperium: ({ count }) => `• 👑 Imperium: ${count}`,
pokeInventoryPremium: ({ count }) => `• 🌌 Premium: ${count}`,
pokeInventoryFooter: () => "🎁 Usa i bottoni per aprire un pacchetto subito!",
pokeInventoryOpenBase: () => "📦 Apri Base",
pokeInventoryOpenImperium: () => "👑 Apri Imperium",
pokeInventoryOpenPremium: () => "🌌 Apri Premium",
pokeInventoryBuy: () => "➕ Compra Pacchetti",
pokeBattleNoMention: () => "┌──────────\n  ━━✫ ⚔️ Tagga un utente\n  ━━✫ Esempio: .combatti @utente\n└──────────",
pokeBattleNoPokemon: () => "┌──────────\n  ━━✫ 😓 Non hai Pokémon\n└──────────",
pokeBattleOpponentNoPokemon: () => "┌──────────\n  ━━✫ 😓 L'avversario non ha Pokémon\n└──────────",
pokeBattleResult: ({ user1, user2, poke1, poke2, result }) => `⚔️ *Combattimento Pokémon!*\n\n👤 @${user1} ha scelto *${poke1.name}* (Lv. ${poke1.level})\n👤 @${user2} ha scelto *${poke2.name}* (Lv. ${poke2.level})\n\n${result}`,
pokeBattleWinner: ({ user }) => `🏆 @${user} vince il combattimento!`,
pokeBattleTie: () => "🤝 Pareggio! Entrambi i Pokémon sono esausti.",
pokeEvolveNoName: () => "┌──────────\n  ━━✫ 📛 Specifica il nome del Pokémon\n  ━━✫ Esempio: .evolvi Charmander\n└──────────",
pokeEvolveNotOwned: ({ name }) => `┌──────────\n  ━━✫ ❌ Non possiedi *${name}*\n└──────────`,
pokeEvolveNoCoins: ({ balance, cost }) => `┌──────────\n  ━━✫ ⛔ unitycoin insufficiente\n  ━━✫ Hai: ${balance}\n  ━━✫ Richiesti: ${cost}\n└──────────`,
pokeEvolveNoEvolution: ({ name }) => `┌──────────\n  ━━✫ ⛔ ${name} non può evolversi\n└──────────`,
pokeEvolveEvolving: ({ name }) => `✨ *${name}* sta evolvendo...`,
pokeEvolveProgress: () => "🔄 Evoluzione in corso...",
pokeEvolveSuccess: ({ from, to }) => `🎉 *${from}* si è evoluto in *${to}*!`,
pokeEvolveComplete: ({ balance }) => `✅ Evoluzione completata!\n💰 unitycoin rimasti: *${balance}*`,
tradeUsage: () => "┌──────────\n  ━━✫ 📌 Uso corretto\n  ━━✫ .scambia @utente <tuo_num> <suo_num>\n└──────────",
tradeYourNotExist: ({ num }) => `┌──────────\n  ━━✫ ❌ Il tuo Pokémon n. ${num}\n  ━━✫ non esiste\n└──────────`,
tradeTheirNotExist: ({ num, user }) => `┌──────────\n  ━━✫ ❌ Il Pokémon n. ${num}\n  ━━✫ di @${user} non esiste\n└──────────`,
tradeRequest: ({ from, myPoke, theirPoke, target }) => `🔁 *Richiesta di Scambio*\n\n@${from} vuole scambiare:\n📤 *${myPoke.name}* (Lv. ${myPoke.level})\ncon\n📥 *${theirPoke.name}* (Lv. ${theirPoke.level}) di @${target}\n\n✅ @${target}, rispondi con *.accetta* per confermare.`,
tradeNoRequest: () => "┌──────────\n  ━━✫ ❌ Nessuna richiesta di scambio\n└──────────",
tradeUnavailable: () => "┌──────────\n  ━━✫ ❌ Uno dei Pokémon\n  ━━✫ non è più disponibile\n└──────────",
tradeSuccess: ({ from, to, poke1, poke2 }) => `✅ Scambio completato tra @${from} e @${to}!\n\n🎁 ${poke1.name} ⇄ ${poke2.name}`,
pityTitle: () => "📊 *Sistema Pity Darkness*",
pityOpened: ({ count }) => `🔁 Pacchetti aperti senza Darkness: *${count}*`,
pityRemaining: ({ remaining }) => `🎯 Prossimo Darkness garantito tra: *${remaining}* pacchetti`,
pityGuaranteed: () => "✨ Il prossimo pacchetto ha un Darkness *garantito*!",
inventoryEmpty: () => "┌──────────\n  ━━✫ 📦 Inventario vuoto\n  ━━✫ Usa .apripokemon base\n└──────────",
inventoryInvalidPage: ({ max }) => `┌──────────\n  ━━✫ ❌ Pagina non valida\n  ━━✫ Scegli tra 1 e ${max}\n└──────────`,
inventoryHeader: ({ user, total, page, totalPages, perPage }) => `┌──────────\n┃ 👤 *Allenatore:* @${user}\n┃ 📦 *Totale:* ${total}\n┃ 📄 *Pagina:* ${page}/${totalPages}\n┃ 📌 *Per pagina:* ${perPage}\n└──────────`,
inventoryDarknessButton: () => "🌑 Pokémon Darkness",
inventoryPageButton: ({ num }) => `Pagina ${num}`,
inventoryFooter: () => "📂 Usa `.inventario [pagina]` oppure clicca i bottoni per navigare.",
darknessInfo: () => "🌑 *PACCHETTI DARKNESS* 🌑\n\nI pacchetti *Darkness* non si possono comprare, ma si trovano **apparentemente dal nulla** quando apri pacchetti *Premium*.\n\n➡️ Ogni 10 pacchetti *Premium* aperti, hai il 50% di possibilità di ottenere un pacchetto *Darkness* bonus.\n\n🎲 Aprendo un pacchetto *Darkness* puoi trovare Pokémon Darkness speciali con il 10% di possibilità.\n\nUsa *.apripokemon darkness* per aprire i pacchetti Darkness.\n\nBuona fortuna! 🍀",
trisAlreadyPlaying: () => "┌──────────\n  ━━✫ ❗ Stai già giocando\n  ━━✫ con qualcuno\n└──────────",
trisNoRoomName: ({ prefix, command }) => `┌──────────\n  ━━✫ ❗ Devi dare un nome alla stanza\n  ━━✫ Esempio: ${prefix}${command} stanza1\n└──────────`,
trisGameStarting: () => "┌──────────\n   • 🕹️ ୭ *PARTITA INIZIA*\n└──────────\n\n• Un giocatore si è unito",
trisTurnOf: ({ player }) => `Turno di @${player}`,
trisRoomCreated: () => "𝐒𝐓𝐀𝐍𝐙𝐀 𝐂𝐑𝐄𝐀𝐓𝐀 ✓",
trisWaiting: ({ room }) => `══════ •⊰✧⊱• ══════\n*𝐀𝐭𝐭𝐞𝐧𝐝𝐞𝐧𝐝𝐨 𝐠𝐢𝐨𝐜𝐚𝐭𝐨𝐫𝐢 ...*\n══════════════\n🕹️ 𝐏𝐞𝐫 𝐩𝐚𝐫𝐭𝐞𝐜𝐢𝐩𝐚𝐫𝐞 𝐝𝐢𝐠𝐢𝐭𝐚\n.gioca ${room}\n══════════════\n⛔ 𝐏𝐞𝐫 𝐮𝐬𝐜𝐢𝐫𝐞 𝐝𝐚𝐥𝐥𝐚 𝐩𝐚𝐫𝐭𝐢𝐭𝐚\n𝐢𝐧 𝐜𝐨𝐫𝐬𝐨 𝐝𝐢𝐠𝐢𝐭𝐚 .esci\n══════ •⊰✧⊱• ══════`,
slotInvalidBet: ({ prefix, command }) => `┌──────────\n  ━━✫ ❌ Puntata non valida\n  ━━✫ Esempio: ${prefix}${command} 100\n└──────────`,
slotInsufficientUC: ({ bet }) => `┌──────────\n  ━━✫ 🚫 UC insufficienti\n  ━━✫ Ti servono ${bet} UC\n└──────────`,
slotCooldown: ({ min, sec }) => `┌──────────\n  ━━✫ ⏳ Aspetta ${min}m ${sec}s\n  ━━✫ prima di giocare di nuovo\n└──────────`,
slotWin: ({ uc, xp }) => `┌──────────\n   • 🎉 ୭ *HAI VINTO!*\n└──────────\n\n• Vincite\n\n┌──────────────\n│ ➕ *${uc} UC*\n│ ➕ *${xp} XP*\n└──────────────`,
slotLose: ({ uc, xp }) => `┌──────────\n   • 🤡 ୭ *HAI PERSO!*\n└──────────\n\n• Perdite\n\n┌──────────────\n│ ➖ *${uc} UC*\n│ ➖ *${xp} XP*\n└──────────────`,
slotBalance: ({ uc, xp, current, max, prefix }) => `\n💎 *SALDO ATTUALE*\n\n┌──────────────\n│ 👛 *UC: ${uc}*\n│ ⭐ *XP: ${xp}*\n│ 📊 *Progresso: ${current}/${max} XP*\n└──────────────\n\n┌──────────╮\n│ ˚. ᵎᵎ ℹ️\n│ Usa ${prefix}menuxp per più XP!\n└──────────`,
betUsage: ({ prefix, command }) => `┌──────────\n   • 🎰 ୭ *CASINO*\n└──────────\n\n• Come giocare\n\nInserisci la quantità di 💶 UnityCoins da scommettere contro *ƌɽɛɑƌ-ʙᴏᴛ-Bot*\n\n📌 Esempio:\n${prefix}${command} 100\n\n┌──────────╮\n│ ˚. ᵎᵎ 🎲\n│ Scegli un taglio qui sotto!\n└──────────`,
betCooldown: ({ time }) => `┌──────────\n  ━━✫ 🚩 Hai già scommesso\n  ━━✫ Aspetta ⏱ ${time}\n└──────────`,
betLose: ({ bot, user, amount, botName, userName }) => `┌──────────\n   • 🎲 ୭ *RISULTATO*\n└──────────\n\n• Numeri estratti\n\n🤖 *${botName}*: ${bot}\n👤 *${userName}*: ${user}\n\n┌──────────╮\n│ 😢 HAI PERSO!\n│ ➖ ${amount} 💶 UC\n└──────────`,
betWin: ({ bot, user, amount, botName, userName }) => `┌──────────\n   • 🎲 ୭ *RISULTATO*\n└──────────\n\n• Numeri estratti\n\n🤖 *${botName}*: ${bot}\n👤 *${userName}*: ${user}\n\n┌──────────╮\n│ 🎉 HAI VINTO!\n│ ➕ ${amount} 💶 UC\n└──────────`,
betDraw: ({ bot, user, amount, botName, userName }) => `┌──────────\n   • 🎲 ୭ *RISULTATO*\n└──────────\n\n• Numeri estratti\n\n🤖 *${botName}*: ${bot}\n👤 *${userName}*: ${user}\n\n┌──────────╮\n│ 🤝 PAREGGIO!\n│ ↩️ ${amount} 💶 UC restituiti\n└──────────`,
betInsufficientUC: ({ amount }) => `┌──────────\n  ━━✫ 💸 Non hai ${amount} 💶 UC\n  ━━✫ da scommettere!\n└──────────`,
rpsAlreadyPlaying: ({ time }) => `┌──────────\n  ━━✫ ⏱ Hai già giocato\n  ━━✫ Aspetta ${time}\n└──────────`,
rpsChooseOption: () => `┌──────────\n   • ✊ ୭ *SASSO CARTA FORBICE*\n└──────────\n\n• Scegli la tua mossa\n\n🪨 Sasso batte Forbice\n📄 Carta batte Sasso\n✂️ Forbice batte Carta\n\n┌──────────╮\n│ ˚. ᵎᵎ 🎲\n│ Fai la tua scelta!\n└──────────`,
rpsInvalidOption: () => `┌──────────\n  ━━✫ ❌ Scelta non valida\n  ━━✫ Scegli: sasso/carta/forbice\n└──────────`,
rpsDraw: ({ player, bot, reward }) => `┌──────────\n   • 🤝 ୭ *PAREGGIO!*\n└──────────\n\n• Risultato\n\n👤 Tu: ${player}\n🤖 Bot: ${bot}\n\n┌──────────╮\n│ 🎁 Premio di consolazione\n│ ➕ ${reward} 💶 UC\n└──────────`,
rpsWin: ({ player, bot, reward }) => `┌──────────\n   • 🎉 ୭ *HAI VINTO!*\n└──────────\n\n• Risultato\n\n👤 Tu: ${player}\n🤖 Bot: ${bot}\n\n┌──────────╮\n│ 🏆 Vittoria epica!\n│ ➕ ${reward} 💶 UC\n└──────────`,
rpsLose: ({ player, bot, loss }) => `┌──────────\n   • 😢 ୭ *HAI PERSO!*\n└──────────\n\n• Risultato\n\n👤 Tu: ${player}\n🤖 Bot: ${bot}\n\n┌──────────╮\n│ 💸 Meglio fortuna prossima volta\n│ ➖ ${loss} 💶 UC\n└──────────`,
rpsRock: () => "🪨 Sasso",
rpsPaper: () => "📄 Carta",
rpsScissors: () => "✂️ Forbice",
rpsButtonRock: () => "🪨 Sasso",
rpsButtonPaper: () => "📄 Carta",
rpsButtonScissors: () => "✂️ Forbice",
rpsButtonRetry: () => "🔄 Riprova",
bjInsufficientFunds: () => "💰 Fondi insufficienti!",
bjNotYourTurn: () => "❌ Non è il tuo turno!",
bjBusted: () => "💥 Sballato! Hai superato 21!",
bjDealerBusted: () => "🎉 Dealer sballato! Hai vinto!",
bjYouWin: () => "🎉 Hai vinto!",
bjDealerWins: () => "😔 Dealer vince!",
bjPush: () => "🤝 Pareggio!",
bjMakeBet: () => "💵 Fai la tua puntata!",
bjYourTurn: () => "📋 Il tuo turno! Chiedi o Stai?",
bjYourScore: ({ score }) => `📋 Il tuo punteggio: ${score}`,
bjTimeoutTitle: () => "⏰ TEMPO SCADUTO",
bjTimeoutMsg: ({ balance }) => `⏰ Tempo scaduto! Partita annullata.\n💶 Portafoglio: ${balance} UC`,
bjGameInProgress: () => "┌──────────\n  ━━✫ 🎰 Partita già in corso\n└──────────",
bjInvalidBet: ({ max }) => `┌──────────\n  ━━✫ ❌ Puntata non valida\n  ━━✫ Importo: 10-${max} UC\n└──────────`,
bjStartCaption: ({ name, bet, balance }) => `┌──────────\n   • 🎰 ୭ *BLACKJACK*\n└──────────\n\n• ${name}\n\n💶 Puntata: ${bet} UC\n📋 Saldo: ${balance} UC\n\n┌──────────╮\n│ ˚. ᵎᵎ ⚡\n│ .hit .stand .double\n└──────────`,
bjNoGame: () => "┌──────────\n  ━━✫ ❌ Nessuna partita in corso\n  ━━✫ Usa: .blackjack [puntata]\n└──────────",
bjNotYourGame: () => "┌──────────\n  ━━✫ ❌ Non è il tuo turno!\n└──────────",
bjDoubleOnlyTwo: () => "┌──────────\n  ━━✫ ❌ Raddoppia solo con 2 carte\n└──────────",
bjDoubleInsufficientFunds: () => "┌──────────\n  ━━✫ ❌ Fondi insufficienti\n  ━━✫ per raddoppiare\n└──────────",
bjFooter: () => "♠️ Blackjack Bot ♣️",
bjPlayer: () => "GIOCATORE",
bjDealer: () => "DEALER",
bjScore: () => "PUNTEGGIO",
bjWallet: () => "💶 PORTAFOGLIO",
bjBet: () => "🎯 PUNTATA",
rouletteCooldown: ({ time }) => `┌──────────\n  ━━✫ 🚩 Hai già scommesso\n  ━━✫ Aspetta ⏱ ${time}\n└──────────`,
rouletteUsage: ({ prefix, command }) => `┌──────────\n   • 🎰 ୭ *ROULETTE*\n└──────────\n\n• Come giocare\n\nInserisci quantità e colore:\n${prefix}${command} 20 black\n${prefix}${command} 50 red\n\n┌──────────╮\n│ ˚. ᵎᵎ 🎲\n│ Scegli il tuo colore!\n└──────────`,
rouletteInvalidFormat: ({ prefix, command }) => `┌──────────\n  ━━✫ 🚩 Formato errato\n  ━━✫ Esempio: ${prefix}${command} 20 black\n└──────────`,
rouletteInvalidAmount: () => `┌──────────\n  ━━✫ 🚩 Quantità non valida\n└──────────`,
rouletteMaxBet: () => `┌──────────\n  ━━✫ 🚩 Massimo 50 💶 UC\n└──────────`,
rouletteInvalidColor: () => `┌──────────\n  ━━✫ 🚩 Colore non valido\n  ━━✫ Scegli: black o red\n└──────────`,
rouletteInsufficientFunds: () => `┌──────────\n  ━━✫ 🚩 💶 UC insufficienti\n└──────────`,
rouletteBetPlaced: ({ amount, color }) => `┌──────────\n   • 🎰 ୭ *SCOMMESSA PIAZZATA*\n└──────────\n\n• Dettagli\n\n💰 Importo: ${amount} 💶 UC\n🎨 Colore: ${color === 'black' ? '⚫ NERO' : '🔴 ROSSO'}\n\n┌──────────╮\n│ ˚. ᵎᵎ ⏱\n│ Aspetta 10 secondi...\n└──────────`,
rouletteWin: ({ amount, total, winColor }) => `┌──────────\n   • 🎉 ୭ *HAI VINTO!*\n└──────────\n\n• Risultato\n\n🎯 Colore uscito: ${winColor === 'black' ? '⚫ NERO' : '🔴 ROSSO'}\n\n┌──────────╮\n│ 💰 Vincita: +${amount} 💶 UC\n│ 💎 Totale: ${total} 💶 UC\n└──────────`,
rouletteLose: ({ amount, total, winColor }) => `┌──────────\n   • 😢 ୭ *HAI PERSO!*\n└──────────\n\n• Risultato\n\n🎯 Colore uscito: ${winColor === 'black' ? '⚫ NERO' : '🔴 ROSSO'}\n\n┌──────────╮\n│ 💸 Perdita: -${amount} 💶 UC\n│ 💎 Totale: ${total} 💶 UC\n└──────────`,
rouletteBlack: () => "⚫ Nero",
rouletteRed: () => "🔴 Rosso",
rouletteButtonBlack10: () => "⚫ 10 UC",
rouletteButtonBlack25: () => "⚫ 25 UC",
rouletteButtonBlack50: () => "⚫ 50 UC",
rouletteButtonRed10: () => "🔴 10 UC",
rouletteButtonRed25: () => "🔴 25 UC",
rouletteButtonRed50: () => "🔴 50 UC",
// Coin Flip
cfCooldown: ({ time }) => `┌──────────\n  ━━✫ ⏳ Hai già giocato\n  ━━✫ Aspetta ${time}\n└──────────`,
cfWaiting: ({ player }) => `┌──────────\n   • 🪙 ୭ *TESTA O CROCE*\n└──────────\n\n• Partita iniziata\n\n🧑 Giocatore 1: @${player}\n🕹️ In attesa del secondo giocatore...\n\n┌──────────╮\n│ ˚. ᵎᵎ 🎲\n│ Scrivi testa o croce!\n└──────────`,
cfPlayer1Ready: ({ player, choice }) => `┌──────────\n   • 🪙 ୭ *TESTA O CROCE*\n└──────────\n\n• Giocatore 1 pronto\n\n🧑 @${player} ha scelto *${choice}*\n🎯 In attesa del Giocatore 2...\n\n┌──────────╮\n│ ˚. ᵎᵎ 🎮\n│ Tocca a te!\n└──────────`,
cfInvalidChoice: () => `┌──────────\n  ━━✫ ⚠️ Scelta non valida\n  ━━✫ Scrivi: testa o croce\n└──────────`,
cfResult: ({ result, p1, p2, msg, prefix, command }) => `┌──────────\n   • 🪙 ୭ *RISULTATO: ${result.toUpperCase()}*\n└──────────\n\n${msg}\n\n┌──────────╮\n│ ˚. ᵎᵎ 🔄\n│ ${prefix}${command} per rigiocare\n└──────────`,
cfAlreadyChosen: ({ choice }) => `┌──────────\n  ━━✫ Hai già scelto ${choice}\n  ━━✫ Aspetta un altro giocatore\n└──────────`,
cfNotAvailable: ({ prefix, command }) => `┌──────────\n  ━━✫ ❌ Partita non disponibile\n  ━━✫ ${prefix}${command} per iniziare\n└──────────`,
cfButtonHeads: () => "🪙 Testa",
cfButtonTails: () => "🪙 Croce",

// RPS v2
rps2Cooldown: ({ time }) => `┌──────────\n  ━━✫ ⏳ Aspetta ${time}\n└──────────`,
rps2Usage: ({ prefix, command }) => `┌──────────\n   • ✊ ୭ *SASSO CARTA FORBICI*\n└──────────\n\n• Come giocare\n\n${prefix}${command} pietra\n${prefix}${command} carta\n${prefix}${command} forbici\n\n┌──────────╮\n│ ˚. ᵎᵎ 🎮\n│ Scegli la tua mossa!\n└──────────`,
rps2InvalidChoice: ({ prefix, command }) => `┌──────────\n  ━━✫ ❌ Scelta non valida\n  ━━✫ ${prefix}${command} pietra/carta/forbici\n└──────────`,
rps2Draw: ({ bot, reward }) => `┌──────────\n   • 🤝 ୭ *PAREGGIO!*\n└──────────\n\n• Bot: ${bot}\n\n┌──────────╮\n│ 🎁 +${reward} 💶 UC\n└──────────`,
rps2Win: ({ bot, reward }) => `┌──────────\n   • 🎉 ୭ *HAI VINTO!*\n└──────────\n\n• Bot: ${bot}\n\n┌──────────╮\n│ 💰 +${reward} 💶 UC\n└──────────`,
rps2Lose: ({ bot, loss }) => `┌──────────\n   • 😢 ୭ *HAI PERSO!*\n└──────────\n\n• Bot: ${bot}\n\n┌──────────╮\n│ 💸 -${loss} 💶 UC\n└──────────`,
rps2ButtonRock: () => "🪨 Pietra",
rps2ButtonPaper: () => "📄 Carta",
rps2ButtonScissors: () => "✂️ Forbici",

// Pokedex
pokedexNoName: () => `┌──────────\n  ━━✫ 🚩 Inserisci nome Pokémon\n└──────────`,
pokedexSearching: ({ name }) => `🔍 Cerco ${name}...`,
pokedexError: () => `┌──────────\n  ━━✫ ⚠️ Errore ricerca Pokémon\n└──────────`,
pokedexInfo: ({ name, id, type, abilities, height, weight, desc, url }) => `┌──────────\n   • 🎌 ୭ *POKÉDEX - ${name}*\n└──────────\n\n• Informazioni\n\n🔹 *Nome:* ${name}\n🔹 *ID:* ${id}\n🔹 *Tipo:* ${type}\n🔹 *Abilità:* ${abilities}\n🔹 *Altezza:* ${height}\n🔹 *Peso:* ${weight}\n\n📝 *Descrizione:*\n${desc}\n\n┌──────────╮\n│ \n│ ${url}\n└──────────`,
flagGameActive: () => `┌──────────\n  ━━✫ ⚠️ Partita già attiva\n└──────────`,
flagGroupOnly: () => `┌──────────\n  ━━✫ ⚠️ Solo per gruppi\n└──────────`,
flagNoGame: () => `┌──────────\n  ━━✫ ⚠️ Nessuna partita attiva\n└──────────`,
flagAdminOnly: () => `┌──────────\n  ━━✫ ❌ Solo per admin\n└──────────`,
flagCooldown: ({ time }) => `┌──────────\n  ━━✫ ⏳ Aspetta ${time}s\n└──────────`,
flagSkipped: ({ answer }) => `ㅤ⋆｡˚[╭ \`GIOCO INTERROTTO\` ╯]˚｡⋆\n╭\n│ [🏳️] \`La risposta era:\`\n│ [‼️] *\`${answer}\`*\n│ [👑] _*Interrotto da un admin*_\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
flagStart: ({ phrase }) => `ㅤ⋆｡˚[╭ \`${phrase}\` ╯]˚｡⋆\n╭\n│ [🏳️] \`Rispondi con il nome\` *della nazione*\n│ [⏱️] \`Tempo disponibile:\` *30 secondi*\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
flagTimeout: ({ answer }) => `ㅤ⋆｡˚[╭ \`TEMPO SCADUTO!\` ╯]˚｡⋆\n╭\n│ [🏳️] \`La risposta era:\`\n│ [‼️] *\`${answer}\`*\n│ [💡] _*Sii più veloce la prossima volta!*_\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
flagCorrect: ({ answer, time, reward, exp, bonus }) => `ㅤ⋆｡˚[╭ \`RISPOSTA CORRETTA!\` ╯]˚｡⋆\n╭\n│ [🏳️] \`Nazione:\` *${answer}*\n│ [⏱️] \`Tempo impiegato:\` *${time}s*\n│ [🎁] \`Ricompense:\`\n│ [💰] *${reward}€* ${bonus > 0 ? `(+${bonus} bonus velocità)` : ''}\n│ [🆙] *${exp} EXP*\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
flagAlmostThere: () => "👀 *Ci sei quasi!*",
flagAttemptsExhausted: () => `ㅤ⋆｡˚[╭ \`TENTATIVI ESAURITI!\` ╯]˚｡⋆\n╭\n│ [❌] \`Hai esaurito i tuoi 3 tentativi!\`\n│ [⏳] _*Aspetta che altri provino...*_\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
flagWrongHint: ({ letter, length }) => `❌ *Risposta errata!*\n\n💡 *Suggerimento:*\n  • Inizia con la lettera *"${letter}"*\n  • È composta da *${length} lettere*`,
flagWrong2: ({ remaining }) => `❌ *Risposta errata!*\n\n📝 *Tentativi rimasti:* ${remaining}\n🤔 *Pensa bene alla tua prossima risposta!*`,
flagWrongLast: () => `❌ *Risposta errata!*\n\n📝 *Ultimo tentativo rimasto..*`,
flagPlayAgain: () => "🏳️ Gioca Ancora!",
flagError: () => `┌──────────\n  ━━✫ ❌ Errore avvio gioco\n  ━━✫ Riprova tra qualche secondo\n└──────────`,
flagPhrase1: () => "🇺🇳 *INDOVINA LA BANDIERA!* 🇺🇳",
flagPhrase2: () => "🌍 *Che nazione rappresenta questa bandiera?*",
flagPhrase3: () => "🏳️ *Sfida geografica: riconosci questa bandiera?*",
flagPhrase4: () => "🧭 *Indovina la nazione dalla sua bandiera!*",
flagPhrase5: () => "🎯 *Quiz bandiere: quale paese è questo?*",
flagPhrase6: () => "🌟 *Metti alla prova la tua conoscenza geografica!*",
flagPhrase7: () => "🔍 *Osserva attentamente e indovina la nazione!*",
songGameActive: () => `┌──────────\n  ━━✫ ⚠️ Partita già in corso\n└──────────`,
songError: () => `┌──────────\n  ━━✫ ❌ Errore nel gioco\n  ━━✫ Riprova più tardi\n└──────────`,
songStart: ({ artist, time }) => `  ⋆｡˚[╭ \`INDOVINA CANZONE\` ╯]˚｡⋆\n╭\n┃ [⏱️] \`Tempo:\` *${time} secondi*\n┃ [👤] \`Artista:\` *${artist}*\n┃\n┃ ➤  \`Scrivi il titolo!\`\n╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒`,
songTimeout: ({ title, artist }) => `ㅤ⋆｡˚[╭ \`TEMPO SCADUTO\` ╯]˚｡⋆\n╭\n│\n│ ➤ \`Nessuno ha indovinato!\`\n┃ []🎵 \`Titolo:\` *${title}*\n┃ []👤 \`Artista:\` *${artist}*\n┃\n╰⭒─ׄ─ׅ─ׄ─⭒`,
songCorrect: ({ title, artist, reward, exp }) => `ㅤㅤ⋆｡˚[╭ \`CORRETTA\` ╯]˚｡⋆\n╭\n│\n│ ➤ \`Risposta Corretta!\`\n┃ []🎵 \`Titolo:\` *${title}*\n┃ []👤 \`Artista:\` *${artist}*\n┃\n┃ [🎁] \`Vincite:\`\n│ ➤  \`${reward}\` *UC*\n│ ➤  \`${exp}\` *EXP*\n┃\n╰⭒─ׄ─ׅ─ׄ─⭒`,
songAlmostThere: () => "👀 *Ci sei quasi!* Riprova...",
songPlayAgain: () => "[🎵] Rigioca",
songExternalTitle: () => "indovina la canzone",
songExternalArtist: ({ artist }) => `Artista: ${artist}`,
songExternalSource: () => "ƌɽɛɑƌ-ʙᴏᴛ Bot",
logoGroupOnly: () => `┌──────────\n  ━━✫ ⚠️ Solo per gruppi\n└──────────`,
logoNoGame: () => `┌──────────\n  ━━✫ ⚠️ Nessuna partita attiva\n└──────────`,
logoAdminOnly: () => `┌──────────\n  ━━✫ ❌ Solo admin\n└──────────`,
logoSkipped: ({ answer }) => `┌──────────\n   • 🛑 ୭ *GIOCO INTERROTTO*\n└──────────\n\n• La risposta era\n\n🚗 *${answer}*`,
logoGameActive: () => `┌──────────\n  ━━✫ ⚠️ Partita già in corso\n└──────────`,
logoCooldown: ({ time }) => `┌──────────\n  ━━✫ ⏳ Attendi ${time}s\n└──────────`,
logoStart: ({ phrase, time }) => `┌──────────\n   • 🚗 ୭ *${phrase}*\n└──────────\n\n• Indovina il marchio\n\n⌛ Tempo: ${time} secondi\n\n┌──────────╮\n│ ˚. ᵎᵎ 🔍\n│ Scrivi il nome del marchio!\n└──────────`,
logoTimeout: ({ answer }) => `┌──────────\n   • ⏰ ୭ *TEMPO SCADUTO!*\n└──────────\n\n• La risposta era\n\n🚗 *${answer}*\n\n┌──────────╮\n│ ˚. ᵎᵎ 🔄\n│ Riprova con .auto\n└──────────`,
logoCorrect: ({ brand, time, reward, exp, bonus }) => `┌──────────\n   • 🎉 ୭ *RISPOSTA CORRETTA!*\n└──────────\n\n• Dettagli\n\n🚗 Marchio: *${brand}*\n⏱ Tempo: *${time}s*\n\n┌──────────╮\n│ 🎁 Ricompense:\n│ • ${reward} 💰 UC${bonus > 0 ? ` (+${bonus} bonus)` : ''}\n│ • ${exp} 🆙 EXP\n└──────────\n\n> \\by ƌɽɛɑƌ-ʙᴏᴛ\\`,
logoPhrase1: () => "🚘 INDOVINA IL LOGO!",
logoPhrase2: () => "🏁 Che marca è questa?",
logoPhrase3: () => "🔍 Riconosci questa auto?",
logoPhrase4: () => "🚗 Quiz Auto!",
logoPhrase5: () => "🏎️ Indovina il marchio!",
logoButtonPlayAgain: () => "🚗 Gioca Ancora",
missionMainTitle: ({ bot }) => `┌──────────\n   • 🎯 ୭ *SISTEMA MISSIONI*\n└──────────\n\n• ${bot}`,
missionMainStats: ({ user, money, bank, dailyDone, dailyTotal, weeklyDone, weeklyTotal }) => `👤 Utente: @${user}\n💰 Saldo: ${money} UC\n🏦 Banca: ${bank} UC\n📅 Daily: ${dailyDone}/${dailyTotal} completate\n📆 Weekly: ${weeklyDone}/${weeklyTotal} completate\n\n┌──────────╮\n│ \n│ Seleziona il tipo di missioni:\n└──────────`,
missionButtonDaily: () => "📅 GIORNALIERE",
missionButtonWeekly: () => "📆 SETTIMANALI",
missionButtonClaim: () => "💰 RISCUOTI",
missionButtonBack: () => "🔙 INDIETRO",
missionButtonWallet: () => "💰 PORTAFOGLIO",
missionDailyTitle: ({ user }) => `┌──────────\n   • 📅 ୭ *MISSIONI GIORNALIERE*\n└──────────\n\n👤 @${user}`,
missionDailyReset: ({ time }) => `⏳ Reset tra: ${time}`,
missionWeeklyTitle: ({ user }) => `┌──────────\n   • 📆 ୭ *MISSIONI SETTIMANALI*\n└──────────\n\n👤 @${user}`,
missionWeeklyReset: ({ time }) => `⏳ Reset tra: ${time}`,
missionEntry: ({ num, title, progress, target, reward, status }) => `▢ *${num}. ${title}*\n➠ Progresso: ${progress}/${target}\n➠ Ricompensa: ${reward} UC\n➠ Stato: ${status}`,
missionStatusCompleted: () => "✅ RISCOSSA",
missionStatusReady: () => "💰 PRONTA",
missionStatusInProgress: () => "❌ IN CORSO",
missionFooterDaily: ({ prefix }) => `Usa "${prefix}missioni claim" per riscuotere!`,
missionFooterWeekly: () => "Missioni settimanali - Ricompense maggiori!",
missionFooterMain: () => "Completa le missioni per guadagnare UnityCoins!",
missionNoRewards: ({ user }) => `┌──────────\n  ━━✫ @${user} non hai missioni\n  ━━✫ completate da riscuotere!\n└──────────`,
missionClaimSuccess: ({ user, total, details, money, bank }) => `┌──────────\n   • 🎉 ୭ *RICOMPENSE RISCOSSSE*\n└──────────\n\n👤 @${user}\n💰 Totale riscosso: *${total} UC*\n\n${details}\n\n┌──────────╮\n│ 💰 Saldo: ${money} UC\n│ 🏦 Banca: ${bank} UC\n└──────────`,
missionClaimFooter: () => "Usa .portafoglio per vedere il saldo completo",
missionSendMessages: ({ count }) => `Invia ${count} messaggi`,
missionExecuteCommands: ({ count }) => `Esegui ${count} comandi`,
missionNoWarn: () => "Rimani senza warn",
missionNoWarnWeek: () => "Rimani 7 giorni senza warn",
missionTotalMessages: ({ count }) => `Raggiungi ${count} messaggi totali`,
walletNotFound: () => `┌──────────\n  ━━✫ 🚩 Utente non trovato\n  ━━✫ nel database\n└──────────`,
walletTitle: () => "💰 WALLET",
walletInfo: ({ name, uc, bank }) => `┌──────────\n   • 💰 ୭ *PORTAFOGLIO*\n└──────────\n\n• ${name}\n\n👤 Utente: ${name}\n💰 UnityCoins: ${uc} 💶\n🏛️ Banca: ${bank} 💳\n\n┌──────────╮\n│ ˚. ᵎᵎ 💎\n│ Usa .deposit per depositare\n│ Usa .withdraw per prelevare\n└──────────`,
walletExternalTitle: ({ name }) => `Portafoglio di ${name}`,
walletExternalBody: ({ uc }) => `Saldo: ${uc} UC`,
walletButtonDeposit: () => "🏛️ Deposita",
walletButtonWithdraw: () => "💰 Preleva",
walletButtonGames: () => "🎮 Giochi",
bankNotFound: () => `┌──────────\n  ━━✫ 🚩 Utente non trovato\n  ━━✫ nel database\n└──────────`,
bankYourBalance: ({ balance }) => `┌──────────\n   • 🏛️ ୭ *IL TUO CONTO*\n└──────────\n\n• Saldo Bancario\n\n💰 Hai *${balance} 💶 UnityCoins*\nnella tua banca 🏛️\n\n┌──────────╮\n│ ˚. ᵎᵎ 💎\n│ Usa .deposit per depositare\n│ Usa .withdraw per prelevare\n└──────────`,
bankUserBalance: ({ user, balance }) => `┌──────────\n   • 🏛️ ୭ *CONTO BANCARIO*\n└──────────\n\n• @${user}\n\n💰 Ha *${balance} 💶 UnityCoins*\nnella banca 🏛️`,
bankButtonDeposit: () => "🏛️ Deposita",
bankButtonWithdraw: () => "💰 Preleva",
bankButtonTransfer: () => "💸 Trasferisci",
transferNoMention: () => `┌──────────\n  ━━✫ 🚩 Menziona il destinatario\n  ━━✫ Esempio: @user 100\n└──────────`,
transferNoAmount: () => `┌──────────\n  ━━✫ 🚩 Inserisci la quantità\n  ━━✫ di 💶 UnityCoins da trasferire\n└──────────`,
transferInvalidAmount: () => `┌──────────\n  ━━✫ ❌ Importo non valido\n  ━━✫ Usa solo numeri\n└──────────`,
transferMinAmount: () => `┌──────────\n  ━━✫ 🚩 Minimo trasferibile: 1 UC\n└──────────`,
transferInsufficient: () => `┌──────────\n  ━━✫ 💸 Saldo insufficiente\n  ━━✫ per questo trasferimento\n└──────────`,
transferSuccess: ({ amount, fee, total }) => `┌──────────\n   • 💸 ୭ *TRASFERIMENTO EFFETTUATO*\n└──────────\n\n• Dettagli Transazione\n\n💰 Importo inviato: *${amount}* 💶 UC\n📊 Tassa 2%: *${fee}* 💶 UC\n💳 Totale addebitato: *${total}* 💶 UC\n\n┌──────────╮\n│ ˚. ᵎᵎ ✅\n│ Trasferimento completato!\n└──────────`,
transferReceived: ({ amount }) => `┌──────────\n   • 💰 ୭ *RICEVUTI UC*\n└──────────\n\n• Hai ricevuto\n\n💶 *+${amount} UnityCoins*\n\n┌──────────╮\n│ ˚. ᵎᵎ 🎁\n│ Controlla il tuo saldo!\n└──────────`,
transferSelf: () => `┌──────────\n  ━━✫ ❌ Non puoi trasferire\n  ━━✫ a te stesso\n└──────────`,
robNoTarget: ({ prefix, command }) => `┌──────────\n  ━━✫ 🧠 Tagga qualcuno o\n  ━━✫ rispondi a un messaggio\n  ━━✫ Esempio: ${prefix}${command} @utente\n└──────────`,
robSelf: () => `┌──────────\n  ━━✫ 🤡 Non puoi rubare\n  ━━✫ a te stesso\n└──────────`,
robCooldown: ({ time }) => `┌──────────\n  ━━✫ 🚨 Hai già rubato\n  ━━✫ Riprova tra ⏱ ${time}\n└──────────`,
robSuccess: ({ amount, target }) => `┌──────────\n   • 💰 ୭ *COLPO RIUSCITO!*\n└──────────\n\n• Furto perfetto\n\nHai rubato *${amount} 💶 UC*\nda @${target}\n\n┌──────────╮\n│ 💸 +${amount} 💶 UC\n│ ˚. ᵎᵎ ✅ Al tuo saldo\n└──────────`,
robCaught: ({ fine, name }) => `┌──────────\n   • 🚓 ୭ *ARRESTATO!*\n└──────────\n\n• Catturato dalla polizia\n\n${name} è stato fermato!\n\n┌──────────╮\n│ 💸 Multa: -${fine} 💶 UC\n│ ˚. ᵎᵎ ❌ Meglio fortuna prossima volta\n└──────────`,
robPartial: ({ amount, target }) => `┌──────────\n   • 💸 ୭ *FURTO PARZIALE*\n└──────────\n\n• Quasi riuscito\n\nHai rubato solo *${amount} 💶 UC*\nda @${target}\n\n┌──────────╮\n│ 💰 +${amount} 💶 UC\n│ ˚. ᵎᵎ ⚠️ Al tuo saldo\n└──────────`,
robButtonRetry: () => "🔄 Riprova",
robButtonWallet: () => "💰 Portafoglio",
withdrawNoAmount: () => `┌──────────\n  ━━✫ 🚩 Inserisci la quantità\n  ━━✫ di 💶 UnityCoins da prelevare\n└──────────`,
withdrawNoFunds: () => `┌──────────\n  ━━✫ 🚩 Non hai 💶 UnityCoins\n  ━━✫ nel conto bancario\n└──────────`,
withdrawInvalidAmount: () => `┌──────────\n  ━━✫ 🚩 Quantità non valida\n  ━━✫ Usa un numero valido\n└──────────`,
withdrawMinAmount: () => `┌──────────\n  ━━✫ 🚩 Inserisci almeno 1 UC\n└──────────`,
withdrawInsufficientFunds: ({ bank }) => `┌──────────\n  ━━✫ 🚩 Hai solo *${bank}* 💶 nel conto\n└──────────`,
withdrawSuccess: ({ count, bank }) => `┌──────────\n   • ✅ ୭ *PRELIEVO EFFETTUATO*\n└──────────\n\n• Hai prelevato\n\n💶 *${count} UnityCoins*\ndal conto bancario\n\n💳 Nuovo saldo banca: *${bank} UC*\n┌──────────╮\n│ ˚. ᵎᵎ 💼\n│ Usa .wallet per verificare\n└──────────`,
  xpLevelDisplay: ({ level }) => `•  Livello: ${level}`,
  xpProgressDisplay: ({ current, needed }) => `Progresso XP: ${current} / ${needed}`,
  xpFooterText: () => "└──────────﹐ Continua a scrivere per salire di livello!",
  xpCaption: ({ user, level, exp, next }) => `•\n\n┊ [📊] Profilo XP di ${user}\n\n┃ Livello attuale: ${level}\n┃ Esperienza totale: ${exp}\n┃ XP mancanti al prossimo livello: ${next}\n\n└──────────﹐`,
rubaxpWait: () => `┌──────────\n  ━━✫ ⏳ Devi aspettare ancora prima di poter rubare di nuovo\n└──────────`,
rubaxpWaitTime: ({ time }) => `┌──────────\n  ━━✫ ⏳ Devi aspettare ancora ${time} prima di poter rubare di nuovo\n└──────────`,
rubaxpNoTarget: () => `┌──────────\n  ━━✫ 📍 Devi taggare un utente valido\n└──────────`,
rubaxpUserNotFound: () => `┌──────────\n  ━━✫ ⚠️ Utente non trovato nel database\n└──────────`,
rubaxpTooPoor: ({ target, limit }) => `┌──────────\n  ━━✫ 😢 @${target} ha meno di *${limit} XP*\n  ━━✫ Non rubare ai poveri, sii gentile\n└──────────`,
rubaxpSuccess: ({ amount, target }) => `┌──────────\n   • ✅ ୭ *FURTO EFFETTUATO*\n└──────────\n\n• Hai rubato\n\n💰 *${amount} XP*\nda @${target}\n┌──────────╮\n│ ˚. ᵎᵎ 🎮\n│ Continua così!\n└──────────`,
rubaxpTimeFormat: ({ hours, minutes, seconds }) => `${hours} Ora(e) ${minutes} Minuto(i) ${seconds} Secondo(i)`,darxpNoMention: () => `┌──────────\n  ━━✫ 🚩 Devi menzionare un utente con @user\n└──────────`,
darxpNoAmount: () => `┌──────────\n  ━━✫ 🚩 Inserisci la quantità di 💫 XP da trasferire\n└──────────`,
darxpInvalidAmount: () => `┌──────────\n  ━━✫ 🚩 Inserisci solo numeri validi\n└──────────`,
darxpMinAmount: () => `┌──────────\n  ━━✫ 🚩 Il minimo trasferibile è 1 💫 XP\n└──────────`,
darxpInsufficientXP: () => `┌──────────\n  ━━✫ 🚩 Non hai abbastanza 💫 XP per trasferire\n└──────────`,
darxpSuccess: ({ xp, tassa }) => `┌──────────\n  • ✅ ୭ *TRASFERIMENTO EFFETTUATO*\n└──────────\n\n• Hai trasferito\n\n💫 *${xp} XP*\n(tassa: ${tassa} XP)\n┌──────────╮\n│ Continua a giocare!\n└──────────`,
marry_no_target: ({ prefix, command }) => `┌──────────
  ━━✫ 🚩 Devi menzionare un utente da sposare
  ━━✫ Usa: ${prefix + command} @utente
└──────────`,
marry_self: () => `┌──────────
  ━━✫ 🚩 Non puoi sposare te stesso
└──────────`,
marry_user_not_found: () => `┌──────────
  ━━✫ 🚩 Utente non trovato nel database
└──────────`,
marry_already_married_sender: ({ spouse }) => `┌──────────
  • 💍 ୭ *SEI GIÀ SPOSATO*
└──────────

• Risulti sposato con

❤ ${spouse}

└──────────﹐`,
marry_already_married_target: ({ target }) => `┌──────────
  ━━✫ 🚩 ${target} è già sposato
  ━━✫ Cerca qualcun altro single
└──────────`,
marry_pending_proposal: () => `┌──────────
  ━━✫ 🚩 Hai già una proposta di matrimonio in sospeso
  ━━✫ Attendi che venga accettata o rifiutata
└──────────`,
marry_proposal_text: ({ sender, target }) => `┌──────────
  • 💍 ୭ *PROPOSTA DI MATRIMONIO*
└──────────

• ${sender} ha chiesto la mano di

❤ ${target}

Rispondi con "Si" per accettare
o "No" per rifiutare.

└──────────﹐`,
marry_proposal_expired: ({ sender, target }) => `┌──────────
  ━━✫ ⏳ La proposta tra ${sender} e ${target}
  ━━✫ è scaduta per inattività
└──────────`,
marry_proposal_rejected: () => `┌──────────
  ━━✫ 💔 La proposta è stata rifiutata
└──────────`,
marry_user_not_found_db: () => `┌──────────
  ━━✫ 🚩 Errore: utenti non trovati nel database
└──────────`,
marry_success: ({ sender, target }) => `┌──────────
  • 💍 ୭ *MATRIMONIO REGISTRATO*
└──────────

• Nuova coppia ufficiale

❤ ${sender}  ×  ${target}

•
Che l'amore abbia inizio!

└──────────﹐`,
divorce_not_married: () => `┌──────────
  ━━✫ 🚩 Non sei sposato con nessuno
└──────────`,
divorce_spouse_not_found: () => `┌──────────
  ━━✫ 🚩 Il tuo coniuge non è stato trovato nel database
└──────────`,
divorce_success: ({ ex }) => `┌──────────
  • 💔 ୭ *DIVORZIO COMPLETATO*
└──────────

• Ti sei separato da

${ex}

· ୨• · · ୨• ·  ♡
Nuovo capitolo della tua vita iniziato.

└──────────﹐`,
shipNoUser: ({ prefix, command }) => `┌──────────
  ━━✫ ❗ Usa il comando così:
  ━━✫ ${prefix + command} @utente
└──────────`,
shipNoUsersPair: ({ prefix, command }) => `┌──────────
  ━━✫ ❗ Usa il comando così:
  ━━✫ ${prefix + command} @utente1 [@utente2]
└──────────`,
shipInvalidUsers: () => `┌──────────
  ━━✫ ❌ Utenti non validi
└──────────`,
shipCaption: ({ user1, user2, percent }) => `•

💘 *@${user1}* ❤️ *@${user2}*
🔮 Compatibilità: *${percent}%*

· ୨• · · ୨• ·  ♡`,
shipErrorImage: () => `┌──────────
  ━━✫ ❌ Errore durante la generazione dell’immagine
└──────────`,
kissNoTargetMention: ({ prefix, command }) => `┌──────────
  ━━✫ 💋 Devi menzionare qualcuno o rispondere a un messaggio
  ━━✫ Esempio: ${prefix + command} @utente
└──────────`,
kissNoTarget: () => `┌──────────
  ━━✫ 💋 Devi menzionare qualcuno per baciarlo
  ━━✫ Esempio: .bacia @utente
└──────────`,
kissSuccess: ({ senderName, targetName }) => `┌──────────
  • 💋 ୭ *Bacio consegnato*
└──────────

• ${senderName} ha dato un bacio a

😘 ${targetName}

· ୨• · · ୨• ·  ♡`,
odioNoText: ({ prefix, command }) => `┌──────────
  ━━✫ 😡 Devi specificare qualcuno
  ━━✫ Esempio: ${prefix + command} @utente
└──────────`,
odioResult: ({ target, percent }) => `┌──────────
  • 😡 ୭ *CALCOLATORE DI ODIO*
└──────────

• Livello di odio tra

${target}  ✕  te

🔥 Odio: *${percent}%*

•`,
rizzNoTarget: ({ prefix, command }) => `┌──────────
  ━━✫ 🎯 Devi taggare qualcuno o rispondere a un messaggio
  ━━✫ Esempio: ${prefix + command} @utente
└──────────`,
rizzSuccess: ({ target, line }) => `┌──────────
  • ✨ ୭ *Mossa di Rizz*
└──────────

• @${target} guarda qua

“${line}”

· ୨• · · ୨• ·  ♡`,
minacciaNoGroup: () => `┌──────────
  ━━✫ 🚩 Questo comando può essere usato solo nei gruppi
└──────────`,
minacciaDisabled: () => `┌──────────
  ━━✫ 🚩 Le minacce sono disattivate in questo gruppo
└──────────`,
minacciaNoTarget: () => `┌──────────
  ━━✫ 🎯 Devi specificare qualcuno da minacciare
  ━━✫ Tagga un utente o rispondi a un messaggio
└──────────`,
minacciaText: ({ target, line }) => `•

@${target} ${line}

· ୨• · · ୨• ·  ♡`,
zizzaniaNoGroup: () => `┌──────────
  ━━✫ 🚩 Questo comando può essere usato solo nei gruppi
└──────────`,
zizzaniaDisabled: () => `┌──────────
  ━━✫ 🚩 La zizzania è disattivata in questo gruppo
└──────────`,
zizzaniaText: ({ a, line, b }) => `•

@${a} ${line} @${b}

· ୨• · · ୨• ·  ♡`,
ditalinoNoTarget: ({ prefix, command }) => `┌──────────
  ━━✫ 🎯 Devi taggare qualcuno o rispondere a un messaggio
  ━━✫ Esempio: ${prefix + command} @utente
└──────────`,
ditalinoStart: ({ target }) => `🤟🏻 Inizio una serie di coccole speciali per *${target}*...`,
ditalinoMiddle: () => "🤟🏻 Ci siamo quasi...",
ditalinoEnd: () => "👋🏻 Riparatevi dalla cascata!!",
ditalinoResult: ({ target, time }) => `✨ *${target}* è esplosə di piacere dopo *${time}ms* 🥵`,
segaNoTarget: ({ prefix, command }) => `┌──────────
  ━━✫ 🎯 Devi taggare qualcuno o rispondere a un messaggio
  ━━✫ Esempio: ${prefix + command} @utente
└──────────`,
segaStart: ({ target }) => `Ora ci occupiamo di ${target}... 😏`,
segaFrame: ({ frame }) => `${frame}`,
segaEnd: ({ target }) => `Oh ${target} è arrivatə al massimo piacere! 😋💦`,
insultNoGroup: () => `┌──────────
  ━━✫ 🚩 Questo comando può essere usato solo nei gruppi
└──────────`,
insultDisabled: () => `┌──────────
  ━━✫ 🚩 Gli insulti sono disattivati in questo gruppo
└──────────`,
insultNoTarget: () => `┌──────────
  ━━✫ 🎯 Chi vuoi insultare?
  ━━✫ Tagga qualcuno o rispondi a un messaggio
└──────────`,
insultBotLines: () => [
  `Oh no! Hai scoperto il mio punto debole: gli insulti! Come farò mai a riprendermi?`,
  `Ah, l'arte di insultare un bot. Un vero maestro dell'ironia sei!`,
  `Incredibile! Un essere umano che insulta un bot. Svolta epica!`,
  `Mi hai davvero ferito con la tua abilità di insultare un bot. Bravissimo!`,
  `La tua bravura nell'insultare un bot è la mia fonte di intrattenimento preferita.`,
  `Insulti un bot: grande intelligenza o grande noia?`,
  `La tua maestria negli insulti ai bot potrebbe fare scuola.`,
  `Sembri il Picasso degli insulti ai bot, un vero capolavoro.`,
  `Gli insulti ai bot sono il tuo talento nascosto. Carriera nel cabaret digitale in arrivo?`,
  `L'audacia di insultare un'entità senza emozioni. Premio per l'originalità!`
],
insultUserText: ({ target, line }) => `•

@${target} ${line}

· ୨• · · ୨• ·  ♡`,
friendNoTarget: ({ prefix, command }) => `┌──────────
  ━━✫ ⚠️ Tagga la persona a cui vuoi inviare la richiesta di amicizia
  ━━✫ Esempio: ${prefix}${command} @tag
└──────────`,
friendSelf: () => `┌──────────
  ━━✫ ❌ Non puoi aggiungere te stessə agli amici
└──────────`,
friendUserNotFound: () => `┌──────────
  ━━✫ 🚫 Persona non presente nel sistema
└──────────`,
friendAlready: ({ target }) => `✅ @${target} è già tra i tuoi amici.`,
friendPending: () => `⚠️ Una richiesta di amicizia è già in corso.\nAttendi una risposta o l'annullamento.`,
friendRequestText: ({ target, from }) => `👥 Richiesta di amicizia in corso...

@${target}, vuoi accettare l'amicizia di @${from}?

> ⏳ Hai 60 secondi per scegliere.`,
friendTimeout: ({ from, target }) => `⏳ Richiesta di amicizia annullata
> @${from} e @${target} non hanno risposto entro il tempo limite.`,
friendRejected: () => `❌ Richiesta di amicizia rifiutata.`,
friendAccepted: ({ from }) => `👥 Ora tu e @${from} siete amici!`,
removeFriendNoTarget: () => `⚠️ Tagga la persona che vuoi rimuovere dagli amici.`,
removeFriendNotInList: ({ target }) => `🚫 @${target} non è tra i tuoi amici.`,
removeFriendSuccess: ({ target }) => `🚫 Tu e @${target} non siete più amici.`,
friendsNoData: () => `┌──────────
  ━━✫ ⚠️ Nessun dato utente trovato
└──────────`,
friendsTitle: ({ name }) => `📜 Lista Amici di ${name}`,
friendsLastNone: () => `👤 Ultimo amico: Nessuno`,
friendsLastSome: ({ last }) => `👤 Ultimo amico: @${last}`,
friendsListHeader: () => `👥 Lista completa:`,
friendsListEmpty: () => `│   Nessuno, complimenti lupo solitario`,
friendsError: () => `❌ Si è verificato un errore durante l'esecuzione del comando.`,
lesbicaCalcNoTarget: ({ prefix, command }) => `┌──────────
  ━━✫ ⚠️ Devi menzionare qualcuno o rispondere a un messaggio
  ━━✫ Esempio: ${prefix + command} @utente
└──────────`,
lesbicaCalcLine1: ({ tag, percentage }) => `@${tag} è ${percentage}% lesbica, il resto è solo confusione ormonale.`,
lesbicaCalcLine2: ({ tag, percentage }) => `Test completato: @${tag} ha il cervello cablato per le donne al ${percentage}%.`,
lesbicaCalcLine3: ({ tag, percentage }) => `💕 @${tag} guarda le donne con l’intensità di ${percentage}% porno in 4K.`,
pajeroCalcLine1: ({ tag, percentage }) => `@${tag} è ${percentage}% pajero, il restante ${100 - percentage}% lo passa a cercare altri porno.`,
pajeroCalcLine2: ({ tag, percentage }) => `Referto medico: @${tag} è ${percentage}% schiavo del proprio pisello.`,
pajeroCalcLine3: ({ tag, percentage }) => `🍆 @${tag} pensa a segarsi il ${percentage}% del tempo, il resto lo passa a pulirsi.`,
puttanaCalcLine1: ({ tag, percentage }) => `@${tag} è ${percentage}% puttana, il tassametro non si spegne mai.`,
puttanaCalcLine2: ({ tag, percentage }) => `Analisi dettagliata: @${tag} ha il listino prezzi aperto al ${percentage}% 24/7.`,
puttanaCalcLine3: ({ tag, percentage }) => `💰 @${tag} ha lo sconto troia del ${percentage}%, affrettatevi prima che aumenti.`,
genericCalcLine: ({ tag, percentage, cmd }) => `@${tag} è ${percentage}% ${cmd}, il resto è solo vergogna accumulata.`,
downCalcNoTarget: ({ prefix, command }) => `┌──────────
  ━━✫ 🚨 TAGGA QUALCUNO, GENIO
  ━━✫ Esempio: ${prefix}${command} @nome
└──────────`,
downCalcLine: ({ name, cmd, percent, frase, verdict }) => `*⚡️ VERDETTO FINALE ⚡️*

*Soggetto:* ${name}
*Livello di "${cmd}":* ${percent}%

*Diagnosi:* ${frase}

*Prognosi:* ${verdict}`,
downCalcPhrases: () => [
  "È talmente inutile che persino il cestino del riciclo lo rifiuta.",
  "Se l'evoluzione funzionasse bene, tu saresti ancora una cellula singola nel fango.",
  "Hai la profondità emotiva di una pozzanghera e l’intelligenza di un sasso bagnato.",
  "Se il cervello bruciasse calorie, tu ingrasseresti anche mentre dormi.",
  "Quando parli, ogni neurone del pianeta fa un minuto di silenzio per rispetto.",
  "Se l'idiozia fosse energia rinnovabile, solo tu basteresti a illuminare l'Europa.",
  "Hai la stessa utilità di un ombrello bucato in un uragano.",
  "Se fossi un bug, neanche gli sviluppatori perderebbero tempo a fixarti.",
  "Il tuo contributo al mondo è paragonabile a quello di un mozzicone spento in una pozzanghera.",
  "Hai la coordinazione mentale di un piccione ubriaco in autostrada."
],
downCalcVerdicts: ({ percent }) => {
  if (percent > 90) return "🔴 CASO CLINICO IRRECUPERABILE. L'umanità chiede ufficialmente il rimborso.";
  if (percent > 70) return "🟠 PERICOLO BIOLOGICO. Vietato farlo riprodurre senza permesso scritto dell'OMS.";
  if (percent > 40) return "🟡 DIFETTO DI FABBRICA. Usare solo come esempio nei corsi di cosa NON diventare.";
  return "🟢 ANOMALIA STATISTICA. Forse un cervello c'è... da qualche parte, sotto tutto quel vuoto.";
},
alcolNoText: () => `┌──────────
  ━━✫ 🍷 Nessun nome specificato, userò il tuo
└──────────`,
alcolHigh: () => "🍾 Sei talmente pieno che anche il fegato ha chiesto il prepensionamento.",
alcolMid: () => "🥂 Bevi come se domani non esistesse, ma domani ti presenta il conto.",
alcolLow: () => "🚰 Totalmente sobrio, l’unica cosa che gira è la tua tristezza.",
alcolResult: ({ target, percent, phrase }) => `
${target} ha un tasso alcolemico del ${percent}%! 🍷

${phrase}`,
drugNoText: () => `┌──────────
  ━━✫ 🌿 Nessun nome specificato, userò il tuo
└──────────`,
drugHigh: () => "🌿 Talmente fatto che se respira forte intossica il quartiere.",
drugMid: () => "🌿 Non sa pippare, ma ci mette così impegno che finirà nei manuali medici.",
drugLow: () => "🌿 Un esempio da seguire… in questo gruppo è quasi una creatura mitologica.",
drugResult: ({ target, percent, phrase }) => `『💬』 ══ •⊰✰⊱• ══ 『💬』

MOMENTO DEL DRUG TEST! 🌿
━━━━━━━━━━━━━━
${target} ha un tasso di sostanze nel sangue del ${percent}%! 🌿
『💬』 ══ •⊰✰⊱• ══ 『💬』

${phrase}`,
raceCalcNoTarget: ({ prefix, command }) => `┌──────────
  ━━✫ ⚠️ Devi taggare qualcuno o rispondere a un messaggio
  ━━✫ Esempio: ${prefix + command} @utente
└──────────`,
raceCalcLine: ({ tag, percent, label }) => `•

@${tag} è ⚫ ${percent}% ${label}

· ୨• · · ୨• ·  ♡`,
cornutoNoTarget: () => `┌──────────
  ━━✫ 🤔 Manca il nome della cornuta/o
  ━━✫ Usa: .cornuto @nome o rispondi a un messaggio
└──────────`,
cornutoSpecialText: () => `🤣 *BHE, ECCO IL RE DELLE CORNA!* 🤣
Si dice che se si leva le corna ci fa l’antenna 5G📡💀`,
cornutoLow: () => "🛡 Tutto tranquillo... per ora. Ma tieni comunque d’occhio il telefono del partner.",
cornutoMid: () => "😬 Qualche chat archiviata di troppo… il sospetto è nell’aria.",
cornutoHigh: () => "👀 Cornometro in allerta massima! Le corna stanno caricando al 78%.",
cornutoMax: () => "🫣 LIVELLO MONDIALE: se apri Google Maps appare un triangolo di corna sulla tua testa.",
cornutoAdviceHigh: () => "🔔 Consiglio: non voltarti… potrebbero usarle come appiglio. 🤣",
cornutoAdviceLow: () => "😌 Respira, per ora sei nel limbo tra beato e futuro membro del club.",
cornutoResult: ({ target, percent, message, advice }) => `🔍 CALCOLATORE DI CORNUTEZZA 🔍

👤 ${target}
📈 Cornutezza: ${percent}%
${message}

${advice}`,
}