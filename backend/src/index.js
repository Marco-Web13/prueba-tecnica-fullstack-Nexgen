import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import sequelize from './config/db.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors()) 
app.use(morgan('dev')) 
app.use(express.json()) 

app.get('/', (req, res) => {
  res.send('API jalando al 100') 
}) 

// Función para iniciar el servidor
const startServer = async () => {
  try {
    await sequelize.authenticate() 
    console.log("Conexión a la base de datos exitosa") 

    // await sequelize.sync({ force: false })  

    app.listen(3000, () => {    
        console.log("Server is running on port 3000") 
    }) 
  } catch (error) {
    console.error('No se pudo conectar a la base de datos ', error) 
  }
} 

startServer() 