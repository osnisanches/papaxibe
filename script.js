// Script principal apenas para recursos PWA e UI

// Funcionalidade PWA para criar atalho
function initializePWA() {
    const pwaButton = document.getElementById('pwa-button');
    const pwaInstructions = document.getElementById('pwa-instructions');
    const pwaSection = document.getElementById('pwa-section');

    // Verifica se é um dispositivo móvel
    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Detecta o sistema operacional
    function detectOS() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        if (/android/i.test(userAgent)) {
            return 'android';
        }
        if (/iPad|iPhone|iPod/.test(userAgent)) {
            return 'ios';
        }
        return 'other';
    }

    // Mostra instruções específicas para cada OS
    function showPWAInstructions() {
        const os = detectOS();
        let instructionsHTML = '';

        if (os === 'android') {
            instructionsHTML = `
                <div class="pwa-steps">
                    <div class="pwa-step"><span class="step-icon">1️⃣</span> <strong>Toque no menu</strong> (três pontos ⋮) no canto superior direito</div>
                    <div class="pwa-step"><span class="step-icon">2️⃣</span> Selecione <strong>"Adicionar à tela inicial"</strong></div>
                    <div class="pwa-step"><span class="step-icon">3️⃣</span> Confirme tocando em <strong>"Adicionar"</strong></div>
                </div>
                <div class="pwa-note">O app será instalado como um atalho na sua tela inicial!</div>
            `;
        } else if (os === 'ios') {
            instructionsHTML = `
                <div class="pwa-steps">
                    <div class="pwa-step"><span class="step-icon">1️⃣</span> Toque no ícone de <strong>compartilhar</strong> (□ com ↑) na barra inferior</div>
                    <div class="pwa-step"><span class="step-icon">2️⃣</span> Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong></div>
                    <div class="pwa-step"><span class="step-icon">3️⃣</span> Toque em <strong>"Adicionar"</strong> no canto superior direito</div>
                </div>
                <div class="pwa-note">O ícone do app aparecerá na sua tela inicial!</div>
            `;
        } else {
            instructionsHTML = `
                <div class="no-mobile-message">
                    📱 Para criar um atalho, acesse este site pelo navegador <strong>Chrome no Android</strong> ou <strong>Safari no iPhone</strong>.
                </div>
            `;
        }

        pwaInstructions.innerHTML = instructionsHTML;
        pwaInstructions.style.display = 'block';

        // Scroll suave até as instruções
        pwaInstructions.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Event listener para o botão PWA
    if (pwaButton) {
        pwaButton.addEventListener('click', showPWAInstructions);
    }

    // Esconde a seção PWA em dispositivos não móveis (opcional)
    if (!isMobileDevice()) {
        pwaSection.style.display = 'none';
    }

    // Tenta usar a API de instalação PWA (para browsers mais modernos)
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        // Previne que o prompt apareça automaticamente
        e.preventDefault();
        deferredPrompt = e;
        
        // Atualiza o botão para usar a API nativa
        pwaButton.textContent = '📲 Instalar App';
        pwaButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    pwaInstructions.innerHTML = '<div class="pwa-note">🎉 App instalado com sucesso!</div>';
                    pwaInstructions.style.display = 'block';
                }
                deferredPrompt = null;
            } else {
                showPWAInstructions();
            }
        });
    });
}

// Inicializa a funcionalidade PWA quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o PWA
    initializePWA();
});
