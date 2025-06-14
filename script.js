// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
    // Configurações do PIX - ALTERE AQUI seus dados
    PIX: {
        chave: '85987748770', // Sua chave PIX
        beneficiario: 'Igreja Vida em Cristo',
        cidade: 'Fortaleza',
        email: 'harleyfoux@gmail.com' // Email para receber comprovantes

        
    },
    
    // Configurações do YouTube - ALTERE AQUI o canal
    YOUTUBE: {
        channelId: '@harleywagner',
        maxVideos: 6
    }
};

// ===== INICIALIZAÇÃO DO SITE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Site da Igreja Vida em Cristo carregado!');
    
    // Inicializar todas as funcionalidades
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initCourseButtons();
    initPixModal();
    loadYouTubeVideos();
    initScrollAnimations();
    initHeaderScroll();
    
    console.log('✅ Todas as funcionalidades inicializadas!');
});

// ===== HEADER COM SCROLL =====
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== MENU MOBILE =====
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== SCROLL SUAVE =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll suave para o hero scroll
    const heroScroll = document.querySelector('.hero-scroll');
    if (heroScroll) {
        heroScroll.addEventListener('click', function() {
            const aboutSection = document.querySelector('#sobre');
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = aboutSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }
}

// ===== FORMULÁRIO DE CONTATO =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');
        
        if (!name || !email || !message) {
            showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Por favor, insira um e-mail válido!', 'error');
            return;
        }
        
        // Simular envio
        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        form.reset();
    });
}

// ===== SISTEMA DE CURSOS COM PIX =====
function initCourseButtons() {
    const buyButtons = document.querySelectorAll('.course-buy-btn');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course');
            const price = this.getAttribute('data-price');
            const title = this.getAttribute('data-title');
            
            showPixPayment(courseId, price, title);
        });
    });
}

// ===== MODAL PIX =====
function initPixModal() {
    const modal = document.getElementById('pixModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// ===== EXIBIR PAGAMENTO PIX =====
function showPixPayment(courseId, price, title) {
    const modal = document.getElementById('pixModal');
    const pixContent = document.getElementById('pixContent');
    
    const pixCode = generatePixCode(price);
    
    pixContent.innerHTML = `
        <div class="pix-payment">
            <div class="course-info">
                <h3>${title}</h3>
                <div class="price-display">R$ ${price}</div>
                <p>E-book em PDF de alta qualidade</p>
            </div>
            
            <div class="payment-methods">
                <h4><i class="fas fa-qrcode"></i> Opção 1: QR Code PIX</h4>
                <div class="qr-container">
                    <img src="qr-code-pix.png" alt="QR Code PIX" class="qr-image">
                    <p class="qr-instruction">Escaneie o QR Code com o app do seu banco</p>
                </div>
                
                <div class="divider">
                    <span>OU</span>
                </div>
                
                <h4><i class="fas fa-key"></i> Opção 2: Chave PIX</h4>
                <div class="pix-key-container">
                    <div class="pix-key-info">
                        <label>Chave PIX:</label>
                        <div class="key-display">
                            <input type="text" value="${CONFIG.PIX.chave}" readonly id="pixKeyInput">
                            <button onclick="copyPixKey()" class="copy-btn">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                    <div class="pix-details">
                        <p><strong>Beneficiário:</strong> ${CONFIG.PIX.beneficiario}</p>
                        <p><strong>Valor:</strong> R$ ${price}</p>
                    </div>
                </div>
            </div>
            
            <div class="payment-instructions">
                <h4><i class="fas fa-info-circle"></i> Como receber seu e-book:</h4>
                <ol>
                    <li>Realize o pagamento via PIX usando uma das opções acima</li>
                    <li>Clique no botão abaixo para enviar o comprovante por e-mail</li>
                    <li>Aguarde a confirmação do pagamento (até 2 horas úteis)</li>
                    <li>Receba seu e-book em PDF diretamente no seu e-mail</li>
                </ol>
            </div>
            
            <div class="send-receipt">
                <button onclick="sendReceipt('${courseId}', '${title}', '${price}')" class="btn btn-primary send-receipt-btn">
                    <i class="fas fa-envelope"></i>
                    Enviar Comprovante por E-mail
                </button>
                <p class="receipt-note">
                    <i class="fas fa-shield-alt"></i>
                    Seus dados estão seguros. Enviaremos o e-book após a confirmação do pagamento.
                </p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// ===== GERAR CÓDIGO PIX =====
function generatePixCode(price) {
    // Código PIX simulado - em produção, use uma API real
    const timestamp = Date.now();
    return `00020126580014BR.GOV.BCB.PIX0136${CONFIG.PIX.chave}0208${CONFIG.PIX.beneficiario}520400005303986540${price}5802BR5925${CONFIG.PIX.beneficiario}6009${CONFIG.PIX.cidade}62070503***6304${timestamp}`;
}

// ===== COPIAR CHAVE PIX =====
function copyPixKey() {
    const input = document.getElementById('pixKeyInput');
    input.select();
    input.setSelectionRange(0, 99999); // Para mobile
    
    try {
        document.execCommand('copy');
        showNotification('Chave PIX copiada com sucesso!', 'success');
    } catch (err) {
        showNotification('Erro ao copiar. Tente selecionar e copiar manualmente.', 'error');
    }
}

// ===== ENVIAR COMPROVANTE POR EMAIL =====
function sendReceipt(courseId, title, price) {
    const subject = `Comprovante de Pagamento - ${title}`;
    const body = `Olá!

Realizei o pagamento via PIX para o curso "${title}" no valor de R$ ${price}.

Dados do curso:
- Nome: ${title}
- Valor: R$ ${price}
- Data: ${new Date().toLocaleDateString('pt-BR')}

Segue em anexo o comprovante de pagamento.

Aguardo o envio do e-book em PDF.

Atenciosamente.`;

    const mailtoLink = `mailto:${CONFIG.PIX.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoLink, '_blank');
    
    showNotification('E-mail aberto! Anexe o comprovante e envie.', 'info');
    
    // Fechar modal após um tempo
    setTimeout(() => {
        document.getElementById('pixModal').style.display = 'none';
    }, 3000);
}

// ===== CARREGAR VÍDEOS DO YOUTUBE =====
function loadYouTubeVideos() {
    const videosContainer = document.getElementById('videosContainer');
    
    // Vídeos simulados do canal - em produção, use a API do YouTube
    const videos = [
        {
            id: 'dQw4w9WgXcQ',
            title: 'Mensagem de Fé e Esperança - Transformando Vidas',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            views: '1.2K visualizações',
            date: 'há 2 dias'
        },
        {
            id: 'dQw4w9WgXcQ',
            title: 'O Poder da Oração na Vida do Jovem Cristão',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            views: '856 visualizações',
            date: 'há 5 dias'
        },
        {
            id: 'dQw4w9WgXcQ',
            title: 'Vida Cristã Vitoriosa - Superando Desafios',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            views: '2.1K visualizações',
            date: 'há 1 semana'
        },
        {
            id: 'dQw4w9WgXcQ',
            title: 'Comunhão e Amor Fraternal na Igreja',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            views: '743 visualizações',
            date: 'há 1 semana'
        },
        {
            id: 'dQw4w9WgXcQ',
            title: 'Propósito de Deus Para Sua Vida',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            views: '1.8K visualizações',
            date: 'há 2 semanas'
        },
        {
            id: 'dQw4w9WgXcQ',
            title: 'Adoração e Louvor - Conectando com Deus',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            views: '1.5K visualizações',
            date: 'há 3 semanas'
        }
    ];
    
    // Limpar container
    videosContainer.innerHTML = '';
    
    // Criar cards de vídeo
    videos.forEach(video => {
        const videoCard = createVideoCard(video);
        videosContainer.appendChild(videoCard);
    });
}

// ===== CRIAR CARD DE VÍDEO =====
function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
        <div class="video-thumbnail" onclick="openVideo('${video.id}')">
            <img src="${video.thumbnail}" alt="${video.title}" 
                 onerror="this.src='data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 400 300\\"><rect fill=\\"%23f0f0f0\\" width=\\"400\\" height=\\"300\\"/><text x=\\"50%\\" y=\\"50%\\" text-anchor=\\"middle\\" fill=\\"%23999\\" font-size=\\"16\\">Vídeo Indisponível</text></svg>'">
            <div class="play-button">
                <i class="fas fa-play"></i>
            </div>
        </div>
        <div class="video-info">
            <h4>${video.title}</h4>
            <div class="video-meta">${video.views} • ${video.date}</div>
        </div>
    `;
    return card;
}

// ===== ABRIR VÍDEO =====
function openVideo(videoId) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(url, '_blank');
}

// ===== ANIMAÇÕES DE SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Elementos para animar
    const animatedElements = document.querySelectorAll('.course-card, .contact-item, .about-item, .stat-item, .video-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    // Remover automaticamente
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== UTILITÁRIOS =====
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#6366f1'
    };
    return colors[type] || '#6366f1';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== ESTILOS ADICIONAIS VIA JAVASCRIPT =====
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .pix-payment {
        text-align: center;
        max-width: 500px;
        margin: 0 auto;
    }
    
    .course-info {
        margin-bottom: 30px;
        padding: 25px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        border-radius: 16px;
        color: white;
    }
    
    .course-info h3 {
        margin-bottom: 10px;
        font-size: 1.4rem;
    }
    
    .price-display {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 8px;
    }
    
    .payment-methods h4 {
        color: #1f2937;
        margin: 25px 0 15px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.1rem;
    }
    
    .qr-container {
        margin-bottom: 25px;
    }
    
    .qr-image {
        width: 200px;
        height: 200px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        margin-bottom: 10px;
    }
    
    .qr-instruction {
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    .divider {
        margin: 25px 0;
        position: relative;
        text-align: center;
    }
    
    .divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: #e5e7eb;
    }
    
    .divider span {
        background: white;
        padding: 0 15px;
        color: #9ca3af;
        font-weight: 500;
    }
    
    .pix-key-container {
        background: #f8fafc;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 25px;
    }
    
    .pix-key-info {
        margin-bottom: 15px;
    }
    
    .pix-key-info label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #374151;
    }
    
    .key-display {
        display: flex;
        gap: 8px;
    }
    
    .key-display input {
        flex: 1;
        padding: 12px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-family: monospace;
        font-size: 14px;
        background: white;
    }
    
    .copy-btn {
        padding: 12px 16px;
        background: #6366f1;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .copy-btn:hover {
        background: #5b5bd6;
    }
    
    .pix-details {
        text-align: left;
    }
    
    .pix-details p {
        margin-bottom: 5px;
        color: #4b5563;
        font-size: 0.9rem;
    }
    
    .payment-instructions {
        background: #f0f9ff;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 25px;
        text-align: left;
    }
    
    .payment-instructions h4 {
        color: #0369a1;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .payment-instructions ol {
        padding-left: 20px;
        color: #374151;
    }
    
    .payment-instructions li {
        margin-bottom: 8px;
        line-height: 1.5;
    }
    
    .send-receipt {
        text-align: center;
    }
    
    .send-receipt-btn {
        width: 100%;
        padding: 16px;
        font-size: 1.1rem;
        margin-bottom: 15px;
    }
    
    .receipt-note {
        color: #6b7280;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    
    .receipt-note i {
        color: #10b981;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 4px;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;

document.head.appendChild(additionalStyles);

console.log('🎯 Sistema PIX e YouTube configurado!');
console.log('📧 Email para comprovantes:', CONFIG.PIX.email);
console.log('🔑 Chave PIX:', CONFIG.PIX.chave);

