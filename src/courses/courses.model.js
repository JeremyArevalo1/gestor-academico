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
    students: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'student', 
        required: true
    }]
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('courses', CoursesSchema)