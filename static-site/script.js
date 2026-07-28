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
            '6283178533575', // Nomor WhatsApp Admin 1 (Kira)
            '6285273165229', // Nomor WhatsApp Admin 2 (Kaes)
            '6283119355072'  // Nomor WhatsApp Admin 3 (Finn)
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
// =========================================
// E-COMMERCE LOGIC (SHOP, CART, CHECKOUT)
// =========================================

let cart = JSON.parse(localStorage.getItem('sera_cart')) || [];
let playerIgn = localStorage.getItem('sera_ign') || '';

function saveCart() {
    localStorage.setItem('sera_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerText = cart.length;
    
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    if (!container || !totalEl) return;
    
    container.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-400 py-8">Keranjang belanja kosong.</div>';
        totalEl.innerText = 'Rp 0';
        return;
    }
    
    cart.forEach((item, index) => {
        total += item.price;
        container.innerHTML += `
            <div class="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                <div>
                    <h4 class="font-bold text-white">${item.name}</h4>
                    <p class="text-sm text-gray-400">${item.duration}</p>
                    <p class="text-[#f2e28a] font-medium mt-1">Rp ${item.price.toLocaleString('id-ID')}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-300 p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    totalEl.innerText = 'Rp ' + total.toLocaleString('id-ID');
}

function addToCart(productJson) {
    const product = JSON.parse(decodeURIComponent(productJson));
    cart.push({
        id: product.id,
        name: product.name,
        price: product.discount > 0 ? product.price * (1 - product.discount/100) : product.price,
        duration: product.duration || 'Permanen'
    });
    saveCart();
    
    // Show toast
    const toast = document.getElementById('notice-toast');
    if(toast) {
        toast.innerHTML = '<i class="fa-solid fa-check-circle mr-2"></i> Berhasil ditambahkan ke keranjang!';
        toast.classList.replace('bg-rose-500/20', 'bg-green-500/20');
        toast.classList.replace('text-rose-200', 'text-green-200');
        toast.classList.replace('border-rose-500/30', 'border-green-500/30');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

function openPlayerLogin() {
    document.getElementById('player-ign-input').value = playerIgn;
    openModal('player-login-modal');
}

function savePlayerLogin() {
    const ign = document.getElementById('player-ign-input').value.trim();
    if (!ign) {
        alert('Username tidak boleh kosong!');
        return;
    }
    playerIgn = ign;
    localStorage.setItem('sera_ign', playerIgn);
    updatePlayerUI();
    closeModal('player-login-modal');
}

function updatePlayerUI() {
    const display = document.getElementById('shop-ign-display');
    if (display) {
        display.innerText = playerIgn ? playerIgn : 'Belum Login';
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Keranjang belanja kosong!');
        return;
    }
    if (!playerIgn) {
        alert('Silakan isi Username Minecraft kamu terlebih dahulu!');
        openPlayerLogin();
        return;
    }
    
    let total = 0;
    let itemsText = cart.map((item, i) => {
        total += item.price;
        return `${i+1}. ${item.name} (${item.duration}) - Rp ${item.price.toLocaleString('id-ID')}`;
    }).join('%0A'); // URL encoded newline
    
    let message = `Halo Admin SERA MC,%0ASaya ingin melakukan pembelian item berikut:%0A%0A*IGN:* ${playerIgn}%0A%0A*Pesanan:*%0A${itemsText}%0A%0A*Total:* Rp ${total.toLocaleString('id-ID')}%0A%0AMohon panduannya untuk pembayaran. Terima kasih!`;
    
    window.location.href = `https://wa.me/6283178533575?text=${message}`;
}

// Render Shop Products
function renderShop(category = 'Rank') {
    const container = document.getElementById('shop-products-container');
    const tabsContainer = document.getElementById('shop-tabs');
    if (!container || !window.SERA_PRODUCTS) return;
    
    const categories = ['Rank', 'Keys', 'Others'];
    
    tabsContainer.innerHTML = categories.map(cat => `
        <button onclick="renderShop('${cat}')" class="px-5 py-2.5 rounded-xl font-bold transition-all ${category === cat ? 'bg-[#f2e28a] text-gray-900 shadow-[0_0_15px_rgba(242,226,138,0.4)]' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'}">
            ${cat}
        </button>
    `).join('');
    
    let items = window.SERA_PRODUCTS.filter(p => {
        if (category === 'Keys') return (p.category || '').toLowerCase().includes('key') || (p.category || '').toLowerCase().includes('crate');
        if (category === 'Others') return (p.category || '').toLowerCase().includes('other');
        return (p.category || '').toLowerCase() === category.toLowerCase();
    });
    
    if (items.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-400 py-12">Tidak ada produk di kategori ini.</div>';
        return;
    }
    
    container.innerHTML = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">' + items.map(p => {
        const finalPrice = p.discount > 0 ? p.price * (1 - p.discount/100) : p.price;
        const encodedData = encodeURIComponent(JSON.stringify(p));
        return `
            <div class="bg-black/30 border border-white/10 rounded-2xl p-5 hover:border-[#f2e28a]/40 transition-colors flex flex-col">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="font-bold text-lg text-white">${p.name}</h3>
                    ${p.discount > 0 ? `<span class="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded-md">-${p.discount}%</span>` : ''}
                </div>
                <p class="text-gray-400 text-sm mb-4 line-clamp-2">${p.description || p.category}</p>
                <div class="mt-auto">
                    ${p.discount > 0 ? `<p class="text-gray-500 text-sm line-through">Rp ${p.price.toLocaleString('id-ID')}</p>` : ''}
                    <div class="flex justify-between items-center mt-1">
                        <span class="text-[#f2e28a] font-bold text-xl">Rp ${finalPrice.toLocaleString('id-ID')}</span>
                        <button onclick="addToCart('${encodedData}')" class="bg-white/10 hover:bg-white/20 text-white rounded-lg p-2.5 transition-colors">
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('') + '</div>';
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    updatePlayerUI();
    renderShop('Rank');
});
