import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { studentRouter } from './routes/student/route.js';
import { classRouter } from './routes/class/route.js';
import { adminRouter } from './routes/admin/route.js';
import { teacherRouter } from './routes/teacher/route.js';
import { majorRouter } from './routes/major/route.js';
import { accountRouter } from './routes/account/route.js';
import { subjectRouter } from './routes/subject/route.js';
import { semesterRouter } from './routes/semester/route.js';
import { scoreRouter } from './routes/score/route.js';
import { authRouter } from './routes/auth/route.js';
import { rbacRouter } from './routes/auth/rbacRoutes.js';


// Load environment variables
dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Routes
app.use('/api/students', studentRouter);
app.use('/api/classes', classRouter);
app.use('/api/admins', adminRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/majors', majorRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/subjects', subjectRouter);
app.use('/api/semesters', semesterRouter);
app.use('/api/scores', scoreRouter);
app.use('/api/auth', authRouter);
app.use('/api/rbac', rbacRouter);


// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ message: 'API is running' });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
});

export default app;
