let recentTracksList = [];
let currentTrackIndex = 0;
let tgChannelPhoto = localStorage.getItem('cached_tg_photo') || null;

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
                localStorage.setItem('cached_tg_photo', tgChannelPhoto);
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
                localStorage.setItem('cached_tg_photo', tgChannelPhoto);
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

    card.innerHTML = `
        <md-elevation></md-elevation>
        <div class="m3-player-wrapper ${isLive ? 'is-playing' : 'is-idle'}">
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
                        <a href="${lastFmUrl}" target="_blank" class="m3-lastfm-link" title="Open in Last.fm">
                            <md-icon>open_in_new</md-icon>
                        </a>
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

document.addEventListener('DOMContentLoaded', () => {
    nowPlaying();
    setInterval(nowPlaying, 10000);
});
