import { Sequelize } from "sequelize" 
import dotenv from "dotenv" 
import path from "path" 
import { fileURLToPath } from "url" 

const __filename = fileURLToPath(import.meta.url) 
const __dirname = path.dirname(__filename) 

dotenv.config({ path: path.resolve(__dirname, '../../.env') }) 

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false,
  }
) 

export default sequelize 