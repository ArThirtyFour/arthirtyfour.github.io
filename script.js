document.addEventListener('DOMContentLoaded', () => {

    const subtitleElement = document.getElementById('subtitle-text');
    if (subtitleElement) {

        const userLanguage = navigator.language || navigator.userLanguage;
        const isRussian = userLanguage.startsWith('ru');
        const phrases = isRussian ? 
            ['Python + JS Dev', 'Full stack enjoyer', 'Arch user', 'Напишу сюда.. например', 'Я рыгнул'] : 
            ['Python + JS Dev', 'Full stack enjoyer', 'Arch user', 'Just writing here.. for example', 'SUKA BLYAT'];
        let phraseIndex = 0;
        const time_pause = 100; 
        const display_time = 1500;

        if (isRussian) {
            document.querySelector('h1').innerHTML = 'Ку, я <span class="gradient-text">AR34!</span>';
            document.querySelector('.btn.details').innerHTML = '<img src="https://img.icons8.com/?size=100&id=6cdJEps4HrFl&format=png&color=FFFFFF" alt="Details"> Подробнее тут';
        } else {
            document.querySelector('h1').innerHTML = 'Hi, I\'m <span class="gradient-text">AR34!</span>';
            document.querySelector('.btn.details').innerHTML = '<img src="https://img.icons8.com/?size=100&id=6cdJEps4HrFl&format=png&color=FFFFFF" alt="Details"> More details here';
        }

        const russianMessage = document.getElementById('russian-only-message');
        if (russianMessage && isRussian) {
            russianMessage.style.display = 'block';
        }

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
                        subtitleElement.innerHTML = text;
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
                if (window.innerWidth <= 480) {
                    this.size = Math.random() * 3 + 1;
                } else {
                    this.size = Math.random() * 4 + 1;
                }
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