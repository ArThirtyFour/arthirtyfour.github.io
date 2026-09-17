async function nowPlaying() {
    const card = document.getElementById('now-playing-card');
    if (!card) return;

    try {
        const response = await fetch("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&nowplaying=true&user=dtydduyyur&api_key=460cda35be2fbf4f28e8ea7a38580730&format=json");
        const data = await response.json();
        
        if (!data.recenttracks || !data.recenttracks.track || data.recenttracks.track.length === 0) {
            card.innerHTML = '<div class="np-loading">No scrobble data found</div>';
            return;
        }

        const track = data.recenttracks.track[0];
        const isLive = Boolean(track['@attr'] && track['@attr'].nowplaying);
        
        const trackName = track.name || 'Unknown Track';
        const artist = track.artist ? (track.artist['#text'] || track.artist.name || 'Unknown Artist') : 'Unknown Artist';
        const album = track.album ? track.album['#text'] : '';
        const lastFmUrl = track.url || 'https://www.last.fm/user/dtydduyyur';

        const DEFAULT_PHOTO = 'https://cdn4.telesco.pe/file/tsadyMGtq5oZKRIjQqgNZnzY6Jc-ffCtlxaxKu_YiJWo6hYTBlIexopI2bA3wmzoXCsr_wLmDWlVpDbvqzLGqTxTGgXypTG9RGZh2Bv3_lGGZRhCQodchU1hLt_RHWeGQ5DjHIU--BExRTgW3DqxvJEoW_MFSdYqlnpc6G9fzFtYdU49ctNRC4BVoSf7Xt2mvxWwbFoH15hmxKegJEJ_LVSjPCAYPWAtRhADSO4TE6k3XQFjvL31gVf9e5ZWsvE5rXk61eryY2XrXePa4MGGwwMCNr5URvX_c-PR_eNDoxYtR-eFnBXsJhGzhEi3BwJn-0p5JHsKanqG-ryBlMiOdA.jpg';

        let urlPhoto = '';
        if (track.image && track.image.length > 0) {
            urlPhoto = track.image[3]?.['#text'] || track.image[2]?.['#text'] || track.image[1]?.['#text'] || '';
        }

        if (!urlPhoto || urlPhoto.includes('2a96cbd8b46e442fc41c2b86b821562f')) {
            urlPhoto = DEFAULT_PHOTO;
        }

        const currentLang = localStorage.getItem('language') || (navigator.language.startsWith('ru') ? 'ru' : 'en');
        const isRu = currentLang === 'ru';
        
        const statusLabel = isLive 
            ? (isRu ? 'СЕЙЧАС ИГРАЕТ' : 'NOW PLAYING')
            : (isRu ? 'ПОСЛЕДНИЙ ТРЕК' : 'LAST PLAYED');
            
        const timeDurationLabel = isLive
            ? (isRu ? 'ПОТОК' : 'STREAMING')
            : (isRu ? 'ПРОСЛУШАНО' : 'SCROBBLED');

        card.innerHTML = `
            <md-elevation></md-elevation>
            <div class="m3-player-wrapper ${isLive ? 'is-playing' : 'is-idle'}">
                <div class="m3-player-main">
                    <div class="m3-player-art-wrap">
                        <img src="${urlPhoto}" alt="${trackName}" class="m3-player-art">
                        <div class="m3-art-glow" style="background-image: url('${urlPhoto}')"></div>
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
                                <span class="time-current">${isLive ? 'LIVE' : '0:00'}</span>
                                <span class="time-duration">${timeDurationLabel}</span>
                            </div>
                        </div>

                        <div class="m3-player-controls">
                            <button class="m3-ctrl-btn" title="Previous" disabled>
                                <md-icon>skip_previous</md-icon>
                            </button>
                            <a href="${lastFmUrl}" target="_blank" class="m3-ctrl-btn play-btn" title="${isLive ? 'Listening now' : 'Play on Last.fm'}">
                                <md-icon>${isLive ? 'volume_up' : 'play_arrow'}</md-icon>
                            </a>
                            <button class="m3-ctrl-btn" title="Next" disabled>
                                <md-icon>skip_next</md-icon>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error("Ошибка при загрузке трека:", error);
        card.innerHTML = '<div class="np-loading">Unable to load track data</div>';
    }
}

window.nowPlaying = nowPlaying;

document.addEventListener('DOMContentLoaded', () => {
    nowPlaying();
    setInterval(nowPlaying, 25000);
});
