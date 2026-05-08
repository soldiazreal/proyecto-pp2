
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

1. **Interfaz** El sistema muestra las comidas que tienen stock.
2. **Entrada de Datos:** El usuario ingresa el ID del producto y la mesa.
3. **Cálculo:** El sistema busca el precio y actualiza el acumulador de la cuenta.
4. **Estado:** El pedido se añade a una cola de "Pendientes".
5. **Finalización:** Una vez entregado, el pedido se marca como completado y se libera la mesa.

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

## Endpoints

Base URL: `http://localhost:3000`

---

### GET /pedidos
Devuelve todos los pedidos registrados.

**Respuesta exitosa `200`**
```json
[
  {
    "id": 3,
    "mesa": 3,
    "productos": [
      { "nombre": "Empanadas", "cantidad": 3, "precio": 800 },
      { "nombre": "Cerveza",   "cantidad": 2, "precio": 600 }
    ],
    "total": 3600,
    "estado": "pendiente"
  }
]
```

---

### POST /pedidos
Crea un nuevo pedido con uno o más productos. Descuenta el stock y guarda el precio del menú al momento del pedido.

**Body**
```json
{
  "mesa": 10,
  "productos": [
    { "nombre": "Empanadas", "cantidad": 3 },
    { "nombre": "Cerveza",   "cantidad": 2 }
  ]
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `mesa` | number | Sí | Número de mesa |
| `productos` | array | Sí | Al menos un elemento |
| `productos[].nombre` | string | Sí | Debe existir en el menú |
| `productos[].cantidad` | number | Sí | Mayor a 0 |

**Respuesta exitosa `201`**
```json
{
  "mensaje": "Pedido realizado y stock actualizado",
  "pedido": {
    "id": 6,
    "mesa": 10,
    "productos": [
      { "nombre": "Empanadas", "cantidad": 3, "precio": 800 },
      { "nombre": "Cerveza",   "cantidad": 2, "precio": 600 }
    ],
    "total": 3600,
    "estado": "pendiente"
  }
}
```

**Errores posibles**

| Código | Motivo |
|---|---|
| `400` | Falta `mesa`, `productos` vacío o `cantidad` inválida |
| `400` | Stock insuficiente para algún producto |
| `404` | Algún producto no existe en el menú |

---

### DELETE /pedidos/:id/productos/:nombre
Elimina un producto de un pedido y devuelve su stock al menú. Si el pedido queda sin productos, se elimina también el pedido.

**Parámetros de URL**

| Parámetro | Descripción |
|---|---|
| `id` | ID del pedido |
| `nombre` | Nombre exacto del producto a eliminar |

**Ejemplo:** `DELETE /pedidos/3/productos/Cerveza`

**Respuesta exitosa `200`**
```json
{
  "mensaje": "Producto 'Cerveza' eliminado del pedido",
  "pedido": {
    "id": 3,
    "mesa": 3,
    "productos": [
      { "nombre": "Empanadas", "cantidad": 3, "precio": 800 }
    ],
    "total": 2400,
    "estado": "pendiente"
  }
}
```

**Errores posibles**

| Código | Motivo |
|---|---|
| `404` | El pedido no existe |
| `404` | El producto no está en ese pedido |

---

### GET /pedidos/stock
Devuelve el menú completo con stock disponible y precio de cada producto.

**Respuesta exitosa `200`**
```json
[
  { "producto": "Pizza Cool",  "stock": 10, "precio": 1500 },
  { "producto": "Hamburguesa", "stock": 5,  "precio": 1200 },
  { "producto": "Empanadas",   "stock": 20, "precio": 800  },
  { "producto": "Pomarola",    "stock": 5,  "precio": 900  },
  { "producto": "Cerveza",     "stock": 20, "precio": 600  }
]
```
