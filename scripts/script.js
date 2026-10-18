document.addEventListener('DOMContentLoaded', () => {

    (function initBgShapes() {
        const box = document.createElement('div');
        box.className = 'bg-shapes';
        box.id = 'bgShapes';
        box.setAttribute('aria-hidden', 'true');
        document.body.prepend(box);

        if (!window.M3Shapes) return;
        const { shapes, Morph, toPath } = window.M3Shapes;
        const POOL = [
            'Cookie9Sided', 'Clover4Leaf', 'Flower', 'SoftBurst', 'Sunny', 'Pill',
            'Cookie4Sided', 'Gem', 'PuffyDiamond', 'Oval', 'Ghostish', 'Cookie12Sided'
        ];
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const rnd = (a, b) => a + Math.random() * (b - a);

        const inUse = new Set();
        const pickFrom = (list, not) => {
            const free = list.filter(n => n !== not && !inUse.has(n));
            let from = free.length ? free : list.filter(n => n !== not);
            if (!from.length) from = list;
            return from[(Math.random() * from.length) | 0] || list[0];
        };
        const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const _morphs = new Map();
        const idle = window.requestIdleCallback || (f => setTimeout(f, 1));
        function morphFor(a, b) {
            const A = shapes.byName(a), B = shapes.byName(b);
            if (!A || !B) return null;
            const k = a + '>' + b;
            let m = _morphs.get(k);
            if (!m) { m = new Morph(A, B); _morphs.set(k, m); }
            return m;
        }
        const TINTS = ['--md-sys-color-primary', '--md-sys-color-tertiary', '--md-sys-color-secondary'];

        const LAYOUTS = [
            {
                name: 'Углы контуром',
                build(W, H, base) {
                    const s = base * 0.95, o = s * 0.58;
                    return [
                        { x: -o, y: -o, size: s },
                        { x: W - s + o, y: -o, size: s },
                        { x: -o, y: H - s + o, size: s },
                        { x: W - s + o, y: H - s + o, size: s }
                    ].map(p => Object.assign(p, { stroke: true, op: 0.16 }));
                }
            }
        ];

        function narrowLayout(W, H) {
            const s1 = W * 0.95, s2 = W * 0.8, s3 = W * 0.55;
            return [
                { x: W - s1 * 0.62, y: -s1 * 0.42, size: s1, stroke: true, op: 0.2, fast: true },
                { x: -s2 * 0.55, y: H - s2 * 0.5, size: s2, stroke: true, op: 0.2, fast: true },
                { x: -s3 * 0.4, y: H * 0.42, size: s3, stroke: true, op: 0.16, fast: true }
            ];
        }

        let timers = [], rafs = [];
        function render(n) {
            timers.forEach(clearTimeout); timers = [];
            rafs.forEach(cancelAnimationFrame); rafs = [];
            inUse.clear();
            box.innerHTML = '';
            const W = innerWidth, H = innerHeight, base = Math.min(W, H);
            const slots = W < 600 ? narrowLayout(W, H) : LAYOUTS[n].build(W, H, base);
            slots.forEach((slot, i) => {
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('viewBox', '0 0 1 1');
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                svg.appendChild(path);
                box.appendChild(svg);
                svg.style.cssText = 'left:' + slot.x.toFixed(1) + 'px;top:' + slot.y.toFixed(1) + 'px;' +
                    'width:' + (slot.size | 0) + 'px;height:' + (slot.size | 0) + 'px;' +
                    'opacity:' + (slot.op ?? rnd(0.05, 0.09)).toFixed(3) + ';' +
                    '--rot:' + (rnd(-40, 40) | 0) + 'deg;--px:0px;--py:0px;' +
                    'transform:translate3d(var(--px),var(--py),0) rotate(var(--rot))';
                svg.dataset.depth = (0.4 + Math.random() * 0.9).toFixed(2);
                const tint = 'var(' + TINTS[i % TINTS.length] + ')';
                if (slot.stroke) {
                    path.setAttribute('fill', 'none');
                    path.setAttribute('stroke', tint);
                    path.setAttribute('stroke-width', '1.5');
                    path.setAttribute('vector-effect', 'non-scaling-stroke');
                } else {
                    path.setAttribute('fill', tint);
                }
                const pool = slot.pool || POOL;
                let cur = pickFrom(pool);
                inUse.add(cur);
                path.setAttribute('d', toPath(new Morph(shapes.byName(cur), shapes.byName(cur)), 0).toString());
                if (reduce) return;
                let nextName = null;
                const prepare = () => {
                    if (nextName) return;
                    nextName = pickFrom(pool, cur);
                    inUse.add(nextName);
                    idle(() => morphFor(cur, nextName));
                };
                const step = () => {
                    prepare();
                    const next = nextName; nextName = null;
                    const morph = next ? morphFor(cur, next) : null;
                    if (!morph) { timers.push(setTimeout(step, 1200)); return; }
                    const dur = slot.slow ? rnd(2200, 3200) : rnd(900, 1600), t0 = performance.now();
                    const frame = now => {
                        const p = Math.min(1, (now - t0) / dur);
                        path.setAttribute('d', toPath(morph, ease(p)).toString());
                        if (p < 1) {
                            rafs.push(requestAnimationFrame(frame));
                        } else {
                            inUse.delete(cur);
                            cur = next;
                            idle(prepare);
                            timers.push(setTimeout(step, slot.slow ? rnd(9000, 18000)
                                : slot.fast ? rnd(3000, 7000)
                                : rnd(6000, 16000)));
                        }
                    };
                    rafs.push(requestAnimationFrame(frame));
                };
                timers.push(setTimeout(step, slot.fast ? rnd(600, 3000) : rnd(1500, 9000)));
            });
        }

        idle(() => { render(0); });

        if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce) {
            let tx = 0, ty = 0, queued = false;
            const apply = () => {
                queued = false;
                for (const svg of box.children) {
                    const d = +svg.dataset.depth || 1;
                    svg.style.setProperty('--px', (tx * d).toFixed(1) + 'px');
                    svg.style.setProperty('--py', (ty * d).toFixed(1) + 'px');
                }
            };
            addEventListener('pointermove', e => {
                if (e.pointerType !== 'mouse') return;
                tx = (e.clientX / innerWidth - 0.5) * 34;
                ty = (e.clientY / innerHeight - 0.5) * 34;
                if (!queued) { queued = true; requestAnimationFrame(apply); }
            }, { passive: true });
        }

        let rt, lastW = innerWidth;
        addEventListener('resize', function () {
            if (Math.abs(innerWidth - lastW) < 40) return;
            lastW = innerWidth;
            clearTimeout(rt);
            rt = setTimeout(function () { render(0); }, 300);
        });
    })();

    const translations = {
        ru: {
            title: 'AR34 | Mаня-Сайт',
            greeting: 'Ку , я <span class="gradient-text">AR34!</span>',
            moreDetails: 'Подробнее тут',
            blogLabel: 'Мой блог',
            loadingTrack: 'Загрузка трека...',
            myStack: '> Мой Тех. Стек <',
            githubContributions: '> Контрибьюции (GitHub + Forgejo) <',
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
            githubContributions: '> Contributions (GitHub + Forgejo) <',
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

    function bindGraphTooltip(graphContainer, showBreakdown) {
        const tip = graphContainer.querySelector('#graph-tooltip');
        if (!tip) return;

        function fill(cell) {
            const dateStr = cell.getAttribute('data-date');
            const count = Number(cell.getAttribute('data-count') || 0);
            const gh = Number(cell.getAttribute('data-gh') || 0);
            const fj = Number(cell.getAttribute('data-fj') || 0);
            const nice = new Date(dateStr + 'T00:00:00Z').toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
            });
            const word = count === 1 ? 'contribution' : 'contributions';
            let html = `<div class="tt-date">${nice}</div>` +
                `<div class="tt-count">${count} ${word}</div>`;
            if (showBreakdown && (gh > 0 || fj > 0)) {
                html += `<div class="tt-breakdown">GitHub: ${gh} · Forgejo: ${fj}</div>`;
            }
            tip.innerHTML = html;
        }

        function place(clientX, clientY) {
            const box = graphContainer.getBoundingClientRect();
            let x = clientX - box.left + 14;
            let y = clientY - box.top - 10;
            tip.classList.add('show');
            const tw = tip.offsetWidth;
            const th = tip.offsetHeight;
            if (x + tw > box.width - 8) x = clientX - box.left - tw - 14;
            if (y < 8) y = 8;
            if (y + th > box.height - 8) y = box.height - th - 8;
            tip.style.left = x + 'px';
            tip.style.top = y + 'px';
        }

        function hide() {
            tip.classList.remove('show');
        }

        graphContainer.addEventListener('pointermove', (e) => {
            const cell = e.target.closest ? e.target.closest('.graph-cell') : null;
            if (!cell || !graphContainer.contains(cell)) { hide(); return; }
            fill(cell);
            place(e.clientX, e.clientY);
        });
        graphContainer.addEventListener('pointerleave', hide);
        graphContainer.addEventListener('click', (e) => {
            const cell = e.target.closest ? e.target.closest('.graph-cell') : null;
            if (!cell || !graphContainer.contains(cell)) { hide(); return; }
            fill(cell);
            place(e.clientX || 0, e.clientY || 0);
        });
        graphContainer.addEventListener('focusin', (e) => {
            const cell = e.target.closest ? e.target.closest('.graph-cell') : null;
            if (!cell) return;
            fill(cell);
            const r = cell.getBoundingClientRect();
            place(r.left + r.width / 2, r.top);
        });
        graphContainer.addEventListener('focusout', hide);
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

            const totalGH = data.total?.lastYear ?? days.reduce((acc, d) => acc + d.count, 0);

            let forgejoByDate = {};
            let forgejoTotal = 0;
            let forgejoOk = false;
            try {
                const fjResp = await fetch('forgejo-contributions.json', { cache: 'no-store' });
                if (fjResp.ok) {
                    const fj = await fjResp.json();
                    forgejoByDate = fj.contributions || {};
                    forgejoTotal = fj.total || 0;
                    forgejoOk = true;
                }
            } catch (fjErr) {
                console.warn('Forgejo stats unavailable, showing GitHub only:', fjErr);
            }

            let total = totalGH;
            if (forgejoOk) {
                days.forEach(day => {
                    const gh = day.count || 0;
                    const fj = forgejoByDate[day.date] || 0;
                    day.ghCount = gh;
                    day.fjCount = fj;
                    day.count = gh + fj;
                });
                total = totalGH + forgejoTotal;
            } else {
                days.forEach(day => {
                    day.ghCount = day.count;
                    day.fjCount = 0;
                });
            }
            const positive = days.map(d => d.count).filter(c => c > 0).sort((a, b) => a - b);
            const distinct = [...new Set(positive)];
            const cuts = [];
            for (let i = 1; i <= 6; i++) {
                cuts.push(distinct.length
                    ? distinct[Math.min(distinct.length - 1, Math.floor(distinct.length * i / 7))]
                    : i);
            }
            function levelFor(count) {
                if (count <= 0) return 0;
                let level = 1;
                for (const c of cuts) if (count > c) level++;
                return Math.min(level, 7);
            }
            days.forEach(day => { day.level = levelFor(day.count); });

            const totalBadge = forgejoOk
                ? `${total} contributions in the last year (GH: ${totalGH} + Forgejo: ${forgejoTotal})`
                : `${total} contributions in the last year`;

            const weeks = [];
            let week = new Array(7).fill(null);
            days.forEach((day) => {
                const wd = new Date(day.date + 'T00:00:00Z').getUTCDay();
                week[wd] = day;
                if (wd === 6) {
                    weeks.push(week);
                    week = new Array(7).fill(null);
                }
            });
            if (week.some(Boolean)) weeks.push(week);

            const colors = {
                0: '#2B2930',
                1: '#38305A',
                2: '#4F378B',
                3: '#6747B8',
                4: '#7E57C2',
                5: '#9A7BD0',
                6: '#B39DDB',
                7: '#D0BCFF'
            };

            const cellW = 10;
            const cellGap = 3;
            const step = cellW + cellGap;
            const totalW = weeks.length * step + 30;
            const totalH = 7 * step + 35;

            let monthLabels = '';
            let lastMonth = -1;
            weeks.forEach((wk, wIdx) => {
                const firstDay = wk.find(Boolean);
                if (firstDay) {
                    const d = new Date(firstDay.date + 'T00:00:00Z');
                    const m = d.getUTCMonth();
                    if (m !== lastMonth) {
                        if (wIdx > 0) {
                            const mName = d.toLocaleString('en', { month: 'short', timeZone: 'UTC' });
                            monthLabels += `<text x="${wIdx * step + 28}" y="12" fill="#CAC4D0" font-size="10" font-family="'Comfortaa', 'Roboto', sans-serif">${mName}</text>`;
                        }
                        lastMonth = m;
                    }
                }
            });


            let cells = '';
            weeks.forEach((wk, wIdx) => {
                wk.forEach((day, wd) => {
                    if (!day) return;
                    const x = wIdx * step + 28;
                    const y = wd * step + 18;
                    const color = colors[day.level] || colors[0];
                    const gh = day.ghCount ?? day.count;
                    const fj = day.fjCount ?? 0;
                    cells += `<rect x="${x}" y="${y}" width="${cellW}" height="${cellW}" rx="2" ry="2" fill="${color}" class="graph-cell" data-date="${day.date}" data-count="${day.count}" data-gh="${gh}" data-fj="${fj}" tabindex="0" role="img" aria-label="${day.count} contributions on ${day.date}"></rect>`;
                });
            });

            const legendCells = [0, 1, 2, 3, 4, 5, 6, 7]
                .map(l => `<i style="background:${colors[l]}"></i>`)
                .join('');

            const svg = `
                <div class="graph-header-meta">
                    <span class="total-contribs-badge">${totalBadge}</span>
                </div>
                <div class="graph-scroll-wrap">
                    <svg viewBox="0 0 ${totalW} ${totalH}" width="100%" height="${totalH}" style="min-width: 680px; max-width: 100%; height: auto; display: block;" xmlns="http://www.w3.org/2000/svg">
                        ${monthLabels}
                        <text x="0" y="38" fill="#CAC4D0" font-size="9" font-family="'Comfortaa', 'Roboto', sans-serif">Mon</text>
                        <text x="0" y="64" fill="#CAC4D0" font-size="9" font-family="'Comfortaa', 'Roboto', sans-serif">Wed</text>
                        <text x="0" y="90" fill="#CAC4D0" font-size="9" font-family="'Comfortaa', 'Roboto', sans-serif">Fri</text>
                        ${cells}
                    </svg>
                </div>
                <div class="graph-footer">
                    <span class="graph-legend">Less ${legendCells} More</span>
                </div>
                <div class="graph-tooltip" id="graph-tooltip" role="status"></div>
            `;

            graphContainer.innerHTML = svg;
            bindGraphTooltip(graphContainer, forgejoOk);
        } catch (err) {
            console.warn('Fallback to static chart generator:', err);
            graphContainer.innerHTML = `
                <img src="https://ghchart.rshah.org/D0BCFF/ArThirtyFour" alt="GitHub Activity Graph" class="github-graph-fallback" style="max-width: 100%; height: auto; display: block; border-radius: 8px;">
            `;
        }
    }

    loadGitHubGraph();

    function armReveal(container) {
        const root = container || document;
        const items = [...root.querySelectorAll('.m3-card, .tech-chip-container, .github-graph-container, header h1, .subtitle, .social-links')];
        if (!items.length) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
            items.forEach(el => el.classList.add('in'));
            return;
        }

        const reveal = (el, d) => setTimeout(() => {
            el.classList.add('in');
            el.addEventListener('transitionend', () => el.classList.add('rv-done'), { once: true });
        }, d);

        const vh = window.innerHeight || 800;
        let near = 0;

        const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries, observer) => {
            for (const e of entries) {
                if (!e.isIntersecting) continue;
                observer.unobserve(e.target);
                reveal(e.target, +(e.target.dataset.rd || 0));
            }
        }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 }) : null;

        for (const el of items) {
            el.classList.add('reveal');
            el.classList.remove('in', 'rv-done');
            if (el.getBoundingClientRect().top < vh * 1.05) {
                el.dataset.rd = '0';
                reveal(el, Math.min(near++, 10) * 45);
            } else if (io) {
                el.dataset.rd = '0';
                io.observe(el);
            } else {
                el.classList.add('in');
            }
        }
    }

    function shapeBurst(x, y) {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.M3Shapes) return;
        const M = window.M3Shapes;
        const SHAPES = ['Cookie4Sided', 'Cookie9Sided', 'Clover4Leaf', 'Flower', 'Sunny', 'Gem', 'PuffyDiamond', 'Pill', 'SoftBurst', 'Diamond', 'Triangle', 'Heart'];
        const TINTS = ['primary', 'tertiary', 'secondary'];
        const rnd = (a, b) => a + Math.random() * (b - a);
        const count = 14;
        const baseAngle = Math.random() * Math.PI * 2;

        for (let i = 0; i < count; i++) {
            const el = document.createElement('span');
            el.className = 'boom';
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            const tint = TINTS[i % TINTS.length];
            const sz = rnd(9, 20) | 0;
            el.style.width = el.style.height = sz + 'px';

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 1 1');
            const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const name = SHAPES[(Math.random() * SHAPES.length) | 0];
            p.setAttribute('d', M.toPath(new M.Morph(M.shapes.byName(name), M.shapes.byName(name)), 0).toString());
            p.setAttribute('fill', 'none');
            p.setAttribute('stroke', `var(--md-sys-color-${tint})`);
            p.setAttribute('stroke-width', '1.6');
            p.setAttribute('vector-effect', 'non-scaling-stroke');
            svg.appendChild(p);
            el.appendChild(svg);

            const a = baseAngle + (i / count) * Math.PI * 2 + rnd(-0.25, 0.25);
            const d = rnd(120, 260);
            el.style.setProperty('--bx', (Math.cos(a) * d).toFixed(1) + 'px');
            el.style.setProperty('--by', (Math.sin(a) * d * 0.75 + rnd(20, 70)).toFixed(1) + 'px');
            el.style.setProperty('--br', (rnd(-260, 260) | 0) + 'deg');
            el.style.setProperty('--bt', rnd(0.85, 1.25).toFixed(2) + 's');

            document.body.appendChild(el);
            el.addEventListener('animationend', () => el.remove(), { once: true });
        }
    }

    const greetingTitle = document.querySelector('header h1');
    if (greetingTitle) {
        greetingTitle.style.cursor = 'pointer';
        greetingTitle.addEventListener('click', (e) => {
            shapeBurst(e.clientX || window.innerWidth / 2, e.clientY || 150);
        });
    }
    const avatar = document.querySelector('.avatar');
    if (avatar) {
        avatar.style.cursor = 'pointer';
        avatar.addEventListener('click', (e) => {
            const r = avatar.getBoundingClientRect();
            shapeBurst(r.left + r.width / 2, r.top + r.height / 2);
        });
    }

    armReveal();
}); 