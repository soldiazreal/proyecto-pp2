
# 🍽️ Sistema de Gestión de Pedidos del grupo Cool

Este proyecto es una aplicación diseñada para automatizar la toma de pedidos y la administración de cuentas en un entorno gastronómico. El objetivo es centralizar la operación desde que el cliente elige un plato hasta que se liquida la cuenta.

---

## 🚀 Funcionalidades Principales

El sistema se basa en cuatro pilares fundamentales:

1. **Gestión de Comandas:** Interfaz dinámica para registrar nuevos pedidos, permitiendo seleccionar productos y cantidades.
2. **Control de Stock:** Revisión de comidas disponibles a pedir.
3. **Cálculo de Precio Total:** Procesamiento automático de los precios para obtener el monto final por mesa o cliente.
4. **Monitor de Pendientes:** Visualización de las órdenes que aún no han sido despachadas por la cocina.

---

## 🛠️ Stack Tecnológico

* Backend: NodeJS
* Frontend: Angular
* Base de datos: PostgreSQL
* API: -

---

## 📐 Flujo de Trabajo

El flujo lógico del programa sigue el siguiente orden:

1. **Llegada de clientes:** Se consultan las mesas disponibles (`GET /mesas`) y se ocupa una actualizando su estado (`PUT /mesas/:id` con `estado: "Ocupada"` y `clientesActuales`).

2. **Toma de pedidos:** Por cada persona se crea un pedido asociando la mesa y el plato elegido (`POST /pedidos` con `mesaId` y `platoId`). Cada pedido creado actualiza automáticamente el `consumoActual` de la mesa sumando el precio del plato.

3. **Pedidos adicionales:** Si los clientes piden más platos (postres, bebidas, etc.), se agregan nuevos pedidos de la misma forma. El `consumoActual` de la mesa se recalcula en cada alta.

4. **Cuenta:** El total acumulado está disponible en cualquier momento consultando la mesa (`GET /mesas/:id`). Solo se contabilizan los pedidos en estado `"Pendiente"`.

5. **Cierre de mesa:** Al marcar la mesa como disponible (`PUT /mesas/:id` con `estado: "Disponible"`), todos los pedidos activos pasan automáticamente a `"Completado"` como historial. La mesa queda lista para la próxima ocupación con `consumoActual` en cero.

---

## ⚙️ Cómo correr el proyecto

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Copiar el archivo de ejemplo y completar con los datos de la base de datos:
```bash
cp .env.example .env
```
```
DATABASE_URL="postgresql://usuario:contraseña@servidor:puerto/postgres?pgbouncer=true"
DIRECT_URL="postgresql://usuario:contraseña@servidor:puerto/postgres"
```

### 3. Aplicar migraciones
```bash
npx prisma migrate deploy
```

### 4. Levantar el servidor
```bash
npm run dev
```
El servidor queda corriendo en `http://localhost:3000`.

### 5. Correr los tests
```bash
npm test
```
Para modo watch (re-ejecuta al guardar cambios):
```bash
npm run test:watch
```

---

## 👤 Authors 

Grupo Cool 😎 (PPII)
- Juan Ignacio Proot [@nacho-p](https://github.com/nacho-p)
- Claudio Romañuk [@claudio](https://github.com/Polaco88h)
- Héctor Díaz [@iWildGuns](https://github.com/iWildGuns)
- Sol Díaz Real [@soldiazreal](https://github.com/soldiazreal)
- Guillermo Romagnoli [@Romitel](https://github.com/Romitel)
- Analía Laura Vazquez [@AnaliaLauraVazquez](https://github.com/AnaliaLauraVazquez)
- Leandro Martín Lambardi [@leandrolambardi](https://github.com/leandrolambardi)
  
