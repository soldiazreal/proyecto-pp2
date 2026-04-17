
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
  
/** ------------- Haciendo un commit --------------*/