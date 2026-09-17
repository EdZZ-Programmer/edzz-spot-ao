/* ==========================================================
   GERADOR DE HASH — EdZZ-Spot AO
   ----------------------------------------------------------
   Uso:
     node tools/hash.js "a-tua-password"
   
   Gera um hash bcrypt que podes colar em data/users.json
   no campo "passwordHash".
========================================================== */

const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
    console.log("");
    console.log("❌ Falta a password.");
    console.log("");
    console.log("Uso:   node tools/hash.js 'a-tua-password'");
    console.log("Exemplo: node tools/hash.js 'MinhaSenha2026!'");
    console.log("");
    process.exit(1);
}

if (password.length < 6) {
    console.log("⚠️  A password deve ter pelo menos 6 caracteres.");
    process.exit(1);
}

bcrypt.hash(password, 10).then(hash => {
    console.log("");
    console.log("═══════════════════════════════════════════════");
    console.log("✅ Hash gerado com sucesso");
    console.log("═══════════════════════════════════════════════");
    console.log("");
    console.log(hash);
    console.log("");
    console.log("───────────────────────────────────────────────");
    console.log("📋 Copia o hash acima e cola em:");
    console.log("   server/data/users.json");
    console.log("   no campo \"passwordHash\" da conta admin.");
    console.log("───────────────────────────────────────────────");
    console.log("");
});