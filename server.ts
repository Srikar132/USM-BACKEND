import { AdminController } from './controllers/AdminControllers';
import { UserController } from './controllers/UserController';
import express from "express";
import { Server} from '@overnightjs/core';
import cors from 'cors'
import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config();

class AppServer extends Server {
    constructor() {
        super();
        this.app.use(express.json());
        this.app.use(cors({
            origin: function (origin: string | undefined, callback: (err: Error | null, origin?: boolean) => void) {
                if (!origin) {
                    // Allow requests with no origin (like mobile apps or Postman)
                    return callback(null, true);
                }
        
                const allowedOrigins = [
                    'https://user-management-system-five-indol.vercel.app',
                    'https://user-management-system-8mtb4pr0a-srikar132s-projects.vercel.app'
                ];
        
                if (allowedOrigins.indexOf(origin) !== -1) {
                    // If origin is in allowedOrigins array, allow the request
                    return callback(null, true);
                } else {
                    // If origin is not allowed, block the request
                    return callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true,
        }));
        
        // Allow preflight requests
        this.app.options('*', cors());

        this.setupDatabase();
        this.setupControllers();
    }

    private setupDatabase() {
        const mongoURL = process.env.MONGO_URL! || 'mongodb+srv://bunnyking828:sGfTbvMWAc1cKK7t@cluster0.qcx5r.mongodb.net/user-management-system';
        mongoose.connect(mongoURL).then(() => console.log("mongodb is connected"))
                                  .catch((err) => console.log("mongodb connection failed " , err));
    }

    private setupControllers () {
        const userController = new  UserController();
        const adminController = new  AdminController();

        this.addControllers([userController , adminController]);
    }
    
    public start (port : number) {
        this.app.listen(port , () => {
            console.log(`server is running on the port ${port}`)
        })
    }

    
}

const appServer = new AppServer();
appServer.start(8002);