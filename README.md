# ⚡ Luzfinia Backend

Sistema backend para monitoreo y gestión de consumo eléctrico en tiempo real con Socket.io.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-black.svg)](https://socket.io/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

## 📋 Descripción

**Luzfinia** es un sistema de monitoreo inteligente de consumo eléctrico que permite a los usuarios gestionar casas, electrodomésticos y recibir alertas en tiempo real sobre su consumo energético.

### 🎯 Características Principales

- 🏠 **Gestión de Casas**: Crear, comprar y administrar propiedades
- ⚡ **Control de Electrodomésticos**: Encender/apagar dispositivos remotamente
- 📊 **Monitoreo en Tiempo Real**: Lecturas de consumo cada 5 segundos vía Socket.io
- ⚠️ **Alertas de Picos**: Notificaciones automáticas de consumo anormal
- 👥 **Sistema de Usuarios**: Autenticación JWT con roles (admin/client)
- 📈 **Estadísticas de Consumo**: Análisis por día, semana, mes y año
- 🔄 **Simulador Integrado**: Generación automática de datos de consumo

---

## 🛠️ Tecnologías

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB Atlas** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Socket.io** - Comunicación en tiempo real
- **JWT** - Autenticación y autorización
- **bcryptjs** - Encriptación de contraseñas

---

## 📁 Estructura del Proyecto

```
Luzfinia-backend/
├── src/
│   ├── config/
│   │   ├── db.js                    # Configuración de MongoDB
│   │   └── corsConfig.js            # Configuración de CORS
│   ├── controllers/
│   │   ├── userController.js        # Lógica de usuarios
│   │   ├── houseController.js       # Lógica de casas
│   │   ├── applianceController.js   # Lógica de electrodomésticos
│   │   └── readingController.js     # Lógica de lecturas
│   ├── middleware/
│   │   └── authMiddleware.js        # Autenticación JWT
│   ├── models/
│   │   ├── userModel.js             # Esquema de usuarios
│   │   ├── houseModel.js            # Esquema de casas
│   │   ├── applianceModel.js        # Esquema de modelos globales
│   │   ├── houseApplianceModel.js   # Esquema de instancias
│   │   └── readingModel.js          # Esquema de lecturas
│   ├── routes/
│   │   ├── userRoutes.js            # Rutas de usuarios
│   │   ├── houseRoutes.js           # Rutas de casas
│   │   ├── applianceRoutes.js       # Rutas de electrodomésticos
│   │   └── readingRoutes.js         # Rutas de lecturas
│   ├── services/
│   │   └── simulator.js             # Simulador de consumo
│   └── utils/
│       └── generateToken.js         # Generación de JWT
├── .env                              # Variables de entorno
├── server.js                         # Punto de entrada
└── package.json                      # Dependencias
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js v18 o superior
- MongoDB Atlas (o MongoDB local)
- npm o yarn

### 1. Clonar el Repositorio

```bash
git clone https://github.com/thefabobian/Luzfinia-backend.git
cd Luzfinia-backend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor
PORT=4000

# Conexión a MongoDB Atlas
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/luzfinia?retryWrites=true&w=majority

# JWT
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=7d
```

**⚠️ Importante:** Cambia `JWT_SECRET` por una clave segura en producción.

### 4. Iniciar el Servidor

```bash
npm start
```

El servidor estará corriendo en: `http://localhost:4000`

---

## 📡 API Endpoints

### 🔐 Autenticación

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | `/api/users/register` | No | Registrar nuevo usuario |
| POST | `/api/users/login` | No | Iniciar sesión |
| GET | `/api/users/profile` | Sí | Obtener perfil |
| GET | `/api/users` | Admin | Listar todos los usuarios |

### 🏠 Casas

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | `/api/houses` | Admin | Crear casa |
| GET | `/api/houses/available` | No | Ver casas disponibles |
| POST | `/api/houses/purchase` | Sí | Comprar casa |
| GET | `/api/houses/user` | Sí | Ver mis casas |
| GET | `/api/houses/all` | Admin | Ver todas las casas |

### ⚡ Electrodomésticos

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | `/api/appliances/models` | Admin | Crear modelo global |
| GET | `/api/appliances/models` | No | Ver catálogo de modelos |
| PUT | `/api/appliances/models/:id` | Admin | Actualizar modelo |
| POST | `/api/appliances/assign` | Sí | Asignar a mi casa |
| PUT | `/api/appliances/toggle/:id` | Sí | Encender/apagar |

### 📊 Lecturas

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/api/readings/house/:houseId` | Sí | Lecturas de una casa |
| GET | `/api/readings/house/:houseId/consumption` | Sí | Consumo total |
| GET | `/api/readings/house/:houseId/profile` | Sí | Perfil de consumo |
| GET | `/api/readings/house/:houseId/stats` | Sí | Estadísticas (día/semana/mes/año) |

---

## 🔌 Socket.io en Tiempo Real

### Eventos Emitidos por el Servidor

#### 📊 `new_reading`

Emitido cada 5 segundos con datos de consumo.

**Payload:**
```json
{
  "houseId": "507f1f77bcf86cd799439020",
  "ts": "2025-11-13T15:30:25.000Z",
  "kwh": 0.25,
  "totalKwh": 125.75,
  "activeAppliances": ["507f...", "507f..."]
}
```

#### ⚠️ `peak_alert`

Emitido cuando se detecta un pico de consumo (>160% del promedio).

**Payload:**
```json
{
  "houseId": "507f1f77bcf86cd799439020",
  "ts": "2025-11-13T15:35:00.000Z",
  "kwh": 0.8,
  "totalKwh": 126.55,
  "avg": 0.45,
  "message": "Pico de consumo detectado"
}
```

### Conectar desde el Cliente

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

socket.on("new_reading", (data) => {
  console.log("Nueva lectura:", data);
});

socket.on("peak_alert", (data) => {
  console.warn("⚠️ Pico detectado:", data);
});
```

---

## 🎮 Simulador de Consumo

El sistema incluye un simulador que genera lecturas automáticamente:

- **Intervalo:** 5 segundos (configurable)
- **Cálculo:** Suma consumo de electrodomésticos encendidos
- **Persistencia:** Guarda en MongoDB
- **Detección de Picos:** Compara con promedio de últimas 10 lecturas

**Configuración:** [server.js:60](server.js:60)

```javascript
startSimulation(io, {
  intervalMs: 5000,    // Intervalo en ms
  peakFactor: 1.6      // Umbral de pico (160%)
});
```

---

## 🔒 Seguridad

### Autenticación JWT

Todos los endpoints protegidos requieren header:

```
Authorization: Bearer <token>
```

### Encriptación

- Contraseñas hasheadas con **bcryptjs** (salt: 10 rondas)
- Tokens firmados con **HMAC SHA-256**

### CORS

Configurado para aceptar peticiones desde:
- `http://localhost:5173` (desarrollo)
- Agregar dominios de producción en [src/config/corsConfig.js](src/config/corsConfig.js)

---

## 📦 Modelos de Datos

### User
```javascript
{
  name: String,
  email: String (único),
  password: String (hasheado),
  role: String (admin/client)
}
```

### House
```javascript
{
  name: String,
  user: ObjectId (ref: User),
  appliances: [ObjectId] (ref: HouseAppliance),
  totalConsumption: Number
}
```

### ApplianceModel (Modelos Globales)
```javascript
{
  name: String,
  powerConsumption: Number,
  description: String
}
```

### HouseAppliance (Instancias)
```javascript
{
  house: ObjectId (ref: House),
  baseModel: ObjectId (ref: ApplianceModel),
  customName: String,
  isOn: Boolean,
  lastToggledAt: Date
}
```

### Reading (Lecturas)
```javascript
{
  house: ObjectId (ref: House),
  ts: Date,
  kwh: Number,
  totalKwh: Number,
  activeAppliances: [ObjectId]
}
```

---

## 🌐 Despliegue en Producción

### Render

1. Conectar repositorio de GitHub
2. Configurar variables de entorno
3. Comando de inicio: `npm start`

**URL de producción:** `https://luzfinia-backend.onrender.com`

### Variables de Entorno en Producción

```env
PORT=4000
MONGO_URI=mongodb+srv://...
JWT_SECRET=clave_super_segura_aleatoria_de_32_caracteres
JWT_EXPIRES_IN=7d
```

### Actualizar CORS

En [src/config/corsConfig.js](src/config/corsConfig.js), agregar dominios permitidos:

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "https://tu-frontend.vercel.app",
  "https://tu-dominio.com"
];
```

---

## 📚 Documentación Adicional

- [📡 Documentación completa de API](./API_DOCUMENTATION.md)
- [🔌 Guía de integración Socket.io Frontend](./FRONTEND_SOCKET_CONTEXT.md)

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📝 Scripts Disponibles

```bash
# Iniciar servidor
npm start

# Desarrollo con nodemon (agregar en package.json)
npm run dev
```

---

## 🐛 Problemas Conocidos

- El simulador procesa todas las casas (incluso sin dueño). Para optimizar, filtrar por `user: { $ne: null }`
- El toggle de electrodomésticos no verifica propiedad (mejora pendiente)

---

## 📄 Licencia

ISC License - Ver [LICENSE](LICENSE) para más detalles

---

## 👨‍💻 Autor

**The Fabobian**
- GitHub: [@thefabobian](https://github.com/thefabobian)
- Repositorio: [Luzfinia-backend](https://github.com/thefabobian/Luzfinia-backend)

---

## 🙏 Agradecimientos

- [Express.js](https://expressjs.com/)
- [Socket.io](https://socket.io/)
- [MongoDB](https://www.mongodb.com/)
- [Render](https://render.com/)

---

## 📞 Soporte

Si encuentras algún problema, por favor abre un [issue](https://github.com/thefabobian/Luzfinia-backend/issues).

---

⚡ **Hecho con ❤️ para un mundo más eficiente energéticamente**
