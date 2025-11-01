-- CreateTable
CREATE TABLE "users" (
    "idusers" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstAdmin" BOOLEAN NOT NULL DEFAULT false,
    "creation_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_edit" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'user',
    "email" TEXT DEFAULT 'No email'
);

-- CreateTable
CREATE TABLE "devices" (
    "iddevices" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT DEFAULT 'Just a server',
    "last_edit" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "mac" TEXT NOT NULL,
    "broadcast" TEXT NOT NULL,
    "port" INTEGER NOT NULL DEFAULT 9,
    "idusers" INTEGER NOT NULL,
    CONSTRAINT "devices_idusers_fkey" FOREIGN KEY ("idusers") REFERENCES "users" ("idusers") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "system" (
    "idsystem" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT 'WOL-RPI',
    "api_refresh" INTEGER NOT NULL DEFAULT 3000
);

-- CreateTable
CREATE TABLE "userCode" (
    "idusercode" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "role" TEXT NOT NULL DEFAULT 'user',
    "isActivated" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "devices_name_key" ON "devices"("name");

-- CreateIndex
CREATE UNIQUE INDEX "devices_mac_key" ON "devices"("mac");

-- CreateIndex
CREATE UNIQUE INDEX "userCode_code_key" ON "userCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "userCode_username_key" ON "userCode"("username");
