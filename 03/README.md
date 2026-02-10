Ejercicio 3: MinIO – Almacenamiento de Objetos con TypeScript

Este ejercicio te permitirá trabajar con MinIO usando un programa TypeScript para gestionar archivos en múltiples buckets.

Objetivos

Trabajar con MinIO instalado en Docker (container: windows-minio-1)

Desarrollar un programa TypeScript para subir y descargar archivos

Crear múltiples buckets y organizar archivos

Generar y subir ~100 archivos de prueba a diferentes buckets

Entender el concepto de almacenamiento de objetos compatible con S3

Requisitos Previos

Docker Desktop instalado y ejecutándose

Container MinIO: windows-minio-1 (ya instalado)

Node.js y npm instalados

TypeScript instalado globalmente o como dependencia del proyecto

Terminal / Command Prompt

Navegador web


Pasos

1. Verificar el container MinIO existente
El container minio-1 ya está iniciado y ejecutándose.

# Verificar el estado del container
docker ps | grep minio

# Ver logs del container
docker logs minio-1

# Verificar puertos
docker port minio-1


Configuración del container:

Container: minio-1

Puerto API: 9000

Puerto Console: 9001

Estado: En ejecución

2. Crear la estructura del proyecto TypeScript

# Crear directorios necesarios
mkdir -p minio-ts uploads downloads generated-files

# Inicializar proyecto Node.js
cd minio-ts
npm install

# Instalar dependencias
npm install minio
npm install --save-dev types/node ts-node

# Crear tsconfig.json
npx tsc --init


3. Acceder a la interfaz web

Abre tu navegador y visita:

http://localhost:9001


Credenciales:

Usuario: adminadmin

Contraseña: adminadmin

5. Crear un bucket

En la interfaz de MinIO, haz clic en “Buckets” en el menú lateral.

Haz clic en “Create Bucket”.

Ingresa un nombre para el bucket (ej: my-files).

Haz clic en “Create Bucket”.

6. Subir archivos a través de la UI

Navega al bucket que acabas de crear.

Haz clic en “Upload” o en el botón “+”.

Selecciona uno o varios archivos desde tu computadora.

Los archivos se subirán y aparecerán en la lista.

7. Crear archivos de ejemplo para subir

Crea algunos archivos de prueba en el directorio uploads.

# Crear un archivo de texto
echo "Este es un archivo de prueba para MinIO" > uploads/test.txt

# Crear un archivo JSON
cat > uploads/data.json << EOF
{
  "nombre": "Juan",
  "fecha": "2024-05-30",
  "descripcion": "Archivo JSON de prueba para MinIO"
}
EOF

# Crear un archivo de imagen (si tienes uno)
cp /path/to/image.jpg uploads/image.jpg


---

## Solución Implementada

### ✅ Proyecto Completado

Se ha implementado una aplicación completa en TypeScript para gestionar MinIO con las siguientes características:

**Estructura del Proyecto:**
```
03/
├── minio-ts/              # Aplicación TypeScript
│   ├── src/               # Código fuente
│   ├── dist/              # JavaScript compilado
│   └── node_modules/      # Dependencias
├── generated-files/       # 100 archivos de prueba
├── downloads/             # Archivos descargados
├── uploads/               # Directorio para subidas manuales
├── README.md              # Este archivo
└── USAGE.md               # Guía de uso completa
```

**Características Implementadas:**
- ✅ 5 buckets organizados por tipo de archivo
- ✅ Generación automática de 100 archivos de prueba
- ✅ Operaciones de subida/descarga de archivos
- ✅ Menú interactivo CLI
- ✅ Workflow automatizado completo
- ✅ Logging con colores y niveles de severidad
- ✅ Validación S3-compatible
- ✅ Manejo completo de errores

### 🚀 Inicio Rápido

```bash
# 1. Asegurar que MinIO está corriendo
docker start minio

# 2. Navegar al proyecto
cd minio-ts

# 3. Ejecutar workflow completo (recomendado)
npm run start:complete
```

**Credenciales MinIO:**
- Usuario: `minioadmin`
- Contraseña: `minioadmin123`
- Console: http://localhost:9001

### 📚 Documentación

Ver [USAGE.md](USAGE.md) para instrucciones detalladas de uso.

**Resultado del Workflow:**
- ✅ 5 buckets creados
- ✅ 100 archivos generados y subidos
- ✅ 0 errores
- ⏱️ Tiempo de ejecución: ~3 minutos

