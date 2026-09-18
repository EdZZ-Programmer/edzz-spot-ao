/* ==========================================================
   EDZZ-SPOT AO — SERVIDOR
========================================================== */

const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

/* ----------------------------------------------------------
   CONFIGURAÇÃO
---------------------------------------------------------- */
const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const STORE_FILE = path.join(DATA_DIR, "store.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const LOGINS_FILE = path.join(DATA_DIR, "logins.json");
const COMMENTS_FILE = path.join(DATA_DIR, "comments.json");
const SECRET_FILE = path.join(DATA_DIR, ".jwt_secret");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]");
if (!fs.existsSync(STORE_FILE)) fs.writeFileSync(STORE_FILE, "{}");
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, "[]");
if (!fs.existsSync(LOGINS_FILE)) fs.writeFileSync(LOGINS_FILE, "[]");
if (!fs.existsSync(COMMENTS_FILE)) fs.writeFileSync(COMMENTS_FILE, "[]");

/* ----------------------------------------------------------
   JWT_SECRET PERSISTENTE
---------------------------------------------------------- */
function getPersistentSecret() {
    if (process.env.JWT_SECRET) return process.env.JWT_SECRET;

    if (fs.existsSync(SECRET_FILE)) {
        return fs.readFileSync(SECRET_FILE, "utf-8").trim();
    }

    const secret = crypto.randomBytes(48).toString("hex");
    fs.writeFileSync(SECRET_FILE, secret);
    console.log("🔐 JWT_SECRET gerado e guardado em data/.jwt_secret");
    return secret;
}

const JWT_SECRET = getPersistentSecret();

/* ----------------------------------------------------------
   HELPERS
---------------------------------------------------------- */
function readUsers() {
    try { return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8")); }
    catch { return []; }
}
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
function readStore() {
    try { return JSON.parse(fs.readFileSync(STORE_FILE, "utf-8")); }
    catch { return {}; }
}
function saveStore(store) {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store));
}
function readOrders() {
    try { return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8")); }
    catch { return []; }
}
function saveOrders(orders) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}
function readLogins() {
    try { return JSON.parse(fs.readFileSync(LOGINS_FILE, "utf-8")); }
    catch { return []; }
}
function saveLogins(logins) {
    if (logins.length > 500) logins = logins.slice(-500);
    fs.writeFileSync(LOGINS_FILE, JSON.stringify(logins, null, 2));
}
function readComments() {
    try { return JSON.parse(fs.readFileSync(COMMENTS_FILE, "utf-8")); }
    catch { return []; }
}
function saveComments(data) {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(data, null, 2));
}
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function getLocalIP() {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === "IPv4" && !net.internal) return net.address;
        }
    }
    return "localhost";
}
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

function registerLogin({ email, name, role, ip, userAgent, success }) {
    try {
        const logins = readLogins();
        logins.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            email,
            name: name || "—",
            role: role || "—",
            ip: ip || "—",
            userAgent: userAgent || "—",
            success: !!success,
            date: new Date().toISOString()
        });
        saveLogins(logins);
    } catch (err) {
        console.error("Erro a registar login:", err);
    }
}

/* ----------------------------------------------------------
   MIDDLEWARES
---------------------------------------------------------- */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use((req, res, next) => {
    const time = new Date().toLocaleTimeString("pt-PT");
    console.log(`[${time}] ${req.method} ${req.url}`);
    next();
});

app.use(express.static(path.join(__dirname, "..", "public")));

/* ==========================================================
   API — REGISTO
========================================================== */
app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password, phone, securityQuestion, securityAnswer } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Nome, email e palavra-passe são obrigatórios." });
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ error: "Email inválido." });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "A palavra-passe precisa de pelo menos 6 caracteres." });
        }

        const users = readUsers();
        const emailLower = email.toLowerCase().trim();

        if (users.find(u => u.email === emailLower)) {
            return res.status(409).json({ error: "Este email já está registado." });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: name.trim(),
            email: emailLower,
            phone: (phone || "").trim(),
            passwordHash,
            role: "client",
            securityQuestion: securityQuestion ? String(securityQuestion).trim() : null,
            securityAnswerHash: securityAnswer
                ? await bcrypt.hash(String(securityAnswer).toLowerCase().trim(), 10)
                : null,
            createdAt: new Date().toISOString()
        };

        users.push(user);
        saveUsers(users);

        // ✅ Regista também o momento do registo como login
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "—";
        const ua = req.headers["user-agent"] || "—";
        registerLogin({
            email: user.email,
            name: user.name,
            role: user.role,
            ip,
            userAgent: ua,
            success: true
        });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "30d" }
        );

        console.log(`✅ Novo utilizador: ${user.email}`);

        res.status(201).json({
            message: "Conta criada com sucesso!",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                hasSecurityQuestion: !!user.securityQuestion
            }
        });

    } catch (err) {
        console.error("Erro no registo:", err);
        res.status(500).json({ error: "Erro no servidor." });
    }
});

/* ==========================================================
   API — LOGIN
========================================================== */
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "—";
        const ua = req.headers["user-agent"] || "—";

        if (!email || !password) {
            return res.status(400).json({ error: "Email e palavra-passe são obrigatórios." });
        }

        const users = readUsers();
        const emailLower = email.toLowerCase().trim();
        const user = users.find(u => u.email === emailLower);

        if (!user) {
            registerLogin({ email: emailLower, ip, userAgent: ua, success: false });
            return res.status(401).json({ error: "Email ou palavra-passe incorretos." });
        }

        const passwordOk = await bcrypt.compare(password, user.passwordHash);
        if (!passwordOk) {
            registerLogin({ email: emailLower, name: user.name, role: user.role, ip, userAgent: ua, success: false });
            return res.status(401).json({ error: "Email ou palavra-passe incorretos." });
        }

        registerLogin({ email: user.email, name: user.name, role: user.role, ip, userAgent: ua, success: true });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "30d" }
        );

        console.log(`🔓 Login: ${user.email}`);

        res.json({
            message: "Login realizado!",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                hasSecurityQuestion: !!user.securityQuestion
            }
        });

    } catch (err) {
        console.error("Erro no login:", err);
        res.status(500).json({ error: "Erro no servidor." });
    }
});

/* ==========================================================
   API — SESSÃO
========================================================== */
app.get("/api/auth/me", (req, res) => {
    try {
        const auth = req.headers.authorization || "";
        const token = auth.replace("Bearer ", "").trim();
        if (!token) return res.status(401).json({ error: "Sem token." });

        const decoded = jwt.verify(token, JWT_SECRET);
        const users = readUsers();
        const user = users.find(u => u.id === decoded.id);

        if (!user) return res.status(404).json({ error: "Utilizador não encontrado." });

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                hasSecurityQuestion: !!user.securityQuestion
            }
        });

    } catch {
        res.status(401).json({ error: "Sessão inválida ou expirada." });
    }
});

/* ==========================================================
   API — RECUPERAÇÃO DE SENHA
========================================================== */
app.post("/api/auth/recover-question", (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email é obrigatório." });

        const users = readUsers();
        const user = users.find(u => u.email === email.toLowerCase().trim());

        if (!user) return res.status(404).json({ error: "Email não encontrado." });
        if (!user.securityQuestion) {
            return res.status(400).json({ error: "Este utilizador não definiu pergunta de segurança. Contacta o administrador." });
        }

        res.json({ question: user.securityQuestion });
    } catch (err) {
        console.error("Erro recover-question:", err);
        res.status(500).json({ error: "Erro no servidor." });
    }
});

app.post("/api/auth/recover", async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;

        if (!email || !answer || !newPassword) {
            return res.status(400).json({ error: "Preenche todos os campos." });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: "A palavra-passe precisa de pelo menos 6 caracteres." });
        }

        const users = readUsers();
        const user = users.find(u => u.email === email.toLowerCase().trim());

        if (!user) return res.status(404).json({ error: "Email não encontrado." });
        if (!user.securityAnswerHash) {
            return res.status(400).json({ error: "Conta sem pergunta de segurança." });
        }

        const answerOk = await bcrypt.compare(
            String(answer).toLowerCase().trim(),
            user.securityAnswerHash
        );

        if (!answerOk) {
            return res.status(401).json({ error: "Resposta de segurança incorreta." });
        }

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        saveUsers(users);

        console.log(`🔐 Recuperação: ${user.email}`);

        res.json({ ok: true, message: "Palavra-passe alterada com sucesso." });
    } catch (err) {
        console.error("Erro recover:", err);
        res.status(500).json({ error: "Erro no servidor." });
    }
});

/* ==========================================================
   API — ADMIN: GERIR UTILIZADORES
========================================================== */
app.get("/api/users", (req, res) => {
    const admin = verifyAdmin(req);
    if (!admin) return res.status(403).json({ error: "Sem permissão." });

    const users = readUsers();
    const safe = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        createdAt: u.createdAt,
        hasSecurityQuestion: !!u.securityQuestion
    }));

    res.json(safe);
});

app.post("/api/auth/admin-reset", async (req, res) => {
    const admin = verifyAdmin(req);
    if (!admin) return res.status(403).json({ error: "Sem permissão." });

    try {
        const { userId, newPassword } = req.body;

        if (!userId || !newPassword) return res.status(400).json({ error: "Faltam dados." });
        if (newPassword.length < 6) return res.status(400).json({ error: "Password muito curta." });

        const users = readUsers();
        const user = users.find(u => u.id === Number(userId));

        if (!user) return res.status(404).json({ error: "Utilizador não encontrado." });

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        saveUsers(users);

        console.log(`🔑 Admin redefiniu: ${user.email}`);

        res.json({
            ok: true,
            message: `Senha de ${user.name} redefinida.`,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error("Erro admin-reset:", err);
        res.status(500).json({ error: "Erro no servidor." });
    }
});

/* ==========================================================
   API — LOGINS
========================================================== */
app.get("/api/logins", (req, res) => {
    const admin = verifyAdmin(req);
    if (!admin) return res.status(403).json({ error: "Sem permissão." });

    try {
        const logins = readLogins();
        res.json(logins.reverse());
    } catch (err) {
        res.status(500).json({ error: "Erro." });
    }
});

/* ==========================================================
   API — FATURAS
========================================================== */
app.get("/api/invoices", (req, res) => {
    const admin = verifyAdmin(req);
    if (!admin) return res.status(403).json({ error: "Sem permissão." });

    try {
        const orders = readOrders();
        const invoices = orders.map(o => ({
            id: o.id,
            date: o.date,
            customer: o.customer,
            items: o.items,
            subtotal: o.subtotal,
            shipping: o.shipping,
            total: o.total,
            paymentMethod: o.paymentMethod,
            status: o.status,
            seen: o.seen
        }));
        res.json(invoices.reverse());
    } catch (err) {
        res.status(500).json({ error: "Erro." });
    }
});

app.get("/api/my-invoices", (req, res) => {
    try {
        const auth = req.headers.authorization || "";
        const token = auth.replace("Bearer ", "").trim();
        if (!token) return res.status(401).json({ error: "Sem token." });

        const decoded = jwt.verify(token, JWT_SECRET);
        const orders = readOrders();
        const mine = orders.filter(o => o.customer?.email === decoded.email);
        res.json(mine.reverse());
    } catch {
        res.status(401).json({ error: "Sessão inválida." });
    }
});

/* ==========================================================
   API — COMENTÁRIOS
========================================================== */
app.get("/api/comments", (req, res) => {
    try { res.json(readComments()); }
    catch (err) { res.status(500).json({ error: "Erro." }); }
});

app.post("/api/comments", (req, res) => {
    try {
        const { userId, name, rating, text } = req.body;
        if (!name || !text) return res.status(400).json({ error: "Faltam dados." });

        const comments = readComments();
        const newComment = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            userId: userId || null,
            name: String(name).slice(0, 80),
            rating: Number(rating) || 5,
            text: String(text).slice(0, 500),
            date: new Date().toISOString()
        };

        comments.push(newComment);
        saveComments(comments);

        console.log(`💬 Comentário: ${newComment.name} — ${newComment.rating}★`);
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ error: "Erro." });
    }
});

app.delete("/api/comments/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        const comments = readComments().filter(c => c.id !== id);
        saveComments(comments);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: "Erro." });
    }
});

/* ==========================================================
   API — STORE
========================================================== */
app.get("/api/store", (req, res) => {
    try { res.json(readStore()); }
    catch (err) { res.status(500).json({ error: "Erro." }); }
});

app.post("/api/store", (req, res) => {
    try {
        const { key, value } = req.body;
        if (!key) return res.status(400).json({ error: "Falta 'key'." });

        const store = readStore();
        store[key] = value;
        saveStore(store);

        res.json({ ok: true, key });
    } catch (err) {
        res.status(500).json({ error: "Erro." });
    }
});

/* ==========================================================
   API — PEDIDOS
========================================================== */
app.get("/api/orders", (req, res) => {
    try { res.json(readOrders()); }
    catch (err) { res.status(500).json({ error: "Erro." }); }
});

app.post("/api/orders", (req, res) => {
    try {
        const order = req.body;
        if (!order || !order.id) {
            return res.status(400).json({ error: "Pedido inválido." });
        }

        const orders = readOrders();

        // ✅ Garante que o ID é único
        let finalId = order.id;
        if (orders.find(o => o.id === finalId)) {
            const year = new Date().getFullYear();
            let seq = orders.length + 1;
            let candidate = `EDZ-${year}-${String(seq).padStart(4, "0")}`;

            while (orders.find(o => o.id === candidate)) {
                seq++;
                candidate = `EDZ-${year}-${String(seq).padStart(4, "0")}`;
            }

            console.log(`⚠️ ID duplicado: ${order.id} → ${finalId}`);
            finalId = candidate;
        }

        order.id = finalId;
        order.seen = false;
        order.receivedAt = new Date().toISOString();
        orders.push(order);
        saveOrders(orders);

        console.log(`🛒 Novo pedido: ${order.id} — ${order.customer?.name || "?"} — ${order.total} Kz`);

        res.status(201).json({ ok: true, id: order.id });
    } catch (err) {
        console.error("Erro a gravar pedido:", err);
        res.status(500).json({ error: "Erro." });
    }
});

app.patch("/api/orders/:id/seen", (req, res) => {
    try {
        const orders = readOrders();
        let count = 0;

        // ✅ Marca TODOS os pedidos com este ID como lidos
        // (resolve IDs duplicados antigos)
        orders.forEach(o => {
            if (o.id === req.params.id) {
                o.seen = true;
                count++;
            }
        });

        saveOrders(orders);
        console.log(`✅ Pedido ${req.params.id} marcado como lido (${count} registos)`);

        res.json({ ok: true, marked: count });
    } catch (err) {
        res.status(500).json({ error: "Erro." });
    }
});

/* ----------------------------------------------------------
   ADMIN PADRÃO
---------------------------------------------------------- */
(async () => {
    const users = readUsers();

    if (!users.find(u => u.role === "admin")) {
        const passwordHash = await bcrypt.hash("EdZZ@1234", 10);

        users.push({
            id: 1,
            name: "Administrador",
            email: "admin@edzzspot.ao",
            phone: "946665266",
            passwordHash,
            role: "admin",
            securityQuestion: "Qual é o nome do fundador da EdZZ-Spot?",
            securityAnswerHash: await bcrypt.hash("edmilson", 10),
            createdAt: new Date().toISOString()
        });

        saveUsers(users);
        console.log("👑 Conta admin criada: admin@edzzspot.ao / EdZZ@1234");
    }
})();

/* ----------------------------------------------------------
   ARRANQUE
---------------------------------------------------------- */
app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("═══════════════════════════════════════════════");
    console.log("  🎮  EdZZ-Spot AO — Servidor local activo");
    console.log("═══════════════════════════════════════════════");
    console.log(`  🖥️  Local:    http://localhost:${PORT}`);
    console.log(`  📱  Rede:     http://${getLocalIP()}:${PORT}`);
    console.log("");
    console.log("  Pressiona CTRL+C para parar.");
    console.log("═══════════════════════════════════════════════");
    console.log("");
});