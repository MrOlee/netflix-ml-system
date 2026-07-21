-- database/init.sql
-- Inisialisasi database untuk sistem

-- Tabel users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    moonton_email VARCHAR(255) UNIQUE NOT NULL,
    moonton_password VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel accounts
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    moonton_id VARCHAR(100) NOT NULL,
    level INTEGER DEFAULT 1,
    rank VARCHAR(50),
    heroes JSONB DEFAULT '[]',
    total_matches INTEGER DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0,
    last_login TIMESTAMP,
    offline_since TIMESTAMP,
    status VARCHAR(50) DEFAULT 'available',
    claimed_at TIMESTAMP,
    claimed_by INTEGER REFERENCES users(id),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa
CREATE INDEX idx_accounts_status ON accounts(status);
CREATE INDEX idx_accounts_level ON accounts(level);
CREATE INDEX idx_accounts_rank ON accounts(rank);
