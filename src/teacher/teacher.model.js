import { Schema, model } from "mongoose";
import User from '../users/user.model.js';

const teacherSchema = new Schema({
    profesor: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        validate: {
            validator: async function(value) {
                const user = await User.findById(value);
                return user && user.role === 'TEACHER_ROLE';
            },
            message: 'Solo los usuarios con el rol TEACHER_ROLE pueden ser asignados como maestros.'
        }
    },
}, {
    timestamps: true,
    versionKey: false
});

export default model('teacher', teacherSchema);