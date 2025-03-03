import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { esRoleValido, existenteEmail } from "../helpers/db-validator.js";

export const registerValidator = [
    body('name', "The name is required").not().isEmpty(),
    body('surname', 'The surname is required').not().isEmpty(),
    body('email', 'you must enter a valid email').isEmail(),
    body('email').custom(existenteEmail),
    body('role').optional(),
    body('password', 'Password must be at least 6 characteres').isLength({min: 6}),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Enter a valid email address"),
    body("username").optional().isEmail().isString().withMessage("Enter a valid email address"),
    body("password", "password must be at least 6 characters").isLength({min: 8}),
    validarCampos
]

export const coursesValidator = [
    body("name", "the name is required").not().isEmpty(),
    validarCampos
]