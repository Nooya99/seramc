setTimeout(() => {
            const toast = document.getElementById('notice-toast');
            if(toast) toast.classList.add('show');
        }, 1200);

        const navbarInner = document.getElementById('navbar-inner');
        if (navbarInner) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbarInner.style.background = 'rgba(11,17,33,0.85)';
                    navbarInner.style.border = '1px solid rgba(255,255,255,0.3)';
                } else {
                    navbarInner.style.background = 'rgba(11,17,33,0.5)';
                    navbarInner.style.border = '1px solid rgba(255,255,255,0.15)';
                }
            }, { passive: true });
        }

        const reveals = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); revealObserver.unobserve(e.target); } });
        }, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });
        reveals.forEach(el => revealObserver.observe(el));

        // Logic Accordion FAQ 
        document.querySelectorAll('.faq-item').forEach(item => {
            item.querySelector('button').addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                if (!isActive) { 
                    item.classList.add('active'); 
                    const a = item.querySelector('.faq-answer'); 
                    a.style.maxHeight = a.scrollHeight + "px"; 
                } else {
                    item.classList.remove('active'); 
                    const a = item.querySelector('.faq-answer'); 
                    a.style.maxHeight = null;
                }
            });
        });

        // Modal Function
        let pendingPurchase = null;

        // =========================================================================
        // SILAKAN UBAH NOMOR WHATSAPP ADMIN DI BAWAH INI (Gunakan kode negara, misal 62)
        // =========================================================================
        const adminWhatsAppNumbers = [
            '628123456789', // Nomor WhatsApp Admin 1 (Owner)
            '628123456789', // Nomor WhatsApp Admin 2
            '628123456789'  // Nomor WhatsApp Admin 3
        ];

        function buyRank(rankName, duration, price) {
            pendingPurchase = { rank: rankName, duration: duration, price: price };
            openModal('contact-modal');
            updateAdminLinks();
        }

        function updateAdminLinks() {
            const message = pendingPurchase 
                ? `Halo Admin, saya tertarik untuk membeli Rank ${pendingPurchase.rank} (${pendingPurchase.duration}) seharga ${pendingPurchase.price}.` 
                : 'Halo Admin, saya ingin bertanya tentang server SERA MC.';
            const encodedText = encodeURIComponent(message);
            
            // Get all admin links inside contact-modal (they are the first 3 links inside the vertical list)
            const adminContainer = document.querySelector('#contact-modal .flex-col');
            if (adminContainer) {
                const adminLinks = adminContainer.querySelectorAll('a');
                adminLinks.forEach((link, index) => {
                    // Gunakan nomor dari array berdasarkan urutan tombol admin
                    const phone = adminWhatsAppNumbers[index] || '628123456789';
                    link.setAttribute('href', `https://wa.me/${phone}?text=${encodedText}`);
                });
            }
        }

        function openModal(id) { 
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.add('active'); 
                document.body.style.overflow = 'hidden'; 
                if (id === 'contact-modal' && !pendingPurchase) {
                    updateAdminLinks();
                }
            }
        }
        
        function closeModal(id) { 
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.remove('active'); 
                document.body.style.overflow = 'auto'; 
                if (id === 'contact-modal') {
                    pendingPurchase = null;
                }
            }
        }

        // Close modal on ESC key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    closeModal(modal.id);
                });
            }
        });

        // Close modal when clicking outside content (backdrop click)
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal.id);
                }
            });
        });

        function copyIP(elementId, msgId) {
            const text = document.getElementById(elementId).innerText;
            const showSuccess = () => {
                const msg = document.getElementById(msgId);
                if (msg) {
                    msg.style.opacity = '1'; 
                    setTimeout(() => msg.style.opacity = '0', 2000);
                }
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(showSuccess).catch(() => {
                    fallbackCopy(text, showSuccess);
                });
            } else {
                fallbackCopy(text, showSuccess);
            }
        }

        function fallbackCopy(text, callback) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                if (callback) callback();
            } catch (err) {
                console.error('Copy fallback failed', err);
            }
            document.body.removeChild(textarea);
        }

        // Action submit feedback visual
        function submitFeedback() {
            const btn = document.querySelector('#feedback-modal button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerHTML = '<i class="fa-solid fa-check mr-2"></i> Terkirim!';
            btn.classList.replace('bg-[#f2e28a]', 'bg-green-500');
            btn.classList.replace('hover:bg-[#e6d680]', 'hover:bg-green-600');
            btn.classList.replace('text-gray-900', 'text-white');
            
            setTimeout(() => {
                closeModal('feedback-modal');
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.replace('bg-green-500', 'bg-[#f2e28a]');
                    btn.classList.replace('hover:bg-green-600', 'hover:bg-[#e6d680]');
                    btn.classList.replace('text-white', 'text-gray-900');
                    document.querySelector('#feedback-modal form').reset();
                }, 300);
            }, 1500);
        }

        // =========================================
        // LOGIC PHOTO SLIDER (About Section)
        // =========================================
        let currentSlide = 0;
        const totalSlides = 4;
        const sliderTrack = document.getElementById('about-slider');
        const sliderDots = document.querySelectorAll('.slider-dot');
        let slideInterval;

        function updateSlider() {
            sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            sliderDots.forEach((dot, index) => {
                if(index === currentSlide) {
                    dot.classList.replace('bg-white/40', 'bg-white/80');
                    dot.classList.add('scale-125');
                } else {
                    dot.classList.replace('bg-white/80', 'bg-white/40');
                    dot.classList.remove('scale-125');
                }
            });
        }

        function moveSlide(direction, isManual = false) {
            currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
            updateSlider();
            if (isManual) resetInterval();
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
            resetInterval();
        }

        function startInterval() {
            slideInterval = setInterval(() => {
                moveSlide(1, false);
            }, 3500);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        startInterval();

        // =========================================
        // LOGIC 3D COVERFLOW SHOP SLIDER
        // =========================================
        let currentShopIndex = 0;
        const shopCards = document.querySelectorAll('.shop-card');
        const totalShopCards = shopCards.length;

        function updateShopSlider() {
            shopCards.forEach((card, index) => {
                card.classList.remove('center', 'left', 'right', 'hidden-card');
                card.onclick = null; 
                
                if (index === currentShopIndex) {
                    card.classList.add('center');
                } else if (index === (currentShopIndex - 1 + totalShopCards) % totalShopCards) {
                    card.classList.add('left');
                    card.onclick = () => moveShop(-1); 
                } else if (index === (currentShopIndex + 1) % totalShopCards) {
                    card.classList.add('right');
                    card.onclick = () => moveShop(1); 
                } else {
                    card.classList.add('hidden-card');
                }
            });
        }

        function moveShop(step) {
            currentShopIndex = (currentShopIndex + step + totalShopCards) % totalShopCards;
            updateShopSlider();
        }

        updateShopSlider();

        // =========================================
        // LOGIC 3D COVERFLOW RACES SLIDER
        // =========================================
        let currentRaceIndex = 0;
        const raceCards = document.querySelectorAll('.race-card');
        const totalRaceCards = raceCards.length;

        function updateRaceSlider() {
            raceCards.forEach((card, index) => {
                card.classList.remove('center', 'left', 'right', 'hidden-card');
                card.onclick = null; 
                
                if (index === currentRaceIndex) {
                    card.classList.add('center');
                } else if (index === (currentRaceIndex - 1 + totalRaceCards) % totalRaceCards) {
                    card.classList.add('left');
                    card.onclick = () => moveRace(-1); 
                } else if (index === (currentRaceIndex + 1) % totalRaceCards) {
                    card.classList.add('right');
                    card.onclick = () => moveRace(1); 
                } else {
                    card.classList.add('hidden-card');
                }
            });
        }

        function moveRace(step) {
            currentRaceIndex = (currentRaceIndex + step + totalRaceCards) % totalRaceCards;
            updateRaceSlider();
        }

        updateRaceSlider();