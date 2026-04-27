/* ============================================================
   ÁLBUM DE CUMPLEAÑOS — MARCO
   Main JavaScript Module
   ============================================================ */

(function () {
    'use strict';

    /* ======= CONFIG ======= */
    const API_URL = 'api.php';
    const LOVE_ICONS = ['❤️', '🌟', '✨', '💛', '🤗', '😊', '🎉', '💫', '🌻', '🥂'];
    const INITIAL_LOVE_REASONS = [
        ['Por tu sonrisa que ilumina cualquier día', '❤️'],
        ['Por tu paciencia infinita', '🌟'],
        ['Porque haces del mundo un lugar mejor', '✨']
    ];
    const INITIAL_MESSAGE = {
        author: 'La familia',
        text: 'Cada día a tu lado es un regalo. Gracias por ser el pilar de esta familia, por tus risas, tu fuerza y tu amor incondicional. ¡Feliz cumpleaños, Marco!'
    };

    /* Messages + reasons that float in the cover background */
    const COVER_BG_TEXTS = [
        '"Cada día a tu lado es un regalo"',
        '❤ Por tu sonrisa que ilumina cualquier día',
        '"Gracias por ser el pilar de esta familia"',
        '✨ Por tu paciencia infinita',
        '"La vida es mejor cuando se celebra contigo"',
        '❤ Porque haces del mundo un lugar mejor',
        '♥ Feliz Cumpleaños Marco',
        '"Por tus risas, tu fuerza y tu amor incondicional"',
        '✦ Un hombre extraordinario',
        '💛 Siempre en nuestro corazón',
        '"Tu amor es nuestro mayor tesoro"',
        '🌟 Por ser el mejor papá del mundo'
    ];

    let loveIconIndex = 0;
    let serverAvailable = false;

    /* ======= DOM REFS ======= */
    const $ = (sel) => document.querySelector(sel);
    const messageList = $('#messageList');
    const loveGrid = $('#loveGrid');

    /* ============================================================
       API — Comunicación con el servidor MySQL
       ============================================================ */
    async function apiRequest(action, method, body) {
        try {
            const opts = {
                method: method || 'GET',
                headers: { 'Content-Type': 'application/json' }
            };
            if (body) opts.body = JSON.stringify(body);

            const res = await fetch(`${API_URL}?action=${action}`, opts);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            return data;
        } catch (err) {
            console.warn('Error de API:', err.message);
            return null;
        }
    }

    /* ============================================================
       PARTICLES — golden dust on cover
       ============================================================ */
    function initParticles() {
        const canvas = $('#particles-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        const COUNT = 20;
        let animating = true;

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2 + .5,
                dx: (Math.random() - .5) * .3,
                dy: (Math.random() - .5) * .2 - .15,
                opacity: Math.random() * .4 + .1
            });
        }

        function draw() {
            if (!animating) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201,168,76,${p.opacity})`;
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
                if (p.x < -10) p.x = canvas.width + 10;
                if (p.x > canvas.width + 10) p.x = -10;
            });
            requestAnimationFrame(draw);
        }
        draw();

        const observer = new IntersectionObserver((entries) => {
            animating = entries[0].isIntersecting;
            if (animating) draw();
        }, { threshold: 0 });
        observer.observe(canvas);
    }

    /* ============================================================
       COVER BACKGROUND FLOATING MESSAGES
       ============================================================ */
    function initCoverMessages() {
        const container = $('#coverBgMessages');
        if (!container) return;

        const topZone = COVER_BG_TEXTS.slice(0, 6);
        const bottomZone = COVER_BG_TEXTS.slice(6);

        topZone.forEach((text, i) => {
            const el = document.createElement('span');
            el.classList.add('cover-bg-text');
            el.textContent = text;

            const top = 2 + (i / topZone.length) * 16;
            const left = -10 + Math.random() * 100;
            const size = 0.75 + Math.random() * 0.45;
            const opacity = 0.08 + Math.random() * 0.07;
            const duration = 20 + Math.random() * 20;
            const delay = i * 3;
            const driftX = (Math.random() - 0.5) * 60;
            const driftY = -15 + Math.random() * -30;
            const rotate = (Math.random() - 0.5) * 10;

            el.style.cssText = `
                top: ${top}%;
                left: ${left}%;
                font-size: ${size}rem;
                --float-opacity: ${opacity};
                --drift-x: ${driftX}px;
                --drift-y: ${driftY}px;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                transform: rotate(${rotate}deg);
            `;
            container.appendChild(el);
        });

        bottomZone.forEach((text, i) => {
            const el = document.createElement('span');
            el.classList.add('cover-bg-text');
            el.textContent = text;

            const top = 78 + (i / bottomZone.length) * 17;
            const left = -10 + Math.random() * 100;
            const size = 0.7 + Math.random() * 0.4;
            const opacity = 0.08 + Math.random() * 0.07;
            const duration = 22 + Math.random() * 18;
            const delay = 2 + i * 3.5;
            const driftX = (Math.random() - 0.5) * 60;
            const driftY = 15 + Math.random() * 30;
            const rotate = (Math.random() - 0.5) * 10;

            el.style.cssText = `
                top: ${top}%;
                left: ${left}%;
                font-size: ${size}rem;
                --float-opacity: ${opacity};
                --drift-x: ${driftX}px;
                --drift-y: ${driftY}px;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                transform: rotate(${rotate}deg);
            `;
            container.appendChild(el);
        });
    }

    /* ============================================================
       NAVIGATION — sticky nav on scroll
       ============================================================ */
    function initNav() {
        const nav = $('.nav');
        if (!nav) return;
        const threshold = window.innerHeight * 0.6;

        function check() {
            if (window.scrollY > threshold) {
                nav.classList.add('visible');
            } else {
                nav.classList.remove('visible');
            }
        }
        window.addEventListener('scroll', check, { passive: true });
        check();
    }

    /* ============================================================
       SCROLL REVEAL
       ============================================================ */
    function initReveal() {
        const els = document.querySelectorAll('.reveal');
        if (!els.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        els.forEach(el => observer.observe(el));
    }

    /* ============================================================
       LIGHTBOX
       ============================================================ */
    function openLightbox(src, caption) {
        const lb = $('#lightbox');
        if (!lb) return;
        lb.querySelector('img').src = src;
        const cap = lb.querySelector('.lightbox-caption');
        cap.textContent = caption || '';
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        const lb = $('#lightbox');
        if (!lb) return;
        lb.classList.remove('open');
        document.body.style.overflow = '';
    }

    function initLightbox() {
        const lb = $('#lightbox');
        if (!lb) return;
        lb.addEventListener('click', (e) => {
            if (e.target === lb || e.target.classList.contains('lightbox-close')) {
                closeLightbox();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    /* ============================================================
       TOAST NOTIFICATIONS
       ============================================================ */
    let toastTimeout = null;
    function showToast(message) {
        const toast = $('#toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
    }

    /* ============================================================
       MESSAGES / DEDICATORIAS
       ============================================================ */
    function formatDate() {
        const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
        const now = new Date();
        return `${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
    }

    function renderMessage(author, text, date) {
        const card = document.createElement('div');
        card.classList.add('message-card');
        card.innerHTML = `
            <p class="message-author">— ${escapeHTML(author)}</p>
            <p class="message-text">"${escapeHTML(text)}"</p>
            <p class="message-date">${date || formatDate()}</p>
        `;
        return card;
    }

    async function addMessage() {
        const authorEl = $('#msgAuthor');
        const textEl = $('#msgText');
        const author = authorEl.value.trim();
        const text = textEl.value.trim();
        if (!author || !text) {
            showToast('Completa todos los campos');
            return;
        }

        const btn = $('#btnAddMsg');
        btn.disabled = true;
        btn.textContent = '✦ Guardando...';

        if (serverAvailable) {
            const result = await apiRequest('add_message', 'POST', { author, text });
            if (result && result.success) {
                messageList.appendChild(renderMessage(
                    result.message.author,
                    result.message.text,
                    result.message.date
                ));
                authorEl.value = '';
                textEl.value = '';
                showToast('💌 ¡Dedicatoria guardada!');
            } else {
                showToast('❌ Error al guardar. Intenta de nuevo.');
            }
        } else {
            // Fallback sin servidor
            messageList.appendChild(renderMessage(author, text));
            authorEl.value = '';
            textEl.value = '';
            showToast('⚠️ Guardado solo localmente (sin conexión al servidor)');
        }

        btn.disabled = false;
        btn.textContent = '✦ Agregar dedicatoria';
    }

    /* ============================================================
       LOVE / POR QUÉ TE QUEREMOS
       ============================================================ */
    function renderLoveCard(text, icon) {
        const card = document.createElement('div');
        card.classList.add('love-card');
        card.innerHTML = `<span class="love-icon">${icon}</span><span class="love-text">${escapeHTML(text)}</span>`;
        return card;
    }

    async function addLove() {
        const input = $('#loveInput');
        const text = input.value.trim();
        if (!text) return;
        const icon = LOVE_ICONS[loveIconIndex % LOVE_ICONS.length];
        loveIconIndex++;

        if (serverAvailable) {
            const result = await apiRequest('add_love', 'POST', { text, icon });
            if (result && result.success) {
                loveGrid.appendChild(renderLoveCard(result.love.text, result.love.icon));
                input.value = '';
                showToast('♥ ¡Razón guardada!');
            } else {
                showToast('❌ Error al guardar. Intenta de nuevo.');
            }
        } else {
            loveGrid.appendChild(renderLoveCard(text, icon));
            input.value = '';
            showToast('⚠️ Guardado solo localmente');
        }
    }

    /* ============================================================
       SECURITY HELPER
       ============================================================ */
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function setupTrack(track, speedPx, durationVar) {
        if (!track) return;
        const slides = track.querySelectorAll('.carousel-slide');
        if (!slides.length) return;

        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            track.appendChild(clone);
        });

        const slideW = 324;
        const totalWidth = slides.length * slideW;
        const duration = totalWidth / speedPx;
        track.style.setProperty(durationVar, `${duration}s`);

        track.querySelectorAll('.carousel-slide').forEach(slide => {
            const img = slide.querySelector('img');
            if (img) {
                slide.addEventListener('click', () => openLightbox(img.src, img.alt));
            }
        });
    }

    function initCarousel() {
        setupTrack($('#carouselTrack'), 45, '--scroll-duration');
        setupTrack($('#carouselTrackReverse'), 38, '--scroll-duration-reverse');
    }

    /* ============================================================
       CARGAR DATOS DEL SERVIDOR
       ============================================================ */
    async function loadSavedData() {
        // Verificar si el servidor está disponible
        const ping = await apiRequest('ping', 'GET');

        if (ping && ping.success) {
            serverAvailable = true;
            console.log('✅ Servidor MySQL conectado');

            // Cargar todos los datos
            const data = await apiRequest('get_all', 'GET');
            if (data && data.success) {
                // Renderizar mensajes
                if (data.messages && data.messages.length > 0) {
                    data.messages.forEach(msg => {
                        messageList.appendChild(renderMessage(msg.author, msg.text, msg.date));
                    });
                }

                // Renderizar razones
                if (data.love && data.love.length > 0) {
                    data.love.forEach(item => {
                        loveGrid.appendChild(renderLoveCard(item.text, item.icon));
                    });
                    loveIconIndex = data.love.length;
                }
                return;
            }
        }

        // Fallback: datos estáticos si el servidor no está disponible
        console.warn('⚠️ Servidor no disponible, mostrando datos por defecto');
        serverAvailable = false;
        loadDefaults();
    }

    function loadDefaults() {
        messageList.appendChild(
            renderMessage(INITIAL_MESSAGE.author, INITIAL_MESSAGE.text, '26 de abril de 2026')
        );
        INITIAL_LOVE_REASONS.forEach(([text, icon]) => {
            loveGrid.appendChild(renderLoveCard(text, icon));
        });
        loveIconIndex = INITIAL_LOVE_REASONS.length;
    }

    /* ============================================================
       EXPOSE GLOBAL FUNCTIONS (for onclick handlers in HTML)
       ============================================================ */
    window.addMessage = addMessage;
    window.addLove = addLove;
    window.closeLightbox = closeLightbox;

    /* ============================================================
       INIT
       ============================================================ */
    async function init() {
        await loadSavedData();

        initParticles();
        initCoverMessages();
        initNav();
        initReveal();
        initLightbox();
        initCarousel();

        const loveInput = $('#loveInput');
        if (loveInput) {
            loveInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') addLove();
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
