# Kuntur-Tech

Plataforma de Scouting Deportivo Inteligente que democratiza el descubrimiento de talentos eliminando barreras geográficas, económicas y sociales mediante IA y análisis de video.

## 🚀 Cómo iniciar el proyecto localmente

Este proyecto consta de dos partes: un backend en FastAPI (Python) y un frontend en Next.js (React).

### Prerrequisitos
- **PostgreSQL** instalado y corriendo en tu puerto 5432.
- **Python 3.11+**
- **Node.js 18+** y npm

### 1. Base de datos
Crea una base de datos local llamada `kuntur_tech`. El backend creará todas las tablas y datos iniciales automáticamente al iniciar por primera vez.

### 2. Iniciar el Backend (FastAPI)
Abre una terminal y ejecuta:

```bash
cd backend

# Crear y activar entorno virtual
python -m venv venv
venv\Scripts\activate  # En Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno (copia el ejemplo)
cp .env.example .env
# IMPORTANTE: Abre el archivo .env y asegúrate de que DATABASE_URL tenga tu usuario y contraseña de Postgres

# Levantar el servidor
fastapi dev app/main.py
```
*El backend correrá en `http://localhost:8000`. Puedes ver la documentación de la API en `http://localhost:8000/docs`.*

### 3. Iniciar el Frontend (Next.js)
Abre **otra** terminal y ejecuta:

```bash
cd frontend

# Instalar dependencias
npm install

# Levantar el entorno de desarrollo
npm run dev
```
*El frontend correrá en `http://localhost:3000`.*
