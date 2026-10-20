require("dotenv").config();
const { createClient } = require('@supabase/supabase-js');
const fs = require("fs");
const path = require("path");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DATA_DIR = path.join(__dirname, "data");

async function migrar() {
    console.log("🚀 A iniciar migração de dados locais para o Supabase...\n");

    try {
        // 1. Migrar o STORE (Produtos, Jogos, Configurações)
        const storePath = path.join(DATA_DIR, "store.json");
        if (fs.existsSync(storePath)) {
            const store = JSON.parse(fs.readFileSync(storePath, "utf-8"));
            
            // Limpar a tabela store antes de inserir
            await supabase.from('store').delete().neq('key', 'x'); 
            
            // Inserir cada chave do store (products, games, software, etc.)
            for (const [key, value] of Object.entries(store)) {
                console.log(`📦 A migrar: ${key}...`);
                const { error } = await supabase.from('store').upsert([{ key, value }]);
                if (error) throw error;
            }
        }

        // 2. Migrar os COMENTÁRIOS (se existirem)
        const commentsPath = path.join(DATA_DIR, "comments.json");
        if (fs.existsSync(commentsPath)) {
            const comments = JSON.parse(fs.readFileSync(commentsPath, "utf-8"));
            if (comments.length > 0) {
                console.log(`💬 A migrar ${comments.length} comentários...`);
                const mappedComments = comments.map(c => ({
                    id: c.id,
                    product_id: c.productId || null,
                    product_type: c.productType || null,
                    user_id: c.userId || null,
                    name: c.name,
                    rating: c.rating,
                    text: c.text,
                    date: c.date
                }));
                const { error } = await supabase.from('comments').upsert(mappedComments);
                if (error) throw error;
            }
        }

        // 3. Migrar os PEDIDOS (se existirem no ficheiro antigo)
        const ordersPath = path.join(DATA_DIR, "orders.json");
        if (fs.existsSync(ordersPath)) {
            const orders = JSON.parse(fs.readFileSync(ordersPath, "utf-8"));
            if (orders.length > 0) {
                console.log(`🛒 A migrar ${orders.length} pedidos...`);
                const mappedOrders = orders.map(o => ({
                    id: o.id,
                    customer_name: o.customer?.name || "—",
                    customer_email: o.customer?.email || "—",
                    customer_phone: o.customer?.phone || "—",
                    customer_address: o.customer?.address || "—",
                    customer_zone: o.customer?.zone || null,
                    items: o.items || [],
                    subtotal: o.subtotal || 0,
                    shipping: o.shipping || 0,
                    total: o.total || 0,
                    payment_method: o.paymentMethod || "—",
                    status: o.status || "Pendente",
                    seen: o.seen || false,
                    date: o.date || new Date().toISOString()
                }));
                const { error } = await supabase.from('orders').upsert(mappedOrders);
                if (error) throw error;
            }
        }

        console.log("\n✅ Migração concluída com sucesso!");
        console.log("Vai ao site e atualiza a página. Os teus produtos devem lá estar!");

    } catch (err) {
        console.error("\n❌ Erro na migração:", err.message);
    }
}

migrar();