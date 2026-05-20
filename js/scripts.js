document.addEventListener('DOMContentLoaded', function() {

    // --- Header Scroll Effect ---
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Navigation Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
    });

    // Close mobile menu on link click
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !menuToggle.contains(e.target) && mainNav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        }
    });

    // --- Hero Particle Animation ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.8 + 0.6;
                this.speedX = Math.random() * 0.3 - 0.15;
                this.speedY = Math.random() * 0.3 - 0.15;
                this.opacity = Math.random() * 0.4 + 0.55;
                this.twinkleSpeed = Math.random() * 0.02 + 0.005;
                this.twinkleOffset = Math.random() * Math.PI * 2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.twinkleOffset += this.twinkleSpeed;
                if (this.x < -this.size) this.x = canvas.width + this.size;
                if (this.x > canvas.width + this.size) this.x = -this.size;
                if (this.y < -this.size) this.y = canvas.height + this.size;
                if (this.y > canvas.height + this.size) this.y = -this.size;
            }
            draw() {
                const pulse = Math.sin(this.twinkleOffset) * 0.45 + 0.55;
                const alpha = this.opacity * pulse;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
                ctx.shadowBlur = this.size * 10;
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        function initParticles() {
            const particleCount = window.innerWidth < 768 ? 55 : 120;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();
        window.addEventListener('resize', initParticles);


        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // --- Testimonial Carousel ---
    const slider = document.getElementById('testimonial-slider');
    const carousel = document.getElementById('testimonial-carousel');
    if (slider && carousel) {
        const slides = slider.children;
        let currentIndex = 0;
        let intervalId;

        function goToSlide(index) {
            slider.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        }

        function nextSlide() {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        }

        function startCarousel() {
            intervalId = setInterval(nextSlide, 5000);
        }

        function stopCarousel() {
            clearInterval(intervalId);
        }

        carousel.addEventListener('mouseenter', stopCarousel);
        carousel.addEventListener('mouseleave', startCarousel);

        startCarousel();
    }

    // --- Intersection Observer for Scroll Animations ---
    const animatedElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- Lazy Loading Images ---
    const lazyImages = document.querySelectorAll('img.lazy');
    const lazyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                lazyObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        lazyObserver.observe(img);
    });

    // --- Web3Forms Submission ---
    // Handle both quote-form and contact-form
    const forms = ['quote-form', 'contact-form'];

    forms.forEach(formId => {
        const form = document.getElementById(formId);
        const result = document.getElementById('form-result');

        if (form && result) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                const formData = new FormData(form);
                const object = {};
                formData.forEach((value, key) => {
                    object[key] = value;
                });
                const json = JSON.stringify(object);

                // Show loading state
                result.innerHTML = "Sending your enquiry...";
                result.style.display = "block";
                result.className = "";

                // Disable submit button
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span>Sending...</span>';
                }

                fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: json
                    })
                    .then(async (response) => {
                        let jsonResponse = await response.json();
                        if (response.status == 200) {
                            result.innerHTML = "✓ Thank you! We'll get back to you within 24 hours.";
                            result.className = "success";
                            form.reset();
                        } else {
                            console.log(response);
                            result.innerHTML = "✗ " + (jsonResponse.message || "Something went wrong. Please try again.");
                            result.className = "error";
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        result.innerHTML = "✗ Network error. Please check your connection and try again.";
                        result.className = "error";
                    })
                    .finally(() => {
                        // Re-enable submit button
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = '<span>Send Enquiry</span>';
                        }

                        // Hide result after 8 seconds
                        setTimeout(() => {
                            result.style.display = "none";
                            result.className = "";
                        }, 8000);
                    });
            });
        }
    });

    // --- Gallery Lightbox ---
    const lightbox = document.getElementById('gallery-lightbox');
    if (lightbox) {
        const lbImg = document.getElementById('lightbox-img');
        const lbTitle = document.getElementById('lightbox-title');
        const lbCounter = document.getElementById('lightbox-counter');
        const lbLabel = document.getElementById('lightbox-label');
        const lbThumbs = document.getElementById('lightbox-thumbnails');
        const lbPrev = document.getElementById('lightbox-prev');
        const lbNext = document.getElementById('lightbox-next');
        const lbClose = document.getElementById('lightbox-close');

        const LABELS = ['Before', 'During', 'During', 'Detail', 'After'];
        let images = [];
        let currentIndex = 0;

        function showImage(index) {
            currentIndex = index;
            const src = images[index];
            lbImg.classList.add('fading');
            setTimeout(() => {
                lbImg.src = src;
                lbImg.alt = lbTitle.textContent + ' — photo ' + (index + 1);
                lbImg.classList.remove('fading');
            }, 150);
            lbCounter.textContent = (index + 1) + ' / ' + images.length;
            lbLabel.textContent = LABELS[index] || '';
            lbPrev.disabled = index === 0;
            lbNext.disabled = index === images.length - 1;
            lbThumbs.querySelectorAll('.lightbox-thumb').forEach((t, i) => {
                t.classList.toggle('active', i === index);
            });
        }

        function openLightbox(jobTitle, jobImages, startIndex) {
            images = jobImages;
            lbTitle.textContent = jobTitle;
            lbThumbs.innerHTML = '';
            jobImages.forEach((src, i) => {
                const thumb = document.createElement('button');
                thumb.className = 'lightbox-thumb' + (i === startIndex ? ' active' : '');
                thumb.setAttribute('aria-label', 'View photo ' + (i + 1));
                const img = document.createElement('img');
                img.src = src;
                img.alt = '';
                thumb.appendChild(img);
                thumb.addEventListener('click', () => showImage(i));
                lbThumbs.appendChild(thumb);
            });
            showImage(startIndex);
            lightbox.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            lbClose.focus();
        }

        function closeLightbox() {
            lightbox.classList.remove('is-open');
            document.body.style.overflow = '';
        }

        document.querySelectorAll('.gallery-item[data-job-images]').forEach(item => {
            item.addEventListener('click', () => {
                const title = item.dataset.jobTitle || '';
                let imgs;
                try { imgs = JSON.parse(item.dataset.jobImages); } catch (e) { return; }
                if (!imgs || !imgs.length) return;
                openLightbox(title, imgs, 0);
            });
        });

        lbClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        lbPrev.addEventListener('click', () => { if (currentIndex > 0) showImage(currentIndex - 1); });
        lbNext.addEventListener('click', () => { if (currentIndex < images.length - 1) showImage(currentIndex + 1); });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft' && currentIndex > 0) showImage(currentIndex - 1);
            if (e.key === 'ArrowRight' && currentIndex < images.length - 1) showImage(currentIndex + 1);
        });

        // Touch swipe support
        let touchStartX = 0;
        lbImg.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
        lbImg.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentIndex < images.length - 1) showImage(currentIndex + 1);
                if (diff < 0 && currentIndex > 0) showImage(currentIndex - 1);
            }
        });
    }

    // --- Gallery Category Filter ---
    const filterBtns = document.querySelectorAll('.gallery-filter');
    if (filterBtns.length) {
        const galleryItems = document.querySelectorAll('.gallery-item');

        function applyFilter(filter) {
            galleryItems.forEach(item => {
                const show = filter === 'all' ? item.classList.contains('cat-all') : item.classList.contains('cat-' + filter);
                item.style.display = show ? '' : 'none';
            });
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyFilter(btn.dataset.filter);
            });
        });

        applyFilter('all');
    }

});
