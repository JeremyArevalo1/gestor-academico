import { Router } from "express";
import { createTeacher, getTeachers, editTeachers, deleteTeacher } from './teacher.controller.js';

const router = Router();

router.get(
    '/',
    getTeachers);

router.post(
    '/',
    createTeacher
);
router.put(
    '/:id',
    editTeachers
);
router.delete(
    '/:id',
    deleteTeacher
);

export default router;
