document.addEventListener('DOMContentLoaded', () => {
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
            if (type === 'flower8') {
                r = 44 + 6 * Math.cos(8 * a);
            } else if (type === 'flower12') {
                r = 44 + 5 * Math.cos(12 * a);
            } else if (type === 'clover4') {
                r = 43 + 7 * Math.cos(4 * a);
            } else if (type === 'squircle') {
                const R = 44, m = 4;
                r = R / Math.pow(Math.pow(Math.abs(Math.cos(a)), m) + Math.pow(Math.abs(Math.sin(a)), m), 1 / m);
            } else if (type === 'star4') {
                const R = 42, m = 1.6;
                r = R / Math.pow(Math.pow(Math.abs(Math.cos(a)), m) + Math.pow(Math.abs(Math.sin(a)), m), 1 / m);
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

    const pFlower8 = genPath('flower8', 60, 60);
    const pClover4 = genPath('clover4', 60, 60);
    const pSquircle = genPath('squircle', 60, 60);
    const pFlower12 = genPath('flower12', 60, 60);
    const pStar4 = genPath('star4', 60, 60);
    const pPeanut = genPath('peanut', 60, 60);

    const animValues = [pFlower8, pClover4, pSquircle, pFlower12, pStar4, pPeanut, pFlower8].join('; ');
    const keyTimes = '0; 0.16; 0.33; 0.50; 0.66; 0.83; 1';
    const smoothSpline = '0.2 0 0 1';
    const keySplines = [smoothSpline, smoothSpline, smoothSpline, smoothSpline, smoothSpline, smoothSpline].join('; ');

    const colors = [
        'rgba(208, 188, 255, 0.05)',
        'rgba(204, 194, 220, 0.04)',
        'rgba(239, 184, 200, 0.04)',
        'rgba(126, 87, 194, 0.06)',
        'rgba(79, 55, 139, 0.07)'
    ];

    const shapeConfigs = [
        { size: 260, x: '5%', y: '8%', delay: 0 },
        { size: 180, x: '82%', y: '12%', delay: -4 },
        { size: 220, x: '75%', y: '45%', delay: -9 },
        { size: 280, x: '3%', y: '58%', delay: -14 },
        { size: 190, x: '85%', y: '80%', delay: -18 },
        { size: 240, x: '45%', y: '88%', delay: -7 },
        { size: 170, x: '48%', y: '2%', delay: -12 }
    ];

    shapeConfigs.forEach((cfg, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'bg-md3-shape';
        wrap.style.width = cfg.size + 'px';
        wrap.style.height = cfg.size + 'px';
        wrap.style.left = cfg.x;
        wrap.style.top = cfg.y;
        wrap.style.animationDelay = (cfg.delay * 1.5) + 's';

        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', '0 0 120 120');
        svg.classList.add('svg-canvas');

        const g = document.createElementNS(NS, 'g');
        g.classList.add('expressive-snap');
        g.style.animationDuration = (35 + i * 8) + 's';
        g.style.animationDelay = (cfg.delay * 2) + 's';

        const path = document.createElementNS(NS, 'path');
        path.setAttribute('fill', colors[i % colors.length]);
        path.setAttribute('d', pFlower8);

        const anim = document.createElementNS(NS, 'animate');
        anim.setAttribute('attributeName', 'd');
        anim.setAttribute('dur', (18 + (i % 3) * 4) + 's');
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
    });

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
            gitHosted: "Собственный Git сервер",
            vpnServiceDesc: 'Бесплатный VPN-сервис с поддержкой обхода белых списков.',
            nowPlayingLive: 'СЕЙЧАС ИГРАЕТ',
            nowPlayingLast: 'ПОСЛЕДНИЙ ТРЕК',
            streamingLabel: 'ПОТОК',
            scrobbledLabel: 'ПРОСЛУШАНО',
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
            gitHosted: "Self-hosted Git Server",
            vpnServiceDesc: 'Free VPN service with support for VLESS and SS protocols. More actually in Russia',
            nowPlayingLive: 'NOW PLAYING',
            nowPlayingLast: 'LAST PLAYED',
            streamingLabel: 'STREAMING',
            scrobbledLabel: 'SCROBBLED',
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

        if (typeof window.nowPlaying === 'function') {
            window.nowPlaying();
        }
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

    async function loadGitHubGraph() {
        const graphContainer = document.getElementById('github-graph');
        if (!graphContainer) return;

        try {
            const response = await fetch('https://github-contributions-api.jogruber.de/v4/ArThirtyFour?y=last');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const days = data.contributions;
            if (!days || days.length === 0) throw new Error('No contribution data');

            const total = data.total?.lastYear ?? days.reduce((acc, d) => acc + d.count, 0);

            const weeks = [];
            let currentWeek = [];
            days.forEach((day, index) => {
                currentWeek.push(day);
                if (currentWeek.length === 7 || index === days.length - 1) {
                    weeks.push(currentWeek);
                    currentWeek = [];
                }
            });

            const colors = {
                0: '#2B2930',
                1: '#4F378B',
                2: '#7E57C2',
                3: '#B39DDB',
                4: '#D0BCFF'
            };

            const cellW = 10;
            const cellGap = 3;
            const step = cellW + cellGap;
            const totalW = weeks.length * step + 30;
            const totalH = 7 * step + 35;

            let monthLabels = '';
            let lastMonth = -1;
            weeks.forEach((week, wIdx) => {
                const firstDay = week[0];
                if (firstDay) {
                    const m = new Date(firstDay.date).getMonth();
                    if (m !== lastMonth && wIdx > 0 && wIdx < weeks.length - 2) {
                        const mName = new Date(firstDay.date).toLocaleString('en', { month: 'short' });
                        monthLabels += `<text x="${wIdx * step + 28}" y="12" fill="#CAC4D0" font-size="10" font-family="'Comfortaa', 'Roboto', sans-serif">${mName}</text>`;
                        lastMonth = m;
                    } else if (lastMonth === -1) {
                        lastMonth = m;
                    }
                }
            });


            let cells = '';
            weeks.forEach((week, wIdx) => {
                week.forEach((day, dIdx) => {
                    const x = wIdx * step + 28;
                    const y = dIdx * step + 18;
                    const color = colors[day.level] || colors[0];
                    cells += `<rect x="${x}" y="${y}" width="${cellW}" height="${cellW}" rx="2" ry="2" fill="${color}" class="graph-cell"><title>${day.count} contributions on ${day.date}</title></rect>`;
                });
            });

            const svg = `
                <div class="graph-header-meta">
                    <span class="total-contribs-badge">${total} contributions in the last year</span>
                </div>
                <div class="graph-scroll-wrap">
                    <svg viewBox="0 0 ${totalW} ${totalH}" width="100%" height="auto" style="min-width: 680px; max-width: 100%; display: block;" xmlns="http://www.w3.org/2000/svg">
                        ${monthLabels}
                        <text x="0" y="38" fill="#CAC4D0" font-size="9" font-family="'Comfortaa', 'Roboto', sans-serif">Mon</text>
                        <text x="0" y="64" fill="#CAC4D0" font-size="9" font-family="'Comfortaa', 'Roboto', sans-serif">Wed</text>
                        <text x="0" y="90" fill="#CAC4D0" font-size="9" font-family="'Comfortaa', 'Roboto', sans-serif">Fri</text>
                        ${cells}
                    </svg>
                </div>
            `;

            graphContainer.innerHTML = svg;
        } catch (err) {
            console.warn('Fallback to static chart generator:', err);
            graphContainer.innerHTML = `
                <img src="https://ghchart.rshah.org/D0BCFF/ArThirtyFour" alt="GitHub Activity Graph" class="github-graph-fallback" style="max-width: 100%; height: auto; display: block; border-radius: 8px;">
            `;
        }
    }

    loadGitHubGraph();

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