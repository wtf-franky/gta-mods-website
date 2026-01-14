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
        description: "O pacote ideal para quem está a começar ou quer um boost rápido sem exageros.",
        details: [
            "Entrega em 20-30 min", 
            "10 Milhões GTA$", 
            "Nível 120", 
            "Stats no máximo"
        ],
        guarantees: [
            "✓ Pagamento Seguro via Stripe, PayPal ou Crypto",
            "✓ Entrega garantida em 24h",
            "✗ Não são aceites reembolsos"
        ]
    },
    kingpin: {
        title: "Kingpin Pack",
        price: "40€",
        description: "Torne-se o dono de Los Santos. Dinheiro e tudo desbloqueado.",
        details: [
            "Entrega Prioritária", 
            "50 Milhões GTA$", 
            "Nível à escolha", 
            "Unlock All", 
            "Fast Run", 
            "10 Carros Mod"
        ],
        guarantees: [
            "✓ Pagamento Seguro via Stripe, PayPal ou Crypto",
            "✓ Entrega garantida em 24h",
            "✗ Não são aceites reembolsos"
        ]
    },
    cars: {
        title: "Modded Garage",
        price: "25€",
        description: "Enchemos uma garagem de 10 carros à sua escolha com modificações raras.",
        details: [
            "10 Carros Mod", 
            "Rodas F1 ou Benny's", 
            "Pinturas Mod", 
            "Matrículas Yankton"
        ],
        guarantees: [
            "✓ Pagamento Seguro via Stripe, PayPal ou Crypto",
            "✓ Entrega garantida em 24h",
            "✗ Não são aceites reembolsos"
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
        <h2 class="modal-title">${product.title}</h2>
        <span class="modal-price">${product.price}</span>
        <p class="modal-desc">${product.description}</p>
        <ul class="features">
            ${product.details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
        <div class="modal-guarantees">
            ${product.guarantees.map(guarantee => `<p>${guarantee}</p>`).join('')}
        </div>
        <div style="margin-top: 2rem;">
            <p style="color: #888; font-size: 0.9rem; margin-bottom: 0.5rem;">Métodos de Pagamento Aceites:</p>
            <div class="payment-methods">
                <span class="pay-icon">Stripe</span>
                <span class="pay-icon">PayPal</span>
                <span class="pay-icon">Crypto</span>
            </div>
        </div>
        <a href="https://discord.com" target="_blank" class="btn-buy">
            <i class="fab fa-discord"></i> Comprar via Discord
        </a>
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

// 8. GERADOR DE DINHEIRO (MONEY RAIN)
function createMoneyRain() {
    const container = document.getElementById('money-rain');
    if (!container) return;
    
    const icons = ['$', '💵', '💸'];
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('span');
        particle.classList.add('money-particle');
        particle.innerText = icons[Math.floor(Math.random() * icons.length)];
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.fontSize = (Math.random() * 20 + 10) + 'px';
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
    const target = 17;
    const duration = 2000;
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
    if (window.pageYOffset > 500) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});