# Proyecto Control Escolar

## **1. Variables de Entorno**

### **1.1 Backend**
Crea un archivo `.env` dentro de `/backend`:
```bash
PORT=3000
DB_NAME=control_escolar_db
DB_USER=usuario
DB_PASS=contra123
DB_HOST=db
DB_PORT=5432
JWT_SECRET=super_secreto
```

Si corres **SIN Docker** (modo local), cambia el host:
```bash
DB_HOST=localhost
```

---

### **1.2 Frontend**
Crea un archivo `.env` dentro de `/frontend`:
```bash
# Apunta a tu backend en el puerto 3000
VITE_API_URL=http://localhost:3000
```

---

## **2. Ejecutar el proyecto con Docker**
```bash
docker-compose up --build
```

---

## **3. Migraciones y Seeders**
Reiniciar Base de Datos (Seeders) Si deseas borrar la base de datos y volver a llenarla con los datos de prueba (Admin, Maestros, Alumnos), ejecuta:
```bash
docker-compose exec backend npm run seed
```

---

## **4. Ejecutar el proyecto sin Docker – Backend (modo local)**

### **4.1 Instalar dependencias**
```bash
cd backend
npm install
```

### **4.2 Poblar Base de Datos (Seeders)**
Para reiniciar la base de datos y cargar los usuarios de prueba, ejecuta:
```bash
npm run seed
```

### **4.3 Iniciar Servidor**
```bash
npm run dev
```

📌 *Las tablas y datos se crearán automáticamente al arrancar.*

---

## **5. Ejecutar el proyecto sin Docker – Frontend (modo local)**

### **5.1 Instalar dependencias**
```bash
cd frontend
npm install
```

### **5.2 Iniciar Servidor**
```bash
npm run dev
```

---

## **6. Usuarios de Prueba (Seeders)**
El sistema crea automáticamente los siguientes usuarios:

- **Administrador**  
  📧 `admin@escuela.com`  
  🔑 `123456`

- **Maestro**  
  📧 `walter@escuela.com`  
  🔑 `123456`

