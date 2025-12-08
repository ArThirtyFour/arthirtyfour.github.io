document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        ru: {
            title: 'AR34 | Mаня-Сайт',
            greeting: 'Ку , я <span class="gradient-text">AR34!</span>',
            moreDetails: 'Подробнее тут',
            loadingTrack: 'Загрузка трека...',
            myStack: '> Мой Тех. Стек <',
            githubContributions: '> GitHub Contributions <',
            activeProjects: '> Активные Проекты <',
            foxUserbotSubtitle: 'Telegram Userbot',
            foxUserbotDesc: 'FoxUSERBOT | Юзербот на тг построен на Kurigram (Pyrogram). Простая установка.',
            kangelPluginsSubtitle: 'Exteragram плагины',
            kangelPluginsDesc: 'Разработка плагинов для exteraGram (Python)',
            vpnServiceSubtitle: 'VPN Сервис',
            vpnServiceDesc: 'Бесплатный VPN-сервис с поддержкой обхода белых списков.',
            footerQuote: '"Ведь я и есть тот самый интернет-ангел....\n        Которого вы проебали"',
            phrases: ['Python + JS Dev', 'Full stack enjoyer', 'Arch user', 'Напишу сюда.. например', 'Я рыгнул']
        },
        en: {
            title: 'AR34 | My Site',
            greeting: 'Hi, I\'m <span class="gradient-text">AR34!</span>',
            moreDetails: 'More details here',
            loadingTrack: 'Loading track...',
            myStack: '> My Stack <',
            githubContributions: '> GitHub Contributions <',
            activeProjects: '> Active Projects <',
            foxUserbotSubtitle: 'Telegram Userbot',
            foxUserbotDesc: 'FoxUSERBOT | Telegram Userbot built with Kurigram (Pyrogram). Easy installation.',
            kangelPluginsSubtitle: 'Exteragram Plugins',
            kangelPluginsDesc: 'Development of a prototype plugins system for Exteragram (Python)',
            vpnServiceSubtitle: 'VPN Service',
            vpnServiceDesc: 'Free VPN service with support for VLESS and SS protocols. More actually in Russia',
            footerQuote: '"After all, I am that very internet angel....\n        That you messed up"',
            phrases: ['Python + JS Dev', 'Full stack enjoyer', 'Arch user', 'Just writing here.. for example', 'SUKA BLYAT']
        }
    };

  
    let currentLang = localStorage.getItem('language') || (navigator.language.startsWith('ru') ? 'ru' : 'en');

    const subtitleElement = document.getElementById('subtitle-text');
    let phrases = translations[currentLang].phrases;
    let phraseIndex = 0;
    const time_pause = 100; 
    const display_time = 1500;
    let isAnimating = false; 
    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        
        const t = translations[lang];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                if (el.tagName === 'TITLE') {
                    document.title = t[key];
                } else if (el.tagName === 'H1' || (el.tagName === 'P' && key === 'footerQuote')) {
                    el.innerHTML = t[key].replace(/\n/g, '<br>');
                } else if (el.tagName === 'SPAN' && el.parentElement && el.parentElement.classList.contains('btn')) {
                    const btn = el.parentElement;
                    const icon = btn.querySelector('img');
                    if (icon) {
                        btn.innerHTML = icon.outerHTML + ' ' + t[key];
                    } else {
                        el.textContent = t[key];
                    }
                } else {
                    el.textContent = t[key];
                }
            }
        });
        
        const detailsBtn = document.querySelector('.btn.details');
        if (detailsBtn && t.moreDetails) {
            const icon = detailsBtn.querySelector('img');
            if (icon) {
                detailsBtn.innerHTML = icon.outerHTML + ' ' + t.moreDetails;
            }
        }

        const langText = document.getElementById('lang-text');
        if (langText) {
            langText.textContent = lang.toUpperCase();
        }

        const footerMessage = document.getElementById('footer-message');
        if (footerMessage) {
            footerMessage.style.display = lang === 'ru' ? 'block' : 'none';
        }

        phrases = t.phrases;
        phraseIndex = 0;
    }

    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('click', () => {
            isAnimating = false;
            
            const newLang = currentLang === 'ru' ? 'en' : 'ru';
            applyLanguage(newLang);
            
            if (subtitleElement) {
                subtitleElement.innerHTML = '&nbsp;|';
                phraseIndex = 0;
                setTimeout(() => {
                    isAnimating = true;
                    nextPhrase();
                }, 100);
            }
        });
    }

    applyLanguage(currentLang);

    if (subtitleElement) {
        function typeAndErase(text, callback) {
            let charIndex = 0;
            let currentHtml = '';
            let isErasing = false;
            let currentTimer = null;

            function type() {
                if (!isAnimating) {
                    return;
                }
                
                if (!isErasing) {
                    if (charIndex < text.length) {
                        currentHtml = text.substring(0, charIndex + 1) + '|';
                        subtitleElement.innerHTML = currentHtml;
                        charIndex++;
                        currentTimer = setTimeout(type, time_pause);
                    } else {
                        subtitleElement.innerHTML = text;
                        isErasing = true;
                        currentTimer = setTimeout(type, display_time);
                    }
                } else {
                    if (charIndex > 0) {
                        charIndex--;
                        currentHtml = text.substring(0, charIndex) + '|';
                        subtitleElement.innerHTML = currentHtml;
                        currentTimer = setTimeout(type, time_pause);
                    } else {
                        subtitleElement.innerHTML = '&nbsp;|';
                        if (isAnimating) {
                            callback();
                        }
                    }
                }
            }
            type();
        }

        function nextPhrase() {
            if (!isAnimating) {
                return;
            }
            
            typeAndErase(phrases[phraseIndex], () => {
                if (!isAnimating) {
                    return;
                }
                
                phraseIndex++;
                if (phraseIndex >= phrases.length) {
                    phraseIndex = 0; 
                }
                setTimeout(() => {
                    if (isAnimating) {
                        nextPhrase();
                    }
                }, time_pause);
            });
        }


        isAnimating = true;
        setTimeout(nextPhrase, 800);
    }

    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }


        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                if (window.innerWidth <= 480) {
                    this.size = Math.random() * 3 + 1;
                } else {
                    this.size = Math.random() * 4 + 1;
                }
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                const palette = [
                    [209, 196, 233], // #d1c4e9
                    [179, 157, 219], // #b39ddb
                    [149, 117, 205], // #9575cd
                    [126, 87, 194]   // #7e57c2
                ];
                const [r, g, b] = palette[Math.floor(Math.random() * palette.length)];
                const alpha = Math.random() * 0.35 + 0.15; 
                this.color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                this.baseRGB = { r, g, b };
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                ctx.strokeStyle = `rgba(${this.baseRGB.r}, ${this.baseRGB.g}, ${this.baseRGB.b}, 0.25)`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size + 0.6, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
        }

        function initParticles() {
            particles = [];
            let numberOfParticles;
            
            if (window.innerWidth <= 480) {
                numberOfParticles = Math.floor(canvas.width / 15);
            } else if (window.innerWidth <= 768) {
                numberOfParticles = Math.floor(canvas.width / 18);
            } else {
                numberOfParticles = Math.floor(canvas.width / 20);
            }
            
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

           
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            drawConnections();
            requestAnimationFrame(animateParticles);
        }

        function drawConnections() {
            const maxDist = window.innerWidth <= 480 ? 80 : (window.innerWidth <= 768 ? 110 : 140);
            const maxDistSq = maxDist * maxDist;
            const base = { r: 149, g: 117, b: 205 }; 

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < maxDistSq) {
                        const t = 1 - distSq / maxDistSq; 
                        const alpha = 0.25 * t; 
                        ctx.strokeStyle = `rgba(${base.r}, ${base.g}, ${base.b}, ${alpha})`;
                        ctx.lineWidth = Math.max(0.4, 1.2 * t);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.restore();
        }


        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        resizeCanvas();
        initParticles();
        animateParticles();
    }
    


    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
}); 