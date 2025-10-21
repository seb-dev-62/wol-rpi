-- Users
CREATE TABLE IF NOT EXISTS users (
    idusers INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_edit DATETIME DEFAULT CURRENT_TIMESTAMP,
    role TEXT NOT NULL DEFAULT 'user',
    email TEXT NOT NULL
);

-- Devices
CREATE TABLE IF NOT EXISTS devices (
    iddevices INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    last_edit DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_public INTEGER NOT NULL,
    device_privacy TEXT NOT NULL DEFAULT 'public',
    idusers INTEGER NOT NULL,
    FOREIGN KEY (idusers) REFERENCES users(idusers)
);