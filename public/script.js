/* ==========================================================
   EDZZ-SPOT AO — SCRIPT.JS (v2 — corrigido)
========================================================== */

"use strict";

/* ==========================================================
   01 — CONFIGURAÇÃO
========================================================== */
const STORAGE = {
    cart:         "edzzspot_cart",
    products:     "edzzspot_products",
    orders:       "edzzspot_orders",
    appointments: "edzzspot_appointments",
    currentUser:  "edzzspot_currentUser",
    favorites:    "edzzspot_favorites",
    services:     "edzzspot_services",
    games:        "edzzspot_games",
    software:     "edzzspot_software",
    theme:        "edzzspot_theme",
    heroImage:    "edzzspot_heroImage",
    ownerPhoto:   "edzzspot_ownerPhoto",
    carousel:     "edzzspot_carousel",
    comments:     "edzzspot_comments"
};

// ⚠️ Aumenta isto SEMPRE que quiseres forçar reset dos dados em todos os browsers
const DATA_VERSION = 3;

const IMAGE_CONFIG = { maxWidth: 900, quality: 0.75 };

const BUSINESS_HOURS = {
    0: { open: "12:30", close: "15:00" },
    1: { open: "08:30", close: "18:00" },
    2: { open: "08:30", close: "18:00" },
    3: { open: "08:30", close: "18:00" },
    4: { open: "08:30", close: "18:00" },
    5: { open: "08:30", close: "18:00" },
    6: { open: "09:00", close: "15:00" }
};

/* ==========================================================
   02 — DADOS PADRÃO
========================================================== */
const DEFAULT_PRODUCTS = [
    { id: 1, name: "GameStation X", category: "gaming", price: 385000, processor: "Ryzen 7", ram: "32GB RAM", storage: "SSD 1TB", gpu: "RTX", description: "Computador Gaming de alto desempenho, ideal para jogos modernos, streaming, criação de conteúdo e produtividade.", image: "" },
    { id: 2, name: "GameBook Pro 15", category: "notebook", price: 465000, processor: "Core i7", ram: "16GB RAM", storage: "SSD 1TB", gpu: "RTX", description: "Notebook potente com ecrã de 15.6 polegadas, indicado para gaming, programação e trabalho profissional.", image: "" },
    { id: 3, name: "OfficeCore Business", category: "office", price: 215000, processor: "Core i5", ram: "16GB RAM", storage: "SSD 512GB", gpu: "Integrada", description: "Computador equilibrado para escritório, estudos, navegação, produtividade e aplicações empresariais.", image: "" },
    { id: 4, name: "GameStation Ultra", category: "gaming", price: 590000, processor: "Ryzen 9", ram: "32GB RAM", storage: "SSD 2TB", gpu: "RTX", description: "Máquina Gaming de alto nível criada para jogadores exigentes, streaming e aplicações pesadas.", image: "" },
    { id: 5, name: "WorkBook Air", category: "notebook", price: 325000, processor: "Core i5", ram: "16GB RAM", storage: "SSD 512GB", gpu: "FHD", description: "Notebook equilibrado, leve e versátil para estudo, programação, trabalho e entretenimento.", image: "" },
        { id: 6, name: "OfficeCore Mini", category: "office", price: 175000, processor: "Core i3", ram: "8GB RAM", storage: "SSD 256GB", gpu: "Integrada", description: "Computador compacto e económico para tarefas de escritório, estudos e utilização diária.", image: "" },

    // 🎮 Periféricos
    { id: 301, name: "Teclado Mecânico RGB", category: "peripheral", price: 45000, processor: "—", ram: "—", storage: "—", gpu: "—", description: "Teclado mecânico com switches azuis, iluminação RGB personalizável e anti-ghosting.", image: "" },
    { id: 302, name: "Rato Gaming 12000 DPI", category: "peripheral", price: 22000, processor: "—", ram: "—", storage: "—", gpu: "—", description: "Rato ergonómico com sensor óptico de 12000 DPI e 7 botões programáveis.", image: "" },
    { id: 303, name: "Headset 7.1 Surround", category: "peripheral", price: 38000, processor: "—", ram: "—", storage: "—", gpu: "—", description: "Headset com som surround 7.1, microfone removível e almofadas confortáveis.", image: "" },
    { id: 304, name: "Monitor 24\" 144Hz", category: "peripheral", price: 165000, processor: "—", ram: "—", storage: "—", gpu: "—", description: "Monitor IPS Full HD 144Hz com 1ms de resposta, ideal para gaming competitivo.", image: "" },
    { id: 305, name: "Colunas Bluetooth 2.0", category: "peripheral", price: 28000, processor: "—", ram: "—", storage: "—", gpu: "—", description: "Par de colunas com som estéreo, Bluetooth 5.0 e entrada auxiliar.", image: "" },

    // 🔧 Componentes
    { id: 401, name: "RAM DDR4 16GB 3200MHz", category: "component", price: 55000, processor: "—", ram: "16GB", storage: "—", gpu: "—", description: "Memória RAM DDR4 16GB 3200MHz CL16, compatível com placas Intel e AMD.", image: "" },
    { id: 402, name: "SSD NVMe 1TB Gen4", category: "component", price: 78000, processor: "—", ram: "—", storage: "1TB NVMe", gpu: "—", description: "SSD NVMe PCIe Gen4 com leitura até 7000MB/s, ideal para gaming e edição.", image: "" },
    { id: 403, name: "GPU RTX 4060 8GB", category: "component", price: 385000, processor: "—", ram: "—", storage: "—", gpu: "RTX 4060", description: "Placa gráfica GeForce RTX 4060 com 8GB GDDR6, ray tracing e DLSS 3.", image: "" },
    { id: 404, name: "Fonte 650W 80+ Bronze", category: "component", price: 62000, processor: "—", ram: "—", storage: "—", gpu: "—", description: "Fonte de alimentação 650W com certificação 80+ Bronze e PFC ativo.", image: "" },

    // 🎒 Extras
    { id: 501, name: "Mousepad XL Speed", category: "extra", price: 12000, processor: "—", ram: "—", storage: "—", gpu: "—", description: "Mousepad de 900x400mm com superfície speed e base antiderrapante.", image: "" },
    { id: 502, name: "Suporte para Headset", category: "extra", price: 8500, processor: "—", ram: "—", storage: "—", gpu: "—", description: "Suporte de alumínio para headset com base antiderrapante.", image: "" },
    { id: 503, name: "Hub USB-C 7-em-1", category: "extra", price: 24000, processor: "—", ram: "—", storage: "—", gpu: "—", description: "Hub USB-C com HDMI 4K, 3x USB 3.0, leitor SD/microSD e PD 100W.", image: "" },
    { id: 504, name: "Cabo HDMI 2.1 8K 2m", category: "extra", price: 9500, processor: "—", ram: "—", storage: "—", gpu: "—", description: "Cabo HDMI 2.1 com suporte até 8K@60Hz e 4K@120Hz, banhado a ouro.", image: "" }
];

const DEFAULT_GAMES = [
    { id: 101, name: "Cyberpunk 2077", icon: "🎮", price: 35000, description: "RPG futurista de mundo aberto.", image: "" },
    { id: 102, name: "Minecraft", icon: "⛏️", price: 25000, description: "Constrói, explora e sobrevive.", image: "" },
    { id: 103, name: "EA Sports FC", icon: "⚽", price: 45000, description: "Futebol virtual para competir.", image: "" },
    { id: 104, name: "Grand Theft Auto V", icon: "🚗", price: 40000, description: "Aventura e ação em mundo aberto.", image: "" }
];

const DEFAULT_SOFTWARE = [
    { id: 201, name: "Microsoft Office", icon: "📊", price: 55000, description: "Ferramentas para produtividade.", image: "" },
    { id: 202, name: "Adobe Photoshop", icon: "🎨", price: 85000, description: "Edição profissional de imagens.", image: "" },
    { id: 203, name: "Visual Studio Code", icon: "💻", price: 0, description: "Editor gratuito para programação.", image: "" },
    { id: 204, name: "Windows", icon: "🪟", price: 75000, description: "Sistema operativo para computadores.", image: "" }
];

const DEFAULT_SERVICES = [
    { id: 301, name: "Reparação", description: "Diagnóstico e reparação de problemas.", price: 15000, icon: "🔧" },
    { id: 302, name: "Otimização", description: "Melhoria de desempenho do computador.", price: 10000, icon: "⚡" },
    { id: 303, name: "Manutenção", description: "Limpeza e manutenção preventiva.", price: 8000, icon: "🧹" },
    { id: 304, name: "Upgrade", description: "Atualização de componentes.", price: 20000, icon: "⬆️" }
];

const DEFAULT_CAROUSEL = [
    { id: 1, tag: "DESTAQUE", title: 'GameStation <span>Ultra</span>', description: "Máquina Gaming de alto nível com RTX, Ryzen 9 e SSD NVMe de 2TB.", price: 590000, image: "" },
    { id: 2, tag: "NOVIDADE", title: 'GameBook <span>Pro 15</span>', description: "Notebook potente com Core i7, 16GB RAM e RTX.", price: 465000, image: "" },
    { id: 3, tag: "PROMOÇÃO", title: 'OfficeCore <span>Business</span>', description: "Computador equilibrado para escritório com Core i5 e SSD.", price: 215000, image: "" },
    { id: 4, tag: "SERVIÇO", title: 'Manutenção <span>Completa</span>', description: "Limpeza, otimização e diagnóstico do teu computador.", price: 8000, image: "" }
];

/* ==========================================================
   03 — HELPERS (carregam primeiro)
========================================================== */
const $ = id => document.getElementById(id);

/**
 * Carrega dados do localStorage com verificação de tipo.
 * Rejeita: null literal, "null", "undefined", tipo errado.
 */
function loadData(key, fallback) {
    try {
        const raw = localStorage.getItem(key);

        if (raw === null || raw === undefined) return fallback;
        if (raw === "" || raw === "null" || raw === "undefined" || raw === "[]") {
            console.warn(`⚠️ ${key} estava vazio/corrompido — a usar defaults`);
            localStorage.removeItem(key);
            return fallback;
        }

        const parsed = JSON.parse(raw);

        if (parsed === null || parsed === undefined) return fallback;

        // Se for um array vazio E o fallback tiver itens → usa fallback
        if (Array.isArray(parsed) && parsed.length === 0 &&
            Array.isArray(fallback) && fallback.length > 0) {
            console.warn(`⚠️ ${key} era array vazio — a usar defaults`);
            localStorage.removeItem(key);
            return fallback;
        }

        if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;

        return parsed;
    } catch (err) {
        console.error("Erro a carregar:", key, err);
        localStorage.removeItem(key);
        return fallback;
    }
}

/* ==========================================================
   04 — ESTADO
========================================================== */
let products       = loadData(STORAGE.products, DEFAULT_PRODUCTS);
let cart           = loadData(STORAGE.cart, []);
let orders         = loadData(STORAGE.orders, []);
let appointments   = loadData(STORAGE.appointments, []);
let services       = loadData(STORAGE.services, DEFAULT_SERVICES);
let games          = loadData(STORAGE.games, DEFAULT_GAMES);
let software       = loadData(STORAGE.software, DEFAULT_SOFTWARE);
let favorites      = [];
let carouselSlides = loadData(STORAGE.carousel, DEFAULT_CAROUSEL);
let comments       = [];

let currentFilter = "all";
let currentSearch = "";
let currentSort = "relevance";
let currentPriceFilter = "all";
let currentProcessorFilter = "all";
let currentRamFilter = "all";

let carouselIndex = 0;
let carouselInterval = null;

let currentUser = null;
let authToken = localStorage.getItem("edzzspot_token") || null;

let knownOrderIds = new Set();
let notificationSound = true;
let systemNotifications = false;
let ordersPollTimer = null;

let recoveryEmail = "";

const SERVER_KEYS = {
    "edzzspot_products": "products",
    "edzzspot_games":    "games",
    "edzzspot_software": "software",
    "edzzspot_services": "services",
    "edzzspot_carousel": "carousel"
};

/* ==========================================================
   05 — VERSÃO DOS DADOS (reset automático)
========================================================== */
function checkDataVersion() {
    const stored = Number(localStorage.getItem("edzzspot_data_version") || 0);

    if (stored < DATA_VERSION) {
        console.warn(`🔄 A atualizar dados (v${stored} → v${DATA_VERSION})...`);

        // Limpa arrays potencialmente corrompidos
        [STORAGE.products, STORAGE.games, STORAGE.software, STORAGE.services, STORAGE.carousel]
            .forEach(k => localStorage.removeItem(k));

        // Recarrega em memória com defaults
        products       = [...DEFAULT_PRODUCTS];
        games          = [...DEFAULT_GAMES];
        software       = [...DEFAULT_SOFTWARE];
        services       = [...DEFAULT_SERVICES];
        carouselSlides = [...DEFAULT_CAROUSEL];

        localStorage.setItem("edzzspot_data_version", String(DATA_VERSION));
        console.log("✅ Dados restaurados para os valores padrão");
        return true;
    }
    return false;
}

function forceResetAllData() {
    Object.values(STORAGE).forEach(key => {
        if (key === "edzzspot_theme") return;
        localStorage.removeItem(key);
    });
    localStorage.setItem("edzzspot_data_version", String(DATA_VERSION));
    products       = [...DEFAULT_PRODUCTS];
    games          = [...DEFAULT_GAMES];
    software       = [...DEFAULT_SOFTWARE];
    services       = [...DEFAULT_SERVICES];
    carouselSlides = [...DEFAULT_CAROUSEL];
    cart           = [];
    favorites      = [];
}

/* ==========================================================
   06 — SAVE / FORMAT / MISC
========================================================== */
function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
        console.error("Erro a guardar local:", key, err);
        showToast("Erro", "Armazenamento do browser cheio.");
    }
    const serverKey = SERVER_KEYS[key];
    if (serverKey) pushToServer(serverKey, data);
}

function formatKz(value) {
    if (value === 0 || value === "0") return "Grátis";
    return new Intl.NumberFormat("pt-AO").format(Number(value) || 0) + " Kz";
}

function formatPrice(value) {
    if (!value || Number(value) === 0) return `<span class="card-price-ask">Sob consulta</span>`;
    return formatKz(Number(value));
}

function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function getCategoryName(category) {
    const names = {
        gaming: "Gaming", notebook: "Notebook", office: "Office",
        game: "Jogo", software: "Programa", service: "Serviço"
    };
    return names[category] || category;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
}

function setVal(id, value) {
    const el = $(id);
    if (el) el.value = value;
}

function safeCall(name, fn) {
    try {
        fn();
    } catch (err) {
        console.error(`❌ Erro em ${name}:`, err);
    }
}

/* ==========================================================
   07 — SYNC SERVIDOR
========================================================== */
async function syncFromServer() {
    try {
        const res = await fetch(window.location.origin + "/api/store");
        if (!res.ok) throw new Error("Servidor devolveu " + res.status);

        const store = await res.json() || {};

        // Só substitui se o servidor tiver dados REAIS (não array vazio).
        // Se a chave não existir → servidor nunca foi configurado → mantém default.
        if (Array.isArray(store.products) && store.products.length > 0) products       = store.products;
        if (Array.isArray(store.games)    && store.games.length > 0)    games          = store.games;
        if (Array.isArray(store.software) && store.software.length > 0) software       = store.software;
        if (Array.isArray(store.services) && store.services.length > 0) services       = store.services;
        if (Array.isArray(store.carousel) && store.carousel.length > 0) carouselSlides = store.carousel;

        if (typeof store.heroImage === "string" && store.heroImage) {
            localStorage.setItem(STORAGE.heroImage, store.heroImage);
        }
        if (typeof store.ownerPhoto === "string" && store.ownerPhoto) {
            localStorage.setItem(STORAGE.ownerPhoto, store.ownerPhoto);
        }

        console.log("✅ Dados sincronizados com o servidor");
    } catch (err) {
        console.warn("⚠️ Sem servidor — a usar dados locais:", err.message);
    }
}

function pushToServer(key, value) {
    fetch(window.location.origin + "/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value })
    }).catch(err => console.warn("Erro a enviar para o servidor:", err));
}

/* ==========================================================
   08 — IMAGENS
========================================================== */
function readImageFile(file) {
    return new Promise((resolve, reject) => {
        if (!file) return resolve("");
        if (!file.type.startsWith("image/")) {
            return reject(new Error("Ficheiro inválido. Escolhe uma imagem."));
        }
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement("canvas");
                    let { width, height } = img;
                    if (width > IMAGE_CONFIG.maxWidth) {
                        height = Math.round((height * IMAGE_CONFIG.maxWidth) / width);
                        width = IMAGE_CONFIG.maxWidth;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    canvas.getContext("2d").drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL("image/jpeg", IMAGE_CONFIG.quality));
                } catch {
                    reject(new Error("Erro ao processar a imagem."));
                }
            };
            img.onerror = () => reject(new Error("Imagem inválida."));
            img.src = reader.result;
        };
        reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
        reader.readAsDataURL(file);
    });
}

function previewImage(fileInputId, previewId) {
    const input = $(fileInputId);
    const preview = $(previewId);
    if (!input || !preview) return;
    input.addEventListener("change", () => {
        const file = input.files?.[0];
        if (!file) { preview.innerHTML = ""; return; }
        const reader = new FileReader();
        reader.onload = e => {
            preview.innerHTML = `<img src="${e.target.result}" alt="Pré-visualização"><span>Imagem selecionada</span>`;
        };
        reader.readAsDataURL(file);
    });
}

/* ==========================================================
   09 — INTRO
========================================================== */
function startIntro() {
    const screen = $("introScreen");
    const text = $("introLoadingText");
    if (!screen) return;

    const messages = [
        "A preparar a experiência...",
        "A carregar equipamentos...",
        "A preparar o teu gaming...",
        "A verificar os serviços...",
        "Quase pronto..."
    ];

    let i = 0;
    const timer = setInterval(() => {
        i++;
        if (text && i < messages.length) text.textContent = messages[i];
    }, 500);

    setTimeout(() => {
        clearInterval(timer);
        screen.classList.add("hidden");
        setTimeout(() => { screen.style.display = "none"; }, 700);
    }, 2800);
}

/* ==========================================================
   10 — TEMA
========================================================== */
function setupThemeToggle() {
    const toggle = $("themeToggle");
    if (!toggle) return;
    if (localStorage.getItem(STORAGE.theme) === "light") {
        document.body.classList.add("light-mode");
        toggle.textContent = "☀️";
    }
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        const light = document.body.classList.contains("light-mode");
        localStorage.setItem(STORAGE.theme, light ? "light" : "dark");
        toggle.textContent = light ? "☀️" : "🌙";

        // Re-renderiza os gráficos com as cores novas
        if (isAdmin() && typeof renderAdminCharts === "function") {
            renderAdminCharts(orders);
        }
    });
}

/* ==========================================================
   11 — MENU MOBILE
========================================================== */
function setupMobileMenu() {
    const btn = $("mobileMenuButton");
    const nav = $("mainNav");
    if (!btn || !nav) return;
    btn.addEventListener("click", () => nav.classList.toggle("active"));
    document.querySelectorAll(".nav-link").forEach(link =>
        link.addEventListener("click", () => nav.classList.remove("active"))
    );
}

/* ==========================================================
   12 — SCROLL REVEAL
   Abordagem por scroll: usa getBoundingClientRect() que
   funciona em qualquer browser / proxy / túnel.
========================================================== */
function checkReveals() {
    const vh = window.innerHeight;
    const triggers = document.querySelectorAll(".reveal:not(.visible)");

    triggers.forEach(el => {
        const rect = el.getBoundingClientRect();
        // Elemento está a entrar na viewport (com margem de 80px)
        if (rect.top < vh - 80 && rect.bottom > 0) {
            el.classList.add("visible");
        }
    });
}

function observeReveals() {
    // Corre imediatamente + 3 tentativas espaçadas
    // (para apanhar elementos que renderizam tarde)
    checkReveals();
    setTimeout(checkReveals, 100);
    setTimeout(checkReveals, 400);
    setTimeout(checkReveals, 1200);
}

// Bind scroll + resize (só uma vez)
if (!window.__revealBound) {
    window.__revealBound = true;

    let ticking = false;
    window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            checkReveals();
            ticking = false;
        });
    }, { passive: true });

    window.addEventListener("resize", checkReveals);
}

/* ==========================================================
   13 — HORÁRIO
========================================================== */
function updateOpenStatus() {
    const el = $("openStatus");
    if (!el) return;

    try {
        const now = new Date();
        const hours = BUSINESS_HOURS[now.getDay()];
        if (!hours) {
            el.textContent = "Fechado hoje";
            el.className = "open-status is-closed";
            return;
        }
        const current = now.getHours() * 60 + now.getMinutes();
        const [oh, om] = hours.open.split(":").map(Number);
        const [ch, cm] = hours.close.split(":").map(Number);
        const openMin = oh * 60 + om;
        const closeMin = ch * 60 + cm;
        const isOpen = current >= openMin && current < closeMin;

        el.textContent = isOpen
            ? `Aberto agora · até ${hours.close}`
            : `Fechado · abre às ${hours.open}`;
        el.className = `open-status ${isOpen ? "is-open" : "is-closed"}`;
    } catch (err) {
        console.error("Erro updateOpenStatus:", err);
        el.textContent = "—";
    }
}

/* ==========================================================
   14 — PRODUTOS
========================================================== */
/* Categorias de "computadores" (exclui acessórios) */
const COMPUTER_CATEGORIES = ["gaming", "notebook", "office"];

function filterAndSortProducts() {
    if (!Array.isArray(products)) products = [...DEFAULT_PRODUCTS];

    // 1. Só computadores nesta secção
    let list = products.filter(p => COMPUTER_CATEGORIES.includes(p.category));

    // 2. Categoria
    if (currentFilter !== "all") {
        list = list.filter(p => p.category === currentFilter);
    }

    // 3. Preço
    if (currentPriceFilter !== "all") {
        const [min, max] = currentPriceFilter.split("-").map(Number);
        list = list.filter(p => Number(p.price) >= min && Number(p.price) <= max);
    }

    // 4. Processador
    if (currentProcessorFilter !== "all") {
        list = list.filter(p => (p.processor || "").trim() === currentProcessorFilter);
    }

    // 5. RAM
    if (currentRamFilter !== "all") {
        list = list.filter(p => (p.ram || "").trim() === currentRamFilter);
    }

    // 6. Pesquisa
    const search = currentSearch.toLowerCase().trim();
    if (search) {
        list = list.filter(p =>
            [p.name, p.description, p.processor, p.ram, p.storage, p.gpu, getCategoryName(p.category)]
                .some(f => (f || "").toLowerCase().includes(search))
        );
    }

    // 7. Ordenação
    switch (currentSort) {
        case "price-asc":
            list.sort((a, b) => Number(a.price) - Number(b.price));
            break;
        case "price-desc":
            list.sort((a, b) => Number(b.price) - Number(a.price));
            break;
        case "name":
            list.sort((a, b) => String(a.name).localeCompare(String(b.name), "pt"));
            break;
        // "relevance" → mantém ordem original
    }

    return list;
}

function renderProducts() {
    const grid = $("productsGrid");
    if (!grid) return;

    const filtered = filterAndSortProducts();

    // Atualiza contador + breadcrumb
    setText("resultsCount", filtered.length);
    setText("breadcrumbCategory",
        currentFilter === "all"
            ? "Todos"
            : getCategoryName(currentFilter)
    );

    if (!filtered.length) {
        grid.innerHTML = `<div class="empty-result">
            <h3>Nenhum produto encontrado.</h3>
            <p>Tenta ajustar os filtros ou a pesquisa.</p>
        </div>`;
        return;
    }

    grid.innerHTML = filtered.map(productCardTemplate).join("");
    observeReveals();
}

/* Constrói dinamicamente as opções de processador e RAM */
function buildDynamicFilterOptions() {
    const computers = (products || []).filter(p => COMPUTER_CATEGORIES.includes(p.category));

    // Processadores únicos
    const processors = [...new Set(
        computers.map(p => (p.processor || "").trim())
            .filter(v => v && v !== "—" && v !== "Não informado")
    )].sort();

    // RAMs únicas
    const rams = [...new Set(
        computers.map(p => (p.ram || "").trim())
            .filter(v => v && v !== "—" && v !== "Não informado")
    )].sort();

    // Processador
    const procEl = $("processorOptions");
    if (procEl) {
        procEl.innerHTML = `
            <label class="filter-option">
                <input type="radio" name="f-processor" value="all" checked>
                <span>Todos</span>
            </label>
            ${processors.map(proc => `
                <label class="filter-option">
                    <input type="radio" name="f-processor" value="${escapeHtml(proc)}">
                    <span>${escapeHtml(proc)}</span>
                </label>
            `).join("")}
        `;
    }

    // RAM
    const ramEl = $("ramOptions");
    if (ramEl) {
        ramEl.innerHTML = `
            <label class="filter-option">
                <input type="radio" name="f-ram" value="all" checked>
                <span>Todas</span>
            </label>
            ${rams.map(r => `
                <label class="filter-option">
                    <input type="radio" name="f-ram" value="${escapeHtml(r)}">
                    <span>${escapeHtml(r)}</span>
                </label>
            `).join("")}
        `;
    }
}

function productCardTemplate(product) {
    const favorite = favorites.includes(product.id);
    return `
        <article class="product-card reveal" data-product-id="${product.id}">
            <div class="product-image">
                ${product.image
                    ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">`
                    : `<div class="product-placeholder">💻</div>`}
                <button class="favorite-button ${favorite ? "active" : ""}"
                        data-favorite="${product.id}" type="button"
                        aria-label="Favorito">${favorite ? "♥" : "♡"}</button>
            </div>
            <div class="product-info">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h3>${escapeHtml(product.name)}</h3>
                <p class="product-description">${escapeHtml(product.description)}</p>
                <div class="product-specs">
                    <span class="spec">${escapeHtml(product.processor)}</span>
                    <span class="spec">${escapeHtml(product.ram)}</span>
                    <span class="spec">${escapeHtml(product.storage)}</span>
                    <span class="spec">${escapeHtml(product.gpu)}</span>
                </div>
                <div class="product-bottom">
                    <strong class="product-price">${formatKz(product.price)}</strong>
                    <div class="product-actions">
                        <button class="view-product" data-view-product="${product.id}">Detalhes</button>
                        <button class="add-product" data-add-product="${product.id}">+ Carrinho</button>
                    </div>
                </div>
            </div>
        </article>
    `;
}

function setupFilters() {
    // Constrói opções dinâmicas primeiro
    buildDynamicFilterOptions();

    // ---- Categoria (radio) ----
    document.querySelectorAll('input[name="f-category"]').forEach(radio => {
        radio.addEventListener("change", () => {
            if (!radio.checked) return;
            currentFilter = radio.value;
            renderProducts();
        });
    });

    // ---- Preço (chips) ----
    document.querySelectorAll(".filter-chip[data-price]").forEach(chip => {
        chip.addEventListener("click", () => {
            document.querySelectorAll(".filter-chip[data-price]").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            currentPriceFilter = chip.dataset.price;
            renderProducts();
        });
    });

    // ---- Processador (radio, delegado) ----
    document.addEventListener("change", e => {
        if (e.target.name === "f-processor" && e.target.checked) {
            currentProcessorFilter = e.target.value;
            renderProducts();
        }
        if (e.target.name === "f-ram" && e.target.checked) {
            currentRamFilter = e.target.value;
            renderProducts();
        }
    });

    // ---- Ordenação ----
    $("sortSelect")?.addEventListener("change", e => {
        currentSort = e.target.value;
        renderProducts();
    });

    // ---- Pesquisa ----
    $("productSearch")?.addEventListener("input", e => {
        currentSearch = e.target.value;
        renderProducts();
    });

    // ---- Limpar filtros ----
    $("clearFilters")?.addEventListener("click", () => {
        currentFilter = "all";
        currentPriceFilter = "all";
        currentProcessorFilter = "all";
        currentRamFilter = "all";
        currentSearch = "";
        currentSort = "relevance";

        // Reset visual
        document.querySelector('input[name="f-category"][value="all"]').checked = true;
        document.querySelector('input[name="f-processor"][value="all"]').checked = true;
        document.querySelector('input[name="f-ram"][value="all"]').checked = true;
        document.querySelectorAll(".filter-chip").forEach(c =>
            c.classList.toggle("active", c.dataset.price === "all")
        );
        if ($("productSearch")) $("productSearch").value = "";
        if ($("sortSelect")) $("sortSelect").value = "relevance";

        renderProducts();
        showToast("Filtros", "Todos os filtros foram limpos.");
    });

    // ---- Sidebar mobile ----
    $("openSidebar")?.addEventListener("click", () => {
        $("shopSidebar")?.classList.add("active");
        document.body.classList.add("sidebar-open");
    });
    $("closeSidebar")?.addEventListener("click", closeSidebar);
    document.addEventListener("click", e => {
        if (document.body.classList.contains("sidebar-open") &&
            !e.target.closest("#shopSidebar") &&
            !e.target.closest("#openSidebar")) {
            closeSidebar();
        }
    });
}

function closeSidebar() {
    $("shopSidebar")?.classList.remove("active");
    document.body.classList.remove("sidebar-open");
}

function setupProductClickHandlers() {
    document.addEventListener("click", e => {
        const addBtn      = e.target.closest("[data-add-product]");
        const viewBtn     = e.target.closest("[data-view-product]");
        const favBtn      = e.target.closest("[data-favorite]");
        const modalAdd    = e.target.closest("[data-modal-add]");
        const viewGame    = e.target.closest("[data-view-game]");
        const modalAddGame = e.target.closest("[data-modal-add-game]");

        if (addBtn)   addToCart(Number(addBtn.dataset.addProduct), "product");
        if (viewBtn)  openProduct(Number(viewBtn.dataset.viewProduct));
        if (favBtn)   toggleFavorite(Number(favBtn.dataset.favorite));
        if (modalAdd) {
            addToCart(Number(modalAdd.dataset.modalAdd), "product");
            closeModal("productModal");
        }
        if (viewGame) openGame(Number(viewGame.dataset.viewGame));
        if (modalAddGame) {
            addToCart(Number(modalAddGame.dataset.modalAddGame), "game");
            closeModal("productModal");
        }
    });
}

function openGame(id) {
    const game = games.find(g => g.id === id);
    if (!game) return;

    const container = $("productModalContent");
    if (!container) return;

    const favorite = favorites.includes(game.id);

    container.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                ${game.image
                    ? `<img src="${escapeHtml(game.image)}" alt="${escapeHtml(game.name)}">`
                    : `<div class="product-placeholder">${game.icon || "🎮"}</div>`}
            </div>
            <div>
                <span class="section-label">Jogo</span>
                <h2>${escapeHtml(game.name)}</h2>
                <p class="product-detail-description">${escapeHtml(game.description)}</p>
                <strong class="product-detail-price">${formatKz(game.price)}</strong>

                <div class="detail-specs">
                    <div class="detail-spec"><strong>Plataforma</strong><br>PC / Steam</div>
                    <div class="detail-spec"><strong>Ativação</strong><br>Digital</div>
                    <div class="detail-spec"><strong>Entrega</strong><br>Imediata</div>
                    <div class="detail-spec"><strong>Suporte</strong><br>Permanente</div>
                </div>

                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button class="btn btn-primary" data-modal-add-game="${game.id}">
                        Adicionar ao carrinho →
                    </button>
                    <button class="btn btn-secondary" data-favorite="${game.id}" type="button">
                        ${favorite ? "♥ Nos favoritos" : "♡ Guardar"}
                    </button>
                </div>
            </div>
        </div>
    `;
    openModal("productModal");
}

function openProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const container = $("productModalContent");
    if (!container) return;

    container.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                ${product.image
                    ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">`
                    : `<div class="product-placeholder">💻</div>`}
            </div>
            <div>
                <span class="section-label">${getCategoryName(product.category)}</span>
                <h2>${escapeHtml(product.name)}</h2>
                <p class="product-detail-description">${escapeHtml(product.description)}</p>
                <strong class="product-detail-price">${formatKz(product.price)}</strong>
                <div class="detail-specs">
                    <div class="detail-spec"><strong>Processador</strong><br>${escapeHtml(product.processor)}</div>
                    <div class="detail-spec"><strong>Memória</strong><br>${escapeHtml(product.ram)}</div>
                    <div class="detail-spec"><strong>Armazenamento</strong><br>${escapeHtml(product.storage)}</div>
                    <div class="detail-spec"><strong>Gráficos</strong><br>${escapeHtml(product.gpu)}</div>
                </div>
                <button class="btn btn-primary" data-modal-add="${product.id}">Adicionar ao carrinho →</button>
            </div>
        </div>
    `;
    openModal("productModal");
}

/* ==========================================================
   15 — CARRINHO
========================================================== */
function findAnyItemById(id) {
    return products.find(p => p.id === id)
        || games.find(g => g.id === id)
        || software.find(s => s.id === id)
        || services.find(sv => sv.id === id);
}

function favoritesKey() {
    if (currentUser) return `edzzspot_favorites_user_${currentUser.id}`;
    return "edzzspot_favorites_guest";
}

function loadFavorites() {
    favorites = loadData(favoritesKey(), []);
    if (!Array.isArray(favorites)) favorites = [];
}

function saveFavorites() {
    saveData(favoritesKey(), favorites);
}

function updateFavoritesCount() {
    setText("favoritesCount", favorites.length);
}

function addToCart(id, type = "product") {
    const product = findAnyItemById(id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1, type });
    }

    saveData(STORAGE.cart, cart);
    renderCart();

    const btn = $("openCart");
    if (btn) {
        btn.classList.remove("bounce");
        void btn.offsetWidth;
        btn.classList.add("bounce");
    }
    showToast("Adicionado ao carrinho", `${product.name} foi adicionado.`);
}

function renderCart() {
    const container = $("cartItems");
    const empty = $("cartEmpty");
    const footer = $("cartFooter");
    if (!container || !empty || !footer) return;

    if (!cart.length) {
        container.innerHTML = "";
        empty.classList.add("active");
        footer.style.display = "none";
    } else {
        empty.classList.remove("active");
        footer.style.display = "block";
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${item.image
                        ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">`
                        : (item.icon || "💻")}
                </div>
                <div class="cart-item-info">
                    <h4>${escapeHtml(item.name)}</h4>
                    <span>${formatKz(item.price)}</span>
                    <div class="cart-quantity">
                        <button data-cart-minus="${item.id}">−</button>
                        <strong>${item.quantity}</strong>
                        <button data-cart-plus="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-remove" data-cart-remove="${item.id}">Remover</button>
            </div>
        `).join("");
    }

    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal > 0 ? 5000 : 0;
    const total = subtotal + shipping;

    setText("cartCount", cart.reduce((s, i) => s + i.quantity, 0));
    setText("cartSubtotal", formatKz(subtotal));
    setText("cartShipping", formatKz(shipping));
    setText("cartTotal", formatKz(total));
    setText("checkoutTotal", formatKz(total));
}

function setupCartControls() {
    document.addEventListener("click", e => {
        const plus = e.target.closest("[data-cart-plus]");
        const minus = e.target.closest("[data-cart-minus]");
        const remove = e.target.closest("[data-cart-remove]");
        if (plus)   changeQuantity(Number(plus.dataset.cartPlus), 1);
        if (minus)  changeQuantity(Number(minus.dataset.cartMinus), -1);
        if (remove) removeFromCart(Number(remove.dataset.cartRemove));
    });
    $("openCart")?.addEventListener("click", openCart);
    $("closeCart")?.addEventListener("click", closeCart);
    $("cartOverlay")?.addEventListener("click", closeCart);
    $("continueShopping")?.addEventListener("click", closeCart);
}

function changeQuantity(id, amount) {
    const item = cart.find(p => p.id === id);
    if (!item) return;
    item.quantity += amount;
    if (item.quantity <= 0) return removeFromCart(id);
    saveData(STORAGE.cart, cart);
    renderCart();
}

function removeFromCart(id) {
    const item = cart.find(p => p.id === id);
    if (!item) return;
    cart = cart.filter(p => p.id !== id);
    saveData(STORAGE.cart, cart);
    renderCart();
    showToast("Produto removido", `${item.name} saiu do carrinho.`);
}

function openCart() {
    $("cartDrawer")?.classList.add("active");
    $("cartOverlay")?.classList.add("active");
    document.body.classList.add("no-scroll");
}

function closeCart() {
    $("cartDrawer")?.classList.remove("active");
    $("cartOverlay")?.classList.remove("active");
    document.body.classList.remove("no-scroll");
}

/* ==========================================================
   16 — CHECKOUT
========================================================== */
function setupCheckout() {
    $("checkoutButton")?.addEventListener("click", () => {
        if (!cart.length) return showToast("Carrinho vazio", "Adiciona pelo menos um produto.");
        closeCart();
        openModal("checkoutModal");
    });

    $("checkoutForm")?.addEventListener("submit", e => {
        e.preventDefault();
        if (!cart.length) return showToast("Carrinho vazio", "Não existem produtos no pedido.");

        const form = new FormData(e.target);
        const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
        const shipping = subtotal > 0 ? 5000 : 0;

        const order = {
            id: generateOrderNumber(),
            date: new Date().toISOString(),
            customer: {
                name: form.get("customerName"),
                phone: form.get("customerPhone"),
                email: form.get("customerEmail"),
                address: form.get("customerAddress")
            },
            paymentMethod: form.get("paymentMethod"),
            items: [...cart],
            subtotal,
            shipping,
            total: subtotal + shipping,
            status: "Pendente"
        };

        orders.push(order);
        saveData(STORAGE.orders, orders);

        fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        }).catch(err => console.warn("Erro ao enviar pedido:", err));

        showPurchaseAnimation(order);
    });
}

function generateOrderNumber() {
    const year = new Date().getFullYear();
    const key = `edzzspot_sequence_${year}`;
    const seq = Number(localStorage.getItem(key) || 0) + 1;
    localStorage.setItem(key, seq);
    return `EDZ-${year}-${String(seq).padStart(4, "0")}`;
}

function showPurchaseAnimation(order) {
    closeModal("checkoutModal");
    const anim = $("successAnimation");
    if (!anim) return;
    anim.classList.add("active");
    setTimeout(() => {
        anim.classList.remove("active");
        cart = [];
        saveData(STORAGE.cart, cart);
        renderCart();
        fillInvoice(order);
        openModal("invoiceModal");
        $("checkoutForm")?.reset();
    }, 2400);
}

function fillInvoice(order) {
    setText("invoiceOrderNumber", order.id);
    setText("invoiceDate", new Date(order.date).toLocaleString("pt-AO"));
    setText("invoiceCustomer", order.customer.name);
    setText("invoicePhone", order.customer.phone);
    setText("invoiceSubtotal", formatKz(order.subtotal));
    setText("invoiceShipping", formatKz(order.shipping));
    setText("invoiceTotal", formatKz(order.total));

    if ($("invoiceItems")) {
        $("invoiceItems").innerHTML = order.items.map(item => `
            <div class="invoice-item">
                <span>${escapeHtml(item.name)}</span>
                <span>${item.quantity}x</span>
                <strong>${formatKz(item.price * item.quantity)}</strong>
            </div>
        `).join("");
    }
}

/* ==========================================================
   17 — MODAIS
========================================================== */
function openModal(id) {
    const m = $(id);
    if (!m) return;
    m.classList.add("active");
    document.body.classList.add("no-scroll");
}

function closeModal(id) {
    const m = $(id);
    if (!m) return;
    m.classList.remove("active");
    document.body.classList.remove("no-scroll");
}

function setupModals() {
    const bind = (btnId, modalId) =>
        $(btnId)?.addEventListener("click", () => closeModal(modalId));

    bind("closeCheckoutModal", "checkoutModal");
    bind("closeInvoiceModal", "invoiceModal");
    bind("closeInvoice", "invoiceModal");
    bind("closeProductModal", "productModal");
    bind("closeAppointment", "appointmentModal");
    bind("closeLogin", "loginModal");
    bind("closeAdmin", "adminModal");
    bind("closeProductForm", "productFormModal");
    bind("closeServiceForm", "serviceFormModal");
    bind("closeGameForm", "gameFormModal");
    bind("closeSoftwareForm", "softwareFormModal");
    bind("closeCarouselForm", "carouselFormModal");
    bind("closeFavorites", "favoritesModal");
    bind("closeRecover", "recoverModal");
    bind("closeAdminReset", "adminResetPasswordModal");

    $("printInvoice")?.addEventListener("click", () => window.print());
    $("printInvoiceBottom")?.addEventListener("click", () => window.print());

    document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", () => {
            overlay.closest(".modal")?.classList.remove("active");
            document.body.classList.remove("no-scroll");
        });
    });

    document.addEventListener("keydown", e => {
        if (e.key !== "Escape") return;
        document.querySelectorAll(".modal.active").forEach(m => m.classList.remove("active"));
        closeCart();
        document.body.classList.remove("no-scroll");
    });
}

/* ==========================================================
   18 — SERVIÇOS
========================================================== */
function renderServices() {
    const grid = $("servicesGrid");
    if (!grid) return;
    if (!Array.isArray(services)) services = [...DEFAULT_SERVICES];

    grid.innerHTML = services.map((s, i) => `
        <div class="service-card reveal" data-service="${escapeHtml(s.name)}">
            <span class="service-number">${String(i + 1).padStart(2, "0")}</span>
            <div class="service-icon">
                ${s.image
                    ? `<img class="service-image" src="${escapeHtml(s.image)}" alt="${escapeHtml(s.name)}">`
                    : escapeHtml(s.icon || "🛠️")}
            </div>
            <h3>${escapeHtml(s.name)}</h3>
            <p>${escapeHtml(s.description)}</p>
            <div class="card-bottom">
                <strong class="card-price">${formatPrice(s.price)}</strong>
                <button class="card-add-btn" data-add-service="${s.id}">Solicitar →</button>
            </div>
            <button class="service-schedule-btn" data-schedule-service="${escapeHtml(s.name)}">
                📅 Agendar ao domicílio
            </button>
        </div>
    `).join("");

    grid.querySelectorAll("[data-add-service]").forEach(btn => {
        btn.addEventListener("click", e => {
            e.stopPropagation();
            addToCart(Number(btn.dataset.addService), "service");
        });
    });

    grid.querySelectorAll("[data-schedule-service]").forEach(btn => {
        btn.addEventListener("click", e => {
            e.stopPropagation();
            const serviceName = btn.dataset.scheduleService;
            const msgField = $("appointmentMessage");
            if (msgField) msgField.value = `Serviço pretendido: ${serviceName}`;
            openModal("appointmentModal");
        });
    });

    grid.querySelectorAll(".service-card").forEach(card => {
        card.addEventListener("click", e => {
            if (e.target.closest("[data-add-service]")) return;
            if (e.target.closest("[data-schedule-service]")) return;
            const name = card.dataset.service;
            if ($("service")) $("service").value = name;
            document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });
        });
    });
    observeReveals();
}

/* ==========================================================
   18.5 — ACESSÓRIOS
========================================================== */
let currentAccessoryTab = "all";

const ACCESSORY_CATEGORIES = {
    peripheral: "Periférico",
    component: "Componente",
    extra: "Extra"
};

function renderAccessories() {
    const grid = $("accessoriesGrid");
    if (!grid) return;

    const list = (products || []).filter(p =>
        p.category === "peripheral" ||
        p.category === "component" ||
        p.category === "extra"
    );

    const filtered = currentAccessoryTab === "all"
        ? list
        : list.filter(p => p.category === currentAccessoryTab);

    if (!filtered.length) {
        grid.innerHTML = `<div class="empty-result"><h3>Nenhum acessório nesta categoria.</h3><p>Escolhe outra aba ou adiciona produtos no painel admin.</p></div>`;
        return;
    }

    grid.innerHTML = filtered.map(accessoryCardTemplate).join("");
    observeReveals();
}

function accessoryCardTemplate(product) {
    const favorite = favorites.includes(product.id);
    const subLabel = ACCESSORY_CATEGORIES[product.category] || "";

    return `
        <article class="product-card reveal" data-product-id="${product.id}">
            <div class="product-image">
                ${product.image
                    ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">`
                    : `<div class="product-placeholder">🎧</div>`}

                <button class="favorite-button ${favorite ? "active" : ""}"
                        data-favorite="${product.id}" type="button"
                        aria-label="Favorito">${favorite ? "♥" : "♡"}</button>
            </div>

            <div class="product-info">
                <span class="product-category">${subLabel}</span>
                <h3>${escapeHtml(product.name)}</h3>
                <p class="product-description">${escapeHtml(product.description)}</p>

                <div class="product-bottom">
                    <strong class="product-price">${formatKz(product.price)}</strong>
                    <div class="product-actions">
                        <button class="view-product" data-view-product="${product.id}">Detalhes</button>
                        <button class="add-product" data-add-product="${product.id}">+ Carrinho</button>
                    </div>
                </div>
            </div>
        </article>
    `;
}

function setupAccessoryTabs() {
    document.querySelectorAll(".accessory-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".accessory-tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentAccessoryTab = tab.dataset.subcategory;
            renderAccessories();
        });
    });
}


/* ==========================================================
   19 — FOTO PROPRIETÁRIO / HERO
========================================================== */
function loadOwnerPhoto() {
    const photo = localStorage.getItem(STORAGE.ownerPhoto);
    const img = $("ownerPhoto");
    const placeholder = $("ownerPlaceholder");
    if (!img || !placeholder) return;
    if (photo) {
        img.src = photo;
        img.hidden = false;
        placeholder.hidden = true;
    } else {
        img.hidden = true;
        placeholder.hidden = false;
    }
}

function loadHeroImage() {
    const image = localStorage.getItem(STORAGE.heroImage);
    const imgEl = $("heroImage");
    const animEl = $("heroAnimation");
    if (!imgEl || !animEl) return;

    if (image) {
        imgEl.src = image;
        imgEl.hidden = false;
        animEl.style.display = "none";
    } else {
        imgEl.hidden = true;
        imgEl.src = "";
        animEl.style.display = "";
    }
    updateHeroAdminPreview(image);
}

function updateHeroAdminPreview(image) {
    const preview = $("heroAdminPreview");
    const placeholder = $("heroAdminPlaceholder");
    const urlInput = $("heroImageUrl");

    if (preview) {
        if (image) {
            preview.src = image;
            preview.hidden = false;
            if (placeholder) placeholder.hidden = true;
        } else {
            preview.src = "";
            preview.hidden = true;
            if (placeholder) placeholder.hidden = false;
        }
    }
    if (urlInput) {
        urlInput.value = image && !image.startsWith("data:") ? image : "";
    }
}

function setupHeroImageAdmin() {
    const saveBtn = $("saveHeroImage");
    const resetBtn = $("resetHeroImage");
    const urlInput = $("heroImageUrl");
    const fileInput = $("heroImageFile");

    fileInput?.addEventListener("change", () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => updateHeroAdminPreview(e.target.result);
        reader.readAsDataURL(file);
    });

    urlInput?.addEventListener("input", () => {
        const url = urlInput.value.trim();
        updateHeroAdminPreview(url || null);
    });

    saveBtn?.addEventListener("click", async () => {
        const file = fileInput?.files?.[0];
        const url = urlInput?.value.trim();
        try {
            let image = url || "";
            if (file) image = await readImageFile(file);
            if (!image) return showToast("Sem imagem", "Escolhe uma imagem ou cola um URL.");
            localStorage.setItem(STORAGE.heroImage, image);
            pushToServer("heroImage", image);
            loadHeroImage();
            if (fileInput) fileInput.value = "";
            if ($("heroImagePreview")) $("heroImagePreview").innerHTML = "";
            showToast("Guardado", "Imagem do hero actualizada.");
        } catch (err) {
            showToast("Erro na imagem", err.message);
        }
    });

    resetBtn?.addEventListener("click", () => {
        localStorage.removeItem(STORAGE.heroImage);
        pushToServer("heroImage", null);
        if (urlInput) urlInput.value = "";
        if (fileInput) fileInput.value = "";
        if ($("heroImagePreview")) $("heroImagePreview").innerHTML = "";
        loadHeroImage();
        showToast("Reposto", "Voltou à animação CSS.");
    });

    loadHeroImage();
}

function setupOwnerPhotoAdmin() {
    const saveBtn = $("saveOwnerPhoto");
    const resetBtn = $("resetOwnerPhoto");
    const fileInput = $("ownerPhotoFile");
    const preview = $("ownerAdminPreview");
    const placeholder = $("ownerAdminPlaceholder");

    const existing = localStorage.getItem(STORAGE.ownerPhoto);
    if (existing && preview) {
        preview.src = existing;
        preview.hidden = false;
        if (placeholder) placeholder.hidden = true;
    }

    fileInput?.addEventListener("change", () => {
        const file = fileInput.files?.[0];
        if (!file || !preview) return;
        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            preview.hidden = false;
            if (placeholder) placeholder.hidden = true;
        };
        reader.readAsDataURL(file);
    });

    saveBtn?.addEventListener("click", async () => {
        const file = fileInput?.files?.[0];
        if (!file) return showToast("Sem foto", "Escolhe uma imagem primeiro.");
        try {
            const image = await readImageFile(file);
            localStorage.setItem(STORAGE.ownerPhoto, image);
            pushToServer("ownerPhoto", image);
            loadOwnerPhoto();
            if (fileInput) fileInput.value = "";
            showToast("Guardado", "Foto do proprietário actualizada.");
        } catch (err) {
            showToast("Erro", err.message);
        }
    });

    resetBtn?.addEventListener("click", () => {
        localStorage.removeItem(STORAGE.ownerPhoto);
        pushToServer("ownerPhoto", null);
        loadOwnerPhoto();
        if (preview) { preview.src = ""; preview.hidden = true; }
        if (placeholder) placeholder.hidden = false;
        if (fileInput) fileInput.value = "";
        showToast("Removido", "Foto do proprietário removida.");
    });
}

/* ==========================================================
   20 — AGENDAMENTO
========================================================== */
function setupAppointment() {
    $("appointmentForm")?.addEventListener("submit", e => {
        e.preventDefault();
        const form = new FormData(e.target);
        appointments.push({
            id: "EDZ-S-" + Date.now(),
            date: new Date().toISOString(),
            customer: form.get("appointmentName"),
            phone: form.get("appointmentPhone"),
            requestedDate: form.get("appointmentDate"),
            time: form.get("appointmentTime"),
            location: form.get("appointmentLocation"),
            message: form.get("appointmentMessage"),
            service: "Serviço ao domicílio",
            status: "Pendente"
        });
        saveData(STORAGE.appointments, appointments);
        closeModal("appointmentModal");
        e.target.reset();
        showToast("Agendamento enviado", "A EdZZ-Spot AO recebeu o teu pedido.");
    });
}

/* ==========================================================
   21 — AUTENTICAÇÃO
========================================================== */
const API_URL = window.location.origin;

async function apiRequest(endpoint, options = {}) {
    const res = await fetch(API_URL + endpoint, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
            ...(options.headers || {})
        }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Erro de rede.");
    return data;
}

function saveSession(token, user) {
    authToken = token;
    currentUser = user;
    localStorage.setItem("edzzspot_token", token);
    localStorage.setItem("edzzspot_user", JSON.stringify(user));
    updateUserUI();
    if (user.role === "admin") {
        setTimeout(() => {
            setupNotificationsControls();
            startOrdersPolling();
        }, 1000);
    }
}

function clearSession() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem("edzzspot_token");
    localStorage.removeItem("edzzspot_user");
    updateUserUI();
    stopOrdersPolling();
}

function loadStoredSession() {
    try {
        const token = localStorage.getItem("edzzspot_token");
        const user = JSON.parse(localStorage.getItem("edzzspot_user") || "null");
        if (token && user) {
            authToken = token;
            currentUser = user;
        }
    } catch { /* ignora */ }
    updateUserUI();
}

function updateUserUI() {
    const btn = $("openLogin");
    const label = btn?.querySelector(".user-button-text");
    const icon = btn?.querySelector("span");

    if (currentUser) {
        if (label) label.textContent = currentUser.name.split(" ")[0];
        if (icon) icon.textContent = "👤";
        btn?.classList.add("logged-in");
    } else {
        if (label) label.textContent = "Entrar";
        if (icon) icon.textContent = "👤";
        btn?.classList.remove("logged-in");
    }

    loadFavorites();
    updateFavoritesCount();
    safeCall("renderProducts(updateUserUI)", renderProducts);
    if ($("commentsList")) safeCall("renderComments(updateUserUI)", renderComments);
}

function switchAuthTab(tab) {
    document.querySelectorAll(".auth-tab").forEach(t =>
        t.classList.toggle("active", t.dataset.authTab === tab)
    );
    $("loginForm")?.classList.toggle("active", tab === "login");
    $("registerForm")?.classList.toggle("active", tab === "register");
    setText("authTitle", tab === "login" ? "Entrar na conta" : "Criar conta");
    setText("authSubtitle",
        tab === "login" ? "Acede aos teus pedidos e serviços." : "Cria a tua conta em segundos."
    );
    const msg = $("authMessage");
    if (msg) { msg.textContent = ""; msg.className = "auth-demo"; }
}

function showAuthMessage(text, type = "") {
    const msg = $("authMessage");
    if (!msg) return;
    msg.textContent = text;
    msg.className = "auth-demo active " + type;
}

async function handleRegister(e) {
    e.preventDefault();
    const btn = $("registerSubmitBtn");
    if (btn) { btn.disabled = true; btn.textContent = "A criar conta..."; }
    try {
        const form = new FormData(e.target);
        const data = await apiRequest("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                name: form.get("registerName"),
                email: form.get("registerEmail"),
                password: form.get("registerPassword"),
                phone: form.get("registerPhone"),
                securityQuestion: form.get("registerQuestion"),
                securityAnswer: form.get("registerAnswer")
            })
        });
        saveSession(data.token, data.user);
        showAuthMessage("Conta criada! Bem-vindo 🎉", "success");
        setTimeout(() => {
            closeModal("loginModal");
            e.target.reset();
            showToast("Bem-vindo!", `Olá ${data.user.name.split(" ")[0]}!`);
        }, 900);
    } catch (err) {
        showAuthMessage(err.message, "error");
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = "Criar conta"; }
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const btn = $("loginSubmitBtn");
    if (btn) { btn.disabled = true; btn.textContent = "A entrar..."; }
    try {
        const form = new FormData(e.target);
        const data = await apiRequest("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: form.get("loginEmail"),
                password: form.get("loginPassword")
            })
        });
        saveSession(data.token, data.user);
        showAuthMessage("Login realizado ✓", "success");
        setTimeout(() => {
            closeModal("loginModal");
            e.target.reset();
            if (data.user.role === "admin") openAdmin();
            else openProfileModal();
        }, 800);
    } catch (err) {
        showAuthMessage(err.message, "error");
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = "Entrar"; }
    }
}

function openProfileModal() {
    if (!currentUser) return;
    setText("profileName", currentUser.name.split(" ")[0]);
    setText("profileEmail", currentUser.email);
    setText("profilePhone", currentUser.phone || "—");
    setText("profileRole", currentUser.role === "admin" ? "Administrador" : "Cliente");
    const adminBtn = $("openAdminFromProfile");
    if (adminBtn) adminBtn.style.display = currentUser.role === "admin" ? "inline-flex" : "none";
    openModal("profileModal");
}

function handleLogout() {
    clearSession();
    closeModal("profileModal");
    closeModal("adminModal");
    showToast("Sessão terminada", "Até à próxima!");
}

async function verifySession() {
    if (!authToken) return;
    try {
        const data = await apiRequest("/api/auth/me");
        currentUser = data.user;
        localStorage.setItem("edzzspot_user", JSON.stringify(data.user));
        updateUserUI();
        if (currentUser.role === "admin") {
            setTimeout(() => {
                setupNotificationsControls();
                startOrdersPolling();
            }, 1000);
        }
    } catch {
        clearSession();
    }
}

function setupAuth() {
    loadStoredSession();
    verifySession();

    document.querySelectorAll(".auth-tab").forEach(tab => {
        tab.addEventListener("click", () => switchAuthTab(tab.dataset.authTab));
    });
    $("loginForm")?.addEventListener("submit", handleLogin);
    $("registerForm")?.addEventListener("submit", handleRegister);

    $("openLogin")?.addEventListener("click", () => {
        if (currentUser) {
            if (currentUser.role === "admin") openAdmin();
            else openProfileModal();
        } else {
            switchAuthTab("login");
            openModal("loginModal");
        }
    });

    $("closeProfile")?.addEventListener("click", () => closeModal("profileModal"));
    $("logoutButton")?.addEventListener("click", handleLogout);
    $("logoutFromAdmin")?.addEventListener("click", handleLogout);
    $("openAdminFromProfile")?.addEventListener("click", () => {
        closeModal("profileModal");
        openAdmin();
    });

    $("openRecover")?.addEventListener("click", () => {
        closeModal("loginModal");
        resetRecoverForm();
        openModal("recoverModal");
    });
    $("backToLogin")?.addEventListener("click", () => {
        closeModal("recoverModal");
        switchAuthTab("login");
        openModal("loginModal");
    });
    $("backToStep1")?.addEventListener("click", () => {
        $("recoverStep2")?.classList.remove("active");
        $("recoverStep1")?.classList.add("active");
        showRecoverMessage("");
    });
    $("recoverStep1")?.addEventListener("submit", handleRecoverStep1);
    $("recoverStep2")?.addEventListener("submit", handleRecoverStep2);
}

/* ==========================================================
   22 — RECUPERAÇÃO
========================================================== */
function resetRecoverForm() {
    $("recoverStep1")?.reset();
    $("recoverStep2")?.reset();
    $("recoverStep1")?.classList.add("active");
    $("recoverStep2")?.classList.remove("active");
    showRecoverMessage("");
    setText("recoverSubtitle", "Insere o teu email para começares.");
    recoveryEmail = "";
}

function showRecoverMessage(text, type = "") {
    const msg = $("recoverMessage");
    if (!msg) return;
    msg.textContent = text;
    msg.className = "auth-demo " + (text ? "active " + type : "");
}

async function handleRecoverStep1(e) {
    e.preventDefault();
    const btn = $("recoverStep1Btn");
    if (btn) { btn.disabled = true; btn.textContent = "A verificar..."; }
    try {
        const form = new FormData(e.target);
        const email = form.get("recoverEmail");
        const data = await apiRequest("/api/auth/recover-question", {
            method: "POST",
            body: JSON.stringify({ email })
        });
        recoveryEmail = email;
        $("recoverQuestionBox").textContent = data.question;
        setText("recoverSubtitle", "Responde à tua pergunta de segurança.");
        showRecoverMessage("");
        $("recoverStep1").classList.remove("active");
        $("recoverStep2").classList.add("active");
    } catch (err) {
        showRecoverMessage(err.message, "error");
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = "Continuar →"; }
    }
}

async function handleRecoverStep2(e) {
    e.preventDefault();
    const btn = $("recoverStep2Btn");
    if (btn) { btn.disabled = true; btn.textContent = "A alterar..."; }
    try {
        const form = new FormData(e.target);
        const answer = form.get("recoverAnswer");
        const newPassword = form.get("recoverNewPassword");
        await apiRequest("/api/auth/recover", {
            method: "POST",
            body: JSON.stringify({ email: recoveryEmail, answer, newPassword })
        });
        showRecoverMessage("Palavra-passe alterada com sucesso!", "success");
        setTimeout(() => {
            closeModal("recoverModal");
            switchAuthTab("login");
            openModal("loginModal");
            resetRecoverForm();
            showToast("Sucesso", "Já podes entrar com a nova palavra-passe.");
        }, 1500);
    } catch (err) {
        showRecoverMessage(err.message, "error");
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = "Alterar palavra-passe"; }
    }
}

/* ==========================================================
   23 — ADMIN
========================================================== */
function isAdmin() { return currentUser?.role === "admin"; }

function openAdmin() {
    if (!isAdmin()) {
        switchAuthTab("login");
        openModal("loginModal");
        return;
    }
    openModal("adminModal");
    loadAdminDataFromServer();
}

function setupAdminTabs() {
    document.querySelectorAll(".admin-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".admin-panel").forEach(p => p.classList.remove("active"));
            tab.classList.add("active");
            const key = tab.dataset.adminTab;
            const panelId = "admin" + key.charAt(0).toUpperCase() + key.slice(1);
            $(panelId)?.classList.add("active");

            if (key === "clients") loadClients();
            if (key === "orders") checkForNewOrders();
            if (key === "logins") loadLogins();
            if (key === "invoices") loadInvoices();
            if (key === "products") loadAdminDataFromServer();
            if (key === "services") loadAdminDataFromServer();
            if (key === "games") loadAdminDataFromServer();
            if (key === "software") loadAdminDataFromServer();
            if (key === "carousel") loadAdminDataFromServer();
        });
    });
}

function renderAdmin() { loadAdminDataFromServer(); }

async function loadAdminDataFromServer() {
    try {
        const ordersRes = await fetch("/api/orders");
        const ordersFromServer = ordersRes.ok ? await ordersRes.json() : [];

        let clients = [];
        try {
            const usersRes = await fetch("/api/users", {
                headers: { "Authorization": `Bearer ${authToken}` }
            });
            const users = usersRes.ok ? await usersRes.json() : [];
            clients = users.filter(u => u.role !== "admin");
        } catch { /* ignora */ }

        orders = Array.isArray(ordersFromServer) ? ordersFromServer : [];
        const revenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

        setText("adminProductCount", products.length);
        setText("adminOrderCount", orders.length);
        setText("adminRevenue", formatKz(revenue));
        setText("adminClientCount", clients.length);

        renderAdminProducts();
        renderAdminServices();
        renderAdminGames();
        renderAdminSoftware();
        renderAdminCarousel();
        renderAdminOrdersFromServer(orders);
        updateAdminOrderBadge(orders);
        renderAdminCharts(orders);
    } catch (err) {
        console.error("Erro a carregar admin:", err);
    }
}

/* ==========================================================
   GRÁFICOS DO ADMIN (Chart.js)
========================================================== */
let adminCharts = { sales: null, revenue30: null, topProducts: null, orderStatus: null };

function getChartColors() {
    const isLight = document.body.classList.contains("light-mode");
    return {
        text: isLight ? "#131a24" : "#f5f7ff",
        muted: isLight ? "#5f6b7a" : "#a9b4c7",
        grid: isLight ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.08)",
        primary: "#00d9ff", purple: "#7c3cff", success: "#25d366",
        warning: "#ffc83c", danger: "#ff5573"
    };
}

function destroyAdminCharts() {
    Object.keys(adminCharts).forEach(k => {
        if (adminCharts[k]) {
            try { adminCharts[k].destroy(); } catch { /* ignora */ }
            adminCharts[k] = null;
        }
    });
}

function getMonthlySales(orders) {
    const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    const year = new Date().getFullYear();
    const totals = new Array(12).fill(0);
    orders.forEach(o => {
        const d = new Date(o.date);
        if (d.getFullYear() === year) totals[d.getMonth()] += Number(o.total) || 0;
    });
    return { labels: months, data: totals };
}

function getLast30DaysRevenue(orders) {
    const labels = [];
    const data = [];
    const today = new Date();
    today.setHours(23,59,59,999);

    for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dayStart = new Date(d); dayStart.setHours(0,0,0,0);
        const dayEnd = new Date(d); dayEnd.setHours(23,59,59,999);

        const total = orders
            .filter(o => {
                const od = new Date(o.date);
                return od >= dayStart && od <= dayEnd;
            })
            .reduce((s, o) => s + (Number(o.total) || 0), 0);

        labels.push(String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0"));
        data.push(total);
    }
    return { labels, data };
}

function getTopProducts(orders) {
    const counts = {};
    orders.forEach(o => {
        (o.items || []).forEach(item => {
            const key = item.name || "Sem nome";
            counts[key] = (counts[key] || 0) + (item.quantity || 1);
        });
    });
    const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 5);
    return {
        labels: sorted.map(([n]) => n.length > 20 ? n.slice(0,18) + "…" : n),
        data: sorted.map(([,c]) => c)
    };
}

function getOrderStatusCounts(orders) {
    const statuses = ["Pendente","Confirmado","Enviado","Entregue","Cancelado"];
    const colors = {
        "Pendente":"#ffc83c", "Confirmado":"#4da6ff",
        "Enviado":"#b57bff", "Entregue":"#25d366", "Cancelado":"#ff5573"
    };
    return {
        labels: statuses,
        data: statuses.map(s => orders.filter(o => (o.status || "Pendente") === s).length),
        colors: statuses.map(s => colors[s])
    };
}

function renderAdminCharts(ordersFromServer) {
    if (typeof Chart === "undefined") {
        console.warn("⚠️ Chart.js não carregado — gráficos ignorados");
        return;
    }
    const orders = Array.isArray(ordersFromServer) ? ordersFromServer : [];
    const c = getChartColors();
    destroyAdminCharts();

    /* ---- 1) Vendas por mês ---- */
    const salesCanvas = $("chartSales");
    if (salesCanvas) {
        const sales = getMonthlySales(orders);
        const total = sales.data.reduce((s,v) => s + v, 0);
        setText("chartSalesTotal", formatKz(total));

        const grad = salesCanvas.getContext("2d").createLinearGradient(0, 0, 0, 240);
        grad.addColorStop(0, "rgba(0,217,255,.35)");
        grad.addColorStop(1, "rgba(0,217,255,0)");

        adminCharts.sales = new Chart(salesCanvas, {
            type: "line",
            data: {
                labels: sales.labels,
                datasets: [{
                    data: sales.data,
                    borderColor: c.primary,
                    backgroundColor: grad,
                    borderWidth: 3, tension: 0.4, fill: true,
                    pointBackgroundColor: c.primary,
                    pointBorderColor: "#001018",
                    pointBorderWidth: 2,
                    pointRadius: 4, pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "#101827", titleColor: c.primary,
                        bodyColor: c.text, borderColor: c.primary, borderWidth: 1, padding: 10,
                        callbacks: { label: ctx => formatKz(ctx.parsed.y) }
                    }
                },
                scales: {
                    x: { ticks: { color: c.muted, font: { size: 11 } }, grid: { color: c.grid } },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: c.muted, font: { size: 11 },
                            callback: v => v >= 1e6 ? (v/1e6).toFixed(1)+"M" : v >= 1e3 ? (v/1e3).toFixed(0)+"k" : v
                        },
                        grid: { color: c.grid }
                    }
                }
            }
        });
    }

    /* ---- 2) Receita últimos 30 dias ---- */
    const rev30Canvas = $("chartRevenue30");
    if (rev30Canvas) {
        const rev = getLast30DaysRevenue(orders);
        const total = rev.data.reduce((s,v) => s + v, 0);
        setText("chartRevenue30Total", formatKz(total));

        adminCharts.revenue30 = new Chart(rev30Canvas, {
            type: "bar",
            data: {
                labels: rev.labels,
                datasets: [{
                    data: rev.data,
                    backgroundColor: c.purple,
                    borderRadius: 4,
                    barPercentage: 0.75
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "#101827", titleColor: c.purple,
                        bodyColor: c.text, borderColor: c.purple, borderWidth: 1, padding: 10,
                        callbacks: { label: ctx => formatKz(ctx.parsed.y) }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: c.muted, font: { size: 9 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 10 },
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: c.muted, font: { size: 11 },
                            callback: v => v >= 1e6 ? (v/1e6).toFixed(1)+"M" : v >= 1e3 ? (v/1e3).toFixed(0)+"k" : v
                        },
                        grid: { color: c.grid }
                    }
                }
            }
        });
    }

    /* ---- 3) Top 5 produtos ---- */
    const topCanvas = $("chartTopProducts");
    if (topCanvas) {
        const top = getTopProducts(orders);
        if (!top.labels.length) {
            topCanvas.parentElement.innerHTML =
                `<div style="display:grid;place-items:center;height:100%;color:var(--muted);font-size:.85rem;text-align:center;">Sem vendas ainda.<br>Os produtos mais vendidos aparecerão aqui.</div>`;
        } else {
            const palette = [c.primary, c.purple, c.success, c.warning, c.danger];
            adminCharts.topProducts = new Chart(topCanvas, {
                type: "doughnut",
                data: {
                    labels: top.labels,
                    datasets: [{
                        data: top.data,
                        backgroundColor: palette,
                        borderColor: "rgba(0,0,0,.15)",
                        borderWidth: 2, hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, cutout: "62%",
                    plugins: {
                        legend: {
                            position: "bottom",
                            labels: { color: c.muted, font: { size: 11 }, padding: 10, boxWidth: 12, boxHeight: 12, usePointStyle: true }
                        },
                        tooltip: {
                            backgroundColor: "#101827", titleColor: c.primary,
                            bodyColor: c.text, borderColor: c.primary, borderWidth: 1, padding: 10,
                            callbacks: {
                                label: ctx => {
                                    const t = ctx.dataset.data.reduce((s,v) => s + v, 0);
                                    const pct = t ? Math.round((ctx.parsed / t) * 100) : 0;
                                    return `${ctx.label}: ${ctx.parsed} (${pct}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    /* ---- 4) Pedidos por estado ---- */
    const stCanvas = $("chartOrderStatus");
    if (stCanvas) {
        const st = getOrderStatusCounts(orders);
        adminCharts.orderStatus = new Chart(stCanvas, {
            type: "bar",
            data: {
                labels: st.labels,
                datasets: [{
                    data: st.data,
                    backgroundColor: st.colors,
                    borderRadius: 8,
                    barThickness: 26
                }]
            },
            options: {
                indexAxis: "y",
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "#101827", titleColor: c.primary,
                        bodyColor: c.text, borderColor: c.primary, borderWidth: 1, padding: 10,
                        callbacks: { label: ctx => `${ctx.parsed.x} pedido${ctx.parsed.x === 1 ? "" : "s"}` }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { color: c.muted, font: { size: 11 }, stepSize: 1, precision: 0 },
                        grid: { color: c.grid }
                    },
                    y: {
                        ticks: { color: c.text, font: { size: 11, weight: "600" } },
                        grid: { display: false }
                    }
                }
            }
        });
    }
}

/* --------- Clientes --------- */
async function loadClients() {
    const list = $("adminClientList");
    if (!list) return;
    list.innerHTML = `<div class="admin-list-item"><div><h4>A carregar...</h4></div></div>`;
    try {
        const res = await fetch("/api/users", {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) throw new Error("Sem permissão.");
        const users = await res.json();
        const clients = users.filter(u => u.role !== "admin");

        if (!clients.length) {
            list.innerHTML = `<div class="admin-list-item"><div><h4>Nenhum cliente registado.</h4></div></div>`;
            return;
        }

        list.innerHTML = clients.map(u => `
            <div class="admin-list-item">
                <div class="admin-item-info">
                    <div class="admin-item-icon">👤</div>
                    <div>
                        <h4>${escapeHtml(u.name)}</h4>
                        <p>${escapeHtml(u.email)}</p>
                        <p style="font-size:.72rem;margin-top:4px;">
                            📞 ${escapeHtml(u.phone || "—")}
                            • Desde ${new Date(u.createdAt).toLocaleDateString("pt-AO")}
                            ${u.hasSecurityQuestion ? " • 🔐 com pergunta" : " • ⚠️ sem pergunta"}
                        </p>
                    </div>
                </div>
                <div class="client-actions">
                    <button class="reset-password-btn"
                            data-reset-password="${u.id}"
                            data-user-name="${escapeHtml(u.name)}"
                            data-user-email="${escapeHtml(u.email)}">
                        🔑 Redefinir senha
                    </button>
                </div>
            </div>
        `).join("");

        list.querySelectorAll("[data-reset-password]").forEach(btn => {
            btn.addEventListener("click", () => {
                setVal("adminResetUserId", btn.dataset.resetPassword);
                setVal("adminResetPassword", "");
                setText("adminResetUserInfo", `${btn.dataset.userName} (${btn.dataset.userEmail})`);
                openModal("adminResetPasswordModal");
            });
        });
    } catch (err) {
        list.innerHTML = `<div class="admin-list-item"><div><h4>Erro</h4><p>${escapeHtml(err.message)}</p></div></div>`;
    }
}

function setupClientsAdmin() {
    $("refreshClients")?.addEventListener("click", loadClients);

    $("adminResetForm")?.addEventListener("submit", async e => {
        e.preventDefault();
        const userId = $("adminResetUserId")?.value;
        const newPassword = $("adminResetPassword")?.value;
        if (!userId || !newPassword) return;
        if (newPassword.length < 6) {
            return showToast("Erro", "A senha precisa de pelo menos 6 caracteres.");
        }
        try {
            const res = await fetch("/api/auth/admin-reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify({ userId, newPassword })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || "Erro.");
            try {
                await navigator.clipboard.writeText(newPassword);
                showToast("✅ Senha redefinida", "Copiada para o clipboard. Entrega ao cliente.");
            } catch {
                showToast("✅ Senha redefinida", `Nova senha: ${newPassword}`);
            }
            closeModal("adminResetPasswordModal");
        } catch (err) {
            showToast("Erro", err.message);
        }
    });
}

/* --------- Logins --------- */
async function loadLogins() {
    const list = $("adminLoginList");
    if (!list) return;
    list.innerHTML = `<div class="admin-list-item"><div><h4>A carregar...</h4></div></div>`;
    try {
        const res = await fetch("/api/logins", {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) throw new Error("Sem permissão.");
        const logins = await res.json();
        if (!logins.length) {
            list.innerHTML = `<div class="admin-list-item"><div><h4>Ainda não há registos.</h4></div></div>`;
            return;
        }
        list.innerHTML = logins.map(l => `
            <div class="admin-list-item ${l.success ? "" : "is-new"}">
                <div class="admin-item-info">
                    <div class="admin-item-icon">${l.success ? "✅" : "❌"}</div>
                    <div>
                        <h4>${escapeHtml(l.name)} ${l.role === "admin" ? "👑" : ""}</h4>
                        <p>${escapeHtml(l.email)}</p>
                        <p style="font-size:.72rem;margin-top:4px;">
                            🌐 ${escapeHtml((l.ip || "").replace("::ffff:", ""))}
                            • ${new Date(l.date).toLocaleString("pt-AO")}
                        </p>
                    </div>
                </div>
                <div class="admin-item-actions">
                    <span style="font-size:.72rem;color:${l.success ? "var(--success)" : "var(--danger)"};font-weight:800;">
                        ${l.success ? "SUCESSO" : "FALHOU"}
                    </span>
                </div>
            </div>
        `).join("");
    } catch (err) {
        list.innerHTML = `<div class="admin-list-item"><div><h4>Erro</h4><p>${escapeHtml(err.message)}</p></div></div>`;
    }
}

/* --------- Faturas --------- */
async function loadInvoices() {
    const list = $("adminInvoiceList");
    if (!list) return;
    list.innerHTML = `<div class="admin-list-item"><div><h4>A carregar...</h4></div></div>`;
    try {
        const res = await fetch("/api/invoices", {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (!res.ok) throw new Error("Sem permissão.");
        const invoices = await res.json();
        if (!invoices.length) {
            list.innerHTML = `<div class="admin-list-item"><div><h4>Nenhuma fatura ainda.</h4></div></div>`;
            return;
        }
        list.innerHTML = invoices.map(inv => `
            <div class="admin-list-item">
                <div class="admin-item-info">
                    <div class="admin-item-icon">🧾</div>
                    <div>
                        <h4>${inv.id}</h4>
                        <p>${escapeHtml(inv.customer?.name || "?")} • ${formatKz(inv.total)} • ${escapeHtml(inv.paymentMethod || "—")}</p>
                        <p style="font-size:.72rem;margin-top:4px;">
                            ${new Date(inv.date).toLocaleString("pt-AO")}
                        </p>
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button class="admin-edit" data-view-invoice="${inv.id}">Ver detalhes</button>
                </div>
            </div>
        `).join("");

        list.querySelectorAll("[data-view-invoice]").forEach(btn => {
            btn.addEventListener("click", () => {
                const inv = invoices.find(i => i.id === btn.dataset.viewInvoice);
                if (inv) showInvoiceDetails(inv);
            });
        });
    } catch (err) {
        list.innerHTML = `<div class="admin-list-item"><div><h4>Erro</h4><p>${escapeHtml(err.message)}</p></div></div>`;
    }
}

function showInvoiceDetails(invoice) {
    setText("invoiceOrderNumber", invoice.id);
    setText("invoiceDate", new Date(invoice.date).toLocaleString("pt-AO"));
    setText("invoiceCustomer", invoice.customer?.name || "—");
    setText("invoicePhone", invoice.customer?.phone || "—");
    setText("invoiceSubtotal", formatKz(invoice.subtotal));
    setText("invoiceShipping", formatKz(invoice.shipping));
    setText("invoiceTotal", formatKz(invoice.total));

    if ($("invoiceItems")) {
        $("invoiceItems").innerHTML = (invoice.items || []).map(item => `
            <div class="invoice-item">
                <span>${escapeHtml(item.name)}</span>
                <span>${item.quantity}x</span>
                <strong>${formatKz(item.price * item.quantity)}</strong>
            </div>
        `).join("");
    }
    openModal("invoiceModal");
}

/* --------- Produtos admin --------- */
function renderAdminProducts() {
    const list = $("adminProductList");
    if (!list) return;
    list.innerHTML = products.map(p => `
        <div class="admin-list-item">
            <div class="admin-item-info">
                <div class="admin-item-icon">
                    ${p.image ? `<img src="${escapeHtml(p.image)}" alt="">` : `💻`}
                </div>
                <div>
                    <h4>${escapeHtml(p.name)}</h4>
                    <p>${formatKz(p.price)} • ${getCategoryName(p.category)}</p>
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-edit" data-edit-product="${p.id}">Editar</button>
                <button class="admin-delete" data-delete-product="${p.id}">Eliminar</button>
            </div>
        </div>
    `).join("");
}

function setupProductAdmin() {
    $("openProductForm")?.addEventListener("click", () => {
        $("productForm")?.reset();
        setVal("productId", "");
        if ($("productImagePreview")) $("productImagePreview").innerHTML = "";
        openModal("productFormModal");
    });

    $("productForm")?.addEventListener("submit", async e => {
        e.preventDefault();
        const form = new FormData(e.target);
        const file = $("productImageFile")?.files?.[0];
        const id = form.get("productId");

        let image = form.get("productImage") || "";
        try { if (file) image = await readImageFile(file); }
        catch (err) { return showToast("Erro na imagem", err.message); }

        const product = {
            id: id ? Number(id) : generateId(),
            name: form.get("productName"),
            category: form.get("productCategory"),
            price: Number(form.get("productPrice")),
            description: form.get("productDescription"),
            processor: form.get("productProcessor") || "Não informado",
            ram: form.get("productRam") || "Não informado",
            storage: form.get("productStorage") || "Não informado",
            gpu: form.get("productGpu") || "Não informado",
            image
        };

        if (id) {
            products = products.map(p => p.id === Number(id) ? product : p);
            showToast("Produto atualizado", `${product.name} foi atualizado.`);
        } else {
            products.push(product);
            showToast("Produto adicionado", `${product.name} já está na loja.`);
        }

        saveData(STORAGE.products, products);
        buildDynamicFilterOptions();
        renderProducts();
        renderAccessories();
        renderAdmin();
        closeModal("productFormModal");
    });

    document.addEventListener("click", e => {
        const edit = e.target.closest("[data-edit-product]");
        const remove = e.target.closest("[data-delete-product]");
        if (edit) editProduct(Number(edit.dataset.editProduct));
        if (remove) deleteProduct(Number(remove.dataset.deleteProduct));
    });
}

function editProduct(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    setVal("productId", p.id);
    setVal("productName", p.name);
    setVal("productCategory", p.category);
    setVal("productPrice", p.price);
    setVal("productDescription", p.description);
    setVal("productProcessor", p.processor);
    setVal("productRam", p.ram);
    setVal("productStorage", p.storage);
    setVal("productGpu", p.gpu);
    setVal("productImage", p.image?.startsWith("data:") ? "" : (p.image || ""));
    setVal("productImageFile", "");
    if ($("productImagePreview")) {
        $("productImagePreview").innerHTML = p.image
            ? `<img src="${escapeHtml(p.image)}" alt="Pré-visualização"><span>Imagem atual</span>` : "";
    }
    openModal("productFormModal");
}

function deleteProduct(id) {
    const p = products.find(x => x.id === id);
    if (!p || !confirm(`Eliminar "${p.name}"?`)) return;
    products = products.filter(x => x.id !== id);
    saveData(STORAGE.products, products);
    buildDynamicFilterOptions();
    renderProducts();
    renderAccessories();
    renderAdmin();
    showToast("Produto eliminado", `${p.name} foi removido.`);
}

/* --------- Serviços admin --------- */
function renderAdminServices() {
    const list = $("adminServiceList");
    if (!list) return;
    if (!services.length) {
        list.innerHTML = `<div class="admin-list-item"><div><h4>Nenhum serviço cadastrado.</h4></div></div>`;
        return;
    }
    list.innerHTML = services.map(s => `
        <div class="admin-list-item">
            <div class="admin-item-info">
                <div class="admin-item-icon">
                    ${s.image ? `<img src="${escapeHtml(s.image)}" alt="">` : escapeHtml(s.icon || "🛠️")}
                </div>
                <div>
                    <h4>${escapeHtml(s.name)}</h4>
                    <p>${formatKz(s.price)} • ${escapeHtml(s.description)}</p>
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-edit" data-edit-service="${s.id}">Editar</button>
                <button class="admin-delete" data-delete-service="${s.id}">Eliminar</button>
            </div>
        </div>
    `).join("");
}

function setupServiceAdmin() {
    $("openServiceForm")?.addEventListener("click", () => {
        $("serviceForm")?.reset();
        setVal("serviceId", "");
        setVal("newServiceIcon", "🛠️");
        if ($("serviceImagePreview")) $("serviceImagePreview").innerHTML = "";
        openModal("serviceFormModal");
    });

    document.addEventListener("click", e => {
        const edit = e.target.closest("[data-edit-service]");
        const remove = e.target.closest("[data-delete-service]");
        if (edit) editServiceForm(Number(edit.dataset.editService));
        if (remove) deleteServiceById(Number(remove.dataset.deleteService));
    });

    $("serviceForm")?.addEventListener("submit", async e => {
        e.preventDefault();
        const form = new FormData(e.target);
        const id = form.get("serviceId");
        const file = $("serviceImageFile")?.files?.[0];
        try {
            let image = form.get("newServiceImage") || "";
            if (file) image = await readImageFile(file);
            const service = {
                id: id ? Number(id) : generateId(),
                name: String(form.get("newServiceName") || "").trim(),
                description: String(form.get("newServiceDescription") || "").trim(),
                price: Number(form.get("newServicePrice")) || 0,
                icon: String(form.get("newServiceIcon") || "🛠️").trim(),
                image
            };
            if (id) {
                services = services.map(s => s.id === Number(id) ? service : s);
                showToast("Serviço atualizado", `${service.name} foi atualizado.`);
            } else {
                services.push(service);
                showToast("Serviço adicionado", `${service.name} já está disponível.`);
            }
            saveData(STORAGE.services, services);
            renderServices();
            renderAdmin();
            closeModal("serviceFormModal");
            e.target.reset();
            if ($("serviceImagePreview")) $("serviceImagePreview").innerHTML = "";
        } catch (err) {
            showToast("Erro na imagem", err.message);
        }
    });
}

function editServiceForm(id) {
    const s = services.find(x => x.id === id);
    if (!s) return;
    setVal("serviceId", s.id);
    setVal("newServiceName", s.name);
    setVal("newServiceDescription", s.description);
    setVal("newServicePrice", s.price || 0);
    setVal("newServiceIcon", s.icon || "🛠️");
    setVal("newServiceImage", s.image?.startsWith("data:") ? "" : (s.image || ""));
    if ($("serviceImagePreview")) {
        $("serviceImagePreview").innerHTML = s.image
            ? `<img src="${escapeHtml(s.image)}" alt="Pré-visualização"><span>Imagem atual</span>` : "";
    }
    openModal("serviceFormModal");
}

function deleteServiceById(id) {
    const s = services.find(x => x.id === id);
    if (!s || !confirm(`Eliminar o serviço "${s.name}"?`)) return;
    services = services.filter(x => x.id !== id);
    saveData(STORAGE.services, services);
    renderServices();
    renderAdmin();
    showToast("Serviço eliminado", `${s.name} foi removido.`);
}

/* --------- Jogos admin --------- */
function renderAdminGames() {
    const list = $("adminGameList");
    if (!list) return;
    if (!games.length) {
        list.innerHTML = `<div class="admin-list-item"><div><h4>Nenhum jogo cadastrado.</h4></div></div>`;
        return;
    }
    list.innerHTML = games.map(g => `
        <div class="admin-list-item">
            <div class="admin-item-info">
                <div class="admin-item-icon">
                    ${g.image ? `<img src="${escapeHtml(g.image)}" alt="">` : escapeHtml(g.icon || "🎮")}
                </div>
                <div>
                    <h4>${escapeHtml(g.name)}</h4>
                    <p>${formatKz(g.price)} • ${escapeHtml(g.description)}</p>
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-edit" data-edit-game="${g.id}">Editar</button>
                <button class="admin-delete" data-delete-game="${g.id}">Eliminar</button>
            </div>
        </div>
    `).join("");
}

function setupGameAdmin() {
    $("openGameForm")?.addEventListener("click", () => {
        $("gameForm")?.reset();
        setVal("gameId", "");
        setVal("gameIcon", "🎮");
        if ($("gameImagePreview")) $("gameImagePreview").innerHTML = "";
        openModal("gameFormModal");
    });

    document.addEventListener("click", e => {
        const edit = e.target.closest("[data-edit-game]");
        const remove = e.target.closest("[data-delete-game]");
        if (edit) editGameForm(Number(edit.dataset.editGame));
        if (remove) deleteGameById(Number(remove.dataset.deleteGame));
    });

    $("gameForm")?.addEventListener("submit", async e => {
        e.preventDefault();
        const form = new FormData(e.target);
        const id = form.get("gameId");
        const file = $("gameImageFile")?.files?.[0];
        try {
            let image = form.get("gameImage") || "";
            if (file) image = await readImageFile(file);
            const game = {
                id: id ? Number(id) : generateId(),
                name: String(form.get("gameName") || "").trim(),
                description: String(form.get("gameDescription") || "").trim(),
                price: Number(form.get("gamePrice")) || 0,
                icon: String(form.get("gameIcon") || "🎮").trim(),
                image
            };
            if (id) {
                games = games.map(g => g.id === Number(id) ? game : g);
                showToast("Jogo atualizado", `${game.name} foi atualizado.`);
            } else {
                games.push(game);
                showToast("Jogo adicionado", `${game.name} já está disponível.`);
            }
            saveData(STORAGE.games, games);
            renderGames();
            renderAdmin();
            closeModal("gameFormModal");
            e.target.reset();
            if ($("gameImagePreview")) $("gameImagePreview").innerHTML = "";
        } catch (err) {
            showToast("Erro na imagem", err.message);
        }
    });
}

function editGameForm(id) {
    const g = games.find(x => x.id === id);
    if (!g) return;
    setVal("gameId", g.id);
    setVal("gameName", g.name);
    setVal("gameDescription", g.description);
    setVal("gamePrice", g.price || 0);
    setVal("gameIcon", g.icon || "🎮");
    setVal("gameImage", g.image?.startsWith("data:") ? "" : (g.image || ""));
    if ($("gameImagePreview")) {
        $("gameImagePreview").innerHTML = g.image
            ? `<img src="${escapeHtml(g.image)}" alt="Pré-visualização"><span>Imagem atual</span>` : "";
    }
    openModal("gameFormModal");
}

function deleteGameById(id) {
    const g = games.find(x => x.id === id);
    if (!g || !confirm(`Eliminar o jogo "${g.name}"?`)) return;
    games = games.filter(x => x.id !== id);
    saveData(STORAGE.games, games);
    renderGames();
    renderAdmin();
    showToast("Jogo eliminado", `${g.name} foi removido.`);
}

/* --------- Programas admin --------- */
function renderAdminSoftware() {
    const list = $("adminSoftwareList");
    if (!list) return;
    if (!software.length) {
        list.innerHTML = `<div class="admin-list-item"><div><h4>Nenhum programa cadastrado.</h4></div></div>`;
        return;
    }
    list.innerHTML = software.map(s => `
        <div class="admin-list-item">
            <div class="admin-item-info">
                <div class="admin-item-icon">
                    ${s.image ? `<img src="${escapeHtml(s.image)}" alt="">` : escapeHtml(s.icon || "📊")}
                </div>
                <div>
                    <h4>${escapeHtml(s.name)}</h4>
                    <p>${formatKz(s.price)} • ${escapeHtml(s.description)}</p>
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-edit" data-edit-software="${s.id}">Editar</button>
                <button class="admin-delete" data-delete-software="${s.id}">Eliminar</button>
            </div>
        </div>
    `).join("");
}

function setupSoftwareAdmin() {
    $("openSoftwareForm")?.addEventListener("click", () => {
        $("softwareForm")?.reset();
        setVal("softwareId", "");
        setVal("softwareIcon", "📊");
        if ($("softwareImagePreview")) $("softwareImagePreview").innerHTML = "";
        openModal("softwareFormModal");
    });

    document.addEventListener("click", e => {
        const edit = e.target.closest("[data-edit-software]");
        const remove = e.target.closest("[data-delete-software]");
        if (edit) editSoftwareForm(Number(edit.dataset.editSoftware));
        if (remove) deleteSoftwareById(Number(remove.dataset.deleteSoftware));
    });

    $("softwareForm")?.addEventListener("submit", async e => {
        e.preventDefault();
        const form = new FormData(e.target);
        const id = form.get("softwareId");
        const file = $("softwareImageFile")?.files?.[0];
        try {
            let image = form.get("softwareImage") || "";
            if (file) image = await readImageFile(file);
            const sw = {
                id: id ? Number(id) : generateId(),
                name: String(form.get("softwareName") || "").trim(),
                description: String(form.get("softwareDescription") || "").trim(),
                price: Number(form.get("softwarePrice")) || 0,
                icon: String(form.get("softwareIcon") || "📊").trim(),
                image
            };
            if (id) {
                software = software.map(s => s.id === Number(id) ? sw : s);
                showToast("Programa atualizado", `${sw.name} foi atualizado.`);
            } else {
                software.push(sw);
                showToast("Programa adicionado", `${sw.name} já está disponível.`);
            }
            saveData(STORAGE.software, software);
            renderSoftware();
            renderAdmin();
            closeModal("softwareFormModal");
            e.target.reset();
            if ($("softwareImagePreview")) $("softwareImagePreview").innerHTML = "";
        } catch (err) {
            showToast("Erro na imagem", err.message);
        }
    });
}

function editSoftwareForm(id) {
    const s = software.find(x => x.id === id);
    if (!s) return;
    setVal("softwareId", s.id);
    setVal("softwareName", s.name);
    setVal("softwareDescription", s.description);
    setVal("softwarePrice", s.price || 0);
    setVal("softwareIcon", s.icon || "📊");
    setVal("softwareImage", s.image?.startsWith("data:") ? "" : (s.image || ""));
    if ($("softwareImagePreview")) {
        $("softwareImagePreview").innerHTML = s.image
            ? `<img src="${escapeHtml(s.image)}" alt="Pré-visualização"><span>Imagem atual</span>` : "";
    }
    openModal("softwareFormModal");
}

function deleteSoftwareById(id) {
    const s = software.find(x => x.id === id);
    if (!s || !confirm(`Eliminar o programa "${s.name}"?`)) return;
    software = software.filter(x => x.id !== id);
    saveData(STORAGE.software, software);
    renderSoftware();
    renderAdmin();
    showToast("Programa eliminado", `${s.name} foi removido.`);
}

/* --------- Carrossel admin --------- */
function renderAdminCarousel() {
    const list = $("adminCarouselList");
    if (!list) return;
    if (!carouselSlides.length) {
        list.innerHTML = `<div class="admin-list-item"><div><h4>Nenhum slide.</h4></div></div>`;
        return;
    }
    list.innerHTML = carouselSlides.map(s => `
        <div class="admin-list-item">
            <div class="admin-item-info">
                <div class="admin-item-icon">
                    ${s.image ? `<img src="${escapeHtml(s.image)}" alt="">` : `🎠`}
                </div>
                <div>
                    <h4>${s.title.replace(/<[^>]*>/g, "")}</h4>
                    <p>${escapeHtml(s.tag)} • ${formatKz(s.price)}</p>
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-edit" data-edit-carousel="${s.id}">Editar</button>
                <button class="admin-delete" data-delete-carousel="${s.id}">Eliminar</button>
            </div>
        </div>
    `).join("");
}

function setupCarouselAdmin() {
    previewImage("carouselImageFile", "carouselImagePreview");
    $("openCarouselForm")?.addEventListener("click", () => {
        $("carouselForm")?.reset();
        setVal("carouselId", "");
        setVal("carouselTag", "DESTAQUE");
        if ($("carouselImagePreview")) $("carouselImagePreview").innerHTML = "";
        openModal("carouselFormModal");
    });

    document.addEventListener("click", e => {
        const edit = e.target.closest("[data-edit-carousel]");
        const remove = e.target.closest("[data-delete-carousel]");
        if (edit) editCarouselForm(Number(edit.dataset.editCarousel));
        if (remove) deleteCarousel(Number(remove.dataset.deleteCarousel));
    });

    $("carouselForm")?.addEventListener("submit", async e => {
        e.preventDefault();
        const form = new FormData(e.target);
        const id = form.get("carouselId");
        const file = $("carouselImageFile")?.files?.[0];
        try {
            let image = form.get("carouselImage") || "";
            if (file) image = await readImageFile(file);
            const slide = {
                id: id ? Number(id) : generateId(),
                tag: String(form.get("carouselTag") || "").trim(),
                title: String(form.get("carouselTitle") || "").trim(),
                description: String(form.get("carouselDescription") || "").trim(),
                price: Number(form.get("carouselPrice")) || 0,
                image
            };
            if (id) {
                carouselSlides = carouselSlides.map(s => s.id === Number(id) ? slide : s);
                showToast("Slide atualizado", "Alterações guardadas.");
            } else {
                carouselSlides.push(slide);
                showToast("Slide adicionado", "Já aparece no carrossel.");
            }
            saveData(STORAGE.carousel, carouselSlides);
            renderCarousel();
            renderAdminCarousel();
            closeModal("carouselFormModal");
            e.target.reset();
            if ($("carouselImagePreview")) $("carouselImagePreview").innerHTML = "";
        } catch (err) {
            showToast("Erro na imagem", err.message);
        }
    });
}

function editCarouselForm(id) {
    const s = carouselSlides.find(x => x.id === id);
    if (!s) return;
    setVal("carouselId", s.id);
    setVal("carouselTag", s.tag);
    setVal("carouselTitle", s.title);
    setVal("carouselPrice", s.price);
    setVal("carouselDescription", s.description);
    setVal("carouselImage", s.image?.startsWith("data:") ? "" : (s.image || ""));
    setVal("carouselImageFile", "");
    if ($("carouselImagePreview")) {
        $("carouselImagePreview").innerHTML = s.image
            ? `<img src="${escapeHtml(s.image)}" alt=""><span>Imagem atual</span>` : "";
    }
    openModal("carouselFormModal");
}

function deleteCarousel(id) {
    const s = carouselSlides.find(x => x.id === id);
    if (!s || !confirm(`Eliminar o slide "${s.title.replace(/<[^>]*>/g, "")}"?`)) return;
    carouselSlides = carouselSlides.filter(x => x.id !== id);
    saveData(STORAGE.carousel, carouselSlides);
    renderCarousel();
    renderAdminCarousel();
    showToast("Slide eliminado", "Removido do carrossel.");
}

/* ==========================================================
   24 — PEDIDOS / NOTIFICAÇÕES
========================================================== */
async function fetchOrders() {
    try {
        const res = await fetch("/api/orders");
        if (!res.ok) return null;
        return await res.json();
    } catch { return null; }
}

function beep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    } catch { /* silencioso */ }
}

async function requestSystemNotificationPermission() {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    const permission = await Notification.requestPermission();
    return permission === "granted";
}

function showSystemNotification(order) {
    if (!systemNotifications) return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    try {
        const notif = new Notification("🛒 Novo pedido EdZZ-Spot", {
            body: `${order.customer?.name || "Cliente"}\n${order.total} Kz\n${order.id}`
        });
        notif.onclick = () => {
            window.focus();
            openAdmin();
            switchAdminTab("orders");
        };
    } catch { /* silencioso */ }
}

function switchAdminTab(tabKey) {
    document.querySelectorAll(".admin-tab").forEach(t => {
        t.classList.toggle("active", t.dataset.adminTab === tabKey);
    });
    document.querySelectorAll(".admin-panel").forEach(p => p.classList.remove("active"));
    const panelId = "admin" + tabKey.charAt(0).toUpperCase() + tabKey.slice(1);
    $(panelId)?.classList.add("active");
}

function updateAdminOrderBadge(ordersList) {
    if (!currentUser || currentUser.role !== "admin") {
        const badge = $("adminOrderBadge");
        if (badge) badge.hidden = true;
        return;
    }
    const unseen = ordersList.filter(o => !o.seen).length;
    const badge = $("adminOrderBadge");
    if (badge) {
        if (unseen > 0) {
            badge.textContent = unseen > 99 ? "99+" : unseen;
            badge.hidden = false;
        } else {
            badge.hidden = true;
        }
    }
}

async function checkForNewOrders(firstRun = false) {
    if (!currentUser || currentUser.role !== "admin") return;
    const ordersFromServer = await fetchOrders();
    if (!ordersFromServer) return;

    const currentIds = new Set(ordersFromServer.map(o => o.id));
    if (!firstRun) {
        const newOnes = ordersFromServer.filter(o => !knownOrderIds.has(o.id));
        if (newOnes.length > 0) {
            newOnes.forEach(order => {
                showToast("🛒 Novo pedido recebido!", `${order.customer?.name || "Cliente"} — ${formatKz(order.total)}`);
                showSystemNotification(order);
            });
            if (notificationSound) beep();
        }
    }
    knownOrderIds = currentIds;
    updateAdminOrderBadge(ordersFromServer);
    renderAdminOrdersFromServer(ordersFromServer);
}

function renderAdminOrdersFromServer(ordersFromServer) {
    const list = $("adminOrderList");
    if (!list) return;
    if (!ordersFromServer.length) {
        list.innerHTML = `<div class="admin-list-item"><div><h4>Nenhum pedido ainda.</h4><p>Os pedidos dos clientes aparecerão aqui.</p></div></div>`;
        return;
    }
    const sorted = [...ordersFromServer].reverse();
    list.innerHTML = sorted.map(o => {
        const isSeen = o.seen === true;
        const status = o.status || "Pendente";
        const statusClass = getStatusClass(status);
        return `
        <div class="admin-list-item ${isSeen ? "" : "is-new"}">
            <div class="admin-item-info">
                <div class="admin-item-icon">🛒</div>
                <div>
                    <h4>
                        ${o.id}
                        <span class="order-status-badge ${statusClass}">${status}</span>
                        ${isSeen ? "" : '<span class="order-new-badge">NOVO</span>'}
                    </h4>
                    <p>
                        ${escapeHtml(o.customer?.name || "?")} •
                        ${formatKz(o.total)} •
                        ${escapeHtml(o.paymentMethod || "—")}
                    </p>
                    <p style="font-size:.72rem;margin-top:4px;">
                        📞 ${escapeHtml(o.customer?.phone || "—")}
                        • ${new Date(o.date).toLocaleString("pt-AO")}
                    </p>
                </div>
            </div>
            <div class="admin-item-actions">
                ${isSeen ? "" : `<button class="admin-edit" data-mark-seen="${o.id}">Marcar como lido</button>`}
                <select class="order-status-select" data-order-status="${o.id}">
                    <option value="Pendente"   ${status === "Pendente"   ? "selected" : ""}>🟡 Pendente</option>
                    <option value="Confirmado" ${status === "Confirmado" ? "selected" : ""}>🔵 Confirmado</option>
                    <option value="Enviado"    ${status === "Enviado"    ? "selected" : ""}>🟣 Enviado</option>
                    <option value="Entregue"   ${status === "Entregue"   ? "selected" : ""}>🟢 Entregue</option>
                    <option value="Cancelado"  ${status === "Cancelado"  ? "selected" : ""}>🔴 Cancelado</option>
                </select>
            </div>
        </div>
        `;
    }).join("");

    list.querySelectorAll("[data-mark-seen]").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.markSeen;
            btn.disabled = true;
            btn.textContent = "A guardar...";
            try {
                const res = await fetch(`/api/orders/${encodeURIComponent(id)}/seen`, {
                    method: "PATCH",
                    headers: { "Authorization": authToken ? `Bearer ${authToken}` : "" }
                });
                if (!res.ok) throw new Error("Falha ao marcar.");
                showToast("✅", "Pedido marcado como lido.");
                await loadAdminDataFromServer();
            } catch (err) {
                showToast("Erro", err.message);
                btn.disabled = false;
                btn.textContent = "Marcar como lido";
            }
        });
    });

    list.querySelectorAll("[data-order-status]").forEach(select => {
        select.addEventListener("change", async e => {
            const id = select.dataset.orderStatus;
            const newStatus = e.target.value;
            select.disabled = true;
            try {
                const res = await fetch(`/api/orders/${encodeURIComponent(id)}/status`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": authToken ? `Bearer ${authToken}` : ""
                    },
                    body: JSON.stringify({ status: newStatus })
                });
                if (!res.ok) throw new Error("Falha ao alterar.");
                showToast("📦 Estado atualizado", `${id} → ${newStatus}`);
                await loadAdminDataFromServer();
            } catch (err) {
                showToast("Erro", err.message);
                select.disabled = false;
            }
        });
    });
}

function getStatusClass(status) {
    const map = {
        "Pendente":   "status-pending",
        "Confirmado": "status-confirmed",
        "Enviado":    "status-shipped",
        "Entregue":   "status-delivered",
        "Cancelado":  "status-cancelled"
    };
    return map[status] || "status-pending";
}

function startOrdersPolling() {
    if (ordersPollTimer) clearInterval(ordersPollTimer);
    if (!currentUser || currentUser.role !== "admin") return;
    checkForNewOrders(true);
    ordersPollTimer = setInterval(() => checkForNewOrders(), 15000);
}

function stopOrdersPolling() {
    if (ordersPollTimer) {
        clearInterval(ordersPollTimer);
        ordersPollTimer = null;
    }
    const badge = $("adminOrderBadge");
    if (badge) badge.hidden = true;
}

function setupNotificationsControls() {
    const ordersHeader = document.querySelector("#adminOrders .admin-panel-header");
    if (!ordersHeader || ordersHeader.querySelector(".admin-notif-controls")) return;

    const controls = document.createElement("div");
    controls.className = "admin-notif-controls";
    controls.innerHTML = `
        <button id="toggleSound" class="${notificationSound ? "active" : ""}" type="button">🔊 Som</button>
        <button id="toggleSystemNotif" class="${systemNotifications ? "active" : ""}" type="button">🔔 Notificações</button>
        <button id="refreshOrders" type="button">↻ Atualizar</button>
    `;
    ordersHeader.appendChild(controls);

    $("toggleSound")?.addEventListener("click", () => {
        notificationSound = !notificationSound;
        $("toggleSound").classList.toggle("active", notificationSound);
        showToast("Som", notificationSound ? "Ligado" : "Desligado");
    });

    $("toggleSystemNotif")?.addEventListener("click", async () => {
        if (!systemNotifications) {
            const ok = await requestSystemNotificationPermission();
            if (ok) {
                systemNotifications = true;
                $("toggleSystemNotif").classList.add("active");
                showToast("Notificações", "Ativadas");
            } else {
                showToast("Notificações", "Permissão negada pelo browser");
            }
        } else {
            systemNotifications = false;
            $("toggleSystemNotif").classList.remove("active");
            showToast("Notificações", "Desativadas");
        }
    });

    $("refreshOrders")?.addEventListener("click", () => {
        checkForNewOrders();
        showToast("Pedidos", "Lista atualizada");
    });
}

/* ==========================================================
   25 — CONTACTO
========================================================== */
function setupContact() {
    $("contactForm")?.addEventListener("submit", e => {
        e.preventDefault();
        if ($("service")?.value === "Otimização ao domicílio") {
            openModal("appointmentModal");
        }
        showToast("Mensagem enviada", "Obrigado por contactar a EdZZ-Spot AO.");
        e.target.reset();
    });
}

/* ==========================================================
   26 — TOAST
========================================================== */
let toastTimer;

function showToast(title, message) {
    const toast = $("toast");
    if (!toast) return;
    setText("toastTitle", title);
    setText("toastMessage", message);
    toast.classList.add("active");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("active"), 3500);
}

function setupToastClose() {
    $("toastClose")?.addEventListener("click", () => {
        $("toast")?.classList.remove("active");
    });
}

/* ==========================================================
   27 — JOGOS E PROGRAMAS
========================================================== */
function renderGames() {
    const grid = $("gamesGrid");
    if (!grid) return;
    if (!Array.isArray(games)) games = [...DEFAULT_GAMES];

    grid.innerHTML = games.map(g => {
        const favorite = favorites.includes(g.id);
        return `
        <article class="game-card reveal">
            ${g.image
                ? `<div class="game-card-image">
                       <img src="${escapeHtml(g.image)}" alt="${escapeHtml(g.name)}">
                       <button class="favorite-button ${favorite ? "active" : ""}"
                               data-favorite="${g.id}" type="button"
                               aria-label="Favorito">${favorite ? "♥" : "♡"}</button>
                   </div>`
                : `<div class="game-card-icon">
                       ${escapeHtml(g.icon || "🎮")}
                       <button class="favorite-button ${favorite ? "active" : ""}"
                               data-favorite="${g.id}" type="button"
                               aria-label="Favorito">${favorite ? "♥" : "♡"}</button>
                   </div>`}
            <h3>${escapeHtml(g.name)}</h3>
            <p>${escapeHtml(g.description)}</p>
            <div class="card-bottom">
                <strong class="card-price">${formatKz(g.price)}</strong>
                <div style="display:flex;gap:6px;">
                    <button class="view-product" data-view-game="${g.id}">Detalhes</button>
                    <button class="card-add-btn" data-add-game="${g.id}">+ Carrinho</button>
                </div>
            </div>
        </article>
        `;
    }).join("");

    grid.querySelectorAll("[data-add-game]").forEach(btn => {
        btn.addEventListener("click", () => addToCart(Number(btn.dataset.addGame), "game"));
    });
    observeReveals();
}

function renderSoftware() {
    const grid = $("softwareGrid");
    if (!grid) return;
    if (!Array.isArray(software)) software = [...DEFAULT_SOFTWARE];

    grid.innerHTML = software.map(s => {
        const favorite = favorites.includes(s.id);
        return `
        <article class="software-card reveal">
            ${s.image
                ? `<div class="software-card-image">
                       <img src="${escapeHtml(s.image)}" alt="${escapeHtml(s.name)}">
                       <button class="favorite-button ${favorite ? "active" : ""}"
                               data-favorite="${s.id}" type="button"
                               aria-label="Favorito">${favorite ? "♥" : "♡"}</button>
                   </div>`
                : `<div class="software-icon">
                       ${escapeHtml(s.icon || "📊")}
                       <button class="favorite-button ${favorite ? "active" : ""}"
                               data-favorite="${s.id}" type="button"
                               aria-label="Favorito">${favorite ? "♥" : "♡"}</button>
                   </div>`}
            <h3>${escapeHtml(s.name)}</h3>
            <p>${escapeHtml(s.description)}</p>
            <div class="card-bottom">
                <strong class="card-price">${formatKz(s.price)}</strong>
                <button class="card-add-btn" data-add-software="${s.id}">+ Carrinho</button>
            </div>
        </article>
        `;
    }).join("");

    grid.querySelectorAll("[data-add-software]").forEach(btn => {
        btn.addEventListener("click", () => addToCart(Number(btn.dataset.addSoftware), "software"));
    });
    observeReveals();
}

/* ==========================================================
   28 — FAVORITOS
========================================================== */
function toggleFavorite(id) {
    if (!currentUser) {
        showToast("Atenção", "Faz login para guardar favoritos.");
        return;
    }
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
        showToast("Favoritos", "Removido dos favoritos.");
    } else {
        favorites.push(id);
        showToast("Favoritos", "Guardado nos favoritos.");
    }
    saveFavorites();
    updateFavoritesCount();
    renderProducts();
    renderGames();
    renderSoftware();
    if ($("favoritesModal")?.classList.contains("active")) {
        renderFavorites();
    }
}

function renderFavorites() {
    const container = $("favoritesContent");
    if (!container) return;

    if (!currentUser) {
        container.innerHTML = `
            <div class="favorites-empty">
                <div class="favorites-empty-icon">🔒</div>
                <h3>Faz login para veres os teus favoritos</h3>
                <p>Os favoritos são guardados na tua conta.</p>
                <button id="loginForFavorites" class="btn btn-primary" style="margin-top:14px;">
                    Entrar ou criar conta
                </button>
            </div>
        `;
        $("loginForFavorites")?.addEventListener("click", () => {
            closeModal("favoritesModal");
            switchAuthTab("login");
            openModal("loginModal");
        });
        return;
    }

    const allItems = [
        ...products.map(p => ({ ...p, _type: "product", _label: "Computador" })),
        ...games.map(g => ({ ...g, _type: "game", _label: "Jogo" })),
        ...software.map(s => ({ ...s, _type: "software", _label: "Programa" }))
    ];

    const favItems = allItems.filter(item => favorites.includes(item.id));

    if (!favItems.length) {
        container.innerHTML = `
            <div class="favorites-empty">
                <div class="favorites-empty-icon">♡</div>
                <h3>Ainda não tens favoritos</h3>
                <p>Clica no ♥ dos computadores, jogos ou programas para os guardares aqui.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = favItems.map(item => `
        <div class="favorite-item">
            <div class="favorite-item-image">
                ${item.image
                    ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">`
                    : `<span>${item.icon || "💻"}</span>`}
            </div>
            <div class="favorite-item-info">
                <h4>${escapeHtml(item.name)}</h4>
                <span>${formatKz(item.price)}</span>
                <small class="favorite-item-type">${item._label}</small>
            </div>
            <div class="favorite-item-actions">
                <button class="fav-add" data-fav-add="${item.id}" data-fav-type="${item._type}">+ Carrinho</button>
                <button class="fav-remove" data-fav-remove="${item.id}">♡ Remover</button>
            </div>
        </div>
    `).join("");

    container.querySelectorAll("[data-fav-add]").forEach(btn => {
        btn.addEventListener("click", () => {
            addToCart(Number(btn.dataset.favAdd), btn.dataset.favType || "product");
        });
    });
    container.querySelectorAll("[data-fav-remove]").forEach(btn => {
        btn.addEventListener("click", () => toggleFavorite(Number(btn.dataset.favRemove)));
    });
}

function setupFavorites() {
    $("openFavorites")?.addEventListener("click", () => {
        renderFavorites();
        openModal("favoritesModal");
    });
    updateFavoritesCount();
}

/* ==========================================================
   29 — CARROSSEL
========================================================== */
function renderCarousel() {
    const track = $("carouselTrack");
    const dotsEl = $("carouselDots");
    if (!track || !dotsEl) return;
    if (!Array.isArray(carouselSlides)) carouselSlides = [...DEFAULT_CAROUSEL];

    if (!carouselSlides.length) {
        track.innerHTML = `<div class="carousel-slide"><div class="carousel-slide-text"><p>Sem slides configurados.</p></div></div>`;
        dotsEl.innerHTML = "";
        return;
    }

    track.innerHTML = carouselSlides.map((slide, i) => `
        <div class="carousel-slide" data-slide-index="${i}">
            <div class="carousel-slide-text">
                <span class="carousel-slide-tag">${escapeHtml(slide.tag)}</span>
                <h2>${slide.title}</h2>
                <p>${escapeHtml(slide.description)}</p>
                <span class="carousel-slide-price">${formatKz(slide.price)}</span>
                <button class="btn btn-primary" data-carousel-cta="${i}">Ver mais →</button>
            </div>
            <div class="carousel-slide-image">
                ${slide.image ? `<img src="${escapeHtml(slide.image)}" alt="">` : `💻`}
            </div>
        </div>
    `).join("");

    dotsEl.innerHTML = carouselSlides.map((_, i) =>
        `<button class="carousel-dot ${i === 0 ? "active" : ""}"
                 data-carousel-dot="${i}"
                 aria-label="Slide ${i + 1}"></button>`
    ).join("");

    $("carouselPrev")?.addEventListener("click", () => moveCarousel(-1));
    $("carouselNext")?.addEventListener("click", () => moveCarousel(1));

    dotsEl.querySelectorAll("[data-carousel-dot]").forEach(dot => {
        dot.addEventListener("click", () => goToSlide(Number(dot.dataset.carouselDot)));
    });

    track.querySelectorAll("[data-carousel-cta]").forEach(btn => {
        btn.addEventListener("click", () => {
            const slide = carouselSlides[Number(btn.dataset.carouselCta)];
            const firstWord = slide.title.replace(/<[^>]*>/g, "").trim().split(" ")[0].toLowerCase();
            const product = products.find(p => p.name.toLowerCase().includes(firstWord));
            if (product) openProduct(product.id);
            else document.querySelector("#computadores")?.scrollIntoView({ behavior: "smooth" });
        });
    });

    const container = track.closest(".carousel-container");
    container?.addEventListener("mouseenter", stopCarousel);
    container?.addEventListener("mouseleave", startCarousel);

    let touchStartX = 0;
    track.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", e => {
        const diff = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diff) > 50) moveCarousel(diff < 0 ? 1 : -1);
    });

    goToSlide(0);
    startCarousel();
}

function goToSlide(index) {
    if (!carouselSlides.length) return;
    carouselIndex = (index + carouselSlides.length) % carouselSlides.length;
    const track = $("carouselTrack");
    if (track) track.style.transform = `translateX(-${carouselIndex * 100}%)`;
    document.querySelectorAll(".carousel-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === carouselIndex);
    });
}

function moveCarousel(direction) { goToSlide(carouselIndex + direction); }

function startCarousel() {
    stopCarousel();
    if (carouselSlides.length > 1) {
        carouselInterval = setInterval(() => moveCarousel(1), 5000);
    }
}

function stopCarousel() {
    if (carouselInterval) { clearInterval(carouselInterval); carouselInterval = null; }
}

/* ==========================================================
   30 — COMENTÁRIOS
========================================================== */
async function loadCommentsFromServer() {
    try {
        const res = await fetch("/api/comments");
        if (!res.ok) throw new Error("Erro");
        comments = await res.json();
        return true;
    } catch {
        comments = loadData(STORAGE.comments, []);
        return false;
    }
}

async function renderComments() {
    const formWrapper = $("commentForm-wrapper");
    const list = $("commentsList");
    if (!formWrapper || !list) return;

    await loadCommentsFromServer();

    if (currentUser) {
        formWrapper.innerHTML = `
            <form id="commentForm">
                <h3 style="margin-bottom:14px;font-family:Orbitron,sans-serif;font-size:1rem;">
                    Deixa a tua avaliação
                </h3>
                <div class="star-rating" id="starRating">
                    <span data-star="1">★</span>
                    <span data-star="2">★</span>
                    <span data-star="3">★</span>
                    <span data-star="4">★</span>
                    <span data-star="5">★</span>
                </div>
                <input type="hidden" id="commentRating" value="5">
                <div class="form-group">
                    <textarea id="commentText" rows="4" placeholder="Conta-nos a tua experiência..."
                              maxlength="500" required></textarea>
                    <small>A comentar como <strong>${escapeHtml(currentUser.name)}</strong></small>
                </div>
                <button class="btn btn-primary" type="submit">Publicar comentário →</button>
            </form>
        `;

        document.querySelectorAll("#starRating span").forEach(star => {
            star.addEventListener("click", () => {
                const value = Number(star.dataset.star);
                $("commentRating").value = value;
                document.querySelectorAll("#starRating span").forEach(s => {
                    s.classList.toggle("active", Number(s.dataset.star) <= value);
                });
            });
        });
        document.querySelectorAll("#starRating span").forEach(s => s.classList.add("active"));

        $("commentForm").addEventListener("submit", async e => {
            e.preventDefault();
            const text = $("commentText").value.trim();
            const rating = Number($("commentRating").value) || 5;
            if (!text) return;
            try {
                await fetch("/api/comments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: currentUser.id, name: currentUser.name, rating, text })
                });
                showToast("Comentário publicado", "Obrigado pela tua avaliação!");
                renderComments();
            } catch {
                showToast("Erro", "Não foi possível publicar.");
            }
        });
    } else {
        formWrapper.innerHTML = `
            <div class="comment-login-notice">
                <p><strong>Faz login</strong> para deixar a tua avaliação.</p>
                <button id="loginToComment" class="btn btn-primary">Entrar ou criar conta</button>
            </div>
        `;
        $("loginToComment")?.addEventListener("click", () => {
            switchAuthTab("login");
            openModal("loginModal");
        });
    }

    if (!comments.length) {
        list.innerHTML = `<div class="comments-empty">Ainda não há avaliações. Sê o primeiro a comentar!</div>`;
        return;
    }

    list.innerHTML = [...comments].reverse().map(c => {
        const initial = c.name.trim().charAt(0).toUpperCase();
        const stars = "★".repeat(c.rating) + "☆".repeat(5 - c.rating);
        const canDelete = currentUser && (currentUser.id === c.userId || currentUser.role === "admin");
        return `
            <div class="comment-card">
                <div class="comment-header">
                    <div class="comment-author">
                        <div class="comment-avatar">${escapeHtml(initial)}</div>
                        <div>
                            <strong>${escapeHtml(c.name)}</strong>
                            <small>${new Date(c.date).toLocaleDateString("pt-AO")}</small>
                        </div>
                    </div>
                    <div>
                        <span class="comment-rating">${stars}</span>
                        ${canDelete ? `<button class="comment-delete" data-delete-comment="${c.id}">Remover</button>` : ""}
                    </div>
                </div>
                <p class="comment-text">${escapeHtml(c.text)}</p>
            </div>
        `;
    }).join("");

    list.querySelectorAll("[data-delete-comment]").forEach(btn => {
        btn.addEventListener("click", () => deleteComment(Number(btn.dataset.deleteComment)));
    });
}

async function deleteComment(id) {
    const c = comments.find(x => x.id === id);
    if (!c) return;
    if (!confirm("Remover este comentário?")) return;
    try {
        await fetch(`/api/comments/${id}`, { method: "DELETE" });
        showToast("Removido", "Comentário eliminado.");
        renderComments();
    } catch {
        showToast("Erro", "Não foi possível remover.");
    }
}

/* ==========================================================
   31 — RESET ADMIN (botão)
========================================================== */
function setupResetButton() {
    const btn = $("resetAllData");
    if (!btn) return;

    btn.addEventListener("click", async () => {
        if (!isAdmin()) {
            showToast("Sem permissão", "Apenas administradores.");
            return;
        }
        if (!confirm("⚠️ Isto vai apagar TODOS os dados de produtos, jogos, programas, serviços e carrossel,\ne restaurar os valores originais.\n\nContinuar?")) return;

        forceResetAllData();

        // Envia tudo de novo para o servidor
        pushToServer("products", products);
        pushToServer("games", games);
        pushToServer("software", software);
        pushToServer("services", services);
        pushToServer("carousel", carouselSlides);

        // Re-render
        renderProducts();
        renderGames();
        renderSoftware();
        renderServices();
        renderCarousel();
        renderAdmin();
        renderCart();
        updateFavoritesCount();

        showToast("✅ Restaurado", "Dados originais restaurados.");
    });
}

/* ==========================================================
   31.5 — GARANTIR DEFAULTS (safety net)
========================================================== */
function ensureDefaults() {
    let algumaCoisaFoiCorrigida = false;

    const checks = [
        { nome: "products",       atual: products,       fallback: DEFAULT_PRODUCTS, set: v => { products = v;       } },
        { nome: "games",          atual: games,          fallback: DEFAULT_GAMES,    set: v => { games = v;          } },
        { nome: "software",       atual: software,       fallback: DEFAULT_SOFTWARE, set: v => { software = v;       } },
        { nome: "services",       atual: services,       fallback: DEFAULT_SERVICES, set: v => { services = v;       } },
        { nome: "carouselSlides", atual: carouselSlides, fallback: DEFAULT_CAROUSEL, set: v => { carouselSlides = v; } }
    ];

    checks.forEach(c => {
        if (!Array.isArray(c.atual) || c.atual.length === 0) {
            console.warn(`⚠️ ${c.nome} estava vazio no boot — a restaurar defaults`);
            c.set([...c.fallback]);
            algumaCoisaFoiCorrigida = true;
        }
    });

    if (algumaCoisaFoiCorrigida) {
        console.log("✅ Defaults restaurados");
        // Guarda no localStorage E no servidor
        saveData(STORAGE.products, products);
        saveData(STORAGE.games, games);
        saveData(STORAGE.software, software);
        saveData(STORAGE.services, services);
        saveData(STORAGE.carousel, carouselSlides);
    }
}

/* ==========================================================
   32 — INICIALIZAÇÃO
========================================================== */
function initialize() {
    console.log("🚀 initialize() — início");

    $("refreshInvoices")?.addEventListener("click", loadInvoices);
    $("refreshLogins")?.addEventListener("click", loadLogins);

    previewImage("productImageFile", "productImagePreview");
    previewImage("serviceImageFile", "serviceImagePreview");
    previewImage("gameImageFile", "gameImagePreview");
    previewImage("softwareImageFile", "softwareImagePreview");

    safeCall("setupThemeToggle", setupThemeToggle);
    safeCall("setupMobileMenu", setupMobileMenu);
    safeCall("setupFilters", setupFilters);
    safeCall("setupProductClickHandlers", setupProductClickHandlers);
    safeCall("setupCartControls", setupCartControls);
    safeCall("setupCheckout", setupCheckout);
    safeCall("setupModals", setupModals);
    safeCall("setupAppointment", setupAppointment);
    safeCall("setupAuth", setupAuth);
    safeCall("setupAdminTabs", setupAdminTabs);
    safeCall("setupProductAdmin", setupProductAdmin);
    safeCall("setupServiceAdmin", setupServiceAdmin);
    safeCall("setupGameAdmin", setupGameAdmin);
    safeCall("setupSoftwareAdmin", setupSoftwareAdmin);
    safeCall("setupCarouselAdmin", setupCarouselAdmin);
    safeCall("setupHeroImageAdmin", setupHeroImageAdmin);
    safeCall("setupOwnerPhotoAdmin", setupOwnerPhotoAdmin);
    safeCall("setupFavorites", setupFavorites);
    safeCall("setupContact", setupContact);
    safeCall("setupToastClose", setupToastClose);
    safeCall("setupClientsAdmin", setupClientsAdmin);
    safeCall("setupResetButton", setupResetButton);

    safeCall("renderProducts", renderProducts);
    safeCall("renderCart", renderCart);
    safeCall("renderServices", renderServices);
    safeCall("renderGames", renderGames);
    safeCall("renderSoftware", renderSoftware);
    safeCall("renderAccessories", renderAccessories);
    safeCall("setupAccessoryTabs", setupAccessoryTabs);
    safeCall("renderCarousel", renderCarousel);
    safeCall("renderComments", renderComments);
    safeCall("loadOwnerPhoto", loadOwnerPhoto);
    safeCall("loadFavorites", loadFavorites);
    safeCall("updateFavoritesCount", updateFavoritesCount);
    safeCall("updateOpenStatus", updateOpenStatus);

    setInterval(updateOpenStatus, 60000);
    observeReveals();

    console.log("✅ initialize() — fim");
}

/* ==========================================================
   Fallback — força .reveal visível se algo correr mal
========================================================== */
function startRevealFallback() {
    // Roda 3 vezes: em 1s, 3s e 6s
    // Se algum elemento estiver na viewport mas ainda invisível → força
    const run = () => {
        const vh = window.innerHeight;
        const stuck = document.querySelectorAll(".reveal:not(.visible)");
        let forced = 0;

        stuck.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < vh && rect.bottom > 0) {
                el.classList.add("visible", "stuck");
                forced++;
            }
        });

        if (forced > 0) {
            console.warn(`⚠️ Fallback forçou ${forced} elementos visíveis`);
        }
    };

    setTimeout(run, 1000);
    setTimeout(run, 3000);
    setTimeout(run, 6000);
}

/* ==========================================================
   ARRANQUE
========================================================== */
async function boot() {
    console.log("🚀 A arrancar EdZZ-Spot AO...");

    // 1) Reset automático se a versão de dados for antiga
    try { checkDataVersion(); }
    catch (e) { console.error("Erro checkDataVersion:", e); }

    // 2) Intro
    try { startIntro(); }
    catch (err) {
        console.error("Intro falhou:", err);
        const s = document.getElementById("introScreen");
        if (s) s.style.display = "none";
    }

    // 3) Init
    try { initialize(); }
    catch (err) {
        console.error("❌ Initialize falhou:", err);
        const s = document.getElementById("introScreen");
        if (s) s.style.display = "none";
    }

    // 4) Sync servidor + re-render
    try {
        const syncPromise = syncFromServer();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("timeout 5s")), 5000)
        );
        await Promise.race([syncPromise, timeoutPromise]);
        console.log("✅ syncFromServer() completou");

        // 🛡️ Safety net: se algo estiver vazio, restaura defaults
        safeCall("ensureDefaults", ensureDefaults);

        safeCall("renderProducts (sync)", renderProducts);
        safeCall("renderGames (sync)", renderGames);
        safeCall("renderSoftware (sync)", renderSoftware);
        safeCall("renderServices (sync)", renderServices);
        safeCall("renderAccessories (sync)", renderAccessories);
        safeCall("renderCarousel (sync)", renderCarousel);
    } catch (err) {
        console.warn("⚠️ Sync falhou ou timeout — a usar dados locais:", err.message);
    }
    // 🛡️ Fallback: se em 2s ainda houver .reveal escondidos, força-os visíveis
    startRevealFallback();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
    boot();
}

/* ==========================================================
   EXPORTAR GLOBAIS
========================================================== */
window.addToCart = addToCart;
window.closeModal = closeModal;
window.openProduct = openProduct;