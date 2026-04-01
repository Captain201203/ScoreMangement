import dotenv from 'dotenv';
dotenv.config(); 

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { studentController } from './Controllers/StudentController.js';
import { classController } from './Controllers/ClassController.js';
import { adminController } from './Controllers/AdminController.js';
import { teacherController } from './Controllers/TeacherController.js';
import { majorController } from './Controllers/MajorController.js';
import { accountController } from './Controllers/AccountController.js';
import { subjectController } from './Controllers/SubjectController.js';
import { semesterController } from './Controllers/SemesterController.js';
import { scoreController } from './Controllers/ScoreController.js';
import { authController } from './Controllers/AuthController.js';
import { roleController } from './Controllers/RoleController.js';
import { claimController } from './Controllers/ClaimController.js';




const app: Express = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});


app.use('/api/auth', authController.router);
app.use('/api/accounts', accountController.router);
app.use('/api/students', studentController.router);
app.use('/api/teachers', teacherController.router);
app.use('/api/admins', adminController.router);
app.use('/api/classes', classController.router);
app.use('/api/majors', majorController.router);
app.use('/api/subjects', subjectController.router);
app.use('/api/semesters', semesterController.router);
app.use('/api/scores', scoreController.router);
app.use('/uploads', express.static('uploads'));


app.use('/api/roles', roleController.router);
app.use('/api/claims', claimController.router);


app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ message: 'API is running' });
});


app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
});


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('🔥 Server Error:', err);
    res.status(err.status || 500).json({ 
        message: err.message || 'Internal server error' 
    });
});

export default app;