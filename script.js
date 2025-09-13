// IIFE to avoid polluting the global scope
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        
        // --- Element Selection ---
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.getElementById('menu-btn');
        const menuOverlay = document.getElementById('menu-overlay');
        const mainContent = document.getElementById('main-content');
        const toTopBtn = document.getElementById('to-top-btn');
        const navLinks = sidebar.querySelectorAll('.nav-link');
        const contentSections = mainContent.querySelectorAll('.content-section');

        // --- Mobile Menu Functionality ---
        const toggleMenu = () => {
            sidebar.classList.toggle('-translate-x-full');
            menuOverlay.classList.toggle('hidden');
        };
        menuBtn.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);

        // --- Page Navigation Logic ---
        const showSection = (targetId) => {
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        };

        const updateActiveLink = (targetId) => {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${targetId}`);
            });
        };

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                
                showSection(targetId);
                updateActiveLink(targetId);
                history.pushState(null, null, `#${targetId}`);
                mainContent.scrollTop = 0; // Scroll to top on new section
                
                if (window.innerWidth < 768) {
                    toggleMenu();
                }
            });
        });

        // --- Back to Top Button ---
        mainContent.addEventListener('scroll', () => {
            if (mainContent.scrollTop > 300) {
                toTopBtn.classList.add('show');
            } else {
                toTopBtn.classList.remove('show');
            }
        });

        toTopBtn.addEventListener('click', () => {
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // --- Initial Page Load Setup ---
        const setInitialState = () => {
            const currentHash = window.location.hash || '#gates';
            const targetId = currentHash.substring(1);
            showSection(targetId);
            updateActiveLink(targetId);
        };
        setInitialState();

        // --- Copy to Clipboard Functionality ---
        const copyButtons = document.querySelectorAll('.copy-button');
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const code = button.nextElementSibling.querySelector('code').innerText;
                const textarea = document.createElement('textarea');
                textarea.value = code;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                    button.innerText = 'Error';
                }
                document.body.removeChild(textarea);

                setTimeout(() => {
                    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>';
                }, 2000);
            });
        });

        // --- Background Animation ---
        const canvas = document.getElementById('background-animation');
        const ctx = canvas.getContext('2d');
        let particlesArray;

        class Particle {
            constructor(x, y, directionX, directionY, size) {
                this.x = x; this.y = y;
                this.directionX = directionX; this.directionY = directionY;
                this.size = size;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = '#223c6fe6';
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX; this.y += this.directionY;
                this.draw();
            }
        }
        
        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * (innerWidth - size * 2));
                let y = (Math.random() * (innerHeight - size * 2));
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                particlesArray.push(new Particle(x, y, directionX, directionY, size));
            }
        }

        function connect(){
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = Math.sqrt((particlesArray[a].x - particlesArray[b].x) ** 2 + (particlesArray[a].y - particlesArray[b].y) ** 2);
                    if (distance < (canvas.width / 8)) {
                        opacityValue = 1 - (distance / 150);
                        ctx.strokeStyle='rgba(34,60,111,' + opacityValue + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0,0,innerWidth, innerHeight);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    });
})();

