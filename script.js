document.addEventListener('DOMContentLoaded', () => {

    const subtitleElement = document.getElementById('subtitle-text');
    if (subtitleElement) {
        const phrases = ['Python + JS Dev', 'Full stack enjoyer', 'Windows + Arch user', 'Напишу сюда.. например', 'Я рыгнул'];
        let phraseIndex = 0;
        const time_pause = 100; 
        const display_time = 1500;

        function typeAndErase(text, callback) {
            let charIndex = 0;
            let currentHtml = '';
            let isErasing = false;

            function type() {
                if (!isErasing) {
                    if (charIndex < text.length) {
                        currentHtml = text.substring(0, charIndex + 1) + '|';
                        subtitleElement.innerHTML = currentHtml;
                        charIndex++;
                        setTimeout(type, time_pause);
                    } else {
                        // Завершили печать, ждем перед стиранием
                        subtitleElement.innerHTML = text; // Убираем курсор
                        isErasing = true;
                        setTimeout(type, display_time);
                    }
                } else {

                    if (charIndex > 0) {
                        charIndex--;
                        currentHtml = text.substring(0, charIndex) + '|';
                        subtitleElement.innerHTML = currentHtml;
                        setTimeout(type, time_pause);
                    } else {
                     
                        subtitleElement.innerHTML = '&nbsp;|'; 
                        callback();
                    }
                }
            }
            type();
        }

        function nextPhrase() {
            typeAndErase(phrases[phraseIndex], () => {
                phraseIndex++;
                if (phraseIndex >= phrases.length) {
                    phraseIndex = 0; 
                }
                setTimeout(nextPhrase, time_pause);
            });
        }


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
                this.size = Math.random() * 2 + 1; 
                this.speedX = Math.random() * 1 - 0.5; 
                this.speedY = Math.random() * 1 - 0.5; 
                this.color = `rgba(173, 216, 230, ${Math.random() * 0.5 + 0.2})`;
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
            }
        }

        function initParticles() {
            particles = [];
            const numberOfParticles = Math.floor(canvas.width / 30); 
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
            requestAnimationFrame(animateParticles);
        }


        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        resizeCanvas();
        initParticles();
        animateParticles();
    }
    


    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
    */
}); 
