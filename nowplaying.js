async function nowPlaying() {
    try {
        const response = await fetch("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&nowplaying=true&user=dtydduyyur&api_key=460cda35be2fbf4f28e8ea7a38580730&format=json");
        const data = await response.json();
        
        if (!data.recenttracks || !data.recenttracks.track || data.recenttracks.track.length === 0) {
            const card = document.getElementById('now-playing-card');
            if (card) {
                card.innerHTML = '<div class="np-loading">No tracks playing right now</div>';
            }
            return;
        }
        track = data.recenttracks.track[0];
        if (!track['@attr'] || !track['@attr'].nowplaying) {
            const card = document.getElementById('now-playing-card');
            if (card) {
                card.innerHTML = '<div class="np-loading">Not playing anything</div>';
            }
            return;
        }
        
        name_song = track.name;
        artist = track.artist['#text'];
        try {
            url_photo = track.image[3]['#text'];
            if (!url_photo) {
                throw new Error('No image URL');
            }
        } catch (error) {
            url_photo = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fplay-lh.googleusercontent.com%2FVFmAfWqcuV3aReZG8MMQdHRSdKWx85IW22f4RQ5xhR5U-o1_u03P7TVwsnTYa26Q1No&f=1&nofb=1&ipt=4449ba66d57828b42c006e2a6c19d76deae54a97f2485f28b3fbe695883dc7cc';
        }
        last_fm = track.url;
        
        const card = document.getElementById('now-playing-card');
        if (card) {
            card.innerHTML = `
                <div class="np-container">
                    <img src="${url_photo}" alt="${name_song}" class="np-album-art">
                    <div class="np-info">
                        <div class="np-badge">🎵 Now Playing</div>
                        <div class="np-track-name">${name_song}</div>
                        <div class="np-artist">by ${artist}</div>
                    </div>
                </div>
            `;
        }
        
    } catch (error) {
        console.error("Ошибка при загрузке трека:", error);
        const card = document.getElementById('now-playing-card');
        if (card) {
            card.innerHTML = '<div class="np-loading">Unable to load track</div>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    nowPlaying();
    setInterval(nowPlaying, 30000);
});