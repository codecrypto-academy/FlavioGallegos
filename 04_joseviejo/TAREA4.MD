# Ejercicio 2: PostgreSQL con Base de Datos Northwind

Este ejercicio te permitirá cargar la base de datos de ejemplo Northwind en un contenedor PostgreSQL existente.

## Objetivos

- Descargar el esquema de Northwind
- Importar el esquema en un contenedor PostgreSQL existente
- Conectarse a la base de datos y realizar consultas

## Requisitos Previos

- Docker Desktop instalado y ejecutándose
- **Contenedor PostgreSQL existente** ejecutándose en el puerto 5432
  - Usuario: postgres
  - Contraseña: postgres
  - Base de datos: postgres
- Terminal/Command Prompt
- Cliente PostgreSQL (psql) o pgAdmin instalado

# Ejercicio 2: PostgreSQL con Base de Datos Northwind

Este ejercicio te permitirá cargar la base de datos de ejemplo Northwind en un contenedor PostgreSQL existente.

## Objetivos

- Descargar el esquema de Northwind
- Importar el esquema en un contenedor PostgreSQL existente
- Conectarse a la base de datos y realizar consultas

## Requisitos Previos

- Docker Desktop instalado y ejecutándose
- **Contenedor PostgreSQL existente** ejecutándose en el puerto 5432
  - Usuario: postgres
  - Contraseña: postgres
  - Base de datos: postgres
- Terminal/Command Prompt
- Cliente PostgreSQL (psql) o pgAdmin instalado

## Qué Ejecutar

### Paso 1: Crear la estructura de directorios

mkdir postgresql-northwind
cd postgresql-northwind


### Paso 2: Descargar el esquema de Northwind

curl -o northwind.sql https://raw.githubusercontent.com/pthom/northwind_psql/refs/heads/master/northwind.sql


Invoke-WebRequest -Uri "https://raw.githubusercontent.com/pthom/northwind_psql/refs/heads/master/northwind.sql" -OutFile "northwind.sql"

### Paso 3: Identificar el contenedor PostgreSQL

docker ps

## Busca el contenedor que está usando el puerto 5432. Anota su CONTAINER ID o NAMES. En los siguientes pasos, reemplaza ## <NOMBRE_CONTENEDOR> con este nombre.

### Paso 4: Importar el esquema de Northwind

### Vamos a importar el archivo SQL directamente en la base de datos postgres del contenedor existente.

docker cp northwind.sql <NOMBRE_CONTENEDOR>:/tmp/northwind.sql

## importar el esquema 
docker exec -i <NOMBRE_CONTENEDOR> psql -U postgres -d postgres < /tmp/northwind.sql

## PASO 5: conectarse a la base de datos

## opcion A: Usando psql desde el contenedor
docker exec -it <NOMBRE_CONTENEDOR> psql -U postgres -d postgres

## opcion B: Usando psql desde el Local (si esta instalado)

psql -h localhost -U postgres -d postgres
# contraseña : postgres

## Opcion C: Usando pgAdmin

1. Abre pgAdmin
2. Crea una nueva conexión
  host : localhost
  port : 5432
  user : postgres
  password : postgres
  database : postgres





