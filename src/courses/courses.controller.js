import Courses from '../courses/courses.model.js';
import Student from '../students/students.model.js';

export const saveCourses = async (req, res) => {
    try {
        const data = req.body;

        if (!data) {
            return res.status(400).json({
                success: false, 
                message: "El nombre del curso es requerido" 
            });
        }

        const course = new Courses({
            ...data 
        });

        await course.save();

        res.status(200).json({
            success: true, 
            message: "Curso agregado con éxito", 
            course 
        });

    } catch (error) {
        res.status(500).json({
            success: false, 
            message: "Error al agregar el curso", 
            error
        });
    }
};

export const getCourses = async(req, res) =>{
    const { limit = 10, desde = 0 } = req.query;
    const query = { status: true };

    try {

        const courses = await Courses.find()
            .skip(Number(desde))
            .limit(Number(limit));

            const coursesWithInfo = await Promise.all(courses.map(async(courses) =>{
                return{
                    ...courses.toObject(),
                }
            }));
        
        res.status(200).json({
            success: true,
            courses: coursesWithInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los cursos",
            error
        });
    }
}

export const getCourseById = async (req, res) => {
    try {
 
        const { id } = req.params;
 
        const course = await Courses.findById(id);
 
        if(!course){
            return res.status(404).json({
                success: false,
                msg: 'course not found'
            })
        }
 
        res.status(200).json({
            success: true,
            course
        })
 
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener curso',
            error
        })
    }
};

export const updateCourse = async (req, res) =>{
    try {

        const { id } = req.params
        const { ...data } = req.body;

        const course = await Courses.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg: 'Curso actualizado',
            course
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar user',
            error
        })
    }
};

export const deleteCourse = async (req, res) =>{

    try {

        const { id } = req.params;
        const course = await Courses.findByIdAndUpdate(id, { status: false }, {new: true});
        const authenticatedCourses = req.courses
        
        res.status(200).json({
            sucess: true,
            msg: "Course eliminate successfully",
            course,
            authenticatedCourses
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error to eliminate this Course",
            error
        })
    }
}



export const getCoursesWithStudents = async (req, res) => {
    try {
        const courses = await Courses.find();

        if (!courses || courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron cursos.'
            });
        }

        const coursesWithStudents = await Promise.all(
            courses.map(async (course) => {
                const students = await Student.find({ cursos: course._id }).populate('alumno', 'name');
                return {
                    ...course.toObject(),
                    students: students
                };
            })
        );


        res.status(200).json({
            success: true,
            courses: coursesWithStudents
        });
    } catch (error) {
        console.error("Error al obtener los cursos con estudiantes:", error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los cursos con estudiantes.',
            error: error.message
        });
    }
};
