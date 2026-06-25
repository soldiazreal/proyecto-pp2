import { Request, Response, NextFunction, RequestHandler } from "express";
import {
  body,
  param,
  validationResult,
  ValidationChain,
} from "express-validator";

const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const createValidator = (rules: ValidationChain[]): RequestHandler[] => [
  ...rules,
  handleInputErrors,
];

/** Validaciones mesas */

export const ESTADOS_MESA = [
  "Disponible",
  "Ocupada",
  "Reservada",
  "Mantenimiento",
];

const mesaIdRule = param("id")
  .isInt({ min: 1 })
  .withMessage("El ID de la mesa debe ser un entero válido")
  .toInt();

export const validateCreateMesa = createValidator([
  body("numero")
    .notEmpty()
    .withMessage("El número de mesa es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El número debe ser un entero positivo")
    .toInt(),
  body("capacidad")
    .notEmpty()
    .withMessage("La capacidad es obligatoria")
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un entero positivo")
    .toInt(),
]);

export const validateUpdateMesa = createValidator([
  mesaIdRule,
  // body("numero").optional().isInt({ min: 1 }).toInt(),
  // body("capacidad").optional().isInt({ min: 1 }).toInt(),
  body("estado")
    .notEmpty()
    .isIn(ESTADOS_MESA)
    .withMessage("Estado de mesa incorrecto"),
  body("meseroAsignado").optional().isString(),
  body("horaOcupacion")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Formato de fecha inválido"),
  // body("clientesActuales").optional().isInt({ min: 0 }).toInt(),
  // body("duracionEstimada").optional().isInt({ min: 1 }).toInt(),
  // body("consumoActual").optional().isFloat({ min: 0 }).toFloat(),
]);

export const validateBulkDelete = [
  body("ids")
    .isArray({ min: 1 })
    .withMessage("Debe proporcionar un arreglo de IDs")
    .custom((ids: any) => ids.every((id: any) => typeof id === "number"))
    .withMessage("Todos los IDs deben ser números enteros"),
  handleInputErrors,
];

export const validateMesaId = createValidator([mesaIdRule]);

/** Validaciones pedidos */

const pedidoIdRule = param("id")
  .isInt({ min: 1 })
  .withMessage("ID de pedido inválido")
  .toInt();

export const validateCreatePedido = createValidator([
  body("mesaId")
    .isInt({ min: 1 })
    .withMessage("mesaId debe ser un número entero válido")
    .toInt(),
  body("platoId")
    .isInt({ min: 1 })
    .withMessage("platoId debe ser un número entero válido")
    .toInt(),
  body("estado").optional().isString().trim(),
]);

export const validateUpdatePedido = createValidator([
  pedidoIdRule,
  body("estado")
    .notEmpty()
    .withMessage("El estado es obligatorio")
    .isString()
    .trim(),
]);

export const validatePedidoId = createValidator([pedidoIdRule]);

export const validateMesaIdParam = createValidator([
  param("mesaId").isInt({ min: 1 }).withMessage("ID de mesa inválido").toInt(),
]);

/** Validaciones platos */

export const validateCreatePlato = createValidator([
  body("nombre")
    .notEmpty()
    .withMessage("El nombre del plato es obligatorio")
    .isString()
    .trim(),
  body("precio")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isNumeric()
    .withMessage("El precio debe ser un número positivo")
    .toFloat()
    .custom((val) => val >= 0)
    .withMessage("El precio no puede ser negativo"),
  body("descripcion").optional().isString().trim(),

  body("codigo")
    .notEmpty()
    .withMessage("El código es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El código debe ser un entero positivo")
    .toInt(),
  body("sinGluten").optional().default(true),
  body("disponible").optional().default(true),
]);

export const validatePlatoId = createValidator([
  param("id").isInt({ min: 1 }).withMessage("ID de plato inválido").toInt(),
]);

export const validateUpdatePlato = createValidator([
  param("id").isInt({ min: 1 }).withMessage("ID de plato inválido").toInt(),
  body("nombre").optional().isString().trim(),
  body("precio")
    .optional()
    .isNumeric()
    .withMessage("El precio debe ser un número positivo")
    .toFloat(),
  body("descripcion").optional().isString().trim(),
  body("codigo").optional().isString().trim(),
]);

export const validateBulkDeletePlatos = [
  body("ids")
    .isArray({ min: 1 })
    .withMessage("Debe proporcionar un arreglo de IDs")
    .custom((ids: any) => ids.every((id: any) => typeof id === "number"))
    .withMessage("Todos los IDs deben ser números enteros"),
  handleInputErrors,
];

// ─── Usuarios ────────────────────────────────────────────────────────────────

export const validateRegistro = createValidator([
  body("email")
    .isEmail()
    .withMessage("Debe proporcionar un email válido")
    .normalizeEmail(),
  body("nombre").notEmpty().withMessage("El nombre es obligatorio").trim(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
]);

export const validateLogin = createValidator([
  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
]);
