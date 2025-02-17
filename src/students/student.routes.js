import { Router } from "express";
import { createStudent, getStudents, editStudent, deleteStudent } from './student.controller.js';

const router = Router();

// Rutas CRUD para estudiantes
router.get(
    '/',
    getStudents
);

router.post(
    '/',
    createStudent
);

router.put(
    '/:id',
    editStudent
);

router.delete(
    '/:id',
    deleteStudent
);


export default router;