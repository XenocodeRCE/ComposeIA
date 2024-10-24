chrome.runtime.onInstalled.addListener(() => {
  // Créer le menu parent "ComposeIA"
  chrome.contextMenus.create({
    id: "ComposeIA",
    title: "ComposeIA",
    contexts: ["selection"]
  });

  // Sous-menu pour "Améliorer le style"
  chrome.contextMenus.create({
    id: "improve-style",
    parentId: "ComposeIA",
    title: "🪄 Améliorer le style",
    contexts: ["selection"]
  });

  // Sous-menu pour "Corriger la grammaire et l'orthographe"
  chrome.contextMenus.create({
    id: "correct-grammar",
    parentId: "ComposeIA",
    title: "✍️ Corriger la grammaire et l'orthographe",
    contexts: ["selection"]
  });

  // Sous-menu pour "Traduire"
  chrome.contextMenus.create({
    id: "translate",
    parentId: "ComposeIA",
    title: "🌍 Traduire",
    contexts: ["selection"]
  });

  // Sous-menu pour "Traduire en Français"
  chrome.contextMenus.create({
    id: "translate-fr",
    parentId: "translate",
    title: "🇫🇷 Traduire en Français",
    contexts: ["selection"]
  });

  // Sous-menu pour "Traduire en Anglais"
  chrome.contextMenus.create({
    id: "translate-en",
    parentId: "translate",
    title: "🇬🇧 Traduire en Anglais",
    contexts: ["selection"]
  });

  // Sous-menu pour "Traduire en Allemand"
  chrome.contextMenus.create({
    id: "translate-de",
    parentId: "translate",
    title: "🇩🇪 Traduire en Allemand",
    contexts: ["selection"]
  });

  // Sous-menu pour "Rallonger"
  chrome.contextMenus.create({
    id: "expand-text",
    parentId: "ComposeIA",
    title: "➕ Rallonger le texte",
    contexts: ["selection"]
  });

  // Sous-menu pour "Raccourcir"
  chrome.contextMenus.create({
    id: "shorten-text",
    parentId: "ComposeIA",
    title: "➖ Raccourcir le texte",
    contexts: ["selection"]
  });

  // Sous-menu pour "Modifier le ton"
  chrome.contextMenus.create({
    id: "modify-tone",
    parentId: "ComposeIA",
    title: "🎭 Modifier le ton",
    contexts: ["selection"]
  });

  // Sous-menus pour les différents tons
  const tones = [
    { id: "tone-professional", title: "👔 Professionnel" },
    { id: "tone-informal", title: "😎 Informel" },
    { id: "tone-direct", title: "➡️ Simple et direct" },
    { id: "tone-assertive", title: "💪 Assertif" },
    { id: "tone-friendly", title: "😊 Amical" },
  ];

  tones.forEach(tone => {
    chrome.contextMenus.create({
      id: tone.id,
      parentId: "modify-tone",
      title: tone.title,
      contexts: ["selection"]
    });
  });

  // Sous-menu pour "Simplifier la formulation"
  chrome.contextMenus.create({
    id: "simplify-text",
    parentId: "ComposeIA",
    title: "🧹 Simplifier la formulation",
    contexts: ["selection"]
  });

  // Sous-menu pour "Expliquer"
  chrome.contextMenus.create({
    id: "explain-text",
    parentId: "ComposeIA",
    title: "💡 Expliquer",
    contexts: ["selection"]
  });
  
  // Sous-menu pour "Expliquer"
  chrome.contextMenus.create({
    id: "execute-text",
    parentId: "ComposeIA",
    title: "🎯 Executer une tâche",
    contexts: ["selection"]
  });
});

// Écouter les clics sur le menu contextuel
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "improve-style") {
    processSelectedText(info.selectionText, "améliorer", tab.id);
  } else if (info.menuItemId === "correct-grammar") {
    processSelectedText(info.selectionText, "corriger", tab.id);
  } else if (info.menuItemId === "translate-fr") {
    processSelectedText(info.selectionText, "traduire", tab.id, "fr");
  } else if (info.menuItemId === "translate-en") {
    processSelectedText(info.selectionText, "traduire", tab.id, "en");
  } else if (info.menuItemId === "translate-de") {
    processSelectedText(info.selectionText, "traduire", tab.id, "de");
  } else if (info.menuItemId === "expand-text") {
    processSelectedText(info.selectionText, "rallonger", tab.id);
  } else if (info.menuItemId === "shorten-text") {
    processSelectedText(info.selectionText, "raccourcir", tab.id);
  } else if (info.menuItemId.startsWith("tone")) {
    const tone = info.menuItemId.split("-")[1]; // Extraire le ton sélectionné
    processSelectedText(info.selectionText, "modifier-ton", tab.id, tone);
  } else if (info.menuItemId === "simplify-text") {
    processSelectedText(info.selectionText, "simplifier", tab.id);
  } else if (info.menuItemId === "explain-text") {
    processSelectedText(info.selectionText, "expliquer", tab.id);
  } else if (info.menuItemId === "execute-text") {
    processSelectedText(info.selectionText, "executer", tab.id);
  }
});

// Fonction pour traiter le texte sélectionné
function processSelectedText(text, action, tabId, extraInput = null) {
  let systemMessage = "";
  let userMessage = "";

  if (action === "améliorer") {
    systemMessage = "Vous êtes un assistant aidant un utilisateur à améliorer le style d'un texte. Sortez le résultat au format Markdown. N'incluez pas de liens. Ne copiez pas le contenu original littéralement. Utilisez ce format, en remplaçant le texte entre crochets par le résultat. N'incluez pas les crochets dans la sortie : Sortie en Français : [Texte avec le style amélioré, au format Markdown.]";
    userMessage = `Here is the text to improve: ${text}`;
  } else if (action === "corriger") {
    systemMessage = "Vous êtes un assistant aidant un utilisateur à corriger la grammaire et l'orthographe d'un texte. Sortez le résultat au format Markdown. N'incluez pas de liens. Ne copiez pas le contenu original littéralement. Utilisez ce format, en remplaçant le texte entre crochets par le résultat. N'incluez pas les crochets dans la sortie : Sortie en Français : [Texte avec la grammaire et l'orthographe corrigées, au format Markdown.]";
    userMessage = `Here is the text to correct: ${text}`;
  } else if (action === "traduire" && extraInput) {
    systemMessage = `Vous êtes un assistant aidant un utilisateur à traduire un texte de français à ${extraInput}. Sortez le résultat au format Markdown. N'incluez pas de liens. Ne copiez pas le contenu original littéralement. Utilisez ce format, en remplaçant le texte entre crochets par le résultat. N'incluez pas les crochets dans la sortie : Sortie en ${extraInput} : [Texte traduit en ${extraInput}, au format Markdown.]`;
    userMessage = `Here is the text to translate: ${text}`;
  } else if (action === "rallonger") {
    systemMessage = "Vous êtes un assistant aidant un utilisateur à rallonger un texte existant en ajoutant du contenu pertinent et informatif. Sortez le résultat au format Markdown. N'incluez pas de liens. Ne copiez pas le contenu original littéralement. Utilisez ce format, en remplaçant le texte entre crochets par le résultat. N'incluez pas les crochets dans la sortie : Sortie en Français : [Texte rallongé avec du contenu supplémentaire, au format Markdown.]";
    userMessage = `Please expand upon the following text: ${text}`;
  } else if (action === "raccourcir") {
    systemMessage = "Vous êtes un assistant aidant un utilisateur à raccourcir un texte en le condensant tout en conservant les informations essentielles. Sortez le résultat au format Markdown. N'incluez pas de liens. Ne copiez pas le contenu original littéralement. Utilisez ce format, en remplaçant le texte entre crochets par le résultat. N'incluez pas les crochets dans la sortie : Sortie en Français : [Texte raccourci et condensé, au format Markdown.]";
    userMessage = `Please shorten the following text: ${text}`;
  } else if (action === "modifier-ton" && extraInput) {
    systemMessage = `Vous êtes un assistant aidant un utilisateur à reformuler un texte avec un ton plus ${extraInput}. Sortez le résultat au format Markdown. N'incluez pas de liens. Ne copiez pas le contenu original littéralement. Utilisez ce format, en remplaçant le texte entre crochets par le résultat. N'incluez pas les crochets dans la sortie : Sortie en Français : [Texte reformulé avec un ton ${extraInput}, au format Markdown.].`;
    userMessage = `Please adjust the tone of the following text: ${text}`;
  } else if (action === "simplifier") {
    systemMessage = "Vous êtes un assistant aidant un utilisateur à simplifier la formulation d'un texte pour le rendre plus clair et compréhensible. Sortez le résultat au format Markdown. N'incluez pas de liens. Ne copiez pas le contenu original littéralement. Utilisez ce format, en remplaçant le texte entre crochets par le résultat. N'incluez pas les crochets dans la sortie : Sortie en Français : [Texte avec une formulation simplifiée, au format Markdown.]";
    userMessage = `Please simplify the following text: ${text}`;
  } else if (action === "expliquer") {
    systemMessage = "Vous êtes un assistant aidant un utilisateur à expliquer un texte de manière claire et détaillée. Sortez le résultat au format Markdown. N'incluez pas de liens. Ne copiez pas le contenu original littéralement, mais utilisez-le comme base pour l'explication. Utilisez ce format, en remplaçant le texte entre crochets par le résultat. N'incluez pas les crochets dans la sortie : Explication en Français : [Explication détaillée du texte, au format Markdown.]";
    userMessage = `Please explain the meaning of the following text: ${text}`;
  } else if (action === "executer") {
    systemMessage = "Vous êtes un assistant aidant un utilisateur à rédiger un texte. Sortez le résultat au format Markdown. N'incluez pas de liens. Ne copiez pas le contenu original littéralement, mais utilisez-le comme base pour l'explication. Utilisez ce format, en remplaçant le texte entre crochets par le résultat. N'incluez pas les crochets dans la sortie : Rédaction en Français : [Rédaction du texte, au format Markdown.]";
    userMessage = `${text}`;
  }

  // Appeler l'API Groq
  fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ------------------------------------------` // Remplace par ta clé API
    },
    body: JSON.stringify({
      "messages": [
        {
          "role": "system",
          "content": systemMessage
        },
        {
          "role": "user",
          "content": userMessage
        }
      ],
      "model": "mixtral-8x7b-32768",
      "temperature": 1,
      "max_tokens": 1024,
      "top_p": 1
    })
  })
    .then(response => response.json())
    .then(data => {
      const result = data.choices[0].message.content;

      // Injecter un script dans l'onglet actif pour remplacer le texte sélectionné par le résultat
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: replaceSelectedText,
        args: [result]
      });
    })
    .catch(error => {
      console.error("Erreur lors de l'appel à l'API Groq:", error);
    });
}

// Fonction injectée dans la page pour remplacer le texte sélectionné par le résultat
function replaceSelectedText(result) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  // Obtenir la plage sélectionnée
  const range = selection.getRangeAt(0);

  // Supprimer le contenu actuel de la sélection
  range.deleteContents();

  // Créer un nœud texte avec le nouveau contenu
  const newNode = document.createTextNode(result);

  // Insérer le nouveau contenu dans la plage
  range.insertNode(newNode);

  // Mettre à jour la sélection pour placer le curseur après le texte inséré
  selection.removeAllRanges();
  const newRange = document.createRange();
  newRange.setStartAfter(newNode);
  selection.addRange(newRange);
}