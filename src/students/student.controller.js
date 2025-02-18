import { response, request } from "express";
import User from '../users/user.model.js';
import Student from '../students/students.model.js';
import Courses from '../courses/courses.model.js';

export const createStudent = async (req, res) => {
    try {
        const { alumno, cursos } = req.body;
        const user = await User.findOne({ name: alumno });
        const courses = await Courses.find({ name: cursos });


        if (!user || user.role !== 'STUDENT_ROLE') {
            return res.status(400).json({
                success: false,
                message: 'El usuario debe tener el rol de estudiante (STUDENT_ROLE)' 
            });
        }

        if (courses.length !== cursos.length) {
            return res.status(400).json({
                success: false,
                message: 'El curso no existe.'
            });
        }

        if (cursos.length > 3) {
            return res.status(400).json({
                success: false,
                message: 'El estudiante no puede estar asignado a más de 3 cursos.'
            });
        }

        const newStudent = new Student({
            alumno: user._id,
            cursos: courses.map(courses => courses._id)
        });
        await newStudent.save();

        res.status(201).json({
            message: 'Estudiante creado con éxito',
            newStudent
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error al crear el estudiante',
            error: error.message
        });
    }
};

export const getStudents = async (req, res ) => {
    try {
        const students = await Student.find()
        .populate('alumno cursos');



        res.status(200).json({
            success: true,
            students
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message: 'Error al obtener los estudiantes',
            error
        });
    }
};

export const editStudent = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { alumno, cursos } = req.body;

        // 1. Verificamos que el estudiante exista
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        // 2. Actualizamos los datos del estudiante
        student.alumno = alumno || student.alumno;
        student.cursos = cursos || student.cursos;

        // 3. Guardamos los cambios
        await student.save();

        res.status(200).json({ message: 'Estudiante actualizado con éxito', student });
    } catch (error) {
        res.status(500).json({ message: 'Error al editar el estudiante', error });
    }
};

export const deleteStudent = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        // Eliminar el estudiante
        const student = await Student.findByIdAndDelete(id);
        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        res.status(200).json({ message: 'Estudiante eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el estudiante', error });
    }
};