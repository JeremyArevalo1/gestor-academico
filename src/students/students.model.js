import { Schema, model } from "mongoose";
import User from '../users/user.model.js';  // Importa el modelo de usuario correctamente

const studentSchema = new Schema({
    alumno: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        validate: {
            validator: async function(value) {
                const user = await User.findById(value);
                return user && user.role === 'STUDENT_ROLE';
            },
            message: 'Solo los usuarios con el rol STUDENT_ROLE pueden ser asignados como estudiantes.'
        }
    },
    cursos: [{
        type: Schema.Types.ObjectId,
        ref: 'courses',
        required: true
    }]
}, {
    timestamps: true,
    versionKey: false
});

export default model('student', studentSchema);