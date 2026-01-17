// ==================================================
// SELETOR DE IDIOMAS COM GOOGLE TRANSLATE
// ==================================================

// Idiomas suportados
const languages = [
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
];

// Idioma atual (padrão: português)
let currentLanguage = localStorage.getItem('selectedLanguage') || 'pt';

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    createLanguageSelector();
    initGoogleTranslate();
    setTimeout(detectAndSuggestLanguage, 2000);
});

// Criar o seletor de idiomas na navbar
function createLanguageSelector() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Encontrar idioma atual
    const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

    // Criar HTML do seletor
    const selectorHTML = `
        <div class="language-selector" id="language-selector">
            <button class="language-btn" onclick="toggleLanguageDropdown(event)">
                <span class="flag">${currentLang.flag}</span>
                <span class="lang-code">${currentLang.code.toUpperCase()}</span>
                <span class="arrow">▼</span>
            </button>
            <div class="language-dropdown">
                ${languages.map(lang => `
                    <div class="language-option ${lang.code === currentLanguage ? 'active' : ''}" 
                         onclick="changeLanguage('${lang.code}')">
                        <span class="flag">${lang.flag}</span>
                        <span class="lang-name">${lang.name}</span>
                        <span class="check">✓</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Inserir antes do botão CTA ou no final da navbar
    const ctaBtn = navbar.querySelector('.cta-btn-nav');
    if (ctaBtn) {
        ctaBtn.insertAdjacentHTML('beforebegin', selectorHTML);
    } else {
        navbar.insertAdjacentHTML('beforeend', selectorHTML);
    }

    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function(e) {
        const selector = document.getElementById('language-selector');
        if (selector && !selector.contains(e.target)) {
            selector.classList.remove('open');
        }
    });
}

// Toggle dropdown
function toggleLanguageDropdown(event) {
    event.stopPropagation();
    const selector = document.getElementById('language-selector');
    if (selector) {
        selector.classList.toggle('open');
    }
}

// Mudar idioma
function changeLanguage(langCode) {
    currentLanguage = langCode;
    localStorage.setItem('selectedLanguage', langCode);

    // Atualizar UI do seletor
    const currentLang = languages.find(l => l.code === langCode);
    const btn = document.querySelector('.language-btn');
    if (btn && currentLang) {
        btn.querySelector('.flag').textContent = currentLang.flag;
        btn.querySelector('.lang-code').textContent = currentLang.code.toUpperCase();
    }

    // Atualizar opções ativas
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`.language-option[onclick="changeLanguage('${langCode}')"]`)?.classList.add('active');

    // Fechar dropdown
    document.getElementById('language-selector')?.classList.remove('open');

    // Aplicar tradução
    if (langCode === 'pt') {
        // Voltar ao original (remover tradução)
        resetToOriginal();
    } else {
        // Traduzir para o idioma selecionado
        translatePage(langCode);
    }
}

// Inicializar Google Translate (escondido)
function initGoogleTranslate() {
    // Adicionar elemento necessário para o Google Translate
    const translateDiv = document.createElement('div');
    translateDiv.id = 'google_translate_element';
    translateDiv.style.display = 'none';
    document.body.appendChild(translateDiv);

    // Carregar script do Google Translate
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);

    // Se já havia um idioma selecionado diferente de PT, aplicar
    if (currentLanguage !== 'pt') {
        // Esperar o Google Translate carregar
        const checkTranslate = setInterval(() => {
            if (typeof google !== 'undefined' && google.translate) {
                clearInterval(checkTranslate);
                setTimeout(() => translatePage(currentLanguage), 1000);
            }
        }, 100);
    }
}

// Callback do Google Translate
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'pt',
        includedLanguages: 'pt,en,es,fr,de,it',
        autoDisplay: false
    }, 'google_translate_element');
}

// Traduzir página
function translatePage(langCode) {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
    } else {
        // Se o seletor não existir ainda, tentar novamente
        setTimeout(() => translatePage(langCode), 500);
    }
}

// Voltar ao idioma original
function resetToOriginal() {
    // Método 1: Usar o seletor do Google Translate
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = 'pt';
        select.dispatchEvent(new Event('change'));
    }

    // Método 2: Limpar cookies de tradução
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname;
    
    // Método 3: Recarregar página se necessário
    const translated = document.querySelector('.translated-ltr, .translated-rtl');
    if (translated) {
        window.location.reload();
    }
}

// Detectar idioma do navegador e sugerir tradução
function detectAndSuggestLanguage() {
    const browserLang = navigator.language.split('-')[0];
    const savedLang = localStorage.getItem('selectedLanguage');
    const hasSeenPrompt = localStorage.getItem('languagePromptSeen');

    // Se já tem preferência guardada ou já viu o prompt, não mostrar
    if (savedLang || hasSeenPrompt) return;

    // Se o idioma do browser não é português e está na nossa lista
    const matchedLang = languages.find(l => l.code === browserLang && l.code !== 'pt');
    
    if (matchedLang) {
        showLanguagePrompt(matchedLang);
    }
}

// Mostrar prompt de sugestão de idioma
function showLanguagePrompt(suggestedLang) {
    const promptHTML = `
        <div class="language-prompt" id="language-prompt">
            <div class="language-prompt-content">
                <span class="prompt-flag">${suggestedLang.flag}</span>
                <div class="prompt-text">
                    <p class="prompt-title">Translate to ${suggestedLang.name}?</p>
                    <p class="prompt-subtitle">We detected your browser language</p>
                </div>
                <div class="prompt-buttons">
                    <button class="prompt-btn-yes" onclick="acceptLanguageSuggestion('${suggestedLang.code}')">Yes</button>
                    <button class="prompt-btn-no" onclick="dismissLanguagePrompt()">No</button>
                </div>
                <button class="prompt-close" onclick="dismissLanguagePrompt()">×</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', promptHTML);

    // Animar entrada
    setTimeout(() => {
        document.getElementById('language-prompt')?.classList.add('show');
    }, 100);
}

// Aceitar sugestão de idioma
function acceptLanguageSuggestion(langCode) {
    localStorage.setItem('languagePromptSeen', 'true');
    changeLanguage(langCode);
    dismissLanguagePrompt();
}

// Fechar prompt
function dismissLanguagePrompt() {
    localStorage.setItem('languagePromptSeen', 'true');
    const prompt = document.getElementById('language-prompt');
    if (prompt) {
        prompt.classList.remove('show');
        setTimeout(() => prompt.remove(), 300);
    }
}