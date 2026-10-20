require("dotenv").config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require("bcryptjs");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function atualizarAdmin() {
    const email = "edmilsonddjose@gmail.com"; // O email que colocaste no Supabase
    const novaPassword = "EdZZ@1234"; // A password que queres usar

    console.log("⏳ A gerar hash seguro...");
    const hash = await bcrypt.hash(novaPassword, 10);

    console.log("⏳ A ligar ao Supabase...");
    const { data, error } = await supabase
        .from('users')
        .update({ password_hash: hash })
        .eq('email', email)
        .select();

    if (error) {
        console.error("❌ Erro no Supabase:", error.message);
    } else if (data.length === 0) {
        console.error("❌ Utilizador não encontrado! Verifica se o email está igual.");
    } else {
        console.log("✅ Password atualizada com sucesso!");
        console.log(`📧 Email: ${email}`);
        console.log(`🔒 Nova Password: ${novaPassword}`);
    }
}

atualizarAdmin();