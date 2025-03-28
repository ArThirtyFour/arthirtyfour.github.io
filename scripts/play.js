const fon = new Audio("bg.mp3");

// Unlock audio on first user interaction
document.addEventListener('click', () => {
    fon.play().then(() => {
        fon.pause();
        fon.currentTime = 0;
    });
}, { once: true });

function play() {
    const da = document.getElementById('da');
    const main = document.querySelector('.main');

    if (!da || !main) {
        console.error("Required elements not found.");
        return;
    }

    da.style.opacity = '0';
    
    setTimeout(() => {
        da.style.display = 'none';
        main.style.display = 'block';
        
        setTimeout(() => {
            main.classList.add('show');
            fon.play().catch(error => {
                console.error("Audio playback failed:", error);
            });
        }, 10);
    }, 500);
}