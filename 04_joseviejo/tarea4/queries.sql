-- Consultas de Ejemplo para la Base de Datos Northwind

-- 1. Listar todas las tablas
\dt

-- 2. Contar el total de clientes
SELECT COUNT(*) as total_customers FROM customers;

-- 3. Contar el total de productos
SELECT COUNT(*) as total_products FROM products;

-- 4. Contar el total de órdenes
SELECT COUNT(*) as total_orders FROM orders;

-- 5. Ver los primeros 10 clientes
SELECT customer_id, company_name, contact_name, city, country 
FROM customers 
LIMIT 10;

-- 6. Ver los productos más caros
SELECT product_name, unit_price, units_in_stock 
FROM products 
ORDER BY unit_price DESC 
LIMIT 10;

-- 7. Ver las categorías de productos
SELECT category_id, category_name, description 
FROM categories;

-- 8. Productos por categoría
SELECT c.category_name, COUNT(p.product_id) as total_products
FROM categories c
LEFT JOIN products p ON c.category_id = p.category_id
GROUP BY c.category_name
ORDER BY total_products DESC;

-- 9. Ver los empleados
SELECT employee_id, first_name, last_name, title, city, country 
FROM employees;

-- 10. Órdenes recientes
SELECT order_id, customer_id, order_date, shipped_date, ship_city 
FROM orders 
ORDER BY order_date DESC 
LIMIT 10;

-- 11. Total de ventas por cliente (top 10)
SELECT c.company_name, COUNT(o.order_id) as total_orders
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.company_name
ORDER BY total_orders DESC
LIMIT 10;

-- 12. Productos con bajo inventario (menos de 10 unidades)
SELECT product_name, units_in_stock, unit_price
FROM products
WHERE units_in_stock < 10
ORDER BY units_in_stock ASC;

-- 13. Ver proveedores
SELECT supplier_id, company_name, contact_name, city, country
FROM suppliers
LIMIT 10;

-- 14. Detalles de una orden específica (ejemplo: orden 10248)
SELECT od.order_id, p.product_name, od.unit_price, od.quantity, 
       (od.unit_price * od.quantity) as total
FROM order_details od
JOIN products p ON od.product_id = p.product_id
WHERE od.order_id = 10248;

-- 15. Ventas totales por producto
SELECT p.product_name, 
       SUM(od.quantity) as total_quantity_sold,
       SUM(od.unit_price * od.quantity) as total_revenue
FROM products p
JOIN order_details od ON p.product_id = od.product_id
GROUP BY p.product_name
ORDER BY total_revenue DESC
LIMIT 10;
