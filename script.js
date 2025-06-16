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
        apiKey: 'AIzaSyBi-mg71pzAMIBA5UGpuNhZnrgGrELjQIE',
        channelId: 'UCvFbHvZgiXnyrjOqYHLyfug',
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
    initImageGallery(); // Adicionado para a galeria de imagens
    
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
                    <img src="qr-code-pix.jpeg" alt="QR Code PIX" class="qr-image">
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
    const body = `Olá!\n\nRealizei o pagamento via PIX para o curso "${title}" no valor de R$ ${price}.\n\nDados do curso:\n- Nome: ${title}\n- Valor: R$ ${price}\n- Data: ${new Date().toLocaleDateString('pt-BR')}\n\nSegue em anexo o comprovante de pagamento.\n\nAguardo o envio do e-book em PDF.\n\nAtenciosamente.`;

    const mailtoLink = `mailto:${CONFIG.PIX.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoLink, '_blank');
    
    showNotification('E-mail aberto! Anexe o comprovante e envie.', 'info');
    
    // Fechar modal após um tempo
    setTimeout(() => {
        document.getElementById('pixModal').style.display = 'none';
    }, 3000);
}

// ===== CARREGAR VÍDEOS DO YOUTUBE =====
async function loadYouTubeVideos() {
    const videosContainer = document.getElementById('videosContainer');
    const videoLoading = document.querySelector('.video-loading');

    // Clear existing content
    videosContainer.innerHTML = '';

    // Show loading message
    if (videoLoading) {
        videoLoading.style.display = 'block';
    }

    try {
        // Fetch channel uploads playlist ID
        const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CONFIG.YOUTUBE.channelId}&key=${CONFIG.YOUTUBE.apiKey}`);
        const channelData = await channelResponse.json();
        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

        // Fetch videos from the uploads playlist
        const playlistResponse = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${CONFIG.YOUTUBE.maxVideos}&key=${CONFIG.YOUTUBE.apiKey}`);
        const playlistData = await playlistResponse.json();
        const videos = playlistData.items;

        // Filter out the live stream if it's already displayed separately
        const filteredVideos = videos.filter(video => {
            // Assuming live stream is identified by a specific title or if it's currently live
            // This might need adjustment based on how the live stream is identified in the API response
            return !video.snippet.liveBroadcastContent || video.snippet.liveBroadcastContent === 'none';
        });

        // Create video cards for fetched videos
        filteredVideos.forEach(item => {
            const videoId = item.snippet.resourceId.videoId;
            const title = item.snippet.title;
            const thumbnailUrl = item.snippet.thumbnails.high.url;
            // You might need to fetch view count and publish date separately if not available in playlistItems
            // For simplicity, using dummy data for now or parsing from description if available
            const views = 'N/A'; // Placeholder
            const date = 'N/A'; // Placeholder

            const videoCard = createVideoCard({ id: videoId, title: title, thumbnail: thumbnailUrl, views: views, date: date });
            videosContainer.appendChild(videoCard);
        });

    } catch (error) {
        console.error('Erro ao carregar vídeos do YouTube:', error);
        showNotification('Erro ao carregar vídeos do YouTube. Tente novamente mais tarde.', 'error');
    } finally {
        // Hide loading message after attempt
        if (videoLoading) {
            videoLoading.style.display = 'none';
        }
    }
}

// ===== CRIAR CARD DE VÍDEO =====
function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
        <div class="video-thumbnail" onclick="openVideo('${video.id}')">
            <img src="${video.thumbnail}" alt="${video.title}" 
                 onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 300\"><rect fill=\"%23f0f0f0\" width=\"400\" height=\"300\"/><text x=\"50%\" y=\"50%\" text-anchor=\"middle\" fill=\"%23999\" font-size=\"16\">Vídeo Indisponível</text></svg>'">
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
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || '#17a2b8';
}

function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// ===== GALERIA DE IMAGENS (QUEM SOMOS) =====
function initImageGallery() {
    const galleryContainer = document.getElementById('imageGallery');
    if (!galleryContainer) return; // Exit if gallery container not found

    const images = [
        'galeria1.jpg',
        'galeria2.jpg',
        'galeria3.jpg',
        'galeria4.jpg',
        'galeria5.jpg'
    ];

    let currentIndex = 0;

    function renderGallery() {
        galleryContainer.innerHTML = ''; // Clear existing images
        images.forEach((src, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = src;
            imgElement.alt = `Imagem da Galeria ${index + 1}`;
            imgElement.classList.add('gallery-image');
            if (index === currentIndex) {
                imgElement.classList.add('active');
            }
            imgElement.addEventListener('click', () => openLightbox(src));
            galleryContainer.appendChild(imgElement);
        });
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        renderGallery();
    }

    // Automatic carousel
    setInterval(showNextImage, 5000); // Change image every 5 seconds

    // Lightbox functionality
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.classList.add('lightbox');
    lightbox.innerHTML = `
        <span class="close-lightbox">&times;</span>
        <img class="lightbox-content" id="lightboxImg">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightboxBtn = document.querySelector('.close-lightbox');

    closeLightboxBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

    function openLightbox(src) {
        lightbox.style.display = 'block';
        lightboxImg.src = src;
    }

    renderGallery(); // Initial render
}


