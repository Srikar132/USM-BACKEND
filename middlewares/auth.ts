import { Request , Response , NextFunction  } from "express";
import jwt from 'jsonwebtoken';
import { User } from "../models/userModel";
interface AuthRequest extends Request {
    user? : any
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', ''); 
    if (!token) {
        return res.status(401).send('No token provided');
    }
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(401).send('Invalid token');
    }
};


export const adminAuth = (req : AuthRequest , res : Response , next : NextFunction) => {
    if(req.user.role !== 'admin') {
        return res.status(401).send('Access forbidden');
    }
    next();
}