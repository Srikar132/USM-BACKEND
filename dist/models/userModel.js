"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
exports.User = mongoose_1.default.model('User', userSchema);
