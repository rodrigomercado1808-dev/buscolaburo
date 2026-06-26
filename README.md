# Busco Laburo - Frontend

Aplicación React moderna para la red profesional Busco Laburo, refactorizada para consumir una API REST independiente.

## 🚀 Cambios en la Arquitectura

- **Desacoplamiento:** Se eliminó toda dependencia de Firebase Cloud Functions.
- **Cliente API:** Se implementó Axios con interceptores para manejar automáticamente el `Firebase ID Token`.
- **Seguridad:** Los secretos (Mercado Pago Access Token, etc.) ya no residen en el frontend.

## ⚙️ Configuración

1. Instalar dependencias: `npm install`.
2. Crear un archivo `.env` basado en `.env.example`.
3. Configurar las variables de Firebase.
4. Definir `VITE_API_URL` apuntando al backend (ej: `http://localhost:3000/api`).

## 🛠️ Comandos

- `npm run dev`: Inicia el servidor de desarrollo de Vite.
- `npm run build`: Genera el bundle de producción.
- `npm run deploy`: Despliega a Firebase Hosting (solo hosting).

## 📦 Dependencias Clave

- **React 18 + Vite**
- **Tailwind CSS**
- **Axios** (para consumo de API)
- **Firebase SDK** (Auth, Firestore, Storage)
- **Lucide React** (iconos)

## 🗄️ Estructura de Datos (Firestore)

El frontend sigue interactuando directamente con Firestore para el feed, empleos y perfiles, pero delega toda la lógica de pagos y suscripciones al backend a través de la API.
