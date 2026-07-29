document.addEventListener('DOMContentLoaded', () => {
    // MD3 morphing shapes
    const container = document.createElement('div');
    container.id = 'bg-shapes';
    document.body.prepend(container);

    const NS = 'http://www.w3.org/2000/svg';

    function genPath(type, cx, cy) {
        const n = 120, step = Math.PI * 2 / n;
        let d = '';
        for (let i = 0; i < n; i++) {
            const a = i * step;
            let r;
            if (type === 'flower') {
                r = 44 + 4 * Math.cos(10 * a);
            } else if (type === 'blob') {
                const S = 40, R = 16;
                let oct = a % (Math.PI / 2);
                if (oct > Math.PI / 4) oct = Math.PI / 2 - oct;
                const bound = Math.atan2(S - R, S);
                if (oct <= bound) {
                    r = S / Math.cos(oct);
                } else {
                    const b = (S - R) * (Math.cos(oct) + Math.sin(oct));
                    const c = (S - R) * (S - R) - R * R;
                    r = b + Math.sqrt(b * b - c);
                }
            } else if (type === 'squircle') {
                const R = 42;
                const n = 4;
                r = R / Math.pow(Math.pow(Math.abs(Math.cos(a)), n) + Math.pow(Math.abs(Math.sin(a)), n), 1 / n);
            } else if (type === 'peanut') {
                const W = 48, H = 34, cx2 = W - H;
                let quad = a % Math.PI;
                if (quad > Math.PI / 2) quad = Math.PI - quad;
                const bound = Math.atan2(H, cx2);
                if (quad >= bound) {
                    r = H / Math.sin(quad);
                } else {
                    const b = cx2 * Math.cos(quad);
                    const c = cx2 * cx2 - H * H;
                    r = b + Math.sqrt(b * b - c);
                }
            }
            const x = cx + r * Math.cos(a);
            const y = cy + r * Math.sin(a);
            d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ',' + y.toFixed(2) + ' ';
        }
        return d + 'Z';
    }

    const pFlower = genPath('flower', 60, 60);
    const pBlob = genPath('blob', 60, 60);
    const pSquircle = genPath('squircle', 60, 60);
    const pPeanut = genPath('peanut', 60, 60);
    const animValues = [pFlower, pFlower, pBlob, pBlob, pSquircle, pSquircle, pPeanut, pPeanut, pFlower].join('; ');
    const keyTimes = '0; 0.12; 0.25; 0.37; 0.50; 0.62; 0.75; 0.87; 1';
    const hold = '0 0 1 1', morph = '0.2 0 0 1';
    const keySplines = [hold, morph, hold, morph, hold, morph, hold, morph].join('; ');
    const colors = ['rgba(126,87,194,0.08)', 'rgba(160,68,255,0.06)', 'rgba(179,157,219,0.07)', 'rgba(92,52,150,0.09)'];

    for (let i = 0; i < 8; i++) {
        const wrap = document.createElement('div');
        wrap.className = 'bg-md3-shape';
        wrap.style.left = Math.random() * 85 + '%';
        wrap.style.top = Math.random() * 85 + '%';
        wrap.style.animationDelay = (Math.random() * -6) + 's';

        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', '0 0 120 120');
        svg.classList.add('svg-canvas');

        const g = document.createElementNS(NS, 'g');
        g.classList.add('expressive-snap');
        g.style.animationDelay = (Math.random() * -6) + 's';

        const path = document.createElementNS(NS, 'path');
        path.setAttribute('fill', colors[i % colors.length]);
        path.setAttribute('d', pFlower);

        const anim = document.createElementNS(NS, 'animate');
        anim.setAttribute('attributeName', 'd');
        anim.setAttribute('dur', '6s');
        anim.setAttribute('repeatCount', 'indefinite');
        anim.setAttribute('calcMode', 'spline');
        anim.setAttribute('values', animValues);
        anim.setAttribute('keyTimes', keyTimes);
        anim.setAttribute('keySplines', keySplines);

        path.appendChild(anim);
        g.appendChild(path);
        svg.appendChild(g);
        wrap.appendChild(svg);
        container.appendChild(wrap);
    }

    const translations = {
        ru: {
            title: 'AR34 | Mаня-Сайт',
            greeting: 'Ку , я <span class="gradient-text">AR34!</span>',
            moreDetails: 'Подробнее тут',
            blogLabel: 'Мой блог',
            loadingTrack: 'Загрузка трека...',
            myStack: '> Мой Тех. Стек <',
            githubContributions: '> GitHub Contributions <',
            activeProjects: '> Активные Проекты <',
            exteraSubtitle: 'Matrix клиент',
            exteraDesc: 'FluffyChat fork на стероидах. E2EE, голосовые звонки, Material You, кастомные эмодзи и многое другое.',
            kangelPluginsSubtitle: 'Exteragram плагины',
            kangelPluginsDesc: 'Разработка плагинов для exteraGram (Python)',
            vpnServiceSubtitle: 'VPN Сервис',
            selfHostedProject: "> Мои селф-хост сервисы <",
            matrixHosted: "Матрикс сервер",
            searXNGHosted: "Удобный поисковик на базе SearXNG",
            vpnServiceDesc: 'Бесплатный VPN-сервис с поддержкой обхода белых списков.',
            footerQuote: '"Ведь я и есть тот самый интернет-ангел....\n        Которого вы проебали"',
            phrases: ['Python + JS Dev', 'Full stack enjoyer','Селф-хостед дурачок', 'Arch user', 'Напишу сюда.. например', 'Я рыгнул']
        },
        en: {
            title: 'AR34 | My Site',
            greeting: 'Hi, I\'m <span class="gradient-text">AR34!</span>',
            moreDetails: 'More details here',
            blogLabel: 'My blog',
            loadingTrack: 'Loading track...',
            myStack: '> My Stack <',
            githubContributions: '> GitHub Contributions <',
            activeProjects: '> Active Projects <',
            exteraSubtitle: 'Matrix Client',
            exteraDesc: 'FluffyChat fork on steroids. E2EE, voice calls, Material You, custom emotes and much more.',
            kangelPluginsSubtitle: 'Exteragram Plugins',
            kangelPluginsDesc: 'Development of a prototype plugins system for Exteragram (Python)',
            vpnServiceSubtitle: 'VPN Service',
            selfHostedProject: "> My self-hosted services <",
            matrixHosted: "Matrix Server",
            searXNGHosted: "Searxng instance",
            vpnServiceDesc: 'Free VPN service with support for VLESS and SS protocols. More actually in Russia',
            footerQuote: '"After all, I am that very internet angel....\n        That you messed up"',
            phrases: ['Python + JS Dev', 'Full stack enjoyer', 'Self-hosted fool XD','Arch user', 'Just writing here.. for example', 'SUKA BLYAT']
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
                } else {
                    el.textContent = t[key];
                }
            }
        });

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