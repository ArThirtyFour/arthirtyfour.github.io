let recentTracksList = [];
let currentTrackIndex = 0;
const TG_PHOTO_KEY = 'cached_tg_photo';
const TG_PHOTO_TTL = 2 * 24 * 60 * 60 * 1000;

function readCachedTgPhoto() {
    let raw = null;
    try {
        raw = localStorage.getItem(TG_PHOTO_KEY);
    } catch (e) {
        return null;
    }
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.url === 'string' && typeof parsed.ts === 'number') {
            if (Date.now() - parsed.ts < TG_PHOTO_TTL) return parsed.url;
        }
    } catch (e) {

    }
    try {
        localStorage.removeItem(TG_PHOTO_KEY);
    } catch (e2) {}
    return null;
}

function writeCachedTgPhoto(url) {
    try {
        localStorage.setItem(TG_PHOTO_KEY, JSON.stringify({ url, ts: Date.now() }));
    } catch (e) {}
}

let tgChannelPhoto = readCachedTgPhoto();

async function getTgPhoto() {
    if (tgChannelPhoto) return tgChannelPhoto;
    try {
        const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent('https://t.me/+SAqK0Ld2pylkZDMy')}&_t=${Date.now()}`);
        if (res.ok) {
            const html = await res.text();
            const match = html.match(/https:\/\/cdn\d*\.telesco\.pe\/file\/[^\s"']+/i)
                       || html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
            if (match) {
                tgChannelPhoto = match[1] || match[0];
                writeCachedTgPhoto(tgChannelPhoto);
                return tgChannelPhoto;
            }
        }
    } catch (e) {}

    try {
        const res2 = await fetch(`https://r.jina.ai/https://t.me/+SAqK0Ld2pylkZDMy`);
        if (res2.ok) {
            const txt = await res2.text();
            const match2 = txt.match(/https:\/\/cdn\d*\.telesco\.pe\/file\/[^\s"'\)\\]+/i);
            if (match2) {
                tgChannelPhoto = match2[0];
                writeCachedTgPhoto(tgChannelPhoto);
                return tgChannelPhoto;
            }
        }
    } catch (e) {}

    return '';
}

async function renderTrack(track) {
    const card = document.getElementById('now-playing-card');
    if (!card || !track) return;

    const isLive = Boolean(track['@attr'] && track['@attr'].nowplaying);
    const trackName = (typeof track.name === 'string' ? track.name : (track.name?.['#text'] || 'Unknown Track')).trim();
    
    let artist = 'Unknown Artist';
    if (track.artist) {
        if (typeof track.artist === 'string') {
            artist = track.artist;
        } else if (typeof track.artist === 'object') {
            artist = track.artist['#text'] || track.artist.name || 'Unknown Artist';
        }
    }

    let album = '';
    if (track.album) {
        if (typeof track.album === 'string') {
            album = track.album;
        } else if (typeof track.album === 'object' && track.album['#text']) {
            album = track.album['#text'];
        }
    }
    album = album.trim();
    const lastFmUrl = track.url || 'https://www.last.fm/user/dtydduyyur';

    let urlPhoto = '';
    if (track.image && track.image.length > 0) {
        urlPhoto = track.image[3]?.['#text'] || track.image[2]?.['#text'] || track.image[1]?.['#text'] || '';
    }

    if (!urlPhoto || urlPhoto.includes('2a96cbd8b46e442fc41c2b86b821562f')) {
        urlPhoto = await getTgPhoto();
    }

    const currentLang = localStorage.getItem('language') || (navigator.language.startsWith('ru') ? 'ru' : 'en');
    const isRu = currentLang === 'ru';
    
    let statusLabel = '';
    if (isLive) {
        statusLabel = isRu ? 'СЕЙЧАС ИГРАЕТ' : 'NOW PLAYING';
    } else if (currentTrackIndex === 0) {
        statusLabel = isRu ? 'ПОСЛЕДНИЙ ТРЕК' : 'LAST PLAYED';
    } else {
        statusLabel = isRu ? `ИСТОРИЯ #${currentTrackIndex + 1}` : `HISTORY #${currentTrackIndex + 1}`;
    }
        
    const timeDurationLabel = isLive
        ? (isRu ? 'ПОТОК' : 'STREAMING')
        : (isRu ? 'ПРОСЛУШАНО' : 'SCROBBLED');

    const hasPrev = currentTrackIndex > 0;
    const hasNext = currentTrackIndex < recentTracksList.length - 1;
    const viz = m3Viz.modeInfo(isRu ? 'ru' : 'en');

    card.innerHTML = `
        <md-elevation></md-elevation>
        <div class="m3-player-wrapper ${isLive ? 'is-playing' : 'is-idle'}">
            <canvas class="m3-viz-bg ${m3Viz.mode === 'off' ? 'viz-off' : ''}" aria-hidden="true"></canvas>
            <div class="m3-player-main">
                <div class="m3-player-art-wrap">
                    <img src="${urlPhoto}" alt="${trackName}" class="m3-player-art">
                    <div class="m3-art-glow" style="${urlPhoto ? `background-image: url('${urlPhoto}')` : ''}"></div>
                    <div class="m3-player-status-badge ${isLive ? 'live-badge' : 'idle-badge'}">
                        ${isLive ? `
                            <div class="m3-equalizer">
                                <span class="eq-bar eq-1"></span>
                                <span class="eq-bar eq-2"></span>
                                <span class="eq-bar eq-3"></span>
                                <span class="eq-bar eq-4"></span>
                            </div>
                        ` : '<md-icon class="status-mini-icon">history</md-icon>'}
                        <span>${statusLabel}</span>
                    </div>
                </div>

                <div class="m3-player-content">
                    <div class="m3-player-header">
                        <div class="m3-track-meta">
                            <a href="${lastFmUrl}" target="_blank" class="m3-track-title" title="${trackName}">${trackName}</a>
                            <div class="m3-track-artist">${artist}</div>
                            ${album ? `<div class="m3-track-album">${album}</div>` : ''}
                        </div>
                        <div class="m3-header-actions">
                            <button class="m3-viz-btn" id="m3-viz-btn" type="button" title="${viz.title}" aria-label="${viz.title}">
                                <md-icon>${viz.icon}</md-icon>
                            </button>
                            <a href="${lastFmUrl}" target="_blank" class="m3-lastfm-link" title="Open in Last.fm">
                                <md-icon>open_in_new</md-icon>
                            </a>
                        </div>
                    </div>

                    <div class="m3-player-progress-container">
                        <div class="m3-progress-bar">
                            <div class="m3-progress-fill ${isLive ? 'progress-animated' : ''}"></div>
                            <div class="m3-progress-thumb"></div>
                        </div>
                        <div class="m3-progress-time">
                            <span class="time-current">${isLive ? 'LIVE' : `#${currentTrackIndex + 1}`}</span>
                            <span class="time-duration">${timeDurationLabel}</span>
                        </div>
                    </div>

                    <div class="m3-player-controls">
                        <button class="m3-ctrl-btn" id="m3-prev-btn" title="Previous track" ${!hasPrev ? 'disabled' : ''}>
                            <md-icon>skip_previous</md-icon>
                        </button>
                        <a href="${lastFmUrl}" target="_blank" class="m3-ctrl-btn play-btn" title="${isLive ? 'Listening now' : 'Play on Last.fm'}">
                            <md-icon>${isLive ? 'volume_up' : 'play_arrow'}</md-icon>
                        </a>
                        <button class="m3-ctrl-btn" id="m3-next-btn" title="Next track" ${!hasNext ? 'disabled' : ''}>
                            <md-icon>skip_next</md-icon>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const prevBtn = document.getElementById('m3-prev-btn');
    const nextBtn = document.getElementById('m3-next-btn');

    if (prevBtn && hasPrev) {
        prevBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            currentTrackIndex--;
            await renderTrack(recentTracksList[currentTrackIndex]);
        });
    }

    if (nextBtn && hasNext) {
        nextBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            currentTrackIndex++;
            await renderTrack(recentTracksList[currentTrackIndex]);
        });
    }

    const vizBtn = document.getElementById('m3-viz-btn');
    if (vizBtn) {
        vizBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const next = m3Viz.cycleMode(card, isLive);
            const info = m3Viz.modeInfo(isRu ? 'ru' : 'en');
            vizBtn.title = info.title;
            vizBtn.setAttribute('aria-label', info.title);
            const icon = vizBtn.querySelector('md-icon');
            if (icon) icon.textContent = info.icon;
            card.querySelector('.m3-viz-bg')?.classList.toggle('viz-off', next === 'off');
        });
    }

    m3Viz.mount(card, isLive);
}

async function nowPlaying() {
    const card = document.getElementById('now-playing-card');
    if (!card) return;

    try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&nowplaying=true&user=dtydduyyur&api_key=460cda35be2fbf4f28e8ea7a38580730&format=json&_ts=${Date.now()}`, {
            cache: 'no-store'
        });
        const data = await response.json();
        
        let rawTracks = data?.recenttracks?.track;
        if (!rawTracks) {
            if (recentTracksList.length === 0) {
                card.innerHTML = '<div class="np-loading">No scrobble data found</div>';
            }
            return;
        }

        if (!Array.isArray(rawTracks)) {
            rawTracks = [rawTracks];
        }

        if (rawTracks.length === 0) {
            if (recentTracksList.length === 0) {
                card.innerHTML = '<div class="np-loading">No scrobble data found</div>';
            }
            return;
        }

        recentTracksList = rawTracks;
        if (currentTrackIndex >= recentTracksList.length) {
            currentTrackIndex = 0;
        }

        await renderTrack(recentTracksList[currentTrackIndex]);
        
    } catch (error) {
        console.error("Ошибка при загрузке трека:", error);
        if (recentTracksList.length === 0) {
            card.innerHTML = '<div class="np-loading">Unable to load track data</div>';
        }
    }
}

window.nowPlaying = nowPlaying;
const m3Viz = (() => {
    const BANDS = 48;
    const BAR_COUNT = 36;
    const MODES = ['wave', 'bars', 'off'];
    const ICONS = { wave: 'waves', bars: 'graphic_eq', off: 'visibility_off' };

    const bands = new Float32Array(BANDS);
    const state = { t: 0, mode: 'wave', live: false, mix: 0, card: null };
    let raf = null;
    let canvas = null;
    let ctx = null;
    let palette = null;
    let W = 0;
    let H = 0;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!MODES.includes(localStorage.getItem('m3_viz_mode'))) {
        localStorage.setItem('m3_viz_mode', 'wave');
    }
    state.mode = localStorage.getItem('m3_viz_mode');

    function rgba(hex, alpha) {
        let h = (hex || '').trim().replace('#', '');
        if (h.length === 3) h = h.split('').map(c => c + c).join('');
        if (h.length !== 6 || isNaN(parseInt(h, 16))) return `rgba(208, 188, 255, ${alpha})`;
        const num = parseInt(h, 16);
        return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
    }

    function readPalette(el) {
        const cs = getComputedStyle(el);
        const pick = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
        return {
            primary: pick('--md-sys-color-primary', '#D0BCFF'),
            primaryContainer: pick('--md-sys-color-primary-container', '#4F378B'),
            tertiary: pick('--md-sys-color-tertiary', '#EFB8C8')
        };
    }

    function resize() {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = Math.max(1, Math.round(rect.width));
        H = Math.max(1, Math.round(rect.height));
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

   
    const CY_RATIO = 0.92;

    function waveAxis() {
        const cy = H * CY_RATIO;
        const amp = Math.max(4, cy - 4);
        return { cy, amp };
    }

    function hash(n) {
        const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
        return s - Math.floor(s);
    }

    function drive(dt) {
        const goal = state.live ? 1 : 0;
        state.mix += (goal - state.mix) * Math.min(1, dt * 1.4);
        const mix = state.mix;

        state.t += dt * (0.4 + 0.6 * mix);
        const t = state.t;
        const gate = 0.2 + 0.8 * mix;
        const kick = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * (124 / 60))), 6);
        const phrase = 0.5 + 0.5 * Math.sin(t * 0.55);
        const tilt = 0.82 + 0.18 * Math.sin(t * 0.31 + 1.2);
        const swell = 0.78 + 0.22 * Math.sin(t * 0.19 + 0.4);

        for (let i = 0; i < BANDS; i++) {
            const f = i / (BANDS - 1);
            let v =
                0.08 +
                0.26 * (0.5 + 0.5 * Math.sin(f * 9.2 - t * 1.9)) +
                0.14 * (0.5 + 0.5 * Math.sin(f * 21.5 + t * 3.1 + 1.7)) +
                kick * 0.42 * Math.pow(1 - f, 1.25) +
                phrase * 0.16 * Math.sin(Math.PI * f) +
                hash(i + Math.floor(t * 9) * 7.31) * 0.26 * f * f;

            v *= gate * tilt * swell;
            v = 1 - Math.exp(-v * 1.6);

            const target = Math.min(0.98, Math.max(0.03, v));
            const k = (target > bands[i] ? 0.6 : 0.15) * dt * 60;
            bands[i] += (target - bands[i]) * Math.min(1, k);
        }
    }

    function sample(f, shift = 0) {
        const x = (f * (BANDS - 1) + shift) % BANDS;
        const i = Math.floor(x);
        const j = (i + 1) % BANDS;
        const u = x - i;
        const k = 0.5 - 0.5 * Math.cos(u * Math.PI);
        return bands[i] * (1 - k) + bands[j] * k;
    }

    function traceCurve(cy, amp, offset, flip) {
        const step = 2;
        for (let x = 0; x <= W; x += step) {
            const v = sample(x / W, offset) * amp;
            const y = flip ? cy + v : cy - v;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
    }

    function drawWave() {
        const { cy, amp } = waveAxis();
        const p = palette;
        const mix = state.mix;
        const warm = rgba(p.tertiary, 0.1 + 0.9 * mix);
        const cool = rgba(p.primaryContainer, 0.8 - 0.4 * mix);
        const bright = rgba(p.primary, 0.5 + 0.5 * mix);

        ctx.globalAlpha = 0.22 + 0.12 * mix;
        ctx.beginPath();
        traceCurve(cy, amp * 0.72, BANDS * 0.37, false);
        for (let x = W; x >= 0; x -= 2) {
            ctx.lineTo(x, cy + sample(x / W, BANDS * 0.37) * amp * 0.72);
        }
        ctx.closePath();
        const ghost = ctx.createLinearGradient(0, cy - amp, 0, cy + amp);
        ghost.addColorStop(0, rgba(p.primaryContainer, 0.9));
        ghost.addColorStop(1, warm);
        ctx.fillStyle = ghost;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.beginPath();
        traceCurve(cy, amp, 0, false);
        for (let x = W; x >= 0; x -= 2) {
            ctx.lineTo(x, cy + sample(x / W, 0) * amp);
        }
        ctx.closePath();
        const fill = ctx.createLinearGradient(0, cy - amp, 0, cy + amp);
        fill.addColorStop(0, bright);
        fill.addColorStop(0.5, cool);
        fill.addColorStop(1, warm);
        ctx.fillStyle = fill;
        ctx.fill();
        const stroke = ctx.createLinearGradient(0, 0, W, 0);
        stroke.addColorStop(0, bright);
        stroke.addColorStop(0.5, warm);
        stroke.addColorStop(1, bright);
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.5 + 0.7 * mix;
        ctx.lineJoin = 'round';
        ctx.shadowColor = rgba(p.primary, 0.25 + 0.45 * mix);
        ctx.shadowBlur = 6 + 8 * mix;

        ctx.beginPath();
        traceCurve(cy, amp, 0, false);
        ctx.stroke();

        ctx.beginPath();
        traceCurve(cy, amp, 0, true);
        ctx.stroke();


        ctx.shadowBlur = 0;
        ctx.globalAlpha = 0.2 + 0.2 * mix;
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(W, cy);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    function drawBars() {
        const { cy, amp: max } = waveAxis();
        const gap = 2;
        const bw = Math.max(2, (W - gap * (BAR_COUNT - 1)) / BAR_COUNT);
        const p = palette;

        const fill = ctx.createLinearGradient(0, cy - max, 0, cy + max);
        fill.addColorStop(0, rgba(p.primary, 0.6 + 0.4 * state.mix));
        fill.addColorStop(0.5, rgba(p.primaryContainer, 0.95 - 0.35 * state.mix));
        fill.addColorStop(1, rgba(p.tertiary, 0.15 + 0.85 * state.mix));
        ctx.fillStyle = fill;
        ctx.shadowColor = rgba(p.primary, 0.2 + 0.3 * state.mix);
        ctx.shadowBlur = 5 + 5 * state.mix;

        for (let i = 0; i < BAR_COUNT; i++) {
            const f = i / (BAR_COUNT - 1);
            const v = Math.pow(sample(f), 1.3) * max;
            const x = i * (bw + gap);
            const h = Math.max(2, v);
            if (ctx.roundRect) {
                ctx.beginPath();
                ctx.roundRect(x, cy - h, bw, h * 2, Math.min(2, bw / 2));
                ctx.fill();
            } else {
                ctx.fillRect(x, cy - h, bw, h * 2);
            }
        }
        ctx.shadowBlur = 0;
    }

    function render() {
        if (!ctx) return;
        ctx.clearRect(0, 0, W, H);
        if (state.mode === 'bars') drawBars();
        else drawWave();
    }

    function staticFrame() {
        for (let i = 0; i < BANDS; i++) {
            const f = i / (BANDS - 1);
            bands[i] = 0.14 + 0.16 * Math.sin(f * 6.2 + 0.6) + 0.06 * Math.sin(f * 16.5);
        }
        render();
    }

    function loop(now) {
        const dt = Math.min(0.05, (now - (loop.last || now)) / 1000);
        loop.last = now;
        drive(dt);
        render();
        raf = requestAnimationFrame(loop);
    }

    function start() {
        cancelAnimationFrame(raf);
        raf = null;
        if (reducedMotion.matches) {
            staticFrame();
            return;
        }
        loop.last = null;
        raf = requestAnimationFrame(loop);
    }

    function stop() {
        cancelAnimationFrame(raf);
        raf = null;
    }

    function mount(card, isLive) {
        state.card = card || null;
        state.live = Boolean(isLive);
        if (!card) return;

        canvas = card.querySelector('.m3-viz-bg');
        ctx = canvas ? canvas.getContext('2d') : null;
        if (!ctx || state.mode === 'off') {
            stop();
            return;
        }
        palette = readPalette(card);
        resize();
        start();
    }

    function cycleMode(card, isLive) {
        const next = MODES[(MODES.indexOf(state.mode) + 1) % MODES.length];
        state.mode = next;
        localStorage.setItem('m3_viz_mode', next);
        mount(card, isLive);
        return next;
    }

    function modeInfo(lang) {
        const ru = lang !== 'en';
        const titles = ru
            ? { wave: 'Визуализатор: волна', bars: 'Визуализатор: полосы', off: 'Визуализатор выключен' }
            : { wave: 'Visualizer: wave', bars: 'Visualizer: bars', off: 'Visualizer off' };
        return { icon: ICONS[state.mode], title: titles[state.mode] };
    }

    window.addEventListener('resize', () => {
        if (!ctx) return;
        resize();
        if (reducedMotion.matches) staticFrame();
    });

    return { mount, cycleMode, modeInfo, get mode() { return state.mode; } };
})();

document.addEventListener('DOMContentLoaded', () => {
    nowPlaying();
    setInterval(nowPlaying, 10000);
});
