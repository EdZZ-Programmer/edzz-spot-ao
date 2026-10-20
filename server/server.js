const nodemailer = require("nodemailer");
require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const os = require("os");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const { registerSchema, loginSchema, commentSchema, orderSchema, orderStatusSchema } = require("./schemas");
const sanitizeHtml = require("sanitize-html");
const { createClient } = require('@supabase/supabase-js');

// 🛡️ Ligação Segura ao Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PROD = NODE_ENV === "production";

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
const DEV_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];

/* ----------------------------------------------------------
   CONFIGURAÇÃO E JWT
---------------------------------------------------------- */
const DATA_DIR = path.join(__dirname, "data");
const SECRET_FILE = path.join(DATA_DIR, ".jwt_secret");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function getPersistentSecret() {
    if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
    if (fs.existsSync(SECRET_FILE)) return fs.readFileSync(SECRET_FILE, "utf-8").trim();
    const secret = crypto.randomBytes(48).toString("hex");
    fs.writeFileSync(SECRET_FILE, secret);
    return secret;
}
const JWT_SECRET = getPersistentSecret();

// ✉️ Configuração do Carteiro (Ethereal para Testes)
let transporter;
async function setupEmailTransporter() {
    let testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log("📬 Serviço de Email (Teste) configurado.");
}
setupEmailTransporter();

// Base de dados temporária para tokens de recuperação (Ficheiro local)
const RESET_TOKENS_FILE = path.join(DATA_DIR, "reset_tokens.json");
if (!fs.existsSync(RESET_TOKENS_FILE)) fs.writeFileSync(RESET_TOKENS_FILE, "{}");
function readResetTokens() {
    try { return JSON.parse(fs.readFileSync(RESET_TOKENS_FILE, "utf-8")); } catch { return {}; }
}
function saveResetTokens(tokens) {
    fs.writeFileSync(RESET_TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

/* ----------------------------------------------------------
   HELPERS (TRADUTORES: O Frontend usa camelCase, a BD usa snake_case)
---------------------------------------------------------- */
// Utilizadores
async function getUsers() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    // Traduzir snake_case da BD para camelCase que o Node usa
    return (data || []).map(u => ({
        ...u,
        passwordHash: u.password_hash,
        securityQuestion: u.security_question,
        securityAnswerHash: u.security_answer_hash,
        createdAt: u.created_at
    }));
}
async function saveUser(user) {
    const { error } = await supabase.from('users').upsert([{
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        password_hash: user.passwordHash,
        role: user.role,
        security_question: user.securityQuestion,
        security_answer_hash: user.securityAnswerHash,
        created_at: user.createdAt
    }]);
    if (error) throw error;
}

// Pedidos
async function getOrders() {
    const { data, error } = await supabase.from('orders').select('*').order('date', { ascending: false });
    if (error) throw error;
    return (data || []).map(o => ({
        ...o,
        customer: { 
            name: o.customer_name, email: o.customer_email, phone: o.customer_phone, 
            address: o.customer_address, zone: o.customer_zone, zoneLabel: o.customer_zone 
        },
        paymentMethod: o.payment_method
    }));
}
async function saveOrder(order) {
    const { error } = await supabase.from('orders').upsert([{
        id: order.id,
        customer_name: order.customer.name,
        customer_email: order.customer.email,
        customer_phone: order.customer.phone,
        customer_address: order.customer.address,
        customer_zone: order.customer.zone || null,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        payment_method: order.paymentMethod,
        status: order.status,
        seen: order.seen || false,
        date: order.date
    }]);
    if (error) throw error;
}

// Logins
async function getLogins() {
    const { data, error } = await supabase.from('logins').select('*').order('date', { ascending: false }).limit(500);
    if (error) throw error;
    return data || [];
}
async function registerLogin({ email, name, role, ip, userAgent, success }) {
    try {
        await supabase.from('logins').insert([{
            id: Date.now() + Math.floor(Math.random() * 1000),
            email, name: name || "—", role: role || "—", ip: ip || "—", user_agent: userAgent || "—", success: !!success
        }]);
    } catch (err) { console.error("Erro registar login:", err.message); }
}

// Comentários
async function getComments() {
    const { data, error } = await supabase.from('comments').select('*').order('date', { ascending: true });
    if (error) throw error;
    return (data || []).map(c => ({
        ...c, userId: c.user_id, productId: c.product_id, productType: c.product_type
    }));
}
async function saveComment(comment) {
    const { error } = await supabase.from('comments').insert([{
        id: comment.id, product_id: comment.productId, product_type: comment.productType,
        user_id: comment.userId, name: comment.name, rating: comment.rating, text: comment.text
    }]);
    if (error) throw error;
}
async function deleteComment(id) {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) throw error;
}

// Store (Produtos, Jogos, Configurações)
async function getStore() {
    const { data, error } = await supabase.from('store').select('key, value');
    if (error) { if (error.code === '42P01') return {}; throw error; }
    const storeObj = {};
    data.forEach(item => { storeObj[item.key] = item.value; });
    return storeObj;
}
async function saveStoreKey(key, value) {
    const { error } = await supabase.from('store').upsert([{ key, value }]);
    if (error) throw error;
}

// Verificar Admin
function verifyAdmin(req) {
    try {
        const auth = req.headers.authorization || "";
        const token = auth.replace("Bearer ", "").trim();
        if (!token) return null;
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== "admin") return null;
        return decoded; 
    } catch { return null; }
}

/* ----------------------------------------------------------
   MIDDLEWARES DE SEGURANÇA
---------------------------------------------------------- */
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false, crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.disable("x-powered-by");
app.use(cors({ origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = IS_PROD ? ALLOWED_ORIGINS : [...ALLOWED_ORIGINS, ...DEV_ORIGINS];
    if (!IS_PROD && origin.includes(".trycloudflare.com")) return callback(null, true);
    if (allowed.includes(origin)) return callback(null, true);
    return callback(new Error("Origem não permitida pelo CORS."));
}, credentials: true }));
app.set("trust proxy", 1);

app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 500, message: { error: "Demasiados pedidos." } }));
app.use("/api/auth/login", rateLimit({ windowMs: 15 * 60 * 1000, max: 10, skipSuccessfulRequests: true, message: { error: "Demasiadas tentativas de login." } }));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use((req, res, next) => { console.log(`[${new Date().toLocaleTimeString("pt-PT")}] ${req.method} ${req.url}`); next(); });
app.use(express.static(path.join(__dirname, "..", "public")));

/* ==========================================================
   ROTAS DE AUTENTICAÇÃO
========================================================== */
app.post("/api/auth/register", async (req, res) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });
        const { name, email, password, phone, securityQuestion, securityAnswer } = parsed.data;

        const users = await getUsers();
        const emailLower = email.toLowerCase().trim();

        if (users.find(u => u.email === emailLower)) return res.status(409).json({ error: "Este email já está registado." });

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: name.trim(), email: emailLower, phone: (phone || "").trim(),
            passwordHash, role: "client",
            securityQuestion: securityQuestion ? String(securityQuestion).trim() : null,
            securityAnswerHash: securityAnswer ? await bcrypt.hash(String(securityAnswer).toLowerCase().trim(), 10) : null,
            createdAt: new Date().toISOString()
        };

        await saveUser(newUser);
        registerLogin({ email: newUser.email, name: newUser.name, role: newUser.role, ip: req.ip, userAgent: req.headers["user-agent"], success: true });

        const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: "30d" });
        res.status(201).json({ message: "Conta criada!", token, user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role, hasSecurityQuestion: !!newUser.securityQuestion } });
    } catch (err) {
        console.error("Erro registo:", err);
        res.status(500).json({ error: "Erro no servidor." });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });
        const { email, password } = parsed.data;

        const users = await getUsers();
        const user = users.find(u => u.email === email.toLowerCase().trim());

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            registerLogin({ email, ip: req.ip, userAgent: req.headers["user-agent"], success: false });
            return res.status(401).json({ error: "Email ou palavra-passe incorretos." });
        }

        registerLogin({ email: user.email, name: user.name, role: user.role, ip: req.ip, userAgent: req.headers["user-agent"], success: true });
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "30d" });
        res.json({ message: "Login realizado!", token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, hasSecurityQuestion: !!user.securityQuestion } });
        } catch (err) { 
        console.error("❌ ERRO NO LOGIN:", err); // Isto vai mostrar o erro real no terminal!
        res.status(500).json({ error: "Erro no servidor." }); 
    }
});

app.get("/api/auth/me", async (req, res) => {
    try {
        const token = (req.headers.authorization || "").replace("Bearer ", "").trim();
        if (!token) return res.status(401).json({ error: "Sem token." });
        const decoded = jwt.verify(token, JWT_SECRET);
        const users = await getUsers();
        const user = users.find(u => u.id === decoded.id);
        if (!user) return res.status(404).json({ error: "Utilizador não encontrado." });
        res.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, hasSecurityQuestion: !!user.securityQuestion } });
    } catch { res.status(401).json({ error: "Sessão inválida." }); }
});

/* ==========================================================
   RECUPERAÇÃO DE SENHA
========================================================== */
app.post("/api/auth/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const users = await getUsers();
        const user = users.find(u => u.email === email.toLowerCase().trim());

        if (!user) return res.json({ ok: true, message: "Se o email existir, receberás um link." });

        const token = crypto.randomBytes(32).toString("hex");
        const tokens = readResetTokens();
        tokens[token] = { userId: user.id, expires: Date.now() + 15 * 60 * 1000 };
        saveResetTokens(tokens);

        const resetLink = `http://localhost:3000/?resetToken=${token}`;
        const info = await transporter.sendMail({
            from: '"EdZZ-Spot AO" <suporte@edzzspot.ao>', to: user.email,
            subject: "Recuperação de Palavra-passe", html: `<p>Olá ${user.name},</p><p><a href="${resetLink}">Clica aqui para redefinir a password</a>. Expira em 15 min.</p>`
        });
        res.json({ ok: true, testUrl: nodemailer.getTestMessageUrl(info) });
    } catch (err) { res.status(500).json({ error: "Erro ao enviar o email." }); }
});

app.post("/api/auth/reset-password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || newPassword.length < 8) return res.status(400).json({ error: "Dados inválidos." });

        const tokens = readResetTokens();
        const tokenData = tokens[token];
        if (!tokenData || tokenData.expires < Date.now()) return res.status(400).json({ error: "Link inválido ou expirado." });

        const users = await getUsers();
        const user = users.find(u => u.id === tokenData.userId);
        if (!user) return res.status(404).json({ error: "Utilizador não encontrado." });

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await saveUser(user);
        delete tokens[token];
        saveResetTokens(tokens);
        res.json({ ok: true, message: "Palavra-passe alterada!" });
    } catch (err) { res.status(500).json({ error: "Erro no servidor." }); }
});

/* ==========================================================
   ADMIN E UTILIZADORES
========================================================== */
app.get("/api/users", async (req, res) => {
    if (!verifyAdmin(req)) return res.status(403).json({ error: "Sem permissão." });
    const users = await getUsers();
    res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, createdAt: u.createdAt, hasSecurityQuestion: !!u.securityQuestion })));
});

app.post("/api/auth/admin-reset", async (req, res) => {
    if (!verifyAdmin(req)) return res.status(403).json({ error: "Sem permissão." });
    try {
        const { userId, newPassword } = req.body;
        const users = await getUsers();
        const user = users.find(u => u.id === Number(userId));
        if (!user) return res.status(404).json({ error: "Utilizador não encontrado." });
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await saveUser(user);
        res.json({ ok: true, message: "Senha redefinida." });
    } catch (err) { res.status(500).json({ error: "Erro no servidor." }); }
});

app.get("/api/logins", async (req, res) => {
    if (!verifyAdmin(req)) return res.status(403).json({ error: "Sem permissão." });
    const logins = await getLogins();
    res.json(logins);
});

/* ==========================================================
   FATURAS E PEDIDOS
========================================================== */
app.get("/api/invoices", async (req, res) => {
    if (!verifyAdmin(req)) return res.status(403).json({ error: "Sem permissão." });
    const orders = await getOrders();
    res.json(orders);
});

app.get("/api/my-invoices", async (req, res) => {
    try {
        const token = (req.headers.authorization || "").replace("Bearer ", "").trim();
        const decoded = jwt.verify(token, JWT_SECRET);
        const orders = await getOrders();
        const mine = orders.filter(o => o.customer?.email === decoded.email);
        res.json(mine);
    } catch { res.status(401).json({ error: "Sessão inválida." }); }
});

app.get("/api/orders", async (req, res) => {
    const orders = await getOrders();
    res.json(orders);
});

app.post("/api/orders", async (req, res) => {
    try {
        const parsed = orderSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ error: "Pedido inválido: " + parsed.error.errors[0].message });
        
        const newOrder = { ...parsed.data, seen: false, receivedAt: new Date().toISOString() };
        
        // Verificar ID duplicado
        const orders = await getOrders();
        if (orders.find(o => o.id === newOrder.id)) {
            newOrder.id = `EDZ-${new Date().getFullYear()}-${String(orders.length + 1).padStart(4, "0")}`;
        }

        await saveOrder(newOrder);
        res.status(201).json({ ok: true, id: newOrder.id });
    } catch (err) { res.status(500).json({ error: "Erro a gravar pedido." }); }
});

app.patch("/api/orders/:id/seen", async (req, res) => {
    try {
        await supabase.from('orders').update({ seen: true }).eq('id', req.params.id);
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: "Erro." }); }
});

app.patch("/api/orders/:id/status", async (req, res) => {
    try {
        const parsed = orderStatusSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ error: "Estado inválido." });
        await supabase.from('orders').update({ status: parsed.data.status }).eq('id', req.params.id);
        res.json({ ok: true, status: parsed.data.status });
    } catch (err) { res.status(500).json({ error: "Erro." }); }
});

/* ==========================================================
   COMENTÁRIOS E STORE
========================================================== */
app.post("/api/comments", async (req, res) => {
    try {
        const parsed = commentSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });
        
        const { userId, name, rating, text, productId, productType } = parsed.data;
        const safeText = sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
        const safeName = sanitizeHtml(name, { allowedTags: [], allowedAttributes: {} });

        const comments = await getComments();
        if (productId != null && userId != null && comments.some(c => c.productId === productId && c.userId === userId)) {
            return res.status(409).json({ error: "Já avaliaste este produto." });
        }

        const newComment = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            userId, name: safeName.slice(0, 80), rating, text: safeText.slice(0, 500),
            productId, productType
        };
        await saveComment(newComment);
        res.status(201).json(newComment);
    } catch (err) { res.status(500).json({ error: "Erro." }); }
});

app.delete("/api/comments/:id", async (req, res) => {
    try {
        await deleteComment(Number(req.params.id));
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: "Erro." }); }
});

app.get("/api/store", async (req, res) => {
    try { res.json(await getStore()); } 
    catch (err) { res.status(500).json({ error: "Erro." }); }
});

app.post("/api/store", async (req, res) => {
    try {
        const { key, value } = req.body;
        if (!key) return res.status(400).json({ error: "Falta 'key'." });
        await saveStoreKey(key, value);
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: "Erro." }); }
});

/* ----------------------------------------------------------
   TRATAMENTO GLOBAL DE ERROS
---------------------------------------------------------- */
app.use((err, req, res, next) => {
    console.error("❌ Erro detetado:", err.message);
    if (err.message === "Origem não permitida pelo CORS.") return res.status(403).json({ error: "Origem não autorizada." });
    if (err.type === "entity.too.large") return res.status(413).json({ error: "Pedido demasiado grande." });
    res.status(err.status || 500).json({ error: IS_PROD ? "Erro interno do servidor." : err.message });
});

/* ----------------------------------------------------------
   ARRANQUE
---------------------------------------------------------- */
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🎮 EdZZ-Spot AO — Servidor ativo em http://localhost:${PORT}`);
});