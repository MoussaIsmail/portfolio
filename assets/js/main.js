
        document.addEventListener('DOMContentLoaded', () => {
            // 1. Theme Toggle
            const themeToggleBtn = document.getElementById('theme-toggle');
            const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

            const currentTheme = localStorage.getItem('theme');
            if (currentTheme === 'light') {
                document.body.classList.add('light-mode');
                if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
            }

            if (themeToggleBtn) themeToggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('light-mode');
                if (document.body.classList.contains('light-mode')) {
                    localStorage.setItem('theme', 'light');
                    if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
                } else {
                    localStorage.setItem('theme', 'dark');
                    if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
                }
            });


            // Menu mobile
            const menuToggle = document.getElementById('menu-toggle');
            const navLinksMobile = document.querySelector('.nav-links');
            if (menuToggle && navLinksMobile) {
                menuToggle.addEventListener('click', () => {
                    const isOpen = navLinksMobile.classList.toggle('open');
                    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                    const icon = menuToggle.querySelector('i');
                    if (icon) icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
                });
                navLinksMobile.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
                    navLinksMobile.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    const icon = menuToggle.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-bars';
                }));
            }

            // 2. Animation Scroll (Reveal)
            const reveals = document.querySelectorAll('.reveal');
            const revealOnScroll = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, { threshold: 0.1 });
            reveals.forEach(reveal => revealOnScroll.observe(reveal));

            // 3. ScrollSpy (Menu)
            const sections = document.querySelectorAll('.section-target, .hero-section');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            window.addEventListener('scroll', () => {
                let current = "";
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (pageYOffset >= (sectionTop - 200)) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href').includes(current)) {
                        link.classList.add('active-link');
                    }
                });
            });

            // 4. Back to Top Button
            const backToTopBtn = document.getElementById("backToTop");
            window.addEventListener("scroll", () => {
                if (window.scrollY > 400) backToTopBtn.classList.add("visible");
                else backToTopBtn.classList.remove("visible");
            });

            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // 5. Canvas Animation
            const canvas = document.getElementById('network-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                let width, height, particles;
                function initCanvas() {
                    width = canvas.width = window.innerWidth;
                    height = canvas.height = window.innerHeight;
                    particles = [];
                    for (let i = 0; i < 15; i++) {
                        particles.push({
                            x: Math.random() * width,
                            y: Math.random() * height,
                            vx: (Math.random() - 0.5) * 1,
                            vy: (Math.random() - 0.5) * 1,
                            radius: Math.random() * 2 + 1.5
                        });
                    }
                }
                function animateCanvas() {
                    ctx.clearRect(0, 0, width, height);
                    particles.forEach(p => {
                        p.x += p.vx; p.y += p.vy;
                        if (p.x < 0 || p.x > width) p.vx *= -1;
                        if (p.y < 0 || p.y > height) p.vy *= -1;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                        
                        // Adapt particle color based on theme
                        const isLightMode = document.body.classList.contains('light-mode');
                        ctx.fillStyle = isLightMode ? 'rgba(2, 132, 199, 0.4)' : 'rgba(72, 219, 251, 0.8)';
                        ctx.fill();
                    });
                    for (let i = 0; i < particles.length; i++) {
                        for (let j = i + 1; j < particles.length; j++) {
                            const dx = particles[i].x - particles[j].x;
                            const dy = particles[i].y - particles[j].y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            if (distance < 160) {
                                ctx.beginPath();
                                const isLightMode = document.body.classList.contains('light-mode');
                                const opacity = (1 - distance / 160) * (isLightMode ? 0.3 : 0.5);
                                ctx.strokeStyle = isLightMode ? `rgba(2, 132, 199, ${opacity})` : `rgba(72, 219, 251, ${opacity})`;
                                ctx.lineWidth = 1;
                                ctx.moveTo(particles[i].x, particles[i].y);
                                ctx.lineTo(particles[j].x, particles[j].y);
                                ctx.stroke();
                            }
                        }
                    }
                    requestAnimationFrame(animateCanvas);
                }
                initCanvas();
                animateCanvas();
                window.addEventListener('resize', initCanvas);
            }

            // 6. Project Filters
            const filterBtns = document.querySelectorAll('.filter-btn');
            const projectCards = document.querySelectorAll('.projet-card');

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const filterValue = btn.getAttribute('data-filter');

                    projectCards.forEach(card => {
                        const categories = card.getAttribute('data-category');
                        if (filterValue === 'all' || categories.includes(filterValue)) {
                            card.classList.remove('hide-project');
                        } else {
                            card.classList.add('hide-project');
                        }
                    });
                });
            });

            // 7. Modal Logic
            const modal = document.getElementById('modal-projet');
            const dynamicContent = document.querySelector('.modal-dynamic-content');
            const btnClose = document.querySelector('.modal-close');
            const modalOverlay = document.querySelector('.modal-overlay');

            document.querySelectorAll('.projet-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const card = btn.closest('.projet-card');
                    
                    const titre = card.getAttribute('data-titre');
                    const tags = card.getAttribute('data-tags') ? card.getAttribute('data-tags').split(',') : [];
                    const objectif = card.getAttribute('data-objectif');
                    const realisation = card.getAttribute('data-realisation');
                    const competences = card.getAttribute('data-competences') ? card.getAttribute('data-competences').split(',') : [];
                    const livrables = card.getAttribute('data-livrable') ? card.getAttribute('data-livrable').split(',') : [];
                    const preuveLink = card.getAttribute('data-preuve-link');
                    const preuveNom = card.getAttribute('data-preuve-nom') || 'Preuve du projet';

                    let tagsHtml = tags.map(tag => `<span>${tag.trim()}</span>`).join('');
                    let competencesHtml = competences.map(comp => `<li>${comp.trim()}</li>`).join('');
                    let livrablesHtml = livrables.length ? `<h4>Livrables associés</h4><ul>${livrables.map(liv => `<li>${liv.trim()}</li>`).join('')}</ul>` : '';
                    let preuveHtml = preuveLink ? `
                        <h4>Preuve cliquable</h4>
                        <a href="${preuveLink}" target="_blank" class="btn btn-secondary modal-proof-link">
                            <i class="fa-solid fa-up-right-from-square" style="margin-right: 8px;"></i>${preuveNom}
                        </a>
                    ` : '';
                    
                    let pdfHtml = livrables.length ? `
                        <div class="modal-download" style="text-align: center; margin-top: 2.5rem; padding: 1.5rem; background: rgba(0, 168, 255, 0.05); border-radius: 8px; border: 1px dashed rgba(0, 168, 255, 0.3);">
                            <p style="font-size: 0.95rem; margin-bottom: 1rem;">
                                🔒 <strong>Confidentialité</strong> : Les livrables confidentiels ou complets peuvent être transmis sur demande.
                            </p>
                            <a href="mailto:moussa.ismail@etu.unice.fr?subject=Demande de livrable : ${titre}" class="btn btn-primary" style="color: white !important;">✉️ Me contacter</a>
                        </div>
                    ` : '';

                    dynamicContent.innerHTML = `
                        <h3>${titre}</h3>
                        <div class="projet-tags" style="margin-top: 1rem;">${tagsHtml}</div>
                        <h4>Objectif</h4>
                        <p>${objectif}</p>
                        <h4>Mon Implication</h4>
                        <p>${realisation}</p>
                        <h4>Compétences</h4>
                        <ul>${competencesHtml}</ul>
                        ${livrablesHtml}
                        ${preuveHtml}
                        ${pdfHtml}
                    `;
                    
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; 
                });
            });

            function closeModal() {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }

            btnClose.addEventListener('click', closeModal);
            modalOverlay.addEventListener('click', closeModal);
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
            });

            // 8. GoToProject from Competences
            window.goToProject = function(event, filterValue, projectTitle) {
                event.preventDefault(); 
                document.getElementById('projets').scrollIntoView({ behavior: 'smooth' });
                
                setTimeout(() => {
                    const btnToClick = document.querySelector(`.filter-btn[data-filter="${filterValue}"]`);
                    if(btnToClick) btnToClick.click();
                    
                    setTimeout(() => {
                        let targetCard = null;
                        document.querySelectorAll('.projet-card').forEach(card => {
                            if(card.getAttribute('data-titre') === projectTitle) {
                                targetCard = card;
                            }
                        });

                        if(targetCard) {
                            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            targetCard.classList.add('highlight-card');
                            setTimeout(() => {
                                targetCard.classList.remove('highlight-card');
                            }, 2500); 
                        }
                    }, 300);
                }, 300);
            };
        });

        // 9. Lightbox Function (Global)
        window.openLightbox = function(imgSrc, captionText) {
            const lightbox = document.getElementById('lightbox-overlay');
            const img = document.getElementById('lightbox-img');
            const caption = document.getElementById('lightbox-caption');
            
            img.src = imgSrc;
            caption.innerText = captionText;
            lightbox.style.display = 'flex';
            
            lightbox.onclick = function() { lightbox.style.display = 'none'; };
        };
    