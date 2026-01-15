// 1. REGISTO DOS PLUGINS
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

let smoother;

// 2. INICIALIZAÇÃO DO SCROLLER
window.addEventListener("load", function() {
    smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
        effects: true
    });

    ScrollTrigger.refresh();

    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);
    
    // Iniciar contador após carregamento
    setTimeout(animateCounter, 500);
});

// 3. DADOS DOS PRODUTOS
const productsData = {
    starter: {
        title: "Starter Pack",
        price: "10€",
        image: "./images/website-images/starter-pack.png",
        badge: "Iniciante",
        stripeLink: "https://buy.stripe.com/dRm6oG8rx5z0gMx3hT0gw00",
        description: "O pacote ideal para quem está a começar ou quer um boost rápido sem exageros. Perfeito para iniciantes que querem ter uma base sólida em Los Santos.",
        details: [
            "10 Milhões GTA$", 
            "Nível 120", 
            "Stats no máximo",
        ],
        guarantees: [
            { icon: "🔒", text: "Pagamento 100% Seguro" },
            { icon: "⚡", text: "Entrega em até 24h" },
            { icon: "‎ ✓", text: "‎ Suporte 24/7" }
        ]
    },
    kingpin: {
        title: "Kingpin Pack",
        price: "40€",
        image: "./images/website-images/kingpin-pack.png",
        badge: "Mais Popular",
        stripeLink: "https://buy.stripe.com/00waEW239d1sbsdg4F0gw01",
        description: "Torne-se o dono de Los Santos com o pacote mais completo. Dinheiro ilimitado, tudo desbloqueado e carros exclusivos para dominar as ruas.",
        details: [
            "Entrega Prioritária", 
            "50 Milhões GTA$", 
            "Nível à escolha (até 8000)", 
            "Unlock All (Roupas/Tattoos)",
            "Stats Máximos",
            "Corridinha Mod (Fast Run)",
            "10 Carros Mod",
            "10 Trajes Mod"
        ],
        guarantees: [
            { icon: "🔒", text: "Pagamento 100% Seguro" },
            { icon: "⚡", text: "Entrega Prioritária" },
            { icon: "‎ ✓", text: "‎ Suporte 24/7" }
        ]
    },
    cars: {
        title: "Modded Garage",
        price: "25€",
        image: "./images/website-images/modded-garage.png",
        badge: "Exclusivo",
        stripeLink: "https://buy.stripe.com/cNi00iazF6D4ao9aKl0gw02",
        description: "Enchemos uma garagem completa de 10 carros à sua escolha com modificações raras e exclusivas que não encontras em mais lado nenhum.",
        details: [
            "10 Carros Mod à escolha", 
            "Rodas F1 ou Benny's", 
            "Pinturas Mod", 
            "Placas Personalizadas/Limpas",
            "Buzinas Mod"
        ],
        guarantees: [
            { icon: "🔒", text: "Pagamento 100% Seguro" },
            { icon: "⚡", text: "Entrega em até 24h" },
            { icon: "‎ ✓", text: "‎ Suporte 24/7" }
        ]
    }
};

// 4. LÓGICA DO MODAL DE PRODUTOS
const modal = document.getElementById("product-modal");
const modalDetails = document.getElementById("modal-details");

function openProduct(productId) {
    const product = productsData[productId];
    if (!product) return;

    modalDetails.innerHTML = `
        <div class="modal-layout">
            <div class="modal-left">
                <div class="modal-image-wrapper">
                    <span class="modal-badge">${product.badge}</span>
                    <img draggable="false" src="${product.image}" alt="${product.title}" class="modal-product-image">
                </div>
                <div class="modal-guarantees-box">
                    <h4 class="guarantees-title">Garantias:</h4>
                    ${product.guarantees.map(g => `
                        <div class="guarantee-item">
                            <span class="guarantee-icon">${g.icon}</span>
                            <span class="guarantee-text">${g.text}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="trust-badges">
                    <div class="trust-item">
                        <span class="trust-icon">⭐</span>
                        <span class="trust-text">4.8 Rating</span>
                    </div>
                    <div class="trust-item">
                        <span class="trust-icon">👥</span>
                        <span class="trust-text">100+ Clientes</span>
                    </div>
                </div>
            </div>
            <div class="modal-right">
                <div class="modal-header-section">
                    <h2 class="modal-title">${product.title}</h2>
                    <div class="modal-price-box">
                        <span class="price-label">Apenas</span>
                        <span class="modal-price">${product.price}</span>
                    </div>
                </div>
                <p class="modal-desc">${product.description}</p>
                
                <div class="modal-features-section">
                    <h3 class="modal-subtitle">
                        <span class="subtitle-icon">📦</span>
                        O que está incluído:
                    </h3>
                    <ul class="features modal-features">
                        ${product.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                </div>

                <div class="modal-footer">
                    <div class="payment-section">
                        <p class="payment-label">
                            Métodos de Pagamento Aceites
                        </p>
                        <div class="payment-methods">
                            <span class="pay-icon">
                                <img draggable="false" src="https://www.vectorlogo.zone/logos/stripe/stripe-ar21~bgwhite.svg" class="btn-icon">
                            </span>
                        </div>
                    </div>
                    <a href="${product.stripeLink}" target="_blank" class="btn-buy">
                        <span class="btn-icon">
                            <img draggable="false" src="https://www.vectorlogo.zone/logos/stripe/stripe-ar21~bgwhite.svg" class="btn-icon">
                        </span>
                        <span class="btn-text">Comprar Agora</span>
                        <span class="btn-arrow">→</span>
                    </a>
                    <p class="secure-note">
                        <span class="secure-icon">🔒</span>
                        Pagamento 100% seguro e encriptado via Stripe
                    </p>
                </div>
            </div>
        </div>
    `;

    modal.classList.add("show");
    
    if (smoother) smoother.paused(true);
}

function closeProduct() {
    modal.classList.remove("show");
    if (smoother) smoother.paused(false);
}

// 5. LÓGICA DO MODAL DE IMAGEM (PRINTS)
const imageModal = document.getElementById("image-modal");
const fullImage = document.getElementById("full-image");

function openImage(src) {
    fullImage.src = src;
    imageModal.style.display = "flex";
    setTimeout(() => {
        imageModal.classList.add("show");
    }, 10);
    
    if (smoother) smoother.paused(true);
}

function closeImage() {
    imageModal.classList.remove("show");
    setTimeout(() => {
        imageModal.style.display = "none";
    }, 300);
    
    if (smoother) smoother.paused(false);
}

// 6. FECHAR MODAIS AO CLICAR FORA
window.onclick = function(event) {
    if (event.target == modal) closeProduct();
    if (event.target == imageModal) closeImage();
};

// 7. SMOOTH SCROLL PARA LINKS DA NAV (INTEGRADO COM GSAP)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        
        if (smoother) {
            smoother.scrollTo(target, true, "top 90px");
        }
    });
});

// 8. GERADOR DE DINHEIRO (MONEY RAIN) - GTA STYLE
function createMoneyRain() {
    const container = document.getElementById('money-rain');
    if (!container) return;
    
    // Apenas o símbolo $ do GTA
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('span');
        particle.classList.add('money-particle');
        particle.innerText = '$';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = (Math.random() * 4 + 3) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.fontSize = (Math.random() * 40 + 30) + 'px';
        container.appendChild(particle);
    }
}

createMoneyRain();

// 9. FAQ TOGGLE
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const icon = element.querySelector('.faq-icon');
    
    // Fechar todos os outros FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
            item.classList.remove('active');
            item.querySelector('.faq-icon').textContent = '+';
        }
    });
    
    // Toggle FAQ atual
    faqItem.classList.toggle('active');
    icon.textContent = faqItem.classList.contains('active') ? '−' : '+';
}

// 10. CONTADOR FAKE ANIMADO
function animateCounter() {
    const counter = document.getElementById('monthly-counter');
    if (!counter) return;
    
    let count = 0;
    const target = 34;
    const duration = 1500;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            counter.textContent = target;
            clearInterval(timer);
        } else {
            counter.textContent = Math.floor(count);
        }
    }, 16);
}

// 11. BOTÃO VOLTAR AO TOPO
function scrollToTop() {
    if (smoother) {
        smoother.scrollTo("#home", true, "top 0px");
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Mostrar/Esconder botão baseado no scroll
window.addEventListener('scroll', function() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});
