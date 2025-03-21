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
                message: 'El usuario debe tener el rol de estudiante (STUDENT_ROLE) o no existe el usuario' 
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

        let existingStudent = await Student.findOne({ alumno: user._id });

        if (existingStudent) {
            const existingCoursesIds = existingStudent.cursos.map(course => course.toString());
            const existingCourses = await Courses.find({ _id: { $in: existingCoursesIds } });
            const duplicateCourses = courses.filter(course => existingCoursesIds.includes(course._id.toString()));

            if (duplicateCourses.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `El estudiante ya está asignado a los siguientes cursos: ${duplicateCourses.map(course => course.name).join(', ')}`
                });
            }

            if (existingCoursesIds.length + cursos.length > 3) {
                return res.status(400).json({
                    success: false,
                    message: 'El estudiante no puede tener más de 3 cursos asignados en total.'
                });
            }
        }

        const newStudent = new Student({
            alumno: user._id,
            cursos: courses.map(courses => courses._id)
        });

        await newStudent.save();

        for (const course of courses) {
            course.students.push(newStudent._id);
            await course.save();
        }

        res.status(201).json({
            success: true,
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
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                message: 'Estudiante no encontrado'
            });
        }

        student.alumno = alumno || student.alumno;
        student.cursos = cursos || student.cursos;

        await student.save();

        res.status(200).json({
            message: 'Estudiante actualizado con éxito',
            student
        });
    } catch (error) {
        res.status(500).json({ 
        message: 'Error al editar el estudiante',
        error
    });
    }
};

export const deleteStudent = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const student = await Student.findByIdAndDelete(id);

        if (!student) {
            return res.status(404).json({
                message:'Estudiante no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Estudiante eliminado con éxito'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar el estudiante',
            error
        });
    }
};