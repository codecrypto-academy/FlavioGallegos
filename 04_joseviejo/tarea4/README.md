# Northwind Database - PostgreSQL

Este proyecto contiene la base de datos de ejemplo Northwind configurada en PostgreSQL usando Docker.

## Información del Contenedor

- **Nombre del contenedor**: `postgres-northwind`
- **Puerto**: 5432
- **Usuario**: postgres
- **Contraseña**: postgres
- **Base de datos**: postgres

## Tablas Disponibles

La base de datos Northwind contiene 14 tablas:

1. `categories` - Categorías de productos
2. `customer_customer_demo` - Demografía de clientes
3. `customer_demographics` - Datos demográficos
4. `customers` - Clientes (91 registros)
5. `employee_territories` - Territorios de empleados
6. `employees` - Empleados
7. `order_details` - Detalles de órdenes
8. `orders` - Órdenes (830 registros)
9. `products` - Productos (77 registros)
10. `region` - Regiones
11. `shippers` - Transportistas
12. `suppliers` - Proveedores
13. `territories` - Territorios
14. `us_states` - Estados de EE.UU.

## Cómo Conectarse

### Opción A: Usando psql desde el contenedor

```bash
docker exec -it postgres-northwind psql -U postgres -d postgres
```

### Opción B: Usando psql desde tu máquina local (si está instalado)

```bash
psql -h localhost -U postgres -d postgres
# Contraseña: postgres
```

### Opción C: Usando pgAdmin

1. Abre pgAdmin
2. Crea una nueva conexión con los siguientes datos:
   - **Host**: localhost
   - **Port**: 5432
   - **User**: postgres
   - **Password**: postgres
   - **Database**: postgres

## Consultas de Ejemplo

Ver el archivo `queries.sql` para consultas de ejemplo.

## Comandos Útiles

### Listar todas las tablas
```sql
\dt
```

### Ver estructura de una tabla
```sql
\d customers
```

### Salir de psql
```sql
\q
```

## Detener el Contenedor

```bash
docker stop postgres-northwind
```

## Iniciar el Contenedor

```bash
docker start postgres-northwind
```

## Eliminar el Contenedor

```bash
docker stop postgres-northwind
docker rm postgres-northwind
```
