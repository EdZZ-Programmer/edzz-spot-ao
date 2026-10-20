const { z } = require("zod");

// 1. Registo de Utilizador
const registerSchema = z.object({
    name: z.string().min(3, "Nome muito curto").max(80, "Nome muito longo").trim(),
    email: z.string().email("Email inválido").toLowerCase().trim(),
    password: z.string().min(8, "A palavra-passe precisa de pelo menos 8 caracteres"),
    phone: z.string().max(20).optional().default(""),
    securityQuestion: z.string().max(150).optional().nullable(),
    securityAnswer: z.string().max(100).optional().nullable()
});

// 2. Login
const loginSchema = z.object({
    email: z.string().email("Email inválido").toLowerCase().trim(),
    password: z.string().min(1, "Password obrigatória")
});

// 3. Comentários / Avaliações
const commentSchema = z.object({
    userId: z.number().int().positive().nullable().optional(),
    name: z.string().min(1).max(80).trim(),
    rating: z.number().int().min(1, "Mínimo 1 estrela").max(5, "Máximo 5 estrelas"),
    text: z.string().min(3, "Comentário muito curto").max(500, "Comentário muito longo").trim(),
    productId: z.number().int().positive().nullable().optional(),
    productType: z.enum(["product", "game", "software", "site"]).optional().nullable()
});

// 4. Pedidos (Checkout)
const orderItemSchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    price: z.number().min(0),
    quantity: z.number().int().min(1).max(99),
    type: z.string().optional()
});

const orderSchema = z.object({
    id: z.string().min(1),
    customer: z.object({
        name: z.string().min(3).max(100),
        phone: z.string().min(9).max(20),
        email: z.string().email(),
        address: z.string().min(5).max(255),
        zone: z.string().optional(),
        zoneLabel: z.string().optional()
    }),
    items: z.array(orderItemSchema).min(1, "O carrinho está vazio"),
    subtotal: z.number().min(0),
    shipping: z.number().min(0),
    total: z.number().min(0),
    paymentMethod: z.string().min(1),
    date: z.string().optional()
});

// 5. Alterar Estado do Pedido (Admin)
const orderStatusSchema = z.object({
    status: z.enum(["Pendente", "Confirmado", "Enviado", "Entregue", "Cancelado"])
});

module.exports = {
    registerSchema,
    loginSchema,
    commentSchema,
    orderSchema,
    orderStatusSchema
};