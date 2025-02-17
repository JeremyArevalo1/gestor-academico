import { Router } from 'express';
import { check } from 'express-validator';
import { getCourses, saveCourses, getCourseById, updateCourse, deleteCourse } from './courses.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { coursesValidator } from '../middlewares/validator.js';

const router = Router();

router.post(
    '/',
    [
        coursesValidator,
        validarCampos
    ],
    saveCourses
);

router.get(
    '/',
    getCourses
);

router.get(
    '/:id',
    [
        check('id', 'id isnt valid').isMongoId(),
        validarCampos
    ],
    getCourseById
)

router.put(
    '/:id',
    [
        check('id', 'No es un ID valido').isMongoId(),
        validarCampos
    ],
    updateCourse
);

router.delete(
    '/:id',
    [
        check('id', 'id is not valid').isMongoId(),
        validarCampos
    ],
    deleteCourse
);

export default router;