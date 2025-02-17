import Courses from './courses.model.js'

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

        const courses = await Courses.find(query)
            .skip(Number(desde))
            .limit(Number(limit));

            const coursesWithInfo = await Promise.all(courses.map(async(courses) =>{
                return{
                    ...courses.toObject(),
                }
            }));

            const total = await Courses.countDocuments(query);

        
        res.status(200).json({
            success: true,
            total,
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

