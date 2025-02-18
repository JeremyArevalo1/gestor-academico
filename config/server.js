'use strict';

import express from 'express';
import cors from 'cors';
import helmet from "helmet";
import morgan from "morgan";
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth-router.js'
import userRoutes from '../src/users/user.routes.js'
import coursesRoutes from '../src/courses/courses.routes.js'
import studentsRoutes from '../src/students/student.routes.js';
import teacherRoutes from '../src/teacher/teacher.routes.js'

const middlewares = (app) => {
    app.use(express.urlencoded({ extended : false }));
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'))
    app.use(limiter);
}

const routes = (app) => {
    app.use('/gestorAcademico/v1/auth', authRoutes);
    app.use('/gestorAcademico/v1/users', userRoutes);
    app.use('/gestorAcademico/v1/courses', coursesRoutes);
    app.use('/gestorAcademico/v1/alumnos', studentsRoutes);
    app.use('/gestorAcademico/v1/profesores', teacherRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('Conexion exitosa con la base de datos');
    } catch (error) {
        console.log('Error al conectar con la base de datos', error);
    }
}

export const initserver = async () => {
    const app = express();
    const port = process.env.PORT || 3001;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port)
        console.log(`Server running on port ${port}`)
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }

}