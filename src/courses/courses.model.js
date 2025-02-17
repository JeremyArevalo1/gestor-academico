import { Schema, model } from "mongoose";

const CoursesSchema = Schema({
    name: {
        type: String,
        required: [true, 'name in required'],
    },
    estado: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('courses', CoursesSchema)