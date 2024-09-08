import bcrypt from 'bcryptjs';
import { Controller, Get, Middleware, Post, Put } from "@overnightjs/core";
import { Request, Response } from "express";
import { User } from "../models/userModel";
import jwt from 'jsonwebtoken';
import { auth } from '../middlewares/auth';

interface AuthRequest extends Request {
    user?: any;
}

@Controller('api/users')
export class UserController {

    @Post('register')
    public async register(req: Request, res: Response) {
        try {
            const { first_name, last_name, phone_number, gender, job_title, company, skills, username, email, password, bio, website, social_links } = req.body;

            const existingUser = await User.findOne({ "basic_info.email": email });
            if (existingUser) {
                return res.status(400).json({ message: `User already exists with email ${email}` });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                basic_info: {
                    first_name,
                    last_name,
                    username,
                    email,
                    phone_number,
                    gender
                },
                security: {
                    password_hash: hashedPassword
                },
                professional_info: {
                    job_title,
                    company,
                    skills
                },
                social: {
                    bio,
                    website,
                    social_links
                }
            });

            await user.save();

            res.status(200).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(400).json({ message: 'Error registering user', error });
        }
    }

    @Post('login')
    public async loginUser(req: AuthRequest, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ "basic_info.email": email });
            if (!user) {
                return res.status(401).json({ message: "Invalid Credentials" });
            }
    
            if (!user.security || !user.basic_info || !user.professional_info) {
                return res.status(400).json({ message: "User data info is missing" });
            }
    
            const checkPassword = await bcrypt.compare(password, user.security.password_hash);
            if (!checkPassword) {
                return res.status(400).json({ message: "Incorrect Password" });
            }
    
            // Update last login time
            user.security.last_login = new Date();
            await user.save();
    
            const token = jwt.sign({
                _id: user._id,
                username: user.basic_info.username,
                email: user.basic_info.email,
                first_name: user.basic_info.first_name,
                last_name: user.basic_info.last_name,
                phone_number: user.basic_info.phone_number,
                gender: user.basic_info.gender,
                role: user.security.role,
                last_login: user.security.last_login,
                account_status: user.security.account_status,
                job_title: user.professional_info.job_title,
                company: user.professional_info.company,
                skills: user.professional_info.skills,
                bio: user.social?.bio || '',
                website: user.social?.website || '',
                social_links: user.social?.social_links || [],
                account_created_at: user.security.account_created_at
            }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    
            return res.status(200).json({ token, message: "User logged in successfully" });
        } catch (error) {
            console.error("Login error:", error);
            res.status(400).json({ message: "Error logging in", error });
        }
    }

    @Put('update/:id')
    public async updateUser(req : Request , res : Response) {
        try {
            const userId = req.params.id;
            const {
                first_name,
                last_name,
                phone_number,
                gender,
                job_title,
                company,
                skills,
                username,
                email,
                password,
                bio,
                website,
                social_links
            } = req.body;
    
            const user = await User.findById(userId);
    
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            if (!user.security || !user.basic_info || !user.professional_info  || !user.social) {
                return res.status(400).json({ message: "User data info is missing" });
            }
    
            if (first_name) user.basic_info.first_name = first_name;
            if (last_name) user.basic_info.last_name = last_name;
            if (phone_number) user.basic_info.phone_number = phone_number;
            if (gender) user.basic_info.gender = gender;
            if (username) user.basic_info.username = username;
            if (email) user.basic_info.email = email;
    
            if (job_title) user.professional_info.job_title = job_title;
            if (company) user.professional_info.company = company;
            if (skills) user.professional_info.skills = skills;
    
            if (bio) user.social.bio = bio;
            if (website) user.social.website = website;
            if (social_links) user.social.social_links = social_links;
    
            if (password) {

                const hashedPassword = await bcrypt.hash(password, 10);
                user.security.password_hash = hashedPassword;
            }
    
            await user.save();
    
            res.status(200).json({message : "updated successfully"});
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(400).json({ message: "Error updating user", error });
        }
    }

    

    @Get('profile')
    @Middleware(auth) 
    public async getProfile(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const user = await User.findById(req.user._id);
            if(!user) {
                res.status(400).json({message : "user not fount"});
            }
            res.status(200).json(user);
        } catch (error) {
            console.error("Error retrieving profile:", error);
            res.status(500).send("Error retrieving profile");
        }
    }
}
