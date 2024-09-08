import {auth ,  adminAuth } from './../middlewares/auth';
import { Controller , Post , Put , Get , Delete , Middleware } from "@overnightjs/core";
import { Request , Response } from 'express';
import { User } from "../models/userModel";
import bcrypt from 'bcryptjs'
@Controller('api/admin')

export class AdminController {
    @Get('users')
    @Middleware(auth)
    @Middleware(adminAuth)
    public async getUsers (req  : Request , res : Response) {
        try {
            const users = await User.find({'security.role' : 'user'});
            res.json(users);
        }catch(error) {
            res.status(200).send("Erro retriving users")
        }
    }

    

    @Get('users/:id') 
    @Middleware(auth)
    @Middleware(adminAuth)
    public async getUser (req  : Request , res : Response) {
        try {
            const user = await User.findById(req.params.id);
            if(!user) {
                return res.status(401).send("User not found");
            }
            res.json(user);
        }catch(error) {
            res.status(401).send("Error retrieving user.")
        }
    }

    @Put('users/:id')
    @Middleware(auth)
    @Middleware(adminAuth)
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
    
            res.status(200).json(user);
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(400).json({ message: "Error updating user", error });
        }
    }

    @Delete('users/:id')
    @Middleware(auth)
    @Middleware(adminAuth)
    public async deleteUser(req : Request , res : Response) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({message : 'User deleted'});
        }catch(error) {
            res.status(500).send("Error deleting user");
        }
    }

}