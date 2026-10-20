const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const USERS_FILE = path.join(__dirname, "data", "users.json");

async function createAdmin() {
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
        console.log("❌ Erro: Faltam dados.");
        console.log("Uso: node seed-admin.js admin@edzzspot.ao TuaSenhaForte123!");
        process.exit(1);
    }

    if (password.length < 8) {
        console.log("❌ A senha deve ter pelo menos 8 caracteres.");
        process.exit(1);
    }

    let users = [];
    if (fs.existsSync(USERS_FILE)) {
        users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    }

    if (users.find(u => u.email === email.toLowerCase().trim())) {
        console.log("❌ Este email já está registado!");
        process.exit(1);
    }

    const passwordHash = await bcrypt.hash(password, 12); // 12 é mais seguro que 10

    users.push({
        id: Date.now(),
        name: "Administrador",
        email: email.toLowerCase().trim(),
        phone: "946665266",
        passwordHash,
        role: "admin",
        securityQuestion: "Qual é o nome do fundador da EdZZ-Spot?",
        securityAnswerHash: await bcrypt.hash("edmilson", 12),
        createdAt: new Date().toISOString()
    });

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log("✅ Conta Admin criada com sucesso!");
    console.log(`📧 Email: ${email}`);
    console.log(`🔒 Senha: ${password}`);
}

createAdmin();