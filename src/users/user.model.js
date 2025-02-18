import { Schema, model } from "mongoose";

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'name in required'],
    },
    surname: {
        type: String,
        required: [true, 'Surname in required'],
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    role: {
        type: String,

        enum: ['TEACHER_ROLE', 'STUDENT_ROLE'],
        default: 'STUDENT_ROLE'
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

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('user', UserSchema);