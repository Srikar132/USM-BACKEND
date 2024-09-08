
import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    basic_info: {
      first_name: String,
      last_name: String,
      username: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      phone_number: String,
      gender: String
    },
    security: {
      password_hash: { type: String, required: true },
      last_login: { type: Date, default: Date.now },
      account_status: { type: String, enum: ['Active', 'Suspended', 'Deactivated'], default: 'Active' },
      role: { type: String, enum: ['admin', 'user'], default: 'user' },
      account_created_at: { type: Date, default: Date.now }
    },
    professional_info: {
      job_title: String,
      company: String,
      skills: [String]
    },
    social: {
      bio: { type: String },
      website: { type: String },
      social_links: [String]
    },
  });
  
    
export const User = mongoose.model('User',userSchema);