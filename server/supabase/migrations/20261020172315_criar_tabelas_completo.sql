-- ==========================================
-- 1. TABELAS
-- ==========================================

-- Tabela de Utilizadores
CREATE TABLE IF NOT EXISTS users (
    id bigint PRIMARY KEY,
    name text NOT NULL,
    email text UNIQUE NOT NULL,
    phone text,
    password_hash text NOT NULL,
    role text DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    security_question text,
    security_answer_hash text,
    created_at timestamptz DEFAULT now()
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
    id bigint PRIMARY KEY,
    name text NOT NULL,
    category text NOT NULL,
    price numeric NOT NULL DEFAULT 0,
    stock int4 DEFAULT 0,
    description text,
    processor text,
    ram text,
    storage text,
    gpu text,
    image text,
    created_at timestamptz DEFAULT now()
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
    id text PRIMARY KEY,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    customer_address text NOT NULL,
    customer_zone text,
    items jsonb NOT NULL,
    subtotal numeric NOT NULL DEFAULT 0,
    shipping numeric NOT NULL DEFAULT 0,
    total numeric NOT NULL DEFAULT 0,
    payment_method text NOT NULL,
    status text DEFAULT 'Pendente',
    seen boolean DEFAULT false,
    date timestamptz DEFAULT now()
);

-- Tabela de Comentários/Avaliações
CREATE TABLE IF NOT EXISTS comments (
    id bigint PRIMARY KEY,
    product_id bigint,
    product_type text,
    user_id bigint,
    name text NOT NULL,
    rating int4 CHECK (rating >= 1 AND rating <= 5),
    text text NOT NULL,
    date timestamptz DEFAULT now()
);

-- Tabela de Logins
CREATE TABLE IF NOT EXISTS logins (
    id bigint PRIMARY KEY,
    email text NOT NULL,
    name text,
    role text,
    ip text,
    user_agent text,
    success boolean DEFAULT false,
    date timestamptz DEFAULT now()
);

-- ==========================================
-- 2. SEGURANÇA (RLS - Row Level Security)
-- ==========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE logins ENABLE ROW LEVEL SECURITY;

-- Limpar políticas antigas (se existirem)
DROP POLICY IF EXISTS "Utilizador vê o próprio perfil" ON users;
DROP POLICY IF EXISTS "Cliente vê os próprios pedidos" ON orders;
DROP POLICY IF EXISTS "Comentários são públicos para leitura" ON comments;
DROP POLICY IF EXISTS "Utilizador apaga o próprio comentário" ON comments;

-- Criar novas políticas
CREATE POLICY "Utilizador vê o próprio perfil" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Cliente vê os próprios pedidos" ON orders
    FOR SELECT USING (auth.jwt() ->> 'email' = customer_email);

CREATE POLICY "Comentários são públicos para leitura" ON comments
    FOR SELECT USING (true);
    
CREATE POLICY "Utilizador apaga o próprio comentário" ON comments
    FOR DELETE USING (auth.uid()::text = user_id::text);