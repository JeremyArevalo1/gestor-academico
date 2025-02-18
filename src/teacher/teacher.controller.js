import User from '../users/user.model.js';
import Teacher from '../teacher/teacher.model.js';

export const createTeacher = async(req, res) =>{
    try {
        const { profesor } = req.body;
        const user = await User.findOne({ name: profesor });

        if (!user || user.role !== 'TEACHER_ROLE') {
            return res.status(400).json({
                success: false,
                message: 'El usuario debe tener el rol de estudiante (TEACHER_ROLE)' 
            });
        }

         // Verifica si ya existe un profesor con el mismo nombre
         const existingTeacher = await Teacher.findOne({ name: profesor });

         if (existingTeacher) {
             return res.status(400).json({
                 success: false,
                 message: 'Ya existe un profesor con ese nombre.',
             });
         }

        const newTeacher = new Teacher({
                    profesor: user._id,
                });
                await newTeacher.save();
        
                res.status(201).json({
                    success: true,
                    message: 'profesor creado con éxito',
                    newTeacher
                });
            
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear profesor',
            error: error.message
        });
    }
}

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
        const { profesor } = req.body;
        const teacher = await Teacher.findById(id);

        if (!teacher) {
            return res.status(404).json({
                message: 'profesor no encontrado'
            });
        }

        teacher.profesor = profesor || teacher.profesor

        await teacher.save();

        res.status(200).json({
            message: 'Profesor actualizado con éxito',
            teacher
        });
    } catch (error) {
        res.status(500).json({ 
        message: 'Error al editar profesor',
        error
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