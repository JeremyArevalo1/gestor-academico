import User from '../users/user.model.js';
import Teacher from '../teacher/teacher.model.js';
import Courses from '../courses/courses.model.js'

export const createTeacher = async(req, res) =>{
    try {
        const { profesor, cursos, ...data } = req.body;

        // Buscar el profesor por nombre
        const user = await User.findOne({ name: profesor });

        if (!user || user.role !== 'TEACHER_ROLE') {
            return res.status(400).json({
                success: false,
                message: 'El usuario debe tener el rol de profesor (TEACHER_ROLE)' 
            });
        }

        // Buscar el curso por nombre
        const course = await Courses.findOne({ name: cursos });

        if (!course) {
            return res.status(400).json({
                success: false,
                message: `El curso con nombre "${cursos}" no existe`
            });
        }

        // Verificar si ya existe un profesor con ese nombre
        const existingTeacher = await Teacher.findOne({ profesor: user._id });

        if (existingTeacher) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un profesor con ese nombre.'
            });
        }

        // Crear el nuevo profesor con el ID del curso encontrado
        const newTeacher = new Teacher({
            ...data,
            profesor: user._id,
            cursos: course._id
        });

        await newTeacher.save();

        res.status(201).json({
            success: true,
            message: 'Profesor creado con éxito',
            newTeacher
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error al crear profesor',
            error: error.message
        });
    }
};
export const getTeachers = async (req, res ) => {
    try {
        const teachers = await Teacher.find()
        .populate('profesor');

        res.status(200).json({
            success: true,
            teachers
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message: 'Error al obtener los estudiantes',
            error
        });
    }
};

export const editTeachers = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, cursos, profesor, ...data } = req.body;

        // Validar si se proporciona un nombre de profesor
        if (profesor) {
            const user = await User.findOne({ name: profesor });

            if (!user || user.role !== 'TEACHER_ROLE') {
                return res.status(400).json({
                    success: false,
                    message: 'El usuario debe tener el rol de profesor (TEACHER_ROLE)' 
                });
            }

            data.profesor = user._id;
        }

        // Validar si se proporciona un nombre de curso
        if (cursos) {
            const course = await Courses.findOne({ name: cursos });

            if (!course) {
                return res.status(400).json({
                    success: false,
                    message: `El curso con nombre "${cursos}" no existe`
                });
            }

            data.cursos = course._id;
        }

        const teacher = await Teacher.findByIdAndUpdate(id, data, { new: true });

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Profesor no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profesor actualizado con éxito',
            teacher
        });

    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error al editar profesor',
            error: error.message
        });
    }
};

export const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await Teacher.findByIdAndDelete(id);

        if (!teacher) {
            return res.status(404).json({
                message:'profesor no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'profesor eliminado con éxito'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar profesor',
            error
        });
    }
};