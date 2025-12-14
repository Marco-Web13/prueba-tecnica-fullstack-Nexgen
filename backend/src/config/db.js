import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'control_escolar_db';
const DB_USER = process.env.DB_USER || 'usuario';

const password = process.env.DB_PASS || process.env.DB_PASSWORD || "";

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;

const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  password,
  {
    host: DB_HOST,
    dialect: "postgres",
    port: DB_PORT,
    logging: false,
  }
);

export default sequelize;