"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const postgresql_1 = require("@mikro-orm/postgresql");
const migrations_1 = require("@mikro-orm/migrations");
const seeder_1 = require("@mikro-orm/seeder");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = (0, core_1.defineConfig)({
    driver: postgresql_1.PostgreSqlDriver,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    dbName: process.env.DB_NAME || 'tasknew',
    entities: ['dist/entities/*.js'],
    entitiesTs: ['src/entities/*.ts'],
    extensions: [migrations_1.Migrator, seeder_1.SeedManager],
    migrations: {
        path: 'dist/migrations',
        pathTs: 'src/migrations',
    },
    seeder: {
        path: 'dist/seeders',
        pathTs: 'src/seeders',
    },
    debug: process.env.NODE_ENV === 'development',
});
