import express from "express"
import cors from "cors"
import morgan from "morgan"
import sequelize from "./config/db.js"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import "./models/index.js"
import maestroRoutes from "./routes/maestroRoutes.js"
import alumnoRoutes from "./routes/alumnoRoutes.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use('/api/auth', authRoutes)
app.use('/api/maestro', maestroRoutes)
app.use('/api/alumnos', alumnoRoutes);

app.get("/", (req, res) => {
  res.send("API jalando al 100") 
}) 

// Función para iniciar el servidor
const startServer = async () => {
  try {
    await sequelize.authenticate() 
    console.log("Conexión a la base de datos exitosa") 

    await sequelize.sync({ alter: true });
    console.log("Tablas sincronizadas correctamente");  

    app.listen(3000, () => {    
        console.log("Server is running on port 3000") 
    }) 
  } catch (error) {
    console.error("No se pudo conectar a la base de datos ", error) 
  }
} 

startServer() 