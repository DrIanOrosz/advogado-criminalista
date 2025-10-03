// JavaScript para Landing Page Dr. Ian Orosz - Advogado Criminalista

// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    
    // Menu Mobile Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Anima as linhas do hambúrguer
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
    }

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight + document.querySelector('.urgency-24h').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fecha menu mobile se aberto
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const spans = mobileMenuToggle.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = 'none';
                        span.style.opacity = '1';
                    });
                }
            }
        });
    });

    // Efeito de scroll no header
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (header) {
            // Muda opacidade do header conforme scroll
            if (scrollTop > 100) {
                header.style.background = 'rgba(10, 17, 61, 0.98)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'var(--primary-blue)';
                header.style.backdropFilter = 'none';
            }
        }
        
        lastScrollTop = scrollTop;
    });

    // Animação de fade-in ao scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const elementsToAnimate = document.querySelectorAll('.expertise-card, .testimonial, .contact-method, .achievement');
    elementsToAnimate.forEach(el => {
        // Estado inicial dos elementos
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });

    // Contador animado para estatísticas (se houver números)
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    // Ativar contador quando a seção de stats aparecer
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));
                    if (number > 0) {
                        animateCounter(stat, number);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    // Validação de formulário (caso seja adicionado no futuro)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/\s/g, ''));
    }

    // Tracking de eventos para analytics (Google Analytics, Facebook Pixel, etc.)
    function trackEvent(action, label = '') {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'engagement',
                event_label: label
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', action);
        }

        console.log(`Evento rastreado: ${action} - ${label}`);
    }

    // Rastrear cliques nos CTAs
    document.querySelectorAll('.cta-primary, .cta-urgent, .whatsapp-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            trackEvent('click_cta', buttonText);
        });
    });

    // Rastrear tempo na página
    let timeOnPage = 0;
    const timeInterval = setInterval(() => {
        timeOnPage += 10;
        
        // Rastrear marcos de tempo
        if (timeOnPage === 30) trackEvent('time_on_page', '30_seconds');
        if (timeOnPage === 60) trackEvent('time_on_page', '1_minute');
        if (timeOnPage === 120) trackEvent('time_on_page', '2_minutes');
        if (timeOnPage === 300) trackEvent('time_on_page', '5_minutes');
        
    }, 10000); // A cada 10 segundos

    // Limpar interval quando sair da página
    window.addEventListener('beforeunload', () => {
        clearInterval(timeInterval);
        trackEvent('page_exit', `${timeOnPage}_seconds`);
    });

    // Rastrear scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            // Rastrear marcos de scroll
            if (maxScroll >= 25 && maxScroll < 50) {
                trackEvent('scroll_depth', '25_percent');
            } else if (maxScroll >= 50 && maxScroll < 75) {
                trackEvent('scroll_depth', '50_percent');
            } else if (maxScroll >= 75 && maxScroll < 90) {
                trackEvent('scroll_depth', '75_percent');
            } else if (maxScroll >= 90) {
                trackEvent('scroll_depth', '90_percent');
            }
        }
    });

    // Lazy loading de imagens (se necessário)
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Inicializar lazy loading
    lazyLoadImages();

    // Prevenção de spam em formulários (caso seja adicionado)
    let lastSubmission = 0;
    function preventSpam() {
        const now = Date.now();
        if (now - lastSubmission < 5000) { // 5 segundos
            return false;
        }
        lastSubmission = now;
        return true;
    }

    // Utilitário para mostrar mensagens de feedback
    function showMessage(message, type = 'info', duration = 5000) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, duration);
    }

    // Inicialização de plugins externos (se necessário)
    function initExternalPlugins() {
        // Google Analytics
        if (window.GA_MEASUREMENT_ID) {
            // Código do GA já estará no HTML
        }

        // Facebook Pixel
        if (window.FB_PIXEL_ID) {
            // Código do FB Pixel já estará no HTML
        }

        // Outros plugins...
    }

    // Verificar se há parâmetros UTM na URL
    function checkUTMParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');

        if (utmSource || utmMedium || utmCampaign) {
            trackEvent('utm_visit', `${utmSource}-${utmMedium}-${utmCampaign}`);
        }
    }

    // Inicializar funções
    initExternalPlugins();
    checkUTMParameters();

    console.log('Landing Page Dr. Ian Orosz - JavaScript carregado com sucesso!');
});