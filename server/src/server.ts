// server/src/server.ts
import dotenv from 'dotenv';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import app, { setORM } from './app';
import config from './config/mikro-orm.config';

dotenv.config();

const PORT = process.env.PORT || 5000;
let orm: MikroORM<PostgreSqlDriver>;

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database connection...');
    orm = await MikroORM.init(config);
    console.log('✅ Database connected successfully!');
    console.log(`📊 Database: ${process.env.DB_NAME}`);
    // Set the global ORM instance
    setORM(orm);
    return orm;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log('🚀 Server started successfully!');
      console.log(`📍 Server URL: http://localhost:${PORT}`);
      console.log(`🔑 API Base URL: http://localhost:${PORT}/api/v1`);
      console.log('🔐 Default Admin: admin@example.com / admin123');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();